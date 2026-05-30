import { NextResponse } from "next/server";
import {
  getRequestMeta,
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import {
  getBookingDetail,
  patchBooking,
  BOOKING_STATUSES,
} from "@/lib/admin/services/bookings-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request, "bookings:read");
    const { id } = await context.params;
    const data = await getBookingDetail(id);
    if (!data) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin(request, "bookings:write");
    const { id } = await context.params;
    const body = await request.json();
    const meta = getRequestMeta(request);

    if (body.status && !BOOKING_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await patchBooking(
      id,
      {
        status: body.status,
        assignedTo: body.assignedTo,
        internalNotes: body.internalNotes,
        preferredDate: body.preferredDate,
        note: body.note,
      },
      session,
      meta
    );

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
