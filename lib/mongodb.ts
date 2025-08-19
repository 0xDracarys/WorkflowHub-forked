import { MongoClient, MongoClientOptions } from 'mongodb'
import * as tls from 'tls'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const isWindows = process.platform === 'win32'
const isDevelopment = process.env.NODE_ENV === 'development'

// Aggressive SSL bypass for Windows development
if (isDevelopment && isWindows) {
  // Set global Node.js TLS options
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  
  // Override TLS defaults
  const originalCreateSecureContext = tls.createSecureContext
  tls.createSecureContext = (options: any = {}) => {
    return originalCreateSecureContext({
      ...options,
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined,
    })
  }
  
  // Set minimum TLS version
  tls.DEFAULT_MIN_VERSION = 'TLSv1'
  tls.DEFAULT_MAX_VERSION = 'TLSv1.3'
}

// Create different option sets for fallback strategy
const getConnectionOptions = (): MongoClientOptions[] => {
  const baseOptions = {
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000,
    appName: 'WorkflowHub'
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
}

let client
let clientPromise: Promise<MongoClient>

// Mock MongoDB client for development fallback
class MockMongoClient {
  private connected: boolean = false
  private mockData: Map<string, any[]> = new Map()
  
  async connect(): Promise<void> {
    this.connected = true
    console.log('💫 Using mock MongoDB connection for development')
  }
  
  async close(): Promise<void> {
    this.connected = false
  }
  
  private getCollectionData(collectionName: string): any[] {
    if (!this.mockData.has(collectionName)) {
      this.mockData.set(collectionName, [])
    }
    return this.mockData.get(collectionName)!
  }
  
  db(name?: string) {
    return {
      command: async (cmd: any) => ({ ok: 1 }),
      collection: (collectionName: string) => {
        const data = this.getCollectionData(collectionName)
        
        return {
          findOne: async (filter?: any) => {
            console.log(`💫 Mock findOne on ${collectionName}:`, filter)
            return data.find(doc => this.matchesFilter(doc, filter)) || null
          },
          
          find: (filter?: any) => ({
            sort: (sortOptions?: any) => ({
              limit: (limitNum?: number) => ({
                skip: (skipNum?: number) => ({
                  toArray: async () => {
                    console.log(`💫 Mock find on ${collectionName}:`, { filter, sort: sortOptions, limit: limitNum, skip: skipNum })
                    let result = filter ? data.filter(doc => this.matchesFilter(doc, filter)) : [...data]
                    
                    if (sortOptions) {
                      const sortKey = Object.keys(sortOptions)[0]
                      const sortOrder = sortOptions[sortKey]
                      result.sort((a, b) => {
                        const aVal = a[sortKey] || 0
                        const bVal = b[sortKey] || 0
                        return sortOrder === 1 ? aVal - bVal : bVal - aVal
                      })
                    }
                    
                    if (skipNum) result = result.slice(skipNum)
                    if (limitNum) result = result.slice(0, limitNum)
                    
                    return result
                  }
                }),
                toArray: async () => {
                  console.log(`💫 Mock find on ${collectionName}:`, { filter, sort: sortOptions, limit: limitNum })
                  let result = filter ? data.filter(doc => this.matchesFilter(doc, filter)) : [...data]
                  
                  if (sortOptions) {
                    const sortKey = Object.keys(sortOptions)[0]
                    const sortOrder = sortOptions[sortKey]
                    result.sort((a, b) => {
                      const aVal = a[sortKey] || 0
                      const bVal = b[sortKey] || 0
                      return sortOrder === 1 ? aVal - bVal : bVal - aVal
                    })
                  }
                  
                  if (limitNum) result = result.slice(0, limitNum)
                  
                  return result
                }
              }),
              toArray: async () => {
                console.log(`💫 Mock find on ${collectionName}:`, { filter, sort: sortOptions })
                let result = filter ? data.filter(doc => this.matchesFilter(doc, filter)) : [...data]
                
                if (sortOptions) {
                  const sortKey = Object.keys(sortOptions)[0]
                  const sortOrder = sortOptions[sortKey]
                  result.sort((a, b) => {
                    const aVal = a[sortKey] || 0
                    const bVal = b[sortKey] || 0
                    return sortOrder === 1 ? aVal - bVal : bVal - aVal
                  })
                }
                
                return result
              }
            }),
            limit: (limitNum?: number) => ({
              skip: (skipNum?: number) => ({
                toArray: async () => {
                  console.log(`💫 Mock find on ${collectionName}:`, { filter, limit: limitNum, skip: skipNum })
                  let result = filter ? data.filter(doc => this.matchesFilter(doc, filter)) : [...data]
                  
                  if (skipNum) result = result.slice(skipNum)
                  if (limitNum) result = result.slice(0, limitNum)
                  
                  return result
                }
              }),
              toArray: async () => {
                console.log(`💫 Mock find on ${collectionName}:`, { filter, limit: limitNum })
                let result = filter ? data.filter(doc => this.matchesFilter(doc, filter)) : [...data]
                
                if (limitNum) result = result.slice(0, limitNum)
                
                return result
              }
            }),
            toArray: async () => {
              console.log(`💫 Mock find on ${collectionName}:`, filter)
              return filter ? data.filter(doc => this.matchesFilter(doc, filter)) : [...data]
            }
          }),
          
          insertOne: async (doc: any) => {
            const newDoc = { ...doc, _id: `mock-id-${Date.now()}` }
            data.push(newDoc)
            console.log(`💫 Mock insertOne on ${collectionName}:`, newDoc)
            return { insertedId: newDoc._id }
          },
          
          updateOne: async (filter: any, update: any) => {
            console.log(`💫 Mock updateOne on ${collectionName}:`, { filter, update })
            const docIndex = data.findIndex(doc => this.matchesFilter(doc, filter))
            if (docIndex >= 0) {
              if (update.$set) {
                data[docIndex] = { ...data[docIndex], ...update.$set }
              }
              return { modifiedCount: 1 }
            }
            return { modifiedCount: 0 }
          },
          
          findOneAndUpdate: async (filter: any, update: any, options?: any) => {
            console.log(`💫 Mock findOneAndUpdate on ${collectionName}:`, { filter, update, options })
            const docIndex = data.findIndex(doc => this.matchesFilter(doc, filter))
            if (docIndex >= 0) {
              const oldDoc = { ...data[docIndex] }
              if (update.$set) {
                data[docIndex] = { ...data[docIndex], ...update.$set }
              }
              return options?.returnDocument === 'after' ? data[docIndex] : oldDoc
            }
            return null
          },
          
          deleteOne: async (filter: any) => {
            console.log(`💫 Mock deleteOne on ${collectionName}:`, filter)
            const docIndex = data.findIndex(doc => this.matchesFilter(doc, filter))
            if (docIndex >= 0) {
              data.splice(docIndex, 1)
              return { deletedCount: 1 }
            }
            return { deletedCount: 0 }
          },
          
          aggregate: (pipeline: any[]) => ({
            toArray: async () => {
              console.log(`💫 Mock aggregate on ${collectionName}:`, pipeline)
              // Simple mock aggregation - just return empty results
              return []
            }
          }),
          
          createIndex: async (indexSpec: any) => {
            console.log(`💫 Mock createIndex on ${collectionName}:`, indexSpec)
            return 'mock-index'
          }
        }
      },
      
      listCollections: () => ({ 
        toArray: async () => {
          console.log('💫 Mock listCollections')
          return Array.from(this.mockData.keys()).map(name => ({ name }))
        }
      }),
      
      admin: () => ({
        listDatabases: async () => {
          console.log('💫 Mock listDatabases')
          return {
            databases: [{ name: name || 'workflowhub', sizeOnDisk: 0 }]
          }
        }
      })
    }
  }
  
  private matchesFilter(doc: any, filter?: any): boolean {
    if (!filter) return true
    
    for (const [key, value] of Object.entries(filter)) {
      if (doc[key] !== value) {
        return false
      }
    }
    
    return true
  }
}

// Enhanced connection function with fallback strategy
async function createConnection(): Promise<MongoClient> {
  // If Windows development and all connection attempts have failed before,
  // immediately use mock connection
  if (isDevelopment && isWindows && process.env.MONGODB_USE_MOCK === 'true') {
    console.log('⚠️ Using mock MongoDB connection due to SSL issues')
    return new MockMongoClient() as any
  }
  
  const optionSets = getConnectionOptions()
  
  for (let i = 0; i < optionSets.length; i++) {
    const options = optionSets[i]
    console.log(`Attempting MongoDB connection (attempt ${i + 1}/${optionSets.length})...`)
    
    try {
      const client = new MongoClient(uri, options)
      await client.connect()
      
      // Verify connection by pinging the database
      await client.db('admin').command({ ping: 1 })
      console.log(`✅ Successfully connected to MongoDB Atlas using configuration ${i + 1}`)
      
      return client
    } catch (error) {
      console.warn(`❌ Connection attempt ${i + 1} failed:`, error.message)
      
      // If this is the last attempt and we're on Windows, fall back to mock
      if (i === optionSets.length - 1) {
        if (isDevelopment && isWindows) {
          console.warn('⚠️ All real MongoDB connections failed. Using mock connection for development.')
          console.warn('⚠️ Set MONGODB_USE_MOCK=true to skip real connection attempts in future.')
          return new MockMongoClient() as any
        }
        
        console.error('🚨 All MongoDB connection attempts failed')
        throw error
      }
      
      // Continue to next configuration
      continue
    }
  }
  
  throw new Error('Unable to establish MongoDB connection')
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = createConnection()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = createConnection()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
