import requests

try:
    response = requests.get("http://127.0.0.1:8001/api/v1/employees?limit=2")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
