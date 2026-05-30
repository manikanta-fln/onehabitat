"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { adminFetch } from "@/services/admin/api-client";

type SettingsResponse = {
  settings: { key: string; value: Record<string, unknown>; updatedAt: string }[];
  roles: { key: string; name: string; description: string; permissions: string[] }[];
  permissions: { key: string; name: string; description: string }[];
};

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminFetch<SettingsResponse>("/api/admin/settings"),
  });

  const mutation = useMutation({
    mutationFn: (payload: { key: string; value: Record<string, unknown> }) =>
      adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });

  if (query.isLoading) {
    return (
      <AdminShell title="Settings">
        <LoadingState />
      </AdminShell>
    );
  }

  if (query.isError || !query.data) {
    return (
      <AdminShell title="Settings">
        <ErrorState onRetry={() => void query.refetch()} />
      </AdminShell>
    );
  }

  const company = query.data.settings.find((item) => item.key === "company")?.value ?? {};
  const upload = query.data.settings.find((item) => item.key === "upload")?.value ?? {};
  const dashboardPrefs =
    query.data.settings.find((item) => item.key === "dashboard_preferences")?.value ?? {};

  return (
    <AdminShell title="Settings" subtitle="Company, upload, dashboard, and role configuration">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SettingsCard
          title="Company Settings"
          onSubmit={(form) =>
            mutation.mutate({
              key: "company",
              value: {
                brandName: form.get("brandName"),
                brandEmail: form.get("brandEmail"),
                brandPhone: form.get("brandPhone"),
              },
            })
          }
        >
          <Field name="brandName" label="Brand name" defaultValue={String(company.brandName ?? "")} />
          <Field name="brandEmail" label="Brand email" defaultValue={String(company.brandEmail ?? "")} />
          <Field name="brandPhone" label="Brand phone" defaultValue={String(company.brandPhone ?? "")} />
        </SettingsCard>

        <SettingsCard
          title="Upload Settings"
          onSubmit={(form) =>
            mutation.mutate({
              key: "upload",
              value: {
                maxImageBytes: Number(form.get("maxImageBytes")),
                allowedMimeTypes: String(form.get("allowedMimeTypes"))
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              },
            })
          }
        >
          <Field
            name="maxImageBytes"
            label="Max image bytes"
            defaultValue={String(upload.maxImageBytes ?? 5242880)}
          />
          <Field
            name="allowedMimeTypes"
            label="Allowed MIME types (comma separated)"
            defaultValue={Array.isArray(upload.allowedMimeTypes) ? upload.allowedMimeTypes.join(", ") : ""}
          />
        </SettingsCard>

        <SettingsCard
          title="Dashboard Preferences"
          onSubmit={(form) =>
            mutation.mutate({
              key: "dashboard_preferences",
              value: {
                defaultDateRangeDays: Number(form.get("defaultDateRangeDays")),
                refreshIntervalSeconds: Number(form.get("refreshIntervalSeconds")),
              },
            })
          }
        >
          <Field
            name="defaultDateRangeDays"
            label="Default date range (days)"
            defaultValue={String(dashboardPrefs.defaultDateRangeDays ?? 30)}
          />
          <Field
            name="refreshIntervalSeconds"
            label="Refresh interval (seconds)"
            defaultValue={String(dashboardPrefs.refreshIntervalSeconds ?? 60)}
          />
        </SettingsCard>

        <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 text-left shadow-sm">
          <h2 className="font-headline text-headline-sm">Role Management</h2>
          <div className="mt-4 space-y-4">
            {query.data.roles.map((role) => (
              <div key={role.key} className="rounded-xl border p-4">
                <p className="font-label text-label-lg">{role.name}</p>
                <p className="font-body text-body-sm text-on-surface-variant">{role.description}</p>
                <p className="mt-2 font-body text-body-sm">
                  {role.permissions.length} permissions
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function SettingsCard({
  title,
  children,
  onSubmit,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (form: FormData) => void;
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-white p-6 text-left shadow-sm">
      <h2 className="font-headline text-headline-sm">{title}</h2>
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }}
      >
        {children}
        <button type="submit" className="admin-btn-primary">
          Save
        </button>
      </form>
    </section>
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
