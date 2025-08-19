@echo off
echo 🚀 Starting WorkflowHub with Docker Desktop...
echo.

:: Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop first:
    echo 1. Look for Docker Desktop in your system tray
    echo 2. Double-click to start it
    echo 3. Wait for "Docker Desktop is running" message
    echo 4. Then run this script again
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is running!
echo.

:: Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  Environment file missing!
    echo.
    echo Creating .env.local from template...
    copy "env.example" ".env.local" >nul
    echo.
    echo ⚠️  IMPORTANT: Edit .env.local with your actual credentials:
    echo   - Add your Clerk keys
    echo   - Add your MongoDB URI
    echo   - Save the file
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Environment file found!
echo.

:: Build and start containers
echo 🔨 Building Docker containers...
docker-compose -f docker-compose.dev.yml build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Check the error messages above.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo 🚀 Starting containers...
docker-compose -f docker-compose.dev.yml up -d

if %errorlevel% neq 0 (
    echo ❌ Failed to start containers! Check the error messages above.
    pause
    exit /b 1
)

echo.
echo 🎉 WorkflowHub is starting!
echo.
echo 📊 Container Status:
docker-compose -f docker-compose.dev.yml ps

echo.
echo 🌐 Your app will be available at:
echo    http://localhost:3000
echo.
echo 📋 Useful commands:
echo    View logs:    docker-compose -f docker-compose.dev.yml logs -f
echo    Stop app:     docker-compose -f docker-compose.dev.yml down
echo    Restart:      docker-compose -f docker-compose.dev.yml restart
echo.
echo Opening your app in browser...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo ✅ Setup complete! Check Docker Desktop for container status.
pause

