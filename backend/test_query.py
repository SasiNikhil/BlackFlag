import asyncio
import sys
sys.path.insert(0, 'C:\\Users\\SASI NIKHIL\\Desktop\\blackflag-hr-main\\backend')

from sqlalchemy import select
from src.database import AsyncSessionLocal
from src.models import Employee

async def test_query():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Employee).limit(2)
        )
        employees = result.scalars().all()
        print(f"Found {len(employees)} employees")
        for emp in employees:
            print(f"ID: {emp.id}, Name: {emp.first_name} {emp.last_name}, Hire Date: {emp.hire_date}, Type: {type(emp.hire_date)}")
            
asyncio.run(test_query())
