@echo off
cd /d "%~dp0"

echo.
echo ======================================================
echo DIAGNOSTIC DEPLOYMENT
echo ======================================================
echo.

:: Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git and restart this window.
    pause
    exit /b
)

echo [1/4] Checking current status...
git status

echo.
echo [2/4] Adding changes...
git add .

echo.
echo [3/4] Saving changes (Commit)...
git commit -m "Add D.esk AI project card to portfolio"

echo.
echo [4/4] Uploading to GitHub...
:: Trying to push only to 'main' branch
git push origin main --force

echo.
echo ======================================================
echo PROCESS FINISHED!
echo ======================================================
echo If you see "Everything up-to-date", it means it worked.
echo If you see errors, please copy them and tell me!
echo.
pause
