# 🐳 WorkflowHub Docker Complete Setup Guide

## 📋 Prerequisites

### **Required Software:**
1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
2. **Git** - [Download here](https://git-scm.com/downloads)
3. **Node.js 18+** (optional, for local development)

---

## 🚀 Quick Start (Docker Desktop)

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/workflow-v1.git
cd workflow-v1
```

### **Step 2: Setup Environment**
```bash
# Copy the example environment file
copy env.example .env.local

# Edit .env.local with your actual values (see Environment Setup section below)
```

### **Step 3: Start with Docker Desktop**

#### **Option A: Development Mode (Recommended for testing)**
1. Open Docker Desktop
2. Open terminal in project folder
3. Run:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### **Option B: Production Mode**
```bash
docker-compose up -d
```

### **Step 4: Access Your Application**
- **App**: http://localhost:3000
- **MongoDB** (dev mode): http://localhost:27017
- **Mongo Express** (dev mode with tools): http://localhost:8081

---

## 🔧 Environment Setup

### **Minimum Required Environment Variables**

Create `.env.local` file with these essential variables:

```env
# Database (Choose one option)
# Option 1: MongoDB Atlas (Recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflowhub

# Option 2: Local MongoDB (if using docker-compose)
# MONGODB_URI=mongodb://admin:devpassword@mongodb-dev:27017/workflowhub_dev?authSource=admin

# Authentication (Clerk) - Get from https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **Optional Google Integration**
```env
# Google OAuth (for Google Workspace features)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
```

---

## 🖥️ Docker Desktop GUI Instructions

### **Starting the Application:**

1. **Open Docker Desktop**
2. **Navigate to the project folder** in terminal
3. **For Development:**
   - Click "Compose" in Docker Desktop
   - Select `docker-compose.dev.yml`
   - Click "Start"
   
   **OR use terminal:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Monitor in Docker Desktop:**
   - Go to "Containers" tab
   - You'll see `workflowhub-forked` containers running
   - Click on container names to view logs

### **Managing Containers:**

#### **View Logs:**
- In Docker Desktop: Click container → "Logs" tab
- Or terminal: `docker-compose -f docker-compose.dev.yml logs -f`

#### **Stop Containers:**
- In Docker Desktop: Click container → "Stop"
- Or terminal: `docker-compose -f docker-compose.dev.yml down`

#### **Restart Containers:**
- In Docker Desktop: Click container → "Restart"
- Or terminal: `docker-compose -f docker-compose.dev.yml restart`

#### **Update After Code Changes:**
```bash
# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build -d
```

---

## ⚡ Docker CLI Commands

### **Development Commands:**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs (all services)
docker-compose -f docker-compose.dev.yml logs -f

# View logs (specific service)
docker-compose -f docker-compose.dev.yml logs -f workflowhub-dev

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild after changes
docker-compose -f docker-compose.dev.yml up --build -d

# Remove everything (including volumes)
docker-compose -f docker-compose.dev.yml down -v
```

### **Production Commands:**
```bash
# Start production environment
docker-compose up -d

# View production logs
docker-compose logs -f workflowhub

# Stop production environment
docker-compose down

# Update production deployment
docker-compose up --build -d
```

### **Useful Docker Commands:**
```bash
# List all containers
docker ps -a

# List all images
docker images

# Remove unused containers/images
docker system prune -a

# Access container shell
docker exec -it workflowhub-forked-workflowhub-dev-1 sh

# Check container resource usage
docker stats

# View container details
docker inspect container_name
```

---

## 🔍 Troubleshooting

### **Common Issues:**

#### **1. "Unable to get image" error**
```bash
# Solution: Make sure Docker Desktop is running and try:
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d
```

#### **2. Port already in use**
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process or change port in docker-compose file
```

#### **3. MongoDB connection issues**
```bash
# For Windows development, add to .env.local:
MONGODB_USE_MOCK=true

# Or check MongoDB container logs:
docker-compose -f docker-compose.dev.yml logs mongodb-dev
```

#### **4. Permission errors**
```bash
# On Windows, ensure Docker Desktop has proper permissions
# Run terminal as Administrator if needed
```

#### **5. Build fails**
```bash
# Clear Docker cache and rebuild
docker system prune -a
docker-compose -f docker-compose.dev.yml build --no-cache
```

### **Health Checks:**

#### **Check if app is running:**
```bash
curl http://localhost:3000
# Should return HTML content
```

#### **Check API endpoints:**
```bash
curl http://localhost:3000/api/health
# Should return "healthy"
```

#### **Check MongoDB (if using local):**
```bash
docker-compose -f docker-compose.dev.yml exec mongodb-dev mongo --eval "db.adminCommand('ping')"
```

---

## 📊 Docker Desktop Monitoring

### **Container Status:**
- **Green dot**: Container running healthy
- **Red dot**: Container stopped/error
- **Yellow dot**: Container starting

### **Resource Usage:**
- Monitor CPU, Memory, Network in "Stats" tab
- Set resource limits in Docker Desktop settings

### **Volume Management:**
- View persistent data in "Volumes" tab
- Backup important volumes before major changes

---

## 🔄 Development Workflow

### **Daily Development:**
1. **Start containers:** `docker-compose -f docker-compose.dev.yml up -d`
2. **Check logs:** Monitor in Docker Desktop or `docker-compose logs -f`
3. **Make code changes:** Hot reload will automatically update
4. **Test changes:** Visit http://localhost:3000
5. **Stop when done:** `docker-compose -f docker-compose.dev.yml down`

### **After Major Changes:**
```bash
# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build -d

# Or force complete rebuild
docker-compose -f docker-compose.dev.yml down
docker system prune -a
docker-compose -f docker-compose.dev.yml up --build -d
```

---

## 🚀 Production Deployment

### **For VPS/Server Deployment:**
```bash
# 1. Clone repository on server
git clone https://github.com/yourusername/workflow-v1.git
cd workflow-v1

# 2. Setup production environment
cp env.example .env.production
# Edit .env.production with production values

# 3. Start production containers
docker-compose up -d

# 4. Setup SSL (recommended)
# Use nginx.conf for SSL configuration
```

### **For Cloud Platforms:**
- **Railway/Render**: Connect GitHub repository directly
- **DigitalOcean**: Use App Platform with GitHub integration
- **AWS/Azure**: Use container services with this Docker setup

---

## 📱 Mobile/Remote Access

### **Access from other devices on same network:**
```bash
# Find your local IP
ipconfig

# Access via: http://YOUR_LOCAL_IP:3000
# Example: http://192.168.1.100:3000
```

---

## 🔐 Security Notes

### **Development:**
- ✅ Mock database for Windows development
- ✅ Hot reloading enabled
- ⚠️ Debug mode enabled

### **Production:**
- ✅ Optimized builds
- ✅ Security headers in nginx
- ✅ Rate limiting
- 🔒 **Remember**: Use HTTPS in production
- 🔒 **Remember**: Use strong database passwords
- 🔒 **Remember**: Keep environment files secure

---

## 📞 Support

### **If you encounter issues:**

1. **Check Docker Desktop is running**
2. **Verify .env.local has required variables**
3. **Check container logs in Docker Desktop**
4. **Try rebuilding containers**
5. **Check this guide's troubleshooting section**

### **Useful Resources:**
- [Docker Desktop Documentation](https://docs.docker.com/desktop/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)

---

## 🎉 Success Indicators

### **Your setup is working when you see:**
- ✅ Containers running in Docker Desktop
- ✅ App accessible at http://localhost:3000
- ✅ Database connection successful (check logs)
- ✅ No error messages in container logs
- ✅ Clerk authentication working
- ✅ Dashboard loads with data

**Congratulations! Your WorkflowHub is now running in Docker! 🚀**

