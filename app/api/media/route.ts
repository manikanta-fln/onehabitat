import { NextResponse } from "next/server";
import { getPublicGalleryMedia } from "@/lib/admin/services/gallery-media-service";
import {
  getMongoConnectionErrorMessage,
  isMongoConnectionError,
} from "@/lib/mongodb";
import { GALLERY_CATEGORIES, isGalleryCategory } from "@/types/gallery-media";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const category =
      categoryParam && isGalleryCategory(categoryParam) ? categoryParam : undefined;

    const data = await getPublicGalleryMedia(category);
    return NextResponse.json(
      { ...data, categories: GALLERY_CATEGORIES },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json(
        { error: getMongoConnectionErrorMessage() },
        { status: 503 }
      );
    }

    console.error("[media-list]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
