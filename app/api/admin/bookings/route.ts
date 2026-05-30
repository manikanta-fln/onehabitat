import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { getBookingsList } from "@/lib/admin/services/bookings-service";
import { parsePagination } from "@/lib/admin/utils/pagination";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "bookings:read");
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);

    const data = await getBookingsList(params, {
      q: searchParams.get("q") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      from: searchParams.get("from") ?? undefined,
      to: searchParams.get("to") ?? undefined,
      preferredFrom: searchParams.get("preferredFrom") ?? undefined,
      preferredTo: searchParams.get("preferredTo") ?? undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
