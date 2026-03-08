# ARCADIA Demo App

Next.js 15 (App Router) + React 19 + TypeScript によるデモアプリケーション。

## 技術スタック

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| Next.js | 15 | フレームワーク (App Router) |
| React | 19 | UI ライブラリ |
| TypeScript | 5.7+ | 型安全 (strict mode) |
| Tailwind CSS | 4 | スタイリング |
| Recharts | 3.7 | チャート描画 |
| Framer Motion | 12 | アニメーション |
| date-fns | 4 | 日付処理 |

## セットアップ

```bash
cd demo-app
npm install
```

### 環境変数

`.env.local` を作成し、以下を設定します（省略時はモックデータで動作）。

```env
PLATFORM_TYPE=databricks
PLATFORM_HOST=https://your-workspace.cloud.databricks.com
PLATFORM_TOKEN=dapi...
PLATFORM_WAREHOUSE_ID=...
PLATFORM_PROJECT_ID=...
AI_ENDPOINT=https://...
AI_SPACE_ID=...
```

## 開発

```bash
npm run dev     # 開発サーバー起動（http://localhost:3000）
npm run build   # プロダクションビルド
npm run lint    # ESLint 実行
```

## ディレクトリ構成

```
src/
├── app/                   # Next.js App Router ページ
│   ├── api/               # API Routes
│   ├── globals.css        # デザイントークン & グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ（プレースホルダー）
└── lib/
    └── utils.ts           # ユーティリティ関数
```

## 画面生成

画面・コンポーネント・モックデータは `/setup` 時のヒアリング結果に基づき `demo-builder` スキルが自動生成します。テンプレートに縛られず、プロジェクトの要件に最適な構成が構築されます。
