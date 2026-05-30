import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { getCustomersList } from "@/lib/admin/services/customers-service";
import { parsePagination } from "@/lib/admin/utils/pagination";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "customers:read");
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);

    const data = await getCustomersList(params, {
      q: searchParams.get("q") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
