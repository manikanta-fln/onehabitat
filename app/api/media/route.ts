import { NextResponse } from "next/server";
import { getPublicGalleryMedia } from "@/lib/admin/services/gallery-media-service";
import {
  getMongoConnectionErrorMessage,
  isMongoConnectionError,
} from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getPublicGalleryMedia();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
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
