// ============================================================================
// status-badge.tsx — ステータスバッジ
// ============================================================================
// healthy / warning / error / pending / delayed 等のステータスを
// 色分けされたバッジとして表示するコンポーネント。
// ============================================================================

import { cn } from "@/lib/utils";

export type StatusType =
  | "healthy"
  | "warning"
  | "error"
  | "pending"
  | "delayed"
  | "active"
  | "paused"
  | "completed";

export type StatusBadgeProps = {
  /** ステータス種別 */
  status: StatusType;
  /** 表示ラベル（未指定時はステータス名をそのまま表示） */
  label?: string;
  /** ドットインジケーターを表示するか */
  showDot?: boolean;
  /** サイズ */
  size?: "sm" | "md";
  /** 追加の CSS クラス */
  className?: string;
};

const statusConfig: Record<
  StatusType,
  { label: string; bgClass: string; textClass: string; dotClass: string }
> = {
  healthy: {
    label: "正常",
    bgClass: "bg-success/10",
    textClass: "text-success",
    dotClass: "bg-success",
  },
  warning: {
    label: "警告",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    dotClass: "bg-warning",
  },
  error: {
    label: "エラー",
    bgClass: "bg-error/10",
    textClass: "text-error",
    dotClass: "bg-error",
  },
  pending: {
    label: "待機中",
    bgClass: "bg-info/10",
    textClass: "text-info",
    dotClass: "bg-info",
  },
  delayed: {
    label: "遅延",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    dotClass: "bg-warning",
  },
  active: {
    label: "稼働中",
    bgClass: "bg-success/10",
    textClass: "text-success",
    dotClass: "bg-success",
  },
  paused: {
    label: "一時停止",
    bgClass: "bg-text-muted/10",
    textClass: "text-text-muted",
    dotClass: "bg-text-muted",
  },
  completed: {
    label: "完了",
    bgClass: "bg-info/10",
    textClass: "text-info",
    dotClass: "bg-info",
  },
};

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)}
        />
      )}
      {displayLabel}
    </span>
  );
}
