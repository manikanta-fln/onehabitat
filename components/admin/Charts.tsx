"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#7e5700", "#ffb401", "#6f5c32", "#795900", "#e8bc5c", "#ba1a1a"];

export function AdminLineChart({
  data,
  dataKey = "count",
}: {
  data: { date: string; count: number }[];
  dataKey?: string;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="adminArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7e5700" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#7e5700" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee0d0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#7e5700"
            fill="url(#adminArea)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee0d0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#7e5700" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminPieChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={60} outerRadius={95}>
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdminFunnelChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const max = Math.max(...data.map((d) => d.value), 1);
        const width = `${Math.max(18, (item.value / max) * 100)}%`;
        return (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between font-body text-body-sm">
              <span>{item.label}</span>
              <span className="font-label text-label-sm text-on-surface-variant">
                {item.value}
              </span>
            </div>
            <div className="h-3 rounded-full bg-surface-container-low">
              <div
                className="h-3 rounded-full bg-primary transition-all"
                style={{ width, opacity: 1 - index * 0.12 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
