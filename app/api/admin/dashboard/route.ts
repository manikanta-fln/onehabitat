import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { getDashboardData } from "@/lib/admin/services/dashboard-service";
import { parseDateRange } from "@/lib/admin/utils/pagination";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "dashboard:read");
    const { searchParams } = new URL(request.url);
    const { from, to } = parseDateRange(searchParams);
    const data = await getDashboardData(from, to);
    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
