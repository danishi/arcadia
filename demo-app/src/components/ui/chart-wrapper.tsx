// ============================================================================
// chart-wrapper.tsx — Recharts ラッパー
// ============================================================================
// 棒グラフ / 折れ線グラフ / 円グラフの切替に対応したレスポンシブチャート。
// Recharts の ResponsiveContainer を内包し、統一的な API を提供する。
// ============================================================================

"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartType = "bar" | "line" | "pie";

export type ChartDataPoint = {
  label: string;
  value: number;
  value2?: number;
};

export type ChartWrapperProps = {
  /** グラフデータ */
  data: ChartDataPoint[];
  /** デフォルトのグラフ種別 */
  defaultType?: ChartType;
  /** グラフ種別の切替を許可するか */
  switchable?: boolean;
  /** 第1軸ラベル */
  valueLabel?: string;
  /** 第2軸ラベル */
  value2Label?: string;
  /** グラフの高さ（px） */
  height?: number;
  /** 追加の CSS クラス */
  className?: string;
};

const CHART_COLORS = [
  "var(--color-primary)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-accent)",
  "var(--color-error)",
];

const typeLabels: Record<ChartType, string> = {
  bar: "棒グラフ",
  line: "折れ線",
  pie: "円グラフ",
};

export function ChartWrapper({
  data,
  defaultType = "bar",
  switchable = true,
  valueLabel = "値",
  value2Label,
  height = 300,
  className,
}: ChartWrapperProps) {
  const [chartType, setChartType] = useState<ChartType>(defaultType);

  const hasValue2 = data.some((d) => d.value2 !== undefined);

  return (
    <div className={cn("bg-surface rounded-xl border border-border p-4", className)}>
      {/* グラフ種別切替 */}
      {switchable && (
        <div className="flex gap-1 mb-3">
          {(Object.keys(typeLabels) as ChartType[]).map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                chartType === t
                  ? "bg-primary text-white"
                  : "bg-surface-alt text-text-muted hover:text-text"
              )}
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>
      )}

      {/* チャート本体 */}
      <ResponsiveContainer width="100%" height={height}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name={valueLabel} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            {hasValue2 && (
              <Bar dataKey="value2" name={value2Label} fill="var(--color-info)" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        ) : chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name={valueLabel} stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
            {hasValue2 && (
              <Line type="monotone" dataKey="value2" name={value2Label} stroke="var(--color-info)" strokeWidth={2} dot={{ r: 3 }} />
            )}
          </LineChart>
        ) : (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={height / 3}
              label={({ label, percent }) => `${label}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
