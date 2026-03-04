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
│   ├── _screen-templates/ # 画面パターンテンプレート
│   ├── api/               # API Routes
│   ├── globals.css        # デザイントークン & グローバルスタイル
│   ├── layout.tsx.tmpl    # ルートレイアウト（テンプレート）
│   └── page.tsx.tmpl      # ホームページ（テンプレート）
├── components/
│   ├── ui/                # 共通 UI コンポーネント
│   └── sidebar.tsx.tmpl   # サイドバー（テンプレート）
└── lib/
    ├── types.ts           # 共有型定義
    ├── utils.ts           # ユーティリティ関数
    ├── mock-data.ts.tmpl  # モックデータ（テンプレート）
    └── platform-client.ts.tmpl  # プラットフォーム接続（テンプレート）
```

### `.tmpl` ファイルについて

`*.tmpl` ファイルは `/setup` コマンド実行時にプロジェクト固有の値（`__CLIENT_NAME__` 等）が置換され、正規の `.tsx` / `.ts` ファイルとして生成されます。

## 画面一覧

| パス | 画面名 | フェーズ |
|------|--------|---------|
| `/dashboard` | データパイプライン | Ph1 |
| `/analysis` | データ分析 (AI) | Ph1 |
| `/scenario` | シナリオ生成 | Ph1 |
| `/journey` | ジャーニービルダー | Ph2 |
| `/engagement` | エンゲージメント | Ph2 |
| `/realtime` | リアルタイムモニター | Ph2 |

画面の追加・更新は `demo-builder` スキルで自動生成できます。
