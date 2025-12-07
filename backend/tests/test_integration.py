import os
import sys
import asyncio
from pathlib import Path

# Add backend root to path so src module can be imported
backend_root = Path(__file__).parent.parent
sys.path.insert(0, str(backend_root))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select

# Ensure settings can be instantiated without raising on missing credentials
os.environ.setdefault("DB_USERNAME", "test")
os.environ.setdefault("DB_PASSWORD", "test")

import src.database as database
from src.models import Employee


TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


async def setup_in_memory_db(engine):
    """Create database tables in in-memory SQLite"""
    async with engine.begin() as conn:
        await conn.run_sync(database.Base.metadata.create_all)


async def seed_employees(async_session_maker):
    """Seed test employees"""
    async with async_session_maker() as session:
        session.add_all([
            Employee(employee_id="E001", email="a@example.com", first_name="Alice", last_name="Anderson", position="Engineer"),
            Employee(employee_id="E002", email="b@example.com", first_name="Bob", last_name="Brown", position="Senior Engineer"),
        ])
        await session.commit()


def setup_test_env():
    """Setup in-memory test environment"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    engine = create_async_engine(TEST_DB_URL, echo=False)
    async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    database.engine = engine
    database.AsyncSessionLocal = async_session_maker

    loop.run_until_complete(setup_in_memory_db(engine))
    loop.run_until_complete(seed_employees(async_session_maker))
    
    return loop, async_session_maker


def get_test_app(async_session_maker):
    """Create test FastAPI app with in-memory DB"""
    from fastapi import FastAPI
    from src.routes import employees

    app = FastAPI()
    app.include_router(employees.router, prefix="")

    async def get_test_db():
        async with async_session_maker() as session:
            try:
                yield session
            finally:
                await session.close()

    app.dependency_overrides[database.get_db] = get_test_db
    return app


def test_database_connection_and_query():
    """Test 1: Database connection and direct query"""
    loop, async_session_maker = setup_test_env()

    async def run_query():
        async with async_session_maker() as session:
            result = await session.execute(select(Employee).limit(2))
            return result.scalars().all()

    employees = loop.run_until_complete(run_query())
    assert len(employees) == 2, "Should find 2 seeded employees"
    assert employees[0].first_name == "Alice"
    assert employees[1].first_name == "Bob"


def test_employees_list_endpoint():
    """Test 2: GET /employees endpoint returns paginated list"""
    loop, async_session_maker = setup_test_env()
    app = get_test_app(async_session_maker)
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        r = client.get("/employees?limit=2")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 2
        assert "employee_id" in data[0]
        assert "email" in data[0]
        assert "first_name" in data[0]
        assert "salary" in data[0]  # Synthetic salary is computed in endpoint


def test_auth_login_valid_credentials():
    """Test 3: POST /api/v1/auth/login authenticates with valid credentials"""
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from src.routes import auth
    
    app = FastAPI()
    app.include_router(auth.router, prefix="/api/v1")

    with TestClient(app) as client:
        r = client.post("/api/v1/auth/login", json={
            "email": "sarah.chen@blackflag.hr",
            "password": "Admin123!"
        })
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True
        assert "user" in data
        assert data["user"]["role"] == "hr_admin"
        assert "Welcome" in data["message"]


def test_auth_login_invalid_credentials():
    """Test 4: POST /api/v1/auth/login rejects invalid credentials"""
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from src.routes import auth
    
    app = FastAPI()
    app.include_router(auth.router, prefix="/api/v1")

    with TestClient(app) as client:
        r = client.post("/api/v1/auth/login", json={
            "email": "invalid@example.com",
            "password": "wrongpass"
        })
        assert r.status_code == 401
        assert "Invalid" in str(r.json())


def test_health_check_endpoints():
    """Test 5: Health check endpoints are accessible"""
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from src.routes import health
    
    app = FastAPI()
    app.include_router(health.router)

    with TestClient(app) as client:
        # Liveness check
        r = client.get("/health/live")
        assert r.status_code == 200
        assert r.json()["status"] == "alive"
        
        # Health check
        r = client.get("/health")
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"
        
        # Readiness check
        r = client.get("/health/ready")
        assert r.status_code == 200
        assert "status" in r.json()


def test_api_integration_complete_flow():
    """Test 6: Complete API flow - list, query, and auth"""
    loop, async_session_maker = setup_test_env()
    app = get_test_app(async_session_maker)
    from fastapi.testclient import TestClient

    with TestClient(app) as client:
        # Step 1: List employees
        r1 = client.get("/employees?limit=10")
        assert r1.status_code == 200
        data = r1.json()
        assert len(data) >= 2
        
        # Step 2: Verify data structure
        emp = data[0]
        assert all(k in emp for k in ["id", "employee_id", "email", "first_name", "last_name"])
        
        # Step 3: Verify pagination
        r2 = client.get("/employees?skip=0&limit=1")
        assert r2.status_code == 200
        assert len(r2.json()) == 1
