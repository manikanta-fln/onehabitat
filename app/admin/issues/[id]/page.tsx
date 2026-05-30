"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePreviewModal } from "@/components/admin/Modals";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { IssueRecommendationSummary } from "@/components/shared/IssueDiagnosticDetails";
import { adminFetch } from "@/services/admin/api-client";
import type { AIRecommendation } from "@/types/upload-issue";

type IssueAnalysisResultResponse = {
  issueId: string;
  imageId: string;
  recommendation: AIRecommendation;
  saved: boolean;
  analyzedAt: string;
};

type IssueDetailResponse = {
  issue: {
    id: string;
    imageUrl: string;
    recommendation: AIRecommendation;
    analysisResult: IssueAnalysisResultResponse | null;
    status: string;
    archived: boolean;
    adminNotes: string;
    createdAt: string;
    updatedAt: string;
  };
  booking: { id: string; status: string; preferredDate: string } | null;
  customer: { id: string; fullName: string; email: string; phone: string } | null;
  auditLogs: {
    id: string;
    action: string;
    adminEmail: string;
    createdAt: string;
  }[];
};

export default function AdminIssueDetailPage() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState("");

  const query = useQuery({
    queryKey: ["admin", "issue", params.id],
    queryFn: () => adminFetch<IssueDetailResponse>(`/api/admin/issues/${params.id}`),
    enabled: !!params.id,
  });

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      adminFetch(`/api/admin/issues/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "issue", params.id] });
    },
  });

  if (query.isLoading) {
    return (
      <AdminShell title="Issue Detail">
        <LoadingState />
      </AdminShell>
    );
  }

  if (query.isError || !query.data) {
    return (
      <AdminShell title="Issue Detail">
        <ErrorState onRetry={() => void query.refetch()} />
      </AdminShell>
    );
  }

  const { issue, booking, customer, auditLogs } = query.data;
  const analysisRecommendation =
    issue.analysisResult?.recommendation ?? issue.recommendation;

  return (
    <AdminShell
      title={analysisRecommendation.detectedIssue}
      subtitle={`Issue #${issue.id}`}
      actions={
        <Link href="/admin/issues" className="admin-btn-secondary">
          Back to issues
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="overflow-hidden rounded-2xl border border-outline-variant/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={issue.imageUrl}
                alt={analysisRecommendation.detectedIssue}
                className="max-h-96 w-full object-cover"
              />
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                label={analysisRecommendation.severity}
                tone={analysisRecommendation.severity}
              />
              <StatusBadge label={analysisRecommendation.category} />
              <StatusBadge label={issue.status} tone={issue.status} />
              {issue.archived ? <StatusBadge label="archived" tone="cancelled" /> : null}
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-headline text-headline-sm">AI analysis</h2>
              {issue.analysisResult ? (
                <p className="font-body text-body-sm text-on-surface-variant">
                  Analyzed {new Date(issue.analysisResult.analyzedAt).toLocaleString()}
                </p>
              ) : null}
            </div>

            <IssueRecommendationSummary recommendation={analysisRecommendation} />
          </section>

          {issue.analysisResult ? (
            <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
              <h2 className="font-headline text-headline-sm">Saved analysis response</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface-container-low p-4">
                  <dt className="font-label text-label-sm text-on-surface-variant">Issue ID</dt>
                  <dd className="mt-1 break-all font-body text-body-sm">{issue.analysisResult.issueId}</dd>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <dt className="font-label text-label-sm text-on-surface-variant">Image ID</dt>
                  <dd className="mt-1 break-all font-body text-body-sm">{issue.analysisResult.imageId}</dd>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <dt className="font-label text-label-sm text-on-surface-variant">Saved</dt>
                  <dd className="mt-1 font-body text-body-sm">
                    {issue.analysisResult.saved ? "Yes" : "No"}
                  </dd>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <dt className="font-label text-label-sm text-on-surface-variant">Analyzed at</dt>
                  <dd className="mt-1 font-body text-body-sm">
                    {new Date(issue.analysisResult.analyzedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </section>
          ) : null}

          <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
            <h2 className="font-headline text-headline-sm">Timeline & Audit</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-outline-variant/10 p-4">
                <p className="font-label text-label-lg">Issue created</p>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {new Date(issue.createdAt).toLocaleString()}
                </p>
              </div>
              {auditLogs.map((log) => (
                <div key={log.id} className="rounded-xl border border-outline-variant/10 p-4">
                  <p className="font-label text-label-lg">{log.action}</p>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    {log.adminEmail} · {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 text-left shadow-sm">
            <h2 className="font-headline text-headline-sm">Actions</h2>
            <div className="mt-4 space-y-4">
              <label className="admin-field">
                <span className="admin-label">Status</span>
                <select
                  defaultValue={issue.status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="admin-select"
                >
                  <option value="analyzed">analyzed</option>
                  <option value="booked">booked</option>
                </select>
              </label>
              <label className="admin-field">
                <span className="admin-label">Admin notes</span>
                <textarea
                  defaultValue={issue.adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="admin-textarea min-h-[6rem] resize-y"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  mutation.mutate({
                    status: status || issue.status,
                    adminNotes,
                  })
                }
                className="admin-btn-primary w-full"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => mutation.mutate({ archived: !issue.archived })}
                className="admin-btn-secondary w-full"
              >
                {issue.archived ? "Restore issue" : "Archive issue"}
              </button>
            </div>
          </section>

          {booking ? (
            <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
              <h2 className="font-headline text-headline-sm">Linked booking</h2>
              <p className="mt-2 font-body text-body-sm">
                Preferred date: {booking.preferredDate}
              </p>
              <Link
                href={`/admin/bookings/${booking.id}`}
                className="mt-4 inline-flex text-primary"
              >
                View booking
              </Link>
            </section>
          ) : null}

          {customer ? (
            <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 shadow-sm">
              <h2 className="font-headline text-headline-sm">Customer</h2>
              <p className="mt-2 font-label text-label-lg">{customer.fullName}</p>
              <p className="font-body text-body-sm text-on-surface-variant">{customer.email}</p>
              <Link
                href={`/admin/customers/${customer.id}`}
                className="mt-4 inline-flex text-primary"
              >
                View customer
              </Link>
            </section>
          ) : null}
        </div>
      </div>

      <ImagePreviewModal
        open={previewOpen}
        src={issue.imageUrl}
        alt={analysisRecommendation.detectedIssue}
        onClose={() => setPreviewOpen(false)}
      />
    </AdminShell>
  );
}
