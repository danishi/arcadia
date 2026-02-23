// ============================================================================
// route.ts — ヘルスチェック API
// ============================================================================
// GET /api/health でアプリケーションとプラットフォーム接続の状態を返す。
// ============================================================================

import { NextResponse } from "next/server";

export async function GET() {
  const platformHost = process.env.PLATFORM_HOST;
  const platformConfigured = Boolean(platformHost && process.env.PLATFORM_TOKEN);

  let platformReachable = false;
  if (platformConfigured && platformHost) {
    try {
      const res = await fetch(platformHost, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });
      platformReachable = res.ok;
    } catch {
      platformReachable = false;
    }
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    app: {
      name: "arcadia-demo-app",
      version: process.env.npm_package_version ?? "0.1.0",
    },
    platform: {
      configured: platformConfigured,
      reachable: platformReachable,
      type: process.env.PLATFORM_TYPE ?? "custom",
    },
  });
}
