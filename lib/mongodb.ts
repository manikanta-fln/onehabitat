import { MongoClient, type Db } from "mongodb";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10_000,
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Set it in .env.local for local dev and in your hosting provider environment variables for deployment."
    );
  }
  return uri;
}

function getDatabaseName(): string | undefined {
  const explicit = process.env.MONGODB_DB_NAME?.trim();
  if (explicit) return explicit;

  const uri = getUri();
  try {
    const parsed = new URL(uri.replace(/^mongodb(\+srv)?:\/\//, "https://"));
    const name = parsed.pathname.replace(/^\//, "").split("/")[0];
    return name || undefined;
  } catch {
    return undefined;
  }
}

function connectClient(uri: string): Promise<MongoClient> {
  const client = new MongoClient(uri, options);
  return client.connect().catch((error) => {
    global._mongoClientPromise = undefined;
    throw error;
  });
}

function getClientPromise(): Promise<MongoClient> {
  const uri = getUri();

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectClient(uri);
  }

  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  const dbName = getDatabaseName();
  return dbName ? client.db(dbName) : client.db();
}

export async function verifyMongoConnection(): Promise<void> {
  const db = await getDb();
  await db.command({ ping: 1 });
}
