import { Binary, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getIssueImage } from "@/lib/issue-images";
import { getDb } from "@/lib/mongodb";
import type { IssueDocument, StoredIssueImageLegacy } from "@/types/database";

export const runtime = "nodejs";

function toResponseBody(data: Buffer | Binary): Blob {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data.buffer);
  return new Blob([new Uint8Array(buffer)]);
}

type RouteContext = {
  params: Promise<{ issueId: string }>;
};

function isLegacyImage(
  image: IssueDocument["image"]
): image is StoredIssueImageLegacy {
  return (
    !!image &&
    "data" in image &&
    typeof (image as StoredIssueImageLegacy).data === "string" &&
    (image as StoredIssueImageLegacy).data.length > 0
  );
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { issueId } = await context.params;

    if (!ObjectId.isValid(issueId)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    const db = await getDb();
    const objectIssueId = new ObjectId(issueId);

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

    const issue = await db
      .collection<IssueDocument>("issues")
      .findOne({ _id: objectIssueId });

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
    console.error("[GET /api/issues/[issueId]/image]", error);
    return NextResponse.json(
      { error: "Failed to load image" },
      { status: 500 }
    );
  }
}
