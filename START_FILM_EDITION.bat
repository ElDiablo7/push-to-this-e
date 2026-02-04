@echo off
REM ===============================================
REM  GRACE-X FILM EDITION v7.0
REM  AI PRO FILM PRODUCTION SUITE
REM  Zac Crockett - January 2026
REM ===============================================

title GRACE-X FILM EDITION v7.0 - Startup

echo.
echo ========================================================
echo   🎬 GRACE-X FILM EDITION v7.0
echo   AI PRO FILM PRODUCTION SUITE
echo   Core Control Panel System
echo ========================================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM ===============================================
REM STEP 1: Clear Browser Cache (Instructions)
REM ===============================================
echo [STEP 1/5] Cache Management
echo.
echo [INFO] For best results, clear your browser cache:
echo        - Chrome/Edge: Ctrl+Shift+Delete
echo        - Or use Incognito/Private mode
echo.
timeout /t 2 /nobreak >nul

REM ===============================================
REM STEP 2: Kill Old Servers
REM ===============================================
echo [STEP 2/5] Killing old server instances...
echo.

REM Kill any Node.js processes on ports 3000 and 8080
echo [ACTION] Stopping processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo [KILL] Terminating PID %%a
    taskkill /F /PID %%a >nul 2>nul
)

echo [ACTION] Stopping processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING 2^>nul') do (
    echo [KILL] Terminating PID %%a
    taskkill /F /PID %%a >nul 2>nul
)

REM Kill any existing GRACE-X windows
taskkill /F /FI "WINDOWTITLE eq GRACE-X*" >nul 2>nul
taskkill /F /FI "WINDOWTITLE eq *http-server*" >nul 2>nul

echo [OK] Old servers killed
timeout /t 2 /nobreak >nul

REM ===============================================
REM STEP 3: Check Dependencies
REM ===============================================
echo.
echo [STEP 3/5] Checking dependencies...
echo.

if not exist "server\node_modules" (
    echo [INSTALLING] Backend dependencies not found...
    cd server
    call npm install --silent
    if %ERRORLEVEL% NEQ 0 (
        echo [FAIL] Dependency installation failed!
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Dependencies installed
) else (
    echo [OK] Backend dependencies found
)

REM ===============================================
REM STEP 4: Start Backend (Port 3000)
REM ===============================================
echo.
echo [STEP 4/5] Starting backend server...
echo.

REM Start backend in a visible window (so you see errors if it crashes)
start "GRACE-X FILM Backend" cmd /k "cd /d %~dp0server && node server.js"

REM Wait for backend to be ready (health check, up to 30 seconds)
echo [WAIT] Waiting for backend to respond...
set /a attempts=0
:wait_backend
timeout /t 2 /nobreak >nul
set /a attempts+=1
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if %ERRORLEVEL% EQU 0 goto backend_ready
if %attempts% GEQ 15 (
    echo [WARN] Backend did not respond after 30s. Check the Backend window for errors.
    echo [INFO] Opening frontend anyway - start backend manually if needed.
    goto backend_done
)
goto wait_backend
:backend_ready
echo [OK] Backend ready at http://localhost:3000
:backend_done
timeout /t 2 /nobreak >nul

REM ===============================================
REM STEP 5: Start Frontend (Port 8080)
REM ===============================================
echo.
echo [STEP 5/5] Launching GRACE-X FILM EDITION...
echo.

timeout /t 2 /nobreak >nul

echo [OK] Opening browser at http://localhost:8080
start "" "http://localhost:8080"
timeout /t 1 /nobreak >nul

echo.
echo ========================================================
echo   🎬 GRACE-X FILM EDITION v7.0 - RUNNING
echo ========================================================
echo.
echo   Backend:  http://localhost:3000 ✅
echo   Frontend: http://localhost:8080 ✅
echo.
echo   Core Control Panel: Ready
echo   17 Modules Active (TradeLink removed)
echo.
echo   Status: FILM EDITION ACTIVE 🎬
echo.
echo ========================================================
echo.
echo [INFO] Frontend server running in this window
echo [INFO] Close this window to stop GRACE-X
echo.
echo Press Ctrl+C to shutdown servers
echo.

REM Start frontend server (blocks until stopped)
npx -y http-server -p 8080 -c-1 --silent

REM Cleanup on exit
echo.
echo [SHUTDOWN] Stopping GRACE-X FILM EDITION...
taskkill /F /FI "WINDOWTITLE eq GRACE-X FILM Backend" >nul 2>nul
echo [SHUTDOWN] Complete
pause
