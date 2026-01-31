@echo off
REM ===============================================
REM  GRACE-X FILM EDITION v7.0 - STOP ALL
REM  Kill all GRACE-X servers and processes
REM ===============================================

title GRACE-X FILM EDITION - Shutdown

echo.
echo ========================================================
echo   🎬 GRACE-X FILM EDITION v7.0 - SHUTDOWN
echo ========================================================
echo.

echo [STEP 1/3] Killing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    echo [KILL] Backend PID %%a
    taskkill /F /PID %%a >nul 2>nul
)

echo [STEP 2/3] Killing processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING 2^>nul') do (
    echo [KILL] Frontend PID %%a
    taskkill /F /PID %%a >nul 2>nul
)

echo [STEP 3/3] Killing any remaining GRACE-X windows...
taskkill /F /FI "WINDOWTITLE eq GRACE-X*" >nul 2>nul
taskkill /F /FI "WINDOWTITLE eq *http-server*" >nul 2>nul

echo.
echo [OK] All GRACE-X servers stopped
echo.
pause
