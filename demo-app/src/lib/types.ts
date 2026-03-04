// ============================================================================
// types.ts — 共有型定義
// ============================================================================
// mock-data.ts およびコンポーネント間で共有される型を定義する。
// .tmpl ファイルに依存しないため、ビルド前でも型チェックが通る。
// ============================================================================

/** データ連携パイプライン */
export type Pipeline = {
  id: string;
  /** データソース名 */
  source: string;
  /** データ送信先名 */
  destination: string;
  /** パイプライン状態 */
  status: "healthy" | "delayed" | "error";
  /** 最終同期日時（ISO 8601） */
  lastSync: string;
  /** 1日あたりの処理レコード数 */
  recordsPerDay: number;
  /** データ品質スコア（0-100） */
  qualityScore: number;
};

/** AI 対話メッセージ */
export type ChatMessage = {
  id: string;
  /** メッセージの送信元 */
  role: "user" | "assistant" | "system";
  /** メッセージ本文（Markdown 対応） */
  content: string;
  /** 送信日時（ISO 8601） */
  timestamp: string;
  /** 分析結果テーブル（任意） */
  table?: { columns: string[]; rows: string[][] };
  /** 分析結果チャート（任意） */
  chart?: {
    type: "bar" | "line" | "pie";
    data: { label: string; value: number; value2?: number }[];
    label?: string;
    label2?: string;
  };
};

/** KPI メトリクス */
export type KpiMetric = {
  id: string;
  /** KPI ラベル */
  label: string;
  /** 現在値 */
  value: number;
  /** 表示用の単位・サフィックス */
  suffix?: string;
  /** 前期比（%） */
  changePercent: number;
  /** 変化の方向 */
  trend: "up" | "down" | "flat";
  /** 表示アイコン */
  icon?: string;
};

/** 汎用テーブルレコード */
export type TableRecord = {
  [key: string]: string | number | boolean | null;
};
