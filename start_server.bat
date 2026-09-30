@echo off
cd /d "%~dp0"
echo =====================================================
echo  Starting LionStone Floors Local Development Server
echo =====================================================
echo Serving Folder: %CD%
echo Server URL:     http://localhost:8000
echo.
start http://localhost:8000
python -m http.server 8000 --directory "%~dp0"
pause
