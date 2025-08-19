// MongoDB initialization script for Docker
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('workflowhub');

// Create collections with indexes for better performance
db.createCollection('users');
db.createCollection('workflows');
db.createCollection('clients');
db.createCollection('workflow_executions');
db.createCollection('google_integrations');

// Create indexes for better query performance
db.users.createIndex({ "clerkId": 1 }, { unique: true });
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "isProvider": 1 });

db.workflows.createIndex({ "userId": 1 });
db.workflows.createIndex({ "isPublic": 1 });
db.workflows.createIndex({ "category": 1 });
db.workflows.createIndex({ "tags": 1 });
db.workflows.createIndex({ "createdAt": -1 });

db.clients.createIndex({ "providerId": 1 });
db.clients.createIndex({ "workflowId": 1 });
db.clients.createIndex({ "status": 1 });
db.clients.createIndex({ "email": 1 });

db.workflow_executions.createIndex({ "workflowId": 1 });
db.workflow_executions.createIndex({ "clientId": 1 });
db.workflow_executions.createIndex({ "status": 1 });

db.google_integrations.createIndex({ "userId": 1 }, { unique: true });

print('Database initialized with collections and indexes');

// Insert sample data for development (optional)
if (db.users.countDocuments() === 0) {
    print('Inserting sample data...');
    
    // Sample user
    db.users.insertOne({
        clerkId: "sample_clerk_id",
        email: "demo@workflowhub.com",
        firstName: "Demo",
        lastName: "User",
        isProvider: true,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    
    print('Sample data inserted');
}

print('MongoDB initialization complete');

