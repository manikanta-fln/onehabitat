import { NextResponse } from "next/server";
import {
  getRequestMeta,
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import {
  getIssueDetail,
  patchIssue,
} from "@/lib/admin/services/issues-service";
import { isValidRecommendation } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request, "issues:read");
    const { id } = await context.params;
    const data = await getIssueDetail(id);
    if (!data) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin(request, "issues:write");
    const { id } = await context.params;
    const body = await request.json();
    const meta = getRequestMeta(request);

    if (
      body.status &&
      body.status !== "analyzed" &&
      body.status !== "booked"
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (body.recommendation && !isValidRecommendation(body.recommendation)) {
      return NextResponse.json(
        { error: "Invalid recommendation payload" },
        { status: 400 }
      );
    }

    const updated = await patchIssue(
      id,
      {
        status: body.status,
        recommendation: body.recommendation,
        archived: body.archived,
        adminNotes: body.adminNotes,
      },
      session,
      meta
    );

    if (!updated) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json({ issue: updated });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
