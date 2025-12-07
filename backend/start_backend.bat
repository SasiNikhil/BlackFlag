@echo off
cd /d "C:\Users\SASI NIKHIL\Desktop\blackflag-hr-main\backend"
set db_username=postgres
set db_password=postgres
set db_host=localhost
set db_port=5432
set db_name=hrdb
set environment=dev
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000
pause
