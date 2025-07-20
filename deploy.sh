#!/bin/bash

# BQOMIS Deployment Script
# This script helps deploy the BQOMIS application using Docker Compose

set -e

echo "🚀 BQOMIS Deployment Script"
echo "=========================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your database credentials:"
    echo "DB_USERNAME=your_username"
    echo "DB_PASSWORD=your_password"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if caddy_network exists
if ! docker network ls | grep -q caddy_network; then
    echo "⚠️  caddy_network not found. Creating it..."
    docker network create caddy_network
    echo "✅ caddy_network created"
fi

echo "🔧 Building and starting services..."

# Build and start the services
docker-compose up --build -d

echo "⏳ Waiting for services to be healthy..."

# Wait for backend to be healthy
echo "Checking backend health..."
timeout=120
count=0
while [ $count -lt $timeout ]; do
    if docker-compose exec -T backend curl -f http://localhost:8080/actuator/health >/dev/null 2>&1; then
        echo "✅ Backend is healthy"
        break
    fi
    sleep 5
    count=$((count + 5))
    echo "Waiting for backend... ($count/$timeout seconds)"
done

if [ $count -ge $timeout ]; then
    echo "❌ Backend failed to become healthy within $timeout seconds"
    echo "Check logs with: docker-compose logs backend"
    exit 1
fi

# Wait for frontend to be healthy
echo "Checking frontend health..."
timeout=60
count=0
while [ $count -lt $timeout ]; do
    if docker-compose exec -T frontend curl -f http://localhost/health >/dev/null 2>&1; then
        echo "✅ Frontend is healthy"
        break
    fi
    sleep 3
    count=$((count + 3))
    echo "Waiting for frontend... ($count/$timeout seconds)"
done

if [ $count -ge $timeout ]; then
    echo "❌ Frontend failed to become healthy within $timeout seconds"
    echo "Check logs with: docker-compose logs frontend"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "=========================="
echo "Services status:"
docker-compose ps
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f [service_name]"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart [service_name]"
echo "  View status: docker-compose ps"
echo ""
echo "🌐 Your application should now be accessible through your Caddy reverse proxy at:"
echo "   https://bqomis.haguma.com"
