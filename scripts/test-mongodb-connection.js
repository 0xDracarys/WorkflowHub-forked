#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * This script tests the MongoDB connection with SSL configuration
 */

const { MongoClient } = require('mongodb');
const tls = require('tls');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

const isWindows = process.platform === 'win32';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Aggressive SSL bypass for Windows development
if (isDevelopment && isWindows) {
  // Set global Node.js TLS options
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  
  // Override TLS defaults
  const originalCreateSecureContext = tls.createSecureContext
  tls.createSecureContext = (options = {}) => {
    return originalCreateSecureContext({
      ...options,
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined,
    })
  }
  
  // Set minimum TLS version
  tls.DEFAULT_MIN_VERSION = 'TLSv1'
  tls.DEFAULT_MAX_VERSION = 'TLSv1.3'
  console.log('🔧 Applied Windows TLS compatibility settings');
}

// Create different option sets for fallback strategy
const getConnectionOptions = () => {
  const baseOptions = {
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    appName: 'WorkflowHub-Test'
  }

  if (isDevelopment && isWindows) {
    // Windows development - try multiple configurations
    return [
      // Option 1: TLS with all validations disabled
      {
        ...baseOptions,
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true
      },
      // Option 2: TLS insecure mode
      {
        ...baseOptions,
        tls: true,
        tlsInsecure: true
      },
      // Option 3: Minimal TLS
      {
        ...baseOptions,
        tls: true,
        tlsAllowInvalidCertificates: true
      }
    ]
  } else {
    // Production or non-Windows - secure configuration
    return [{
      ...baseOptions,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    }]
  }
};

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  console.log('📡 Connecting to:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  const optionSets = getConnectionOptions()
  
  for (let i = 0; i < optionSets.length; i++) {
    const options = optionSets[i]
    let client;
    
    console.log(`Attempting MongoDB connection (attempt ${i + 1}/${optionSets.length})...`)
    
    try {
      // Create client
      client = new MongoClient(uri, options);
      
      // Connect to MongoDB
      await client.connect();
      
      // Verify connection by pinging the database
      const adminDb = client.db('admin');
      const pingResult = await adminDb.command({ ping: 1 });
      console.log(`✅ Successfully connected to MongoDB Atlas using configuration ${i + 1}`);
      console.log('🏓 Ping successful:', pingResult.ok === 1 ? 'OK' : 'FAILED');
      
      // List databases
      const databasesList = await client.db().admin().listDatabases();
      console.log('📊 Available databases:');
      databasesList.databases.forEach(db => {
        console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
      });
      
      // Test a simple operation on the main database
      const db = client.db('workflowhub');
      const collections = await db.listCollections().toArray();
      console.log(`📁 Collections in 'workflowhub' database: ${collections.length}`);
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
      
      console.log('✅ MongoDB connection test completed successfully!');
      
      // Close the connection
      await client.close();
      console.log('🔌 Connection closed');
      
      return; // Success - exit the function
      
    } catch (error) {
      console.warn(`❌ Connection attempt ${i + 1} failed:`, error.message);
      
      // Close client if it exists
      if (client) {
        try {
          await client.close();
        } catch (closeError) {
          // Ignore close errors
        }
      }
      
      // If this is the last attempt, log final error and exit
      if (i === optionSets.length - 1) {
        console.error('🚨 All MongoDB connection attempts failed');
        console.error('Final error type:', error.constructor.name);
        console.error('Final error message:', error.message);
        
        if (error.code) {
          console.error('Error code:', error.code);
        }
        
        if (error.cause) {
          console.error('Root cause:', error.cause.message);
        }
        
        process.exit(1);
      }
      
      // Continue to next configuration
      continue
    }
  }
}

// Run the test
testConnection();
