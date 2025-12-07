"""
Import data from datacharmer/test_db MySQL dumps into Postgres used by this project.

Usage:
  - Ensure your Postgres `hrdb` exists and the backend models/tables are created (start the app once to create tables or run Alembic if configured).
  - Set these env vars or pass via CLI options: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
  - Run:
      python backend/scripts/import_test_db.py --path test_db

This script performs a pragmatic import: it maps `emp_no` -> `employee_id`, builds an email,
and picks the employee's current department and latest title when available.

It is written to be tolerant for this dataset and focuses on populating the `employees` table
in your existing application database schema.
"""
import argparse
import os
import re
import psycopg2
from datetime import datetime


def iter_tuples_from_insert(stmt_text: str):
    """Yield lists of raw SQL tokens for each tuple in an INSERT ... VALUES (...) statement."""
    # find the VALUES (...) part
    m = re.search(r"VALUES\s*(\(.*\))\s*;?\s*$", stmt_text, flags=re.S | re.I)
    if not m:
        return
    vals = m.group(1)
    # remove leading/trailing parentheses that wrap all rows
    if vals.startswith('(') and vals.endswith(')'):
        inner = vals[1:-1]
    else:
        inner = vals

    # split by '),(' but keep quoted strings safe
    tuples = re.split(r"\),\s*\(", inner)
    for t in tuples:
        # restore balanced parentheses removed by split
        # parse items while respecting quotes
        parts = []
        cur = ''
        in_quote = False
        i = 0
        while i < len(t):
            ch = t[i]
            if ch == "'":
                # handle escaped quote by looking ahead/back
                if i > 0 and t[i-1] == "\\":
                    cur += ch
                else:
                    in_quote = not in_quote
                    cur += ch
            elif ch == ',' and not in_quote:
                parts.append(cur.strip())
                cur = ''
            else:
                cur += ch
            i += 1
        if cur:
            parts.append(cur.strip())

        # normalize parts: NULL -> None, quoted strings -> unescaped
        norm = []
        for p in parts:
            if p == 'NULL':
                norm.append(None)
            elif len(p) >= 2 and p[0] == "'" and p[-1] == "'":
                s = p[1:-1].replace("\\'", "'")
                norm.append(s)
            else:
                norm.append(p)
        yield norm


def stream_inserts_from_file(path):
    """Yield full INSERT statements from a dump file (handles multi-line statements)."""
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        buffer = ''
        for line in f:
            if line.lstrip().upper().startswith('INSERT INTO') and buffer:
                # previous buffer may be incomplete; yield it first if ended with ;
                if buffer.strip().endswith(';'):
                    yield buffer
                    buffer = line
                else:
                    buffer += line
            else:
                buffer += line
            if buffer.strip().endswith(';'):
                yield buffer
                buffer = ''
        if buffer.strip():
            yield buffer


def parse_departments(path):
    """Return a dict dept_no -> dept_name from departments dump."""
    mapping = {}
    for stmt in stream_inserts_from_file(path):
        if 'INSERT INTO' in stmt and 'departments' in stmt:
            for parts in iter_tuples_from_insert(stmt):
                if len(parts) >= 2:
                    dept_no = parts[0].strip("'")
                    dept_name = parts[1] if parts[1] is not None else None
                    mapping[dept_no] = dept_name
    return mapping


def build_latest_map_from_dump(path, key_index=0, value_index=1, to_date_index=None):
    """Return dict key->value selecting the row with to_date='9999-01-01' or latest from_date.

    Used for dept_emp (emp_no->dept_no) and titles (emp_no->title).
    """
    from collections import defaultdict
    records = defaultdict(list)
    for stmt in stream_inserts_from_file(path):
        for parts in iter_tuples_from_insert(stmt):
            try:
                key = parts[key_index]
                val = parts[value_index]
                # from_date at -2 typically, to_date at -1
                to_date = parts[to_date_index] if to_date_index is not None and to_date_index < len(parts) else None
                records[key].append((parts, to_date))
            except Exception:
                continue

    result = {}
    for k, recs in records.items():
        # prefer to_date == '9999-01-01'
        chosen = None
        for parts, to_date in recs:
            if to_date == '9999-01-01' or to_date == '9999-01-01':
                chosen = parts
                break
        if not chosen:
            # fallback: choose the record with max from_date (assume index -2)
            best = None
            best_date = None
            for parts, _ in recs:
                # find a date-like field in parts
                for p in reversed(parts):
                    if p and re.match(r"\d{4}-\d{2}-\d{2}", str(p)):
                        if best_date is None or p > best_date:
                            best_date = p
                            best = parts
                        break
            chosen = best
        if chosen:
            result[k] = chosen
    return result


