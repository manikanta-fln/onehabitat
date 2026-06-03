import nodemailer from "nodemailer";
import { ObjectId, type Binary, type Db } from "mongodb";
import {
  buildBookingNotificationHtml,
  buildBookingNotificationSubject,
  buildBookingNotificationText,
  type BookingNotificationContent,
} from "@/lib/email/booking-notification-template";
import { getAppBaseUrl, getSmtpConfig } from "@/lib/email/config";
import { getIssueImage } from "@/lib/issue-images";
import type { BookingFormData, AIRecommendation } from "@/types/upload-issue";
import type { IssueDocument } from "@/types/database";

const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

type StoredBooking = {
  _id: ObjectId;
  notificationEmailSentAt?: Date;
};

function bufferFromImageData(data: Buffer | Binary): Buffer {
  return Buffer.isBuffer(data) ? data : Buffer.from(data.buffer);
}

function resolveRecommendation(
  issue: IssueDocument,
  submittedRecommendation: AIRecommendation
): AIRecommendation | null {
  const recommendation =
    issue.analysisResult?.recommendation ??
    issue.recommendation ??
    submittedRecommendation;

  if (!recommendation?.detectedIssue || !recommendation.summary) {
    return null;
  }

  return recommendation;
}

async function buildNotificationContent(
  db: Db,
  params: {
    bookingId: string;
    issueId: string;
    customerId: string;
    booking: BookingFormData;
    recommendation: AIRecommendation;
    issue: IssueDocument;
    submittedAt: Date;
  }
): Promise<BookingNotificationContent> {
  const imageDoc = await getIssueImage(db, new ObjectId(params.issueId));
  const imageUrl = `${getAppBaseUrl()}/api/issues/${params.issueId}/image`;

  let image: BookingNotificationContent["image"];
  if (imageDoc) {
    image = {
      fileName: imageDoc.fileName,
      mimeType: imageDoc.mimeType,
      sizeBytes: imageDoc.sizeBytes,
      url: imageUrl,
    };
  } else if (
    params.issue.image &&
    "fileName" in params.issue.image &&
    "sizeBytes" in params.issue.image
  ) {
    image = {
      fileName: params.issue.image.fileName,
      mimeType: params.issue.image.mimeType,
      sizeBytes: params.issue.image.sizeBytes,
      url: imageUrl,
    };
  }

  return {
    bookingId: params.bookingId,
    issueId: params.issueId,
    customerId: params.customerId,
    booking: params.booking,
    recommendation: resolveRecommendation(params.issue, params.recommendation),
    image,
    submittedAt: params.submittedAt,
  };
}

async function acquireNotificationLock(
  db: Db,
  bookingId: ObjectId
): Promise<boolean> {
  const result = await db.collection<StoredBooking>("bookings").findOneAndUpdate(
    {
      _id: bookingId,
      notificationEmailSentAt: { $exists: false },
    },
    {
      $set: {
        notificationEmailSentAt: new Date(),
      },
    },
    {
      returnDocument: "before",
    }
  );

  return result !== null;
}

async function releaseNotificationLock(db: Db, bookingId: ObjectId): Promise<void> {
  await db.collection<StoredBooking>("bookings").updateOne(
    { _id: bookingId },
    {
      $unset: {
        notificationEmailSentAt: "",
      },
    }
  );
}

export async function sendBookingNotificationEmail(
  db: Db,
  params: {
    bookingId: string;
    issueId: string;
    customerId: string;
    booking: BookingFormData;
    recommendation: AIRecommendation;
    issue: IssueDocument;
    submittedAt: Date;
  }
): Promise<void> {
  const smtp = getSmtpConfig();
  if (!smtp) {
    console.warn(
      "[booking-notification] SMTP or BOOKING_NOTIFICATION_EMAIL is not configured; skipping email"
    );
    return;
  }

  const bookingObjectId = new ObjectId(params.bookingId);
  const locked = await acquireNotificationLock(db, bookingObjectId);
  if (!locked) {
    console.info(
      `[booking-notification] Notification already sent for booking ${params.bookingId}; skipping duplicate`
    );
    return;
  }

  try {
    const content = await buildNotificationContent(db, params);
    const imageDoc = await getIssueImage(db, new ObjectId(params.issueId));

    const attachments =
      imageDoc &&
      imageDoc.sizeBytes > 0 &&
      imageDoc.sizeBytes <= MAX_ATTACHMENT_BYTES
        ? [
            {
              filename: imageDoc.fileName || `issue-${params.issueId}.jpg`,
              content: bufferFromImageData(imageDoc.data),
              contentType: imageDoc.mimeType,
            },
          ]
        : undefined;

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: smtp.from,
      to: smtp.to,
      subject: buildBookingNotificationSubject(content),
      text: buildBookingNotificationText(content),
      html: buildBookingNotificationHtml(content),
      attachments,
    });

    console.info(
      `[booking-notification] Sent booking notification for booking ${params.bookingId} to ${smtp.to}`
    );
  } catch (error) {
    await releaseNotificationLock(db, bookingObjectId);
    throw error;
  }
}
