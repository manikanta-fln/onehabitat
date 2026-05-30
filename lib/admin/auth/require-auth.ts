import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasPermission } from "@/lib/admin/auth/permissions";
import { getSessionFromRequest } from "@/lib/admin/auth/session";
import { ensureAdminDatabase } from "@/lib/admin/db/init";
import type { AdminPermission, AdminSession } from "@/types/admin/auth";

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requireAdmin(
  request: NextRequest | Request,
  permission?: AdminPermission
): Promise<AdminSession> {
  await ensureAdminDatabase();

  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  if (permission && !hasPermission(session.role, permission)) {
    throw new AdminAuthError("Forbidden", 403);
  }

  return session;
}

function isMongoConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("econnrefused") ||
    message.includes("mongoserverselectionerror") ||
    message.includes("failed to connect") ||
    message.includes("connection timed out") ||
    message.includes("getaddrinfo enotfound")
  );
}

export function handleAdminRouteError(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (isMongoConnectionError(error)) {
    console.error("[admin-api] MongoDB connection failed:", error);
    return NextResponse.json(
      {
        error:
          "Unable to connect to the database. Check that MongoDB is running and MONGODB_URI in .env.local is correct.",
      },
      { status: 503 }
    );
  }

  console.error("[admin-api]", error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Internal server error" },
    { status: 500 }
  );
}

export function getRequestMeta(request: NextRequest | Request) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown",
    userAgent: request.headers.get("user-agent") ?? "unknown",
  };
}
