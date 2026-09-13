@echo off
setlocal
set "PATH=C:\Program Files\nodejs;%~dp0node_modules\.bin;%PATH%"
cd /d "%~dp0"
echo Starting MyFit AI at http://localhost:3000
call "%~dp0node_modules\.bin\next.cmd" dev --hostname 0.0.0.0
pause
