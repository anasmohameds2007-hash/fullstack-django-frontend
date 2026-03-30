@echo off
REM Django E-Commerce Backend Startup Script for Windows
REM Run this batch file to setup and start the backend

echo.
echo ========================================
echo Django E-Commerce Backend Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

python --version

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo.
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo.
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo Installing dependencies...
pip install -r requirements.txt --quiet

REM Apply migrations
echo.
echo Applying database migrations...
python manage.py migrate

REM Ask to create superuser
echo.
set /p createsuperuser="Do you want to create a superuser? (y/n): "
if /i "%createsuperuser%"=="y" (
    python manage.py createsuperuser
)

REM Run server
echo.
echo ========================================
echo Starting Django Development Server
echo ========================================
echo.
echo Server running at http://localhost:8000
echo Admin panel at http://localhost:8000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver
