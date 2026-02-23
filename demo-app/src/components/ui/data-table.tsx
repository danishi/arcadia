// ============================================================================
// data-table.tsx — 汎用データテーブル
// ============================================================================
// ヘッダー定義と行データを受け取り、ソート対応のテーブルを描画する。
// 行データは文字列キーによるレコード配列で柔軟に対応。
// ============================================================================

"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export type ColumnDef = {
  /** カラム識別キー（行データのプロパティ名） */
  key: string;
  /** 表示ヘッダーラベル */
  label: string;
  /** テキスト寄せ（デフォルト: "left"） */
  align?: "left" | "center" | "right";
  /** ソート可能か（デフォルト: true） */
  sortable?: boolean;
  /** カスタムレンダラー */
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};

export type DataTableProps = {
  /** カラム定義 */
  columns: ColumnDef[];
  /** 行データ */
  rows: Record<string, unknown>[];
  /** 追加の CSS クラス */
  className?: string;
  /** データなし時のメッセージ */
  emptyMessage?: string;
};

type SortState = {
  key: string;
  direction: "asc" | "desc";
} | null;

export function DataTable({
  columns,
  rows,
  className,
  emptyMessage = "データがありません",
}: DataTableProps) {
  const [sort, setSort] = useState<SortState>(null);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), "ja", { numeric: true });
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [rows, sort]);

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : null;
      }
      return { key, direction: "asc" };
    });
  };

  const alignClass = (align?: string) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => {
              const isSortable = col.sortable !== false;
              const isActive = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 font-medium text-text-muted whitespace-nowrap",
                    alignClass(col.align),
                    isSortable && "cursor-pointer select-none hover:text-text"
                  )}
                  onClick={isSortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {isActive && (
                      <span className="text-[10px]">
                        {sort?.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedRows.map((row, ri) => (
              <tr
                key={ri}
                className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3", alignClass(col.align))}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
