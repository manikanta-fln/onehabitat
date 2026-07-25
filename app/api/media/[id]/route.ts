import { Readable } from "node:stream";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getGalleryMediaFile } from "@/lib/admin/services/gallery-media-service";
import {
  getMongoConnectionErrorMessage,
  isMongoConnectionError,
} from "@/lib/mongodb";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid media ID" }, { status: 400 });
    }

    const result = await getGalleryMediaFile(id);
    if (!result) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    const webStream = Readable.toWeb(result.stream) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": result.media.mimeType,
        "Content-Length": String(result.media.sizeBytes),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Disposition": `inline; filename="${encodeURIComponent(result.media.fileName)}"`,
      },
    });
  } catch (error) {
    if (isMongoConnectionError(error)) {
      return NextResponse.json(
        { error: getMongoConnectionErrorMessage() },
        { status: 503 }
      );
    }

    console.error("[media-file]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
