@echo off
setlocal enabledelayedexpansion

echo 🚀 BQOMIS Deployment Script
echo ==========================

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo Please create a .env file with your database credentials:
    echo DB_USERNAME=your_username
    echo DB_PASSWORD=your_password
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if caddy_network exists
docker network ls | findstr caddy_network >nul
if errorlevel 1 (
    echo ⚠️ caddy_network not found. Creating it...
    docker network create caddy_network
    echo ✅ caddy_network created
)

echo 🔧 Building and starting services...

REM Build and start the services
docker-compose up --build -d

echo ⏳ Waiting for services to be healthy...

REM Wait for backend to be healthy
echo Checking backend health...
set /a timeout=120
set /a count=0
:backend_health_loop
if !count! geq !timeout! (
    echo ❌ Backend failed to become healthy within !timeout! seconds
    echo Check logs with: docker-compose logs backend
    pause
    exit /b 1
)

docker-compose exec -T backend curl -f http://localhost:8080/actuator/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend is healthy
    goto frontend_health
)

timeout /t 5 /nobreak >nul
set /a count+=5
echo Waiting for backend... (!count!/!timeout! seconds)
goto backend_health_loop

:frontend_health
REM Wait for frontend to be healthy
echo Checking frontend health...
set /a timeout=60
set /a count=0
:frontend_health_loop
if !count! geq !timeout! (
    echo ❌ Frontend failed to become healthy within !timeout! seconds
    echo Check logs with: docker-compose logs frontend
    pause
    exit /b 1
)

docker-compose exec -T frontend curl -f http://localhost/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ Frontend is healthy
    goto deployment_complete
)

timeout /t 3 /nobreak >nul
set /a count+=3
echo Waiting for frontend... (!count!/!timeout! seconds)
goto frontend_health_loop

:deployment_complete
echo.
echo 🎉 Deployment completed successfully!
echo ==========================
echo Services status:
docker-compose ps
echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f [service_name]
echo   Stop services: docker-compose down
echo   Restart services: docker-compose restart [service_name]
echo   View status: docker-compose ps
echo.
echo 🌐 Your application should now be accessible through your Caddy reverse proxy at:
echo    https://bqomis.haguma.com
pause
