export async function adminLogout() {
  await fetch("/api/admin/auth/login", { method: "DELETE" });
  window.location.href = "/admin/login";
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;

  const response = await fetch(path, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
    },
    credentials: "same-origin",
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (
    contentType.includes("text/csv") ||
    contentType.includes("spreadsheetml")
  ) {
    return response as unknown as T;
  }

  return response.json() as Promise<T>;
}

export async function adminUpload<T>(
  path: string,
  formData: FormData
): Promise<T> {
  return adminFetch<T>(path, {
    method: "POST",
    body: formData,
  });
}

export function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
