import { NextResponse } from "next/server";
import {
  AdminAuthError,
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import {
  getAdminGalleryMedia,
  getGalleryUploadLimits,
  uploadGalleryMedia,
} from "@/lib/admin/services/gallery-media-service";
import { parsePagination } from "@/lib/admin/utils/pagination";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAdmin(request, "media:read");
    const { searchParams } = new URL(request.url);
    const params = parsePagination(searchParams);
    const mediaType = searchParams.get("mediaType");
    const aspectRatio = searchParams.get("aspectRatio");

    const [data, limits] = await Promise.all([
      getAdminGalleryMedia(params, {
        mediaType:
          mediaType === "image" || mediaType === "video" ? mediaType : undefined,
        aspectRatio:
          aspectRatio === "portrait" ||
          aspectRatio === "landscape" ||
          aspectRatio === "square"
            ? aspectRatio
            : undefined,
      }),
      getGalleryUploadLimits(),
    ]);

    return NextResponse.json({ ...data, limits });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin(request, "media:write");
    const formData = await request.formData();
    const media = await uploadGalleryMedia(formData, session.adminId);
    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      const status = (error as Error & { status: number }).status;
      if (status === 400 || status === 404) {
        return NextResponse.json({ error: error.message }, { status });
      }
    }
    if (error instanceof AdminAuthError) {
      return handleAdminRouteError(error);
    }
    return handleAdminRouteError(error);
  }
}
