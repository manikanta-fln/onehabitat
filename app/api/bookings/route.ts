import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { upsertCustomerFromBooking } from "@/lib/customers";
import { sendBookingNotificationEmail } from "@/lib/email/send-booking-notification";
import { getDb } from "@/lib/mongodb";
import { isValidBooking, isValidRecommendation } from "@/lib/validation";
import type { BookingDocument, IssueDocument } from "@/types/database";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { issueId, booking, recommendation } = body as {
      issueId?: string;
      booking?: unknown;
      recommendation?: unknown;
    };

    if (!issueId || !ObjectId.isValid(issueId)) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
    }

    if (!isValidBooking(booking)) {
      return NextResponse.json(
        { error: "Invalid booking details" },
        { status: 400 }
      );
    }

    if (!isValidRecommendation(recommendation)) {
      return NextResponse.json(
        { error: "Invalid recommendation data" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const objectIssueId = new ObjectId(issueId);

    const issue = await db
      .collection<IssueDocument>("issues")
      .findOne({ _id: objectIssueId });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const now = new Date();
    const customerId = await upsertCustomerFromBooking(db, booking);

    const bookingDoc: BookingDocument = {
      issueId: objectIssueId,
      customerId,
      booking,
      recommendation,
      createdAt: now,
    };

    const bookingResult = await db
      .collection<BookingDocument>("bookings")
      .insertOne({
        ...bookingDoc,
        status: "pending",
        assignedTo: null,
        internalNotes: "",
        updatedAt: now,
      } as BookingDocument & {
        status: string;
        assignedTo: null;
        internalNotes: string;
        updatedAt: Date;
      });

    await db.collection<IssueDocument>("issues").updateOne(
      { _id: objectIssueId },
      {
        $set: {
          status: "booked",
          updatedAt: now,
        },
      }
    );

    const bookingId = bookingResult.insertedId.toString();

    try {
      await sendBookingNotificationEmail(db, {
        bookingId,
        issueId,
        customerId: customerId.toString(),
        booking,
        recommendation,
        issue,
        submittedAt: now,
      });
    } catch (emailError) {
      console.error(
        `[POST /api/bookings] Booking ${bookingId} saved, but notification email failed:`,
        emailError
      );
    }

    return NextResponse.json({
      bookingId,
      customerId: customerId.toString(),
      issueId,
    });
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save booking",
      },
      { status: 500 }
    );
  }
}
