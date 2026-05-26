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

function getClientPromise(): Promise<MongoClient> {
  const uri = getUri();

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db();
}
