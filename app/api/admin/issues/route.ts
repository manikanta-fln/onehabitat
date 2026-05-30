import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { getIssuesList } from "@/lib/admin/services/issues-service";
import { parsePagination } from "@/lib/admin/utils/pagination";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "issues:read");
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);

    const data = await getIssuesList(params, {
      q: searchParams.get("q") ?? undefined,
      severity: searchParams.get("severity") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      archived: searchParams.get("archived") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
