import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not defined. MongoDB features will be disabled.');
}

if (!MONGODB_DB) {
  console.warn('MONGODB_DB is not defined. MongoDB features will be disabled.');
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (!MONGODB_URI || !MONGODB_DB) {
    throw new Error('MongoDB is not configured. Please set MONGODB_URI and MONGODB_DB environment variables.');
  }
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let client: MongoClient | null = null;
  let retries = 5;

  while (retries > 0) {
    try {
      if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined');
      client = await MongoClient.connect(MONGODB_URI);
      break;
    } catch (error) {
      console.error('Failed to connect to MongoDB, retrying...', error);
      retries--;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }

  if (!client) {
    throw new Error('Failed to connect to MongoDB after multiple retries');
  }

  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Initialize the connection when the app starts (only if configured)
if (MONGODB_URI && MONGODB_DB) {
  connectToDatabase().catch(console.error);
}