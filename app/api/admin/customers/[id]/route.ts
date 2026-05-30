import { NextResponse } from "next/server";
import {
  getRequestMeta,
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import {
  getCustomerDetail,
  patchCustomer,
} from "@/lib/admin/services/customers-service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request, "customers:read");
    const { id } = await context.params;
    const data = await getCustomerDetail(id);
    if (!data) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin(request, "customers:write");
    const { id } = await context.params;
    const body = await request.json();
    const meta = getRequestMeta(request);

    const updated = await patchCustomer(
      id,
      {
        fullName: body.fullName,
        phone: body.phone,
        email: body.email,
        address: body.address,
        adminNotes: body.adminNotes,
      },
      session,
      meta
    );

    if (!updated) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ customer: updated });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
