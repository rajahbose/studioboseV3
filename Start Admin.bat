@echo off
title Studio BOSE Admin Manager
color 0f
echo.
echo    =========================================
echo    Starting Studio BOSE Admin Manager...
echo    =========================================
echo.
echo    Starting server on http://localhost:3000
echo    Please leave this window open while you work.
echo    Close this window to shut down the server when finished.
echo.

:: Wait 2 seconds in the background then open the browser
start /b cmd /c "timeout /t 2 >nul && start """" ""http://localhost:3000/admin/index.html"""

:: Start the server in the foreground
node server.js
