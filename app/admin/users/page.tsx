"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/Modals";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch } from "@/services/admin/api-client";
import type { PaginatedResult } from "@/types/admin/api";
import type { AdminPublicUser } from "@/types/admin/auth";
import { ADMIN_ROLES } from "@/types/admin/auth";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const query = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () =>
      adminFetch<PaginatedResult<AdminPublicUser>>("/api/admin/users?page=1&limit=50"),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      adminFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setCreateOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      adminFetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const columns: DataTableColumn<AdminPublicUser>[] = [
    { key: "name", header: "Name", render: (row) => row.name },
    { key: "email", header: "Email", render: (row) => row.email },
    {
      key: "role",
      header: "Role",
      render: (row) => <StatusBadge label={row.role} tone={row.role} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge label={row.isActive ? "active" : "inactive"} tone={row.isActive ? "completed" : "cancelled"} />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <button
          type="button"
          onClick={() =>
            updateMutation.mutate({ id: row.id, isActive: !row.isActive })
          }
          className="rounded-lg border px-3 py-1.5 font-label text-label-sm leading-none"
        >
          {row.isActive ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <AdminShell
      title="Admin Users"
      subtitle="Create, assign roles, and manage console access"
      actions={
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="admin-btn-primary"
        >
          Create admin
        </button>
      }
    >
      <div className="space-y-6">
        {query.isLoading ? <LoadingState /> : null}
        {query.isError ? (
          <ErrorState onRetry={() => void query.refetch()} />
        ) : null}
        {query.data ? (
          <DataTable
            columns={columns}
            rows={query.data.data}
            rowKey={(row) => row.id}
          />
        ) : null}
      </div>

      <FormModal
        open={createOpen}
        title="Create admin user"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-admin-form"
              className="admin-btn-primary"
            >
              Create admin
            </button>
          </>
        }
      >
        <form
          id="create-admin-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            createMutation.mutate({
              name: form.get("name"),
              email: form.get("email"),
              password: form.get("password"),
              role: form.get("role"),
            });
          }}
        >
          <Field name="name" label="Name" />
          <Field name="email" label="Email" type="email" />
          <Field name="password" label="Password" type="password" />
          <label className="admin-field">
            <span className="admin-label">Role</span>
            <select name="role" className="admin-select">
              {ADMIN_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        </form>
      </FormModal>
    </AdminShell>
  );
}

function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="admin-field">
      <span className="admin-label">{label}</span>
      <input name={name} type={type} required className="admin-input" />
    </label>
  );
}
