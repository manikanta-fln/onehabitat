import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { getJoinlist } from "@/lib/admin/services/joinlist-service";
import { parsePagination } from "@/lib/admin/utils/pagination";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "joinlist:read");
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);

    const data = await getJoinlist(params, {
      q: searchParams.get("q") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
