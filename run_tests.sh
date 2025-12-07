#!/bin/bash
set -e

echo "=================================="
echo "BlackFlag HR - Test Runner"
echo "=================================="
echo ""

# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "[1/4] Creating virtual environment..."
    python3 -m venv .venv
else
    echo "[1/4] Virtual environment already exists"
fi

# Activate venv
echo "[2/4] Activating virtual environment and installing dependencies..."
source .venv/bin/activate
pip install -U pip > /dev/null 2>&1
pip install -r backend/requirements.txt > /dev/null 2>&1

# Run tests
echo "[3/4] Running pytest integration tests..."
cd backend
pytest tests/test_integration.py -v | tee test_output.txt
TEST_EXIT=$?
cd ..

# Generate screenshot
echo ""
echo "[4/4] Generating test screenshot..."
python3 scripts/generate_test_screenshot.py backend/test_output.txt backend/test_output.png

echo ""
echo "=================================="
echo "Test Complete!"
echo "=================================="
echo ""
echo "Test Output: backend/test_output.txt"
echo "Test Screenshot: backend/test_output.png"
echo ""
echo "Use these files in your project submission:"
echo "  - Include test_output.txt in documentation"
echo "  - Attach test_output.png as proof of passing tests"
echo ""
exit $TEST_EXIT
