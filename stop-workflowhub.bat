@echo off
echo 🛑 Stopping WorkflowHub containers...
echo.

:: Stop the containers
docker-compose -f docker-compose.dev.yml down

if %errorlevel% neq 0 (
    echo ❌ Failed to stop containers! Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ✅ WorkflowHub containers stopped successfully!
echo.
echo 📊 Remaining containers:
docker ps

echo.
echo 🧹 To clean up everything (optional):
echo    docker system prune -a
echo.
echo ✅ All done!
pause

