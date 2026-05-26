import type { Db, ObjectId } from "mongodb";
import type { BookingFormData } from "@/types/upload-issue";
import type { CustomerDocument } from "@/types/database";

export function normalizeCustomerEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Creates or updates a customer by email when they book a service.
 */
export async function upsertCustomerFromBooking(
  db: Db,
  booking: BookingFormData
): Promise<ObjectId> {
  const now = new Date();
  const email = normalizeCustomerEmail(booking.email);

  const result = await db
    .collection<CustomerDocument>("customers")
    .findOneAndUpdate(
      { email },
      {
        $set: {
          fullName: booking.fullName.trim(),
          phone: booking.phone.trim(),
          email,
          address: booking.address.trim(),
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
        $inc: { bookingCount: 1 },
      },
      { upsert: true, returnDocument: "after" }
    );

  if (!result) {
    throw new Error("Failed to save customer");
  }

  return result._id;
}