def import_to_postgres(args):
    # DB connection
    host = os.environ.get('PGHOST', args.host)
    port = os.environ.get('PGPORT', args.port)
    user = os.environ.get('PGUSER', args.user)
    password = os.environ.get('PGPASSWORD', args.password)
    dbname = os.environ.get('PGDATABASE', args.database)

    dsn = f"host={host} port={port} dbname={dbname} user={user} password={password}"
    print(f"Connecting to Postgres: {host}:{port}/{dbname} as {user}")
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()

    # parse department names
    dept_map = parse_departments(os.path.join(args.path, 'load_departments.dump'))

    # build latest dept_emp map: emp_no -> dept_no
    dept_emp_latest = {}
    for stmt in stream_inserts_from_file(os.path.join(args.path, 'load_dept_emp.dump')):
        for parts in iter_tuples_from_insert(stmt):
            try:
                emp_no = parts[0]
                dept_no = parts[1].strip("'") if parts[1] else None
                to_date = parts[3] if len(parts) > 3 else None
                # choose current
                if to_date == '9999-01-01':
                    dept_emp_latest[emp_no] = dept_no
            except Exception:
                continue

    # build latest title map: emp_no -> title
    title_latest = {}
    for stmt in stream_inserts_from_file(os.path.join(args.path, 'load_titles.dump')):
        for parts in iter_tuples_from_insert(stmt):
            try:
                emp_no = parts[0]
                title = parts[1]
                to_date = parts[3] if len(parts) > 3 else None
                if to_date is None or to_date == '9999-01-01':
                    title_latest[emp_no] = title
            except Exception:
                continue

    # stream employees and insert in batches
    insert_sql = (
        "INSERT INTO employees (employee_id, email, first_name, last_name, department, position, phone, address, is_active, hire_date, created_at)"
        " VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT (employee_id) DO NOTHING"
    )

    batch = []
    batch_size = 1000
    total = 0
    for stmt in stream_inserts_from_file(os.path.join(args.path, 'load_employees.dump')):
        for parts in iter_tuples_from_insert(stmt):
            try:
                emp_no = parts[0]
                birth_date = parts[1]
                first_name = parts[2]
                last_name = parts[3]
                # gender = parts[4]
                hire_date = parts[5] if len(parts) > 5 else None

                emp_id = str(emp_no)
                email = f"{emp_id}@example.local"
                dept_no = dept_emp_latest.get(emp_no)
                department = dept_map.get(dept_no) if dept_no else None
                position = title_latest.get(emp_no)
                phone = None
                address = None
                is_active = True
                created_at = hire_date if hire_date else datetime.utcnow().isoformat()

                batch.append((emp_id, email, first_name, last_name, department, position, phone, address, is_active, hire_date, created_at))
                if len(batch) >= batch_size:
                    cur.executemany(insert_sql, batch)
                    conn.commit()
                    total += len(batch)
                    print(f"Inserted {total} employees...")
                    batch = []
            except Exception as e:
                print(f"Skipping row due to parse/insert error: {e}")
                continue

    if batch:
        cur.executemany(insert_sql, batch)
        conn.commit()
        total += len(batch)

    cur.close()
    conn.close()
    print(f"Import complete. Total inserted (approx): {total}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', default='test_db', help='Path to cloned test_db repository')
    parser.add_argument('--host', default='localhost')
    parser.add_argument('--port', default='5432')
    parser.add_argument('--user', default='postgres')
    parser.add_argument('--password', default='')
    parser.add_argument('--database', default='hrdb')
    args = parser.parse_args()

    if not os.path.isdir(args.path):
        print(f"Path {args.path} does not exist. Clone test_db into workspace root or pass correct path.")
        return

    import_to_postgres(args)


if __name__ == '__main__':
    main()
