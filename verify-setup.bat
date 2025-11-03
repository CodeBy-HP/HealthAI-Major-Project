@echo off
echo.
echo =======================================
echo   MediLens Setup Verification
echo =======================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>&1
if %errorlevel% equ 0 (
    node --version
    echo [OK] Node.js is installed
) else (
    echo [ERROR] Node.js not found
    echo Install from: https://nodejs.org
)
echo.

REM Check npm
echo Checking npm...
where npm >nul 2>&1
if %errorlevel% equ 0 (
    npm --version
    echo [OK] npm is installed
) else (
    echo [ERROR] npm not found
)
echo.

REM Check Python
echo Checking Python...
where python >nul 2>&1
if %errorlevel% equ 0 (
    python --version
    echo [OK] Python is installed
) else (
    echo [ERROR] Python not found
    echo Install from: https://python.org
)
echo.

REM Check pip
echo Checking pip...
where pip >nul 2>&1
if %errorlevel% equ 0 (
    pip --version
    echo [OK] pip is installed
) else (
    echo [ERROR] pip not found
)
echo.

echo =======================================
echo   Project Structure
echo =======================================
echo.

REM Check frontend
if exist "frontend\" (
    echo [OK] frontend folder exists
    
    if exist "frontend\package.json" (
        echo   [OK] package.json found
    ) else (
        echo   [ERROR] package.json missing
    )
    
    if exist "frontend\node_modules\" (
        echo   [OK] node_modules installed
    ) else (
        echo   [WARNING] node_modules not found
        echo   Run: cd frontend ^& npm install
    )
) else (
    echo [ERROR] frontend folder missing
)
echo.

REM Check backend
if exist "backend\" (
    echo [OK] backend folder exists
    
    if exist "backend\main.py" (
        echo   [OK] main.py found
    ) else (
        echo   [ERROR] main.py missing
    )
    
    if exist "backend\requirements.txt" (
        echo   [OK] requirements.txt found
    ) else (
        echo   [ERROR] requirements.txt missing
    )
    
    if exist "backend\.env" (
        echo   [OK] .env file configured
    ) else (
        echo   [INFO] .env not found ^(optional^)
    )
) else (
    echo [ERROR] backend folder missing
)
echo.

echo =======================================
echo   Next Steps
echo =======================================
echo.
echo 1. Install dependencies if not done:
echo    Frontend: cd frontend ^& npm install
echo    Backend:  cd backend ^& pip install -r requirements.txt
echo.
echo 2. ^(Optional^) Configure API key:
echo    cd backend
echo    copy .env.example .env
echo    Edit .env and add your Gemini API key
echo.
echo 3. Start the application:
echo    Run: start.bat
echo.
echo 4. Open http://localhost:3000
echo    Login: admin / admin123
echo.
pause
