# BlackFlag HR - Setup Guide

A modern HR management system with employee directory, leave management, and document handling.

## Features

- 🏢 **10,000 Employee Directory** - Real employee names from MySQL test database
- 🔐 **100 Active Credentials** - Pre-configured login accounts for testing
- 📊 **HR Dashboard** - Employee stats, average salary, pending approvals
- 📅 **Leave Management** - Request, approve, and track employee time off
- 📄 **Document Management** - Upload and manage employee documents
- 💬 **Internal Messaging** - Communication between employees
- 🎨 **Modern UI** - Clean interface built with React + Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 14+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/blackflag-hr-main.git
cd blackflag-hr-main
```

### 2. Database Setup

**Install PostgreSQL** (if not already installed):
- Windows: Download from https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt-get install postgresql`

**Create Database:**
```bash
psql -U postgres
CREATE DATABASE hrdb;
\q
```

**Load Employee Data:**
```bash
cd backend
python scripts/import_test_db.py --path ../test_db
```

This imports 10,000 real employee names from the MySQL test database into PostgreSQL.

### 3. Backend Setup

**Create environment file:**
```bash
cd backend
cp .env.example .env
```

**Edit `.env` with your PostgreSQL credentials:**
```env
db_username=postgres
db_password=your_postgres_password
db_host=localhost
db_port=5432
db_name=hrdb
environment=dev
```

**Install dependencies and run:**
```bash
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

Backend will run at `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

## Login Credentials

### HR Admin Accounts
- **Email:** sarah.chen@blackflag.hr | **Password:** Admin123!
- **Email:** hr.manager@blackflag.hr | **Password:** HRPass123!

### Employee Accounts (100 available)
**Password for all employees:** `Staff123!`

**Sample logins:**
1. georgi.facello@blackflag.hr
2. bezalel.simmel@blackflag.hr
3. parto.bamford@blackflag.hr
4. chirstian.koblick@blackflag.hr
5. kyoichi.maliniak@blackflag.hr
6. anneke.preusig@blackflag.hr
7. tzvetan.zielinski@blackflag.hr
8. saniya.kalloufi@blackflag.hr
9. sumant.peac@blackflag.hr
10. duangkaew.piveteau@blackflag.hr
...and 90 more (see full list in `/docs/CREDENTIALS.md`)

## Project Structure

```
blackflag-hr-main/
├── backend/
│   ├── src/
│   │   ├── main.py          # FastAPI application
│   │   ├── database.py      # PostgreSQL connection
│   │   ├── models.py        # SQLAlchemy models
│   │   └── routes/          # API endpoints
│   ├── scripts/
│   │   └── import_test_db.py # Data import script
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # Reusable components
│   │   ├── context/         # App state management
│   │   ├── data/
│   │   │   ├── mockData.ts  # Mock data with 10k employees
│   │   │   └── datasetNames.json # 10k real names
│   │   └── services/        # API client
│   ├── package.json
│   └── vite.config.ts
├── test_db/                 # MySQL employee database dump
├── terraform/               # AWS infrastructure
└── docs/                    # Documentation

```

## API Endpoints

### Employees
- `GET /api/v1/employees` - List all employees (paginated)
- `GET /api/v1/employees/{id}` - Get employee by ID
- `POST /api/v1/employees` - Create employee
- `PUT /api/v1/employees/{id}` - Update employee
- `DELETE /api/v1/employees/{id}` - Delete employee

### Health Check
- `GET /api/v1/health` - API health status

## Environment Variables

### Backend (.env)
```env
db_username=postgres
db_password=your_password
db_host=localhost
db_port=5432
db_name=hrdb
environment=dev
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_USE_API=false  # Set to 'true' to use backend API, 'false' for mock data
```

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -d hrdb -c "SELECT COUNT(*) FROM employees;"
```

### Backend Port Already in Use
```bash
# Windows
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force

# Mac/Linux
pkill -9 python
```

### Frontend Port Already in Use
```bash
# Windows
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Mac/Linux
pkill -9 node
```

### Clear Browser Cache
If login issues persist after changes:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Delete `http://localhost:5173`
4. Refresh page

## Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Backend Docker image
cd backend
docker build -t blackflag-hr-backend .

# Frontend
cd frontend
npm run build
```

## Data Source

Employee names are sourced from the [datacharmer/test_db](https://github.com/datacharmer/test_db) MySQL sample database - a large dataset of ~300,000 employees originally used for MySQL testing. We use the first 10,000 names for our HR system.

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router

**Backend:**
- Python 3.9+
- FastAPI
- SQLAlchemy
- PostgreSQL 14+
- Uvicorn

**Infrastructure:**
- Docker
- Terraform
- AWS (ECS, RDS, ALB, CloudFront)

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues or questions, please open a GitHub issue.
