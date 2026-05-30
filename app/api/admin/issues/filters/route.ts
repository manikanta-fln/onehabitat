import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { getIssueFilterOptions } from "@/lib/admin/services/issues-service";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "issues:read");
    const filters = await getIssueFilterOptions();
    return NextResponse.json(filters);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
