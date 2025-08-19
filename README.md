# 🚀 WorkflowHub - Workflow Automation Platform

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Ready-green?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

**WorkflowHub** is a comprehensive workflow automation platform designed for influencers, content creators, and businesses. Build, share, and automate your workflows with powerful integrations and an intuitive visual builder.

## ✨ Features

### 🎯 **Core Features**
- **Visual Workflow Builder** - Drag-and-drop interface for creating complex workflows
- **Google Workspace Integration** - Connect Drive, Gmail, Calendar, and Sheets
- **Client Pipeline Management** - Track clients from intake to completion
- **AI-Powered Workflow Generation** - Create workflows using Gemini AI
- **Workflow Marketplace** - Share and discover workflows from the community
- **Real-time Collaboration** - Work together on workflow projects

### 🔧 **Technical Features**
- **Modern Tech Stack** - Next.js 15, TypeScript, MongoDB, Clerk Auth
- **Docker Ready** - Complete containerization for easy deployment
- **Responsive Design** - Works perfectly on desktop and mobile
- **SSL Support** - Production-ready with HTTPS configuration
- **Mock Database** - Development fallback for Windows users

## 🚀 Quick Start

### **Option 1: Docker (Recommended)**

```bash
# Clone the repository
git clone https://github.com/yourusername/workflow-v1.git
cd workflow-v1

# Setup environment
cp env.example .env.local
# Edit .env.local with your credentials

# Start with Docker Desktop
docker-compose -f docker-compose.dev.yml up -d

# Access your app
open http://localhost:3000
```

### **Option 2: Local Development**

```bash
# Clone and install
git clone https://github.com/yourusername/workflow-v1.git
cd workflow-v1
npm install

# Setup environment
cp env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

## 📖 Documentation

- **[🐳 Docker Setup Guide](./DOCKER_SETUP_GUIDE.md)** - Complete Docker Desktop & CLI guide
- **[📚 Docker Documentation](./README-DOCKER.md)** - Advanced Docker configuration
- **[🔧 Google Setup Guide](./docs/GOOGLE_SETUP.md)** - Google Cloud integration
- **[👤 User Guide](./docs/USER_GUIDE.md)** - Complete user documentation
- **[🔧 MongoDB Troubleshooting](./docs/MONGODB_SSL_TROUBLESHOOTING.md)** - Database connection help

## 🛠️ Environment Setup

### **Required Variables:**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workflowhub

# Authentication (Get from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Optional Variables:**
```env
# Google Integration
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback

# AI Features
GEMINI_API_KEY=your_gemini_api_key
```

## 🏗️ Architecture

```
WorkflowHub/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Main dashboard
│   ├── workflow/          # Workflow builder & viewer
│   └── auth/              # Authentication pages
├── components/            # Reusable UI components
├── lib/                   # Utilities & API clients
│   ├── mongodb.ts         # Database connection
│   ├── google-services.ts # Google integrations
│   └── workflow-api.ts    # Workflow management
├── scripts/               # Utility scripts
└── docs/                  # Documentation
```

## 🐳 Docker Deployment

### **Development:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### **Production:**
```bash
docker-compose up -d
```

### **With Local MongoDB:**
```bash
# Includes MongoDB container
docker-compose -f docker-compose.dev.yml --profile tools up -d
```

## 🌐 Deployment Platforms

This project is ready to deploy on:

- **Docker Desktop** ✅ (See [Docker Setup Guide](./DOCKER_SETUP_GUIDE.md))
- **Railway** ✅
- **Render** ✅
- **DigitalOcean App Platform** ✅
- **AWS ECS/Fargate** ✅
- **Google Cloud Run** ✅
- **Azure Container Instances** ✅
- **Any VPS with Docker** ✅

## 🔧 Development

### **Project Structure:**
- **Frontend**: Next.js 15 with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk (supports Google, GitHub, email)
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks and context

### **Available Scripts:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **Clerk** - Authentication and user management
- **MongoDB** - Database platform
- **Google Cloud** - API integrations
- **Docker** - Containerization platform
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/workflow-v1/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/workflow-v1/discussions)

## 🚀 Getting Started Checklist

- [ ] Clone the repository
- [ ] Copy `env.example` to `.env.local`
- [ ] Set up Clerk authentication
- [ ] Configure MongoDB connection
- [ ] Start with Docker or npm
- [ ] Access http://localhost:3000
- [ ] Create your first workflow!

**Happy workflow building! 🎉**