# BQOMIS Docker Deployment Guide

This guide explains how to deploy the BQOMIS full-stack application using Docker and Docker Compose.

## 🏗️ Architecture

The application consists of:
- **Frontend**: React application served by Nginx with reverse proxy to backend
- **Backend**: Spring Boot application
- **Database**: PostgreSQL
- **Reverse Proxy**: External Caddy server (not managed by this compose file)

## 📋 Prerequisites

1. **Docker & Docker Compose** installed on your VPS
2. **Caddy reverse proxy** running with `caddy_network` network
3. **Domain configured** to point to your VPS

## 🚀 Quick Deployment

1. **Clone and navigate to the project**:
   ```bash
   cd bqomis
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   nano .env
   ```

3. **Run the deployment script**:
   ```bash
   # On Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   
   # On Windows
   deploy.bat
   ```

## 🔧 Manual Deployment

### Step 1: Environment Configuration

Create a `.env` file in the project root:

```env
DB_USERNAME=bqomis_user
DB_PASSWORD=your_secure_password_here
```

### Step 2: Network Setup

Ensure the Caddy network exists:
```bash
docker network create caddy_network
```

### Step 3: Build and Start

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🌐 Networking

- **Frontend**: Connected to both `app_network` (internal) and `caddy_network` (external)
- **Backend**: Only on `app_network` (internal communication)
- **Database**: Only on `app_network` (internal communication)

The frontend container does not expose ports to the host. Access is only through Caddy reverse proxy.

## 🔍 Health Checks

All services include health checks:
- **Backend**: `/actuator/health` endpoint
- **Frontend**: `/health` endpoint  
- **Database**: PostgreSQL ready check

## 📊 Monitoring

Check service health:
```bash
# Service status
docker-compose ps

# Logs for all services
docker-compose logs -f

# Logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

## 🛠️ Maintenance

### Updating the Application

1. Pull latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild and restart:
   ```bash
   docker-compose up --build -d
   ```

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U bqomis_user bqomis_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U bqomis_user bqomis_db < backup.sql
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart frontend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v
```

## 🐛 Troubleshooting

### Common Issues

1. **"caddy_network not found"**:
   ```bash
   docker network create caddy_network
   ```

2. **Backend fails to start**:
   - Check database connection
   - Verify environment variables
   - Check logs: `docker-compose logs backend`

3. **Frontend 502/503 errors**:
   - Ensure backend is healthy
   - Check nginx logs: `docker-compose logs frontend`

4. **Database connection issues**:
   - Verify credentials in `.env`
   - Ensure PostgreSQL is healthy: `docker-compose ps`

### Viewing Detailed Logs

```bash
# All services with timestamps
docker-compose logs -f -t

# Specific service with last 100 lines
docker-compose logs --tail=100 -f backend
```

### Container Shell Access

```bash
# Frontend container (nginx)
docker-compose exec frontend sh

# Backend container (java)
docker-compose exec backend bash

# Database container
docker-compose exec postgres psql -U bqomis_user -d bqomis_db
```

## 🔒 Security Considerations

- All services run as non-root users
- Database credentials are in environment variables
- Frontend includes security headers
- API rate limiting is configured
- Internal services are not exposed to host

## 📈 Performance Optimizations

- Multi-stage Docker builds for smaller images
- Gzip compression enabled in Nginx
- Static asset caching
- Database connection pooling
- Health checks for quick failure detection

## 🌍 Production Checklist

- [ ] Update database credentials in `.env`
- [ ] Configure domain in Caddy
- [ ] Set up SSL certificates
- [ ] Configure backup strategy
- [ ] Monitor resource usage
- [ ] Set up log rotation
- [ ] Configure alerts for health check failures
