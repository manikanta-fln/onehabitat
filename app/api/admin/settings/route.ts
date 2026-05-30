import { NextResponse } from "next/server";
import {
  getRequestMeta,
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import {
  getSettingsBundle,
  updateSetting,
} from "@/lib/admin/services/settings-service";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "settings:read");
    const data = await getSettingsBundle();
    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin(request, "settings:write");
    const body = await request.json();
    const meta = getRequestMeta(request);

    if (!body.key || typeof body.key !== "string" || !body.value) {
      return NextResponse.json(
        { error: "Setting key and value are required" },
        { status: 400 }
      );
    }

    const updated = await updateSetting(
      body.key,
      body.value as Record<string, unknown>,
      session,
      meta
    );

    return NextResponse.json({ setting: updated });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
