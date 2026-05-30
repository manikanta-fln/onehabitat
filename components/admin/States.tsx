"use client";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant/20 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-primary">
        <span className="material-symbols-outlined text-3xl">inbox</span>
      </div>
      <h3 className="font-headline text-headline-sm text-on-surface">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md font-body text-body-sm text-on-surface-variant">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-outline-variant/10 bg-white shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline-variant/20 border-t-primary" />
      <p className="mt-4 font-body text-body-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-error/20 bg-error-container/20 p-8 text-center">
      <h3 className="font-headline text-headline-sm text-on-error-container">{title}</h3>
      {description ? (
        <p className="mt-2 font-body text-body-sm text-on-surface-variant">{description}</p>
      ) : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-primary px-4 py-2 font-label text-label-lg text-on-primary"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
