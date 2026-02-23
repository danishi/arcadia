// ============================================================================
// utils.ts — ユーティリティ関数
// ============================================================================

import { format as dateFnsFormat } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * className を結合する。falsy な値は無視される。
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 数値を日本語ロケールでフォーマットする。
 * @example formatNumber(1234567) => "1,234,567"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

/**
 * 日付を指定フォーマットで文字列化する（date-fns 使用）。
 * @param date - Date オブジェクトまたは ISO 文字列
 * @param fmt - date-fns フォーマット文字列（デフォルト: "yyyy/MM/dd HH:mm"）
 */
export function formatDate(
  date: Date | string,
  fmt: string = "yyyy/MM/dd HH:mm"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return dateFnsFormat(d, fmt, { locale: ja });
}

/**
 * パーセンテージをフォーマットする。
 * @example formatPercent(12.345, 1) => "12.3%"
 */
export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

/**
 * ランダムな ID を生成する。
 * @param prefix - ID のプレフィックス（デフォルト: "id"）
 */
export function generateId(prefix: string = "id"): string {
  const random = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * min 以上 max 以下のランダムな浮動小数点数を返す。
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * min 以上 max 以下のランダムな整数を返す。
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

/**
 * 配列からランダムに1要素を選ぶ。
 */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 指定ミリ秒だけ待機する Promise を返す。
 */
export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
