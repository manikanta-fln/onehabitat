import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { removeGalleryMedia } from "@/lib/admin/services/gallery-media-service";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request, "media:write");
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid media ID" }, { status: 400 });
    }

    await removeGalleryMedia(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      const status = (error as Error & { status: number }).status;
      if (status === 404) {
        return NextResponse.json({ error: error.message }, { status });
      }
    }
    return handleAdminRouteError(error);
  }
}
