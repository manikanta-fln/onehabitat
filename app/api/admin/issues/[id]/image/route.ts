import { Binary, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  handleAdminRouteError,
  requireAdmin,
} from "@/lib/admin/auth/require-auth";
import { getIssueForImage } from "@/lib/admin/services/issues-service";
import { getIssueImage } from "@/lib/issue-images";
import { getDb } from "@/lib/mongodb";
import type { IssueDocument, StoredIssueImageLegacy } from "@/types/database";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

function toResponseBody(data: Buffer | Binary): Blob {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data.buffer);
  return new Blob([new Uint8Array(buffer)]);
}

function isLegacyImage(
  image: IssueDocument["image"]
): image is StoredIssueImageLegacy {
  return (
    !!image &&
    "data" in image &&
    typeof (image as StoredIssueImageLegacy).data === "string"
  );
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await requireAdmin(request, "issues:read");
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    const db = await getDb();
    const objectIssueId = new ObjectId(id);

    const image = await getIssueImage(db, objectIssueId);
    if (image?.data) {
      const body = toResponseBody(image.data);
      if (body.size > 0) {
        return new NextResponse(body, {
          headers: {
            "Content-Type": image.mimeType,
            "Content-Length": String(body.size),
            "Cache-Control": "private, max-age=3600",
          },
        });
      }
    }

    const issue = await getIssueForImage(id);
    if (issue?.image && isLegacyImage(issue.image)) {
      const body = toResponseBody(Buffer.from(issue.image.data, "base64"));
      return new NextResponse(body, {
        headers: {
          "Content-Type": issue.image.mimeType,
          "Content-Length": String(body.size),
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } catch (error) {
    return handleAdminRouteError(error);
  }
}
