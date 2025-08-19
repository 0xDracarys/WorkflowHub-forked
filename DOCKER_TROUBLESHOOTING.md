# 🔧 Docker Desktop Troubleshooting Guide

## ❌ Error: "The system cannot find the file specified"

This error means **Docker Desktop is not running** or not properly configured on Windows.

---

## 🚀 Step-by-Step Fix

### **Step 1: Start Docker Desktop**

1. **Find Docker Desktop:**
   - Look for Docker Desktop icon in system tray (bottom right)
   - Or search "Docker Desktop" in Windows Start menu

2. **Start Docker Desktop:**
   - Double-click the Docker Desktop icon
   - Wait for it to fully start (this can take 1-2 minutes)
   - You'll see "Docker Desktop is running" in the system tray

3. **Verify Docker is Running:**
   ```bash
   docker --version
   docker info
   ```

### **Step 2: Check Docker Desktop Settings**

1. **Right-click Docker Desktop icon** in system tray
2. **Click "Settings"**
3. **Check these settings:**
   - ✅ **General** → "Start Docker Desktop when you log in" (recommended)
   - ✅ **Resources** → Ensure adequate CPU/Memory (4GB+ recommended)
   - ✅ **Docker Engine** → Should be running

### **Step 3: Restart Docker Desktop (if needed)**

If Docker Desktop is running but still getting errors:

1. **Right-click Docker Desktop icon**
2. **Click "Restart Docker Desktop"**
3. **Wait for complete restart** (2-3 minutes)
4. **Test again:**
   ```bash
   docker --version
   ```

---

## 🐳 Now Start Your WorkflowHub

Once Docker Desktop is running properly:

### **Method 1: Using Docker Desktop GUI**

1. **Open Docker Desktop application**
2. **Click "Images" tab** (to see if images exist)
3. **Open terminal in your project folder**
4. **Run the build command:**
   ```bash
   docker-compose -f docker-compose.dev.yml build
   ```
5. **Start the containers:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```
6. **Check in Docker Desktop:**
   - Go to "Containers" tab
   - You should see your WorkflowHub containers running

### **Method 2: Using Terminal Only**

```bash
# Make sure you're in the project directory
cd "C:\Users\Chintu\Documents\Dev Zone\Dev work web\workflowhub\WorkflowHub-forked"

# Build the images (first time or after changes)
docker-compose -f docker-compose.dev.yml build

# Start the development environment
docker-compose -f docker-compose.dev.yml up -d

# Check if containers are running
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

---

## 📋 Complete Startup Checklist

### **Before Running Docker Commands:**

- [ ] Docker Desktop is installed
- [ ] Docker Desktop is running (check system tray)
- [ ] `.env.local` file exists with required variables
- [ ] You're in the correct project directory

### **Environment File Check:**

Make sure your `.env.local` has at minimum:
```env
# Required for app to start
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (use one of these)
MONGODB_URI=your_mongodb_atlas_uri
# OR for development issues:
# MONGODB_USE_MOCK=true
```

### **Startup Commands:**

```bash
# 1. Build containers
docker-compose -f docker-compose.dev.yml build

# 2. Start containers
docker-compose -f docker-compose.dev.yml up -d

# 3. Check status
docker-compose -f docker-compose.dev.yml ps

# 4. View logs
docker-compose -f docker-compose.dev.yml logs -f workflowhub-dev

# 5. Access your app
# Open browser: http://localhost:3000
```

---

## 🔍 Verification Steps

### **1. Check Docker is Working:**
```bash
docker --version
# Should show: Docker version 28.3.2, build 578ccf6

docker info
# Should show Docker system information (not errors)
```

### **2. Check Containers are Running:**
```bash
docker-compose -f docker-compose.dev.yml ps
# Should show containers with "Up" status
```

### **3. Check Application is Accessible:**
```bash
# Open in browser or use curl
curl http://localhost:3000
# Should return HTML content
```

### **4. Check Logs for Errors:**
```bash
docker-compose -f docker-compose.dev.yml logs workflowhub-dev
# Should show Next.js startup messages, not errors
```

---

## 🆘 Still Having Issues?

### **Common Solutions:**

#### **1. Docker Desktop Won't Start:**
- **Restart your computer**
- **Run as Administrator**: Right-click Docker Desktop → "Run as administrator"
- **Check Windows features**: Enable "Windows Subsystem for Linux" and "Virtual Machine Platform"

#### **2. "Port already in use" Error:**
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID 1234 /F
```

#### **3. Build Fails:**
```bash
# Clear all Docker data and start fresh
docker system prune -a --volumes
docker-compose -f docker-compose.dev.yml build --no-cache
```

#### **4. MongoDB Connection Issues:**
Add to your `.env.local`:
```env
MONGODB_USE_MOCK=true
```

#### **5. Permission Errors:**
- **Run PowerShell as Administrator**
- **Check Docker Desktop has proper permissions**

---

## 🎯 Success Indicators

### **You know it's working when:**

1. **Docker Desktop shows green status**
2. **Terminal commands don't show connection errors**
3. **Containers appear in Docker Desktop "Containers" tab**
4. **http://localhost:3000 loads your WorkflowHub app**
5. **Container logs show "Ready in X seconds"**

### **Expected Log Output:**
```
✓ Starting...
✓ Ready in 2.1s
✓ Compiled /middleware in 329ms
○ Compiling / ...
✓ Compiled / in 2.7s
```

---

## 📞 Getting Help

If you're still stuck:

1. **Check Docker Desktop logs**: Settings → Troubleshoot → "Get support"
2. **Restart everything**: Computer → Docker Desktop → Try again
3. **Use mock database**: Add `MONGODB_USE_MOCK=true` to `.env.local`
4. **Try production mode**: Use `docker-compose.yml` instead of `docker-compose.dev.yml`

## 🎉 Next Steps

Once everything is running:

1. **Visit http://localhost:3000**
2. **Sign up/Sign in with Clerk**
3. **Explore the dashboard**
4. **Create your first workflow**
5. **Check the Google integration** (if configured)

**You're all set! Happy workflow building! 🚀**

