import { MongoClient, type Db } from "mongodb";

function readTimeoutMs(
  envKey: string,
  fallback: number,
  minimum = 5_000
): number {
  const raw = process.env[envKey]?.trim();
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < minimum) {
    return fallback;
  }

  return parsed;
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: readTimeoutMs(
    "MONGODB_SERVER_SELECTION_TIMEOUT_MS",
    30_000
  ),
  connectTimeoutMS: readTimeoutMs("MONGODB_CONNECT_TIMEOUT_MS", 30_000),
  socketTimeoutMS: readTimeoutMs("MONGODB_SOCKET_TIMEOUT_MS", 45_000),
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

export function isMongoConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  return (
    name.includes("mongoserverselectionerror") ||
    message.includes("server selection timed out") ||
    message.includes("econnrefused") ||
    message.includes("failed to connect") ||
    message.includes("connection timed out") ||
    message.includes("getaddrinfo enotfound") ||
    message.includes("mongodb_uri is not defined")
  );
}

export function getMongoConnectionErrorMessage(): string {
  return "Unable to connect to the database. Check that MongoDB is running, MONGODB_URI is configured on the server, and your deployment host is allowed to reach MongoDB.";
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
