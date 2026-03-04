// ============================================================================
// chat-message.tsx — チャットメッセージ表示
// ============================================================================
// ユーザー / AI / システムの各メッセージを表示するコンポーネント。
// Markdown テキスト、テーブル、チャートの表示に対応。
// ============================================================================

"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

export type ChatMessageProps = {
  message: ChatMessageType;
  className?: string;
};

const roleConfig = {
  user: {
    label: "あなた",
    bgClass: "bg-primary/10",
    textClass: "text-primary",
    align: "ml-auto" as const,
  },
  assistant: {
    label: "AI アシスタント",
    bgClass: "bg-surface-alt",
    textClass: "text-info",
    align: "mr-auto" as const,
  },
  system: {
    label: "システム",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    align: "mx-auto" as const,
  },
};

export function ChatMessage({ message, className }: ChatMessageProps) {
  const config = roleConfig[message.role];

  return (
    <div
      className={cn(
        "max-w-[80%] rounded-xl px-4 py-3",
        config.bgClass,
        config.align,
        className
      )}
    >
      {/* ロールラベル */}
      <div className={cn("text-[10px] font-bold mb-1", config.textClass)}>
        {config.label}
      </div>

      {/* メッセージ本文 */}
      <div className="text-sm text-text leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>

      {/* テーブル表示 */}
      {message.table && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {message.table.columns.map((col, ci) => (
                  <th
                    key={ci}
                    className="px-3 py-2 text-left font-medium text-text-muted border-b border-border"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {message.table.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* チャートプレースホルダー（chart-wrapper と連携可能） */}
      {message.chart && (
        <div className="mt-3 p-3 bg-surface rounded-lg border border-border text-xs text-text-muted text-center">
          📊 {message.chart.type === "bar" ? "棒グラフ" : message.chart.type === "line" ? "折れ線グラフ" : "円グラフ"}
          （{message.chart.data.length} データポイント）
        </div>
      )}

      {/* タイムスタンプ */}
      <div className="text-[10px] text-text-muted mt-2 opacity-60">
        {new Date(message.timestamp).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
