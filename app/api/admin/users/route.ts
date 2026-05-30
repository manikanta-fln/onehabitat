import { NextResponse } from "next/server";
import {
  getRequestMeta,
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import {
  createAdminUser,
  getAdminUsersList,
  patchAdminUser,
} from "@/lib/admin/services/users-service";
import { parsePagination } from "@/lib/admin/utils/pagination";
import { ADMIN_ROLES } from "@/types/admin/auth";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "users:read");
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);
    const data = await getAdminUsersList(params);
    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin(request, "users:write");
    const body = await request.json();
    const meta = getRequestMeta(request);

    if (
      !body.email ||
      !body.password ||
      !body.name ||
      !ADMIN_ROLES.includes(body.role)
    ) {
      return NextResponse.json(
        { error: "Name, email, password, and valid role are required" },
        { status: 400 }
      );
    }

    const user = await createAdminUser(
      {
        email: body.email,
        password: body.password,
        name: body.name,
        role: body.role,
      },
      session,
      meta
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return handleAdminRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin(request, "users:write");
    const body = await request.json();
    const meta = getRequestMeta(request);

    if (!body.id) {
      return NextResponse.json({ error: "Admin id is required" }, { status: 400 });
    }

    const user = await patchAdminUser(
      body.id,
      {
        name: body.name,
        role: body.role,
        isActive: body.isActive,
        password: body.password,
      },
      session,
      meta
    );

    if (!user) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return handleAdminRouteError(error);
  }
}
