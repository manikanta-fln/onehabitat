import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  getRequestMeta,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/auth/session";
import { getCurrentAdmin, loginAdmin } from "@/lib/admin/services/auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const meta = getRequestMeta(request);
    const result = await loginAdmin({
      email,
      password,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    const response = NextResponse.json({ user: result.user });
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      result.token,
      result.cookieOptions
    );
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid email or password") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return handleAdminRouteError(error);
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAdmin(request, "dashboard:read");
    const user = await getCurrentAdmin(session.adminId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ user, session: { role: session.role } });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
