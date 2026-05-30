"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePreviewModal } from "@/components/admin/Modals";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch } from "@/services/admin/api-client";
import { BOOKING_STATUSES, type BookingStatus } from "@/types/admin/entities";

type BookingDetailResponse = {
  booking: {
    id: string;
    status: BookingStatus;
    assignedTo: string | null;
    internalNotes: string;
    booking: {
      fullName: string;
      phone: string;
      email: string;
      address: string;
      preferredDate: string;
      notes: string;
    };
    recommendation: { detectedIssue: string; category: string; estimatedCost: string };
  };
  issue: { id: string; imageUrl: string; detectedIssue: string } | null;
  customer: { id: string; fullName: string; email: string; phone: string } | null;
  statusHistory: {
    id: string;
    fromStatus: string | null;
    toStatus: string;
    changedByEmail: string;
    note: string;
    createdAt: string;
  }[];
  auditLogs: { id: string; action: string; adminEmail: string; createdAt: string }[];
};

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [status, setStatus] = useState<BookingStatus>("pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [note, setNote] = useState("");

  const query = useQuery({
    queryKey: ["admin", "booking", params.id],
    queryFn: () => adminFetch<BookingDetailResponse>(`/api/admin/bookings/${params.id}`),
    enabled: !!params.id,
  });

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      adminFetch(`/api/admin/bookings/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "booking", params.id] });
    },
  });

  if (query.isLoading) {
    return (
      <AdminShell title="Booking Detail">
        <LoadingState />
      </AdminShell>
    );
  }

  if (query.isError || !query.data) {
    return (
      <AdminShell title="Booking Detail">
        <ErrorState onRetry={() => void query.refetch()} />
      </AdminShell>
    );
  }

  const { booking, issue, customer, statusHistory, auditLogs } = query.data;

  return (
    <AdminShell
      title={booking.booking.fullName}
      subtitle={`Booking #${booking.id}`}
      actions={
        <Link href="/admin/bookings" className="admin-btn-secondary">
          Back to bookings
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={booking.status} tone={booking.status} />
              <span className="font-body text-body-sm text-on-surface-variant">
                Preferred: {booking.booking.preferredDate}
              </span>
            </div>
            <h2 className="mt-4 font-headline text-headline-sm">
              {booking.recommendation.detectedIssue}
            </h2>
            <p className="mt-2 font-body text-body-sm text-on-surface-variant">
              {booking.recommendation.category} · {booking.recommendation.estimatedCost}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <Info label="Phone" value={booking.booking.phone} />
              <Info label="Email" value={booking.booking.email} />
              <Info label="Address" value={booking.booking.address} />
              <Info label="Customer notes" value={booking.booking.notes || "—"} />
            </div>
          </section>

          {issue ? (
            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="font-headline text-headline-sm">Issue image</h2>
              <button type="button" onClick={() => setPreviewOpen(true)} className="mt-4 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={issue.imageUrl} alt="" className="max-h-72 rounded-2xl object-cover" />
              </button>
            </section>
          ) : null}

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-headline text-headline-sm">Status history</h2>
            <div className="mt-4 space-y-3">
              {statusHistory.map((entry) => (
                <div key={entry.id} className="rounded-xl border p-4">
                  <p className="font-label text-label-lg">
                    {(entry.fromStatus ?? "none").replace(/_/g, " ")} → {entry.toStatus.replace(/_/g, " ")}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    {entry.changedByEmail} · {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  {entry.note ? <p className="mt-2 font-body text-body-sm">{entry.note}</p> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-headline text-headline-sm">Audit trail</h2>
            <div className="mt-4 space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="rounded-xl border p-4">
                  <p className="font-label text-label-lg">{log.action}</p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    {log.adminEmail} · {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 text-left shadow-sm">
          <h2 className="font-headline text-headline-sm">Update booking</h2>
          <div className="mt-4 space-y-4">
            <label className="admin-field">
              <span className="admin-label">Status</span>
              <select
                defaultValue={booking.status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="admin-select"
              >
                {BOOKING_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span className="admin-label">Assign technician</span>
              <input
                defaultValue={booking.assignedTo ?? ""}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="admin-input"
              />
            </label>
            <label className="admin-field">
              <span className="admin-label">Preferred date</span>
              <input
                type="date"
                defaultValue={booking.booking.preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="admin-input"
              />
            </label>
            <label className="admin-field">
              <span className="admin-label">Internal notes</span>
              <textarea
                defaultValue={booking.internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
                className="admin-textarea min-h-[6rem] resize-y"
              />
            </label>
            <label className="admin-field">
              <span className="admin-label">Status change note</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="admin-input"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                mutation.mutate({
                  status: status || booking.status,
                  assignedTo: assignedTo || booking.assignedTo,
                  internalNotes: internalNotes || booking.internalNotes,
                  preferredDate: preferredDate || booking.booking.preferredDate,
                  note,
                })
              }
              className="admin-btn-primary w-full"
            >
              Save booking
            </button>
            {customer ? (
              <Link href={`/admin/customers/${customer.id}`} className="block text-primary">
                View customer profile
              </Link>
            ) : null}
          </div>
        </section>
      </div>

      {issue ? (
        <ImagePreviewModal
          open={previewOpen}
          src={issue.imageUrl}
          alt={issue.detectedIssue}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </AdminShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-container-low p-4">
      <p className="font-label text-label-sm text-on-surface-variant">{label}</p>
      <p className="mt-1 font-body text-body-sm">{value}</p>
    </div>
  );
}
