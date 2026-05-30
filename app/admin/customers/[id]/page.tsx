"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch } from "@/services/admin/api-client";

type CustomerDetailResponse = {
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    bookingCount: number;
    adminNotes: string;
    createdAt: string;
    updatedAt: string;
  };
  bookings: {
    id: string;
    issue: string;
    preferredDate: string;
    status: string;
    createdAt: string;
  }[];
  issues: {
    id: string;
    detectedIssue: string;
    category: string;
    severity: string;
    status: string;
  }[];
  auditLogs: { id: string; action: string; adminEmail: string; createdAt: string }[];
};

export default function AdminCustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "customer", params.id],
    queryFn: () => adminFetch<CustomerDetailResponse>(`/api/admin/customers/${params.id}`),
    enabled: !!params.id,
  });

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      adminFetch(`/api/admin/customers/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "customer", params.id] });
    },
  });

  if (query.isLoading) {
    return (
      <AdminShell title="Customer Detail">
        <LoadingState />
      </AdminShell>
    );
  }

  if (query.isError || !query.data) {
    return (
      <AdminShell title="Customer Detail">
        <ErrorState onRetry={() => void query.refetch()} />
      </AdminShell>
    );
  }

  const { customer, bookings, issues, auditLogs } = query.data;

  return (
    <AdminShell
      title={customer.fullName}
      subtitle={customer.email}
      actions={
        <Link href="/admin/customers" className="admin-btn-secondary">
          Back to customers
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Info label="Phone" value={customer.phone} />
              <Info label="Bookings" value={String(customer.bookingCount)} />
              <Info label="Address" value={customer.address} />
              <Info label="Member since" value={new Date(customer.createdAt).toLocaleDateString()} />
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-headline text-headline-sm">Booking history</h2>
            <div className="mt-4 space-y-3">
              {bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block rounded-xl border p-4 transition hover:bg-surface-container-low/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-label text-label-lg">{booking.issue}</p>
                    <StatusBadge label={booking.status} tone={booking.status} />
                  </div>
                  <p className="mt-1 font-body text-body-sm text-on-surface-variant">
                    Preferred {booking.preferredDate}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="font-headline text-headline-sm">Related issues</h2>
            <div className="mt-4 space-y-3">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/admin/issues/${issue.id}`}
                  className="block rounded-xl border p-4 transition hover:bg-surface-container-low/60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-label text-label-lg">{issue.detectedIssue}</p>
                    <StatusBadge label={issue.severity} tone={issue.severity} />
                  </div>
                  <p className="mt-1 font-body text-body-sm text-on-surface-variant">
                    {issue.category}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-headline text-headline-sm">Edit customer</h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              mutation.mutate({
                fullName: form.get("fullName"),
                phone: form.get("phone"),
                email: form.get("email"),
                address: form.get("address"),
                adminNotes: form.get("adminNotes"),
              });
            }}
          >
            <Field name="fullName" label="Full name" defaultValue={customer.fullName} />
            <Field name="phone" label="Phone" defaultValue={customer.phone} />
            <Field name="email" label="Email" defaultValue={customer.email} />
            <Field name="address" label="Address" defaultValue={customer.address} />
            <label className="admin-field">
              <span className="admin-label">Admin notes</span>
              <textarea
                name="adminNotes"
                defaultValue={customer.adminNotes}
                rows={4}
                className="admin-textarea min-h-[6rem] resize-y"
              />
            </label>
            <button
              type="submit"
              className="admin-btn-primary w-full"
            >
              Save customer
            </button>
          </form>

          <div className="mt-8 space-y-3">
            <h3 className="font-headline text-headline-sm">Timeline</h3>
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

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <input name={name} defaultValue={defaultValue} className="admin-input" />
    </label>
  );
}
