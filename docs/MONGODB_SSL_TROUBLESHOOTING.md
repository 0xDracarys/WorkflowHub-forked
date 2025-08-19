# MongoDB SSL Connection Troubleshooting

## Windows Development SSL Issues

This document explains the MongoDB connection issues and solutions implemented in the WorkflowHub application for Windows development environments.

## Problem Description

When running the application on Windows with Node.js, you may encounter SSL/TLS errors like:

```
MongoServerSelectionError: 00320000:error:0A000438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

This is a known issue with Node.js OpenSSL implementation on Windows when connecting to MongoDB Atlas.

## Solutions Implemented

### 1. Fallback Connection Strategy

The application automatically tries multiple connection configurations:

1. **Primary**: TLS with invalid certificates and hostnames allowed
2. **Secondary**: TLS insecure mode
3. **Fallback**: Basic TLS with invalid certificates allowed

### 2. Mock Connection for Development

If all real connection attempts fail on Windows development, the application automatically falls back to a mock MongoDB connection that:

- ✅ Allows the application to start and run
- ✅ Provides basic CRUD operation mocks
- ✅ Logs all database operations for debugging
- ⚠️ **Does not persist data** (development only)

### 3. Environment Variables

You can control the MongoDB connection behavior with these environment variables:

```env
# Skip real connection attempts and use mock immediately
MONGODB_USE_MOCK=true

# Force development mode behaviors
NODE_ENV=development
```

## Usage Instructions

### For Development on Windows

1. **First Time Setup**: Run the application normally - it will attempt real connections first
2. **If Connections Fail**: The app will automatically use the mock connection
3. **To Always Use Mock**: Add `MONGODB_USE_MOCK=true` to your `.env.local` file

### Testing Connection

Use the test script to verify your MongoDB connection:

```bash
node scripts/test-mongodb-connection.js
```

This will attempt all connection strategies and show which one works.

### For Production/Linux

The application uses secure SSL connections without the Windows-specific workarounds.

## Security Notes

⚠️ **Development Only**: The SSL bypass and mock connections are only active in development mode on Windows.

✅ **Production Safe**: Production deployments use secure SSL connections with proper certificate validation.

## Troubleshooting Steps

1. **Check Connection String**: Ensure `MONGODB_URI` is properly set in `.env.local`
2. **Test Network**: Verify your network allows connections to MongoDB Atlas
3. **Update Node.js**: Try updating to the latest LTS version of Node.js
4. **Use Mock Mode**: Add `MONGODB_USE_MOCK=true` for immediate development
5. **Check Logs**: Look for connection attempt logs in the console

## Alternative Solutions

If you need a real database connection on Windows:

1. **Local MongoDB**: Install MongoDB locally
2. **Docker**: Use MongoDB in Docker container
3. **WSL**: Use Windows Subsystem for Linux
4. **Different Cloud Provider**: Try a different MongoDB hosting service

## Files Affected

- `lib/mongodb.ts` - Main MongoDB connection logic
- `scripts/test-mongodb-connection.js` - Connection testing utility
- `.env.local` - Environment configuration

## Support

If you continue to experience issues, please check:

1. Windows version and Node.js version compatibility
2. Corporate firewall/proxy settings
3. MongoDB Atlas network access settings
4. OpenSSL version used by Node.js
