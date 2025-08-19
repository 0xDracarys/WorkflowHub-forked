# 🐳 WorkflowHub Docker Deployment Guide

## Quick Start

### 1. **Development Setup**
```bash
# Copy environment variables
cp env.example .env.local

# Edit .env.local with your actual values
# At minimum, you need:
# - MONGODB_URI (or use local MongoDB)
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

Your app will be available at:
- **App**: http://localhost:3000
- **MongoDB**: localhost:27017
- **Mongo Express** (if enabled): http://localhost:8081

### 2. **Production Deployment**
```bash
# Copy and configure environment
cp env.example .env.production

# Build and start production
docker-compose up -d

# View logs
docker-compose logs -f workflowhub
```

## 📋 Environment Variables Required

### **Essential (App won't work without these):**
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### **For Google Integration:**
```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/google/callback
```

### **Optional:**
```env
GEMINI_API_KEY=your_gemini_key  # For AI features
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🚀 Deployment Options

### **Option 1: MongoDB Atlas (Recommended)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflowhub
```

### **Option 2: Local MongoDB**
```bash
# Use the included MongoDB container
docker-compose up -d mongodb
```
```env
MONGODB_URI=mongodb://admin:password@mongodb:27017/workflowhub?authSource=admin
```

### **Option 3: External MongoDB**
Point `MONGODB_URI` to your existing MongoDB instance.

## 🔧 Configuration Files

### **docker-compose.yml** - Production
- Optimized Next.js build
- Optional local MongoDB
- Optional Nginx reverse proxy
- Health checks and restart policies

### **docker-compose.dev.yml** - Development
- Hot reloading enabled
- Source code mounting
- Development MongoDB
- Optional Mongo Express admin interface

### **Dockerfile** - Production Build
- Multi-stage build for optimization
- Standalone Next.js output
- Minimal Alpine Linux base
- Non-root user for security

### **Dockerfile.dev** - Development Build
- Hot reloading support
- Development dependencies included
- Volume mounting for live updates

## 🛠️ Docker Commands

### **Development:**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f workflowhub-dev

# Access MongoDB admin (if enabled)
docker-compose -f docker-compose.dev.yml --profile tools up -d
```

### **Production:**
```bash
# Start production
docker-compose up -d

# Stop production
docker-compose down

# Update and rebuild
docker-compose up --build -d

# Scale the application
docker-compose up --scale workflowhub=3 -d

# View logs
docker-compose logs -f workflowhub
```

### **Maintenance:**
```bash
# Clean up unused images
docker system prune -a

# View container status
docker-compose ps

# Backup MongoDB data
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB data
docker-compose exec mongodb mongorestore /backup
```

## 🌐 Production Considerations

### **1. Environment Variables**
- Use Docker secrets or encrypted environment files
- Never commit real credentials to version control
- Use strong passwords for MongoDB

### **2. SSL/HTTPS**
- Configure SSL certificates in `nginx.conf`
- Update `GOOGLE_REDIRECT_URI` to use HTTPS
- Set `NEXT_PUBLIC_APP_URL` to your HTTPS domain

### **3. Monitoring**
```bash
# Add health checks
docker-compose exec workflowhub curl http://localhost:3000/api/health

# Monitor resource usage
docker stats
```

### **4. Scaling**
```bash
# Scale horizontally
docker-compose up --scale workflowhub=3 -d

# Use external load balancer for production
# Update nginx.conf for multiple upstream servers
```

### **5. Backup Strategy**
```bash
# Automated MongoDB backup
docker-compose exec mongodb mongodump --gzip --out /backup/$(date +%Y%m%d)

# Backup application data
docker run --rm -v workflowhub_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

## 🐛 Troubleshooting

### **App won't start:**
1. Check environment variables: `docker-compose config`
2. Check logs: `docker-compose logs workflowhub`
3. Verify MongoDB connection: `docker-compose exec workflowhub node -e "console.log(process.env.MONGODB_URI)"`

### **MongoDB connection issues:**
1. For Windows development: Add `MONGODB_USE_MOCK=true` to use mock database
2. Check MongoDB container: `docker-compose logs mongodb`
3. Test connection: `docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"`

### **Google Integration not working:**
1. Verify Google Cloud Console setup
2. Check redirect URI matches your domain
3. Ensure environment variables are set correctly

### **Build failures:**
1. Clear Docker cache: `docker builder prune -a`
2. Remove node_modules: `docker-compose down && docker volume prune`
3. Rebuild from scratch: `docker-compose build --no-cache`

## 📊 Performance Optimization

### **Production optimizations already included:**
- ✅ Multi-stage Docker builds
- ✅ Standalone Next.js output
- ✅ Nginx reverse proxy with caching
- ✅ Rate limiting on API endpoints
- ✅ MongoDB connection pooling
- ✅ Static asset caching

### **Additional optimizations:**
```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Enable Docker layer caching in CI/CD
docker build --cache-from workflowhub:latest .
```

## 🔒 Security Checklist

- [ ] Use non-root user in containers ✅
- [ ] Set up proper firewall rules
- [ ] Use HTTPS in production
- [ ] Secure MongoDB with authentication ✅
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Use Docker secrets for sensitive data
- [ ] Limit container resources

## 📞 Support

If you encounter issues:

1. **Check logs first**: `docker-compose logs -f`
2. **Verify environment**: `docker-compose config`
3. **Test connectivity**: Use health check endpoints
4. **MongoDB issues**: Check the MongoDB troubleshooting guide in `docs/`

## 🚀 Deployment Platforms

This Docker setup works with:
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **Railway**
- **Render**
- **Any VPS with Docker**

