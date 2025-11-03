@echo off
echo.
echo ========================================
echo   MediLens - AI Healthcare Analyzer
echo ========================================
echo.

REM Check if in correct directory
if not exist "frontend" (
    echo Error: frontend folder not found
    echo Please run this script from Minor-Project directory
    pause
    exit /b 1
)
if not exist "backend" (
    echo Error: backend folder not found
    echo Please run this script from Minor-Project directory
    pause
    exit /b 1
)

echo Starting Backend...
start "MediLens Backend" cmd /k "cd backend && python main.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend...
start "MediLens Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   MediLens Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo.
echo Login: admin / admin123
echo.
echo Close the command windows to stop.
echo.
pause
