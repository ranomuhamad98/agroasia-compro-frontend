# Docker Setup Guide - Shofi Grocery

Panduan lengkap untuk menjalankan aplikasi Shofi Grocery menggunakan Docker dengan konfigurasi yang optimal, ringan, dan hemat memori.

## 🚀 Quick Start

### Prerequisites
- Docker (versi 20.10+)
- Docker Compose (versi 2.0+)
- Minimal 2GB RAM tersedia

### Menjalankan Development
```bash
# Menggunakan script helper
./docker-scripts.sh dev

# Atau manual
docker-compose --profile dev up -d --build
```

### Menjalankan Production
```bash
# Menggunakan script helper
./docker-scripts.sh prod

# Atau manual
docker-compose --profile prod up -d --build
```

## 📋 Management Commands

Script `docker-scripts.sh` menyediakan command yang mudah untuk mengelola container:

```bash
./docker-scripts.sh dev      # Start development environment
./docker-scripts.sh prod     # Start production environment
./docker-scripts.sh build    # Build production image
./docker-scripts.sh stop     # Stop all containers
./docker-scripts.sh restart  # Restart containers
./docker-scripts.sh logs     # Show container logs
./docker-scripts.sh status   # Show container status
./docker-scripts.sh health   # Check container health
./docker-scripts.sh clean    # Clean up containers and images
./docker-scripts.sh help     # Show help message
```

## 🏗️ Architecture Overview

### Development Environment
- **Target**: `build` stage dari Dockerfile
- **Port**: 3000
- **Features**: Hot reload, volume mounting
- **Memory Usage**: ~200-300MB

### Production Environment
- **Target**: `production` stage dari Dockerfile
- **Port**: 80 (melalui nginx), 3000 (direct)
- **Features**: Nginx reverse proxy, caching, compression
- **Memory Usage**: ~400-600MB total (App: 256-512MB, Nginx: 64-128MB)

## 🔧 Konfigurasi Files

### Dockerfile
- **Multi-stage build** untuk optimasi ukuran
- **Alpine Linux** base image (ukuran kecil)
- **Non-root user** untuk security
- **Production build** hanya copy hasil build

### docker-compose.yml
- **Profiles** untuk development dan production
- **Resource limits** untuk memory dan CPU
- **Health checks** untuk monitoring
- **Network isolation** dengan custom bridge

### nginx.conf
- **Reverse proxy** dengan load balancing
- **Static file caching** (7 hari)
- **Gzip compression** untuk text files
- **Rate limiting** untuk API endpoints
- **Security headers** dan best practices

### .dockerignore
- Mengecualikan `node_modules`, `.git`, dan file development
- Mengurangi build context dari ~500MB ke ~50MB

## 💾 Memory Optimization

### Strategi Optimasi:
1. **Multi-stage build**: Menghilangkan dependencies development
2. **Alpine Linux**: Base image hanya ~5MB
3. **Resource limits**: Membatasi memory dan CPU usage
4. **Nginx caching**: Mengurangi load ke Nuxt.js
5. **Non-root user**: Security dan resource isolation

### Resource Allocation:
```yaml
# Production limits
Memory: 512MB (max), 256MB (reserved)
CPU: 0.5 cores (max), 0.25 cores (reserved)

# Nginx limits  
Memory: 128MB (max)
CPU: 0.25 cores (max)
```

## 🔍 Monitoring & Debugging

### Health Checks
```bash
# Check application health
./docker-scripts.sh health

# View logs
./docker-scripts.sh logs

# Container status
./docker-scripts.sh status
```

### Log Locations
- Application logs: `docker-compose logs shofi-grocery-prod`
- Nginx logs: `docker-compose logs nginx`
- System logs: `docker system df`

### Troubleshooting

#### Container tidak start:
```bash
# Check container status
docker ps -a

# Check logs
docker logs shofi-grocery-prod

# Check resource usage
docker stats
```

#### Memory issues:
```bash
# Monitor resource usage
docker stats --no-stream

# Clean unused resources
./docker-scripts.sh clean
```

#### Network issues:
```bash
# Check network
docker network ls
docker network inspect shofi-grocery_shofi-network
```

## 🚀 Production Deployment

### Build Production Image
```bash
# Build optimized image
./docker-scripts.sh build

# Tag for registry
docker tag shofi-grocery:latest your-registry/shofi-grocery:v1.0.0
```

### Deploy to Server
```bash
# Push to registry
docker push your-registry/shofi-grocery:v1.0.0

# Deploy on server
docker-compose --profile prod up -d
```

### SSL/HTTPS Setup (Optional)
1. Buat directory `ssl/` dan copy certificate files
2. Update `nginx.conf` untuk enable HTTPS
3. Restart nginx container

## 📊 Performance Metrics

### Expected Performance:
- **Build time**: 3-5 menit (first build), 30-60 detik (subsequent)
- **Memory usage**: 400-600MB total
- **Startup time**: 10-30 detik
- **Response time**: <100ms (cached), <500ms (uncached)

### Optimization Tips:
1. Gunakan `.dockerignore` yang comprehensive
2. Enable Docker BuildKit untuk build yang lebih cepat
3. Gunakan multi-stage build untuk size optimization
4. Implement proper caching strategy

## 🔒 Security Best Practices

### Implemented:
- Non-root user dalam container
- Security headers di nginx
- Rate limiting untuk API
- Minimal base image (Alpine)
- No sensitive data dalam image

### Recommendations:
- Gunakan secrets management untuk production
- Regular update base images
- Monitor untuk vulnerabilities
- Implement proper logging

## 🛠️ Development Tips

### Hot Reload Development:
```bash
# Start dengan volume mounting
./docker-scripts.sh dev

# Perubahan code akan auto-reload
```

### Debugging:
```bash
# Execute into container
docker exec -it shofi-grocery-dev sh

# View real-time logs
./docker-scripts.sh logs
```

### Database Integration:
Jika memerlukan database, tambahkan service di `docker-compose.yml`:
```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: shofi_grocery
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

## 📞 Support

Jika mengalami issues:
1. Check logs: `./docker-scripts.sh logs`
2. Check status: `./docker-scripts.sh status`
3. Restart: `./docker-scripts.sh restart`
4. Clean & rebuild: `./docker-scripts.sh clean && ./docker-scripts.sh prod`

---

**Catatan**: Konfigurasi ini sudah dioptimasi untuk production use dengan fokus pada reliability, performance, dan memory efficiency. 