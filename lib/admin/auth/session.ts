import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { AdminRole, AdminSession } from "@/types/admin/auth";

export const ADMIN_SESSION_COOKIE = "onehabitat_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_JWT_SECRET must be set in .env.local (minimum 32 characters)"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
}): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;

  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.adminId)
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const adminId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const role = payload.role;
    const exp = payload.exp;

    if (
      typeof adminId !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      typeof role !== "string" ||
      typeof exp !== "number"
    ) {
      return null;
    }

    if (!["super_admin", "admin", "operations", "viewer"].includes(role)) {
      return null;
    }

    return {
      adminId,
      email,
      name,
      role: role as AdminRole,
      exp,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionFromRequest(
  request: NextRequest | Request
): Promise<AdminSession | null> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));

  if (!match) return null;

  const token = decodeURIComponent(match.slice(ADMIN_SESSION_COOKIE.length + 1));
  return verifySessionToken(token);
}

export function getSessionCookieOptions(maxAge = SESSION_DURATION_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
