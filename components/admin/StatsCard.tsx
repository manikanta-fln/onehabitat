"use client";

type StatsCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: string;
  trend?: string;
};

export function StatsCard({ label, value, hint, icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/10 bg-white p-5 text-left shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-label text-label-sm text-on-surface-variant">{label}</p>
          <p className="mt-2 font-headline text-headline-md leading-tight text-on-surface">
            {value}
          </p>
          {hint ? (
            <p className="mt-2 font-body text-body-sm leading-relaxed text-on-surface-variant">
              {hint}
            </p>
          ) : null}
          {trend ? (
            <p className="mt-2 font-label text-label-sm text-primary">{trend}</p>
          ) : null}
        </div>
        {icon ? (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-container/20 text-primary">
            <span className="material-symbols-outlined leading-none">{icon}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type AnalyticsCardProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function AnalyticsCard({ title, children, action }: AnalyticsCardProps) {
  return (
    <section className="rounded-2xl border border-outline-variant/10 bg-white p-5 text-left shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="min-w-0 flex-1 font-headline text-headline-sm leading-tight text-on-surface">
          {title}
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
