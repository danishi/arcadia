// ============================================================================
// kpi-tile.tsx — KPI 表示カード
// ============================================================================
// ダッシュボード等で使用する KPI メトリクス表示用のタイルコンポーネント。
// ラベル、値、前期比、アイコンを表示し、トレンドに応じた色分けを行う。
// ============================================================================

"use client";

import { cn, formatNumber, formatPercent } from "@/lib/utils";

export type KpiTileProps = {
  /** KPI ラベル */
  label: string;
  /** 表示値 */
  value: number;
  /** 値の単位・サフィックス（例: "人", "%", "件/日"） */
  suffix?: string;
  /** 前期比（%） */
  changePercent?: number;
  /** 変化の方向 */
  trend?: "up" | "down" | "flat";
  /** 表示アイコン */
  icon?: string;
  /** 追加の CSS クラス */
  className?: string;
};

const trendConfig = {
  up: { arrow: "↑", color: "text-success" },
  down: { arrow: "↓", color: "text-error" },
  flat: { arrow: "→", color: "text-text-muted" },
} as const;

export function KpiTile({
  label,
  value,
  suffix,
  changePercent,
  trend = "flat",
  icon,
  className,
}: KpiTileProps) {
  const trendInfo = trendConfig[trend];

  return (
    <div
      className={cn(
        "bg-surface rounded-xl border border-border p-5 transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-text-muted">{label}</span>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-text tabular-nums">
          {formatNumber(value)}
        </span>
        {suffix && (
          <span className="text-sm text-text-muted">{suffix}</span>
        )}
      </div>

      {changePercent !== undefined && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs", trendInfo.color)}>
          <span>{trendInfo.arrow}</span>
          <span>{formatPercent(Math.abs(changePercent))}</span>
          <span className="text-text-muted ml-1">前期比</span>
        </div>
      )}
    </div>
  );
}
