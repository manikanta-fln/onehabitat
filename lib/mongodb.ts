import { MongoClient, type Db } from "mongodb";

const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to .env.local");
  }
  return uri;
}

function connectClient(uri: string): Promise<MongoClient> {
  const client = new MongoClient(uri, options);
  return client.connect().catch((error) => {
    if (process.env.NODE_ENV === "development") {
      global._mongoClientPromise = undefined;
    }
    throw error;
  });
}

function getClientPromise(): Promise<MongoClient> {
  const uri = getUri();

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connectClient(uri);
    }
    return global._mongoClientPromise;
  }

  return connectClient(uri);
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}
