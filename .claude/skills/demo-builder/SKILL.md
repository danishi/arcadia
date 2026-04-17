---
name: demo-builder
description: "CLAUDE.md のデモ仕様とヒアリング結果に基づき、Next.js デモアプリの画面・コンポーネント・モックデータをゼロから生成するスキル。"
user-invocable: true
argument-hint: "<画面名またはall>"
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# デモアプリビルダー

## 概要

本スキルは `/setup` で収集されたデモアプリ仕様（CLAUDE.md `## 2. Demo Web App Specification` セクション）に基づき、Next.js App Router 構成のデモアプリを**ゼロから**構築する。

テンプレートに依存せず、プロジェクト固有の要件に最適な画面構成・コンポーネント・モックデータを生成する。

---

## 前提条件

- `/setup` が完了し、CLAUDE.md の `## 2. Demo Web App Specification` に画面定義が記録されていること
- **Phase 2.5 (Design System) が完了し、プロジェクトルートの `DESIGN.md` が確定していること**
- `demo-app/` に最小限の Next.js スキャフォールド（`layout.tsx`, `page.tsx`, `globals.css`, `utils.ts`）が存在すること

---

## 画面構築手順（6ステップ）

### Step 1: 仕様とデザインシステムの読込

#### Step 1-a: DESIGN.md（必須）

プロジェクトルートの **`DESIGN.md`** を読み込む。Phase 2.5 で確定されたデザイン規約（色・タイポ・コンポーネント・Demo App Rules）を抽出する。

- `DESIGN.md` が存在しない場合はエラーを返し、**`/auto-run 2.5` または Phase 2.5 (Design System) の実行を促す**
- `2. Color Palette & Roles` の意味名トークンのみを使用する（`bg-primary-800` 等）
- `8. Demo App Rules` の Tailwind 変数ブロックを `globals.css` の `@theme inline` に適用する
- 素の Tailwind カラートークン（`bg-slate-*`, `bg-blue-*`, `text-gray-*` 等）の使用は**禁止**

#### Step 1-b: CLAUDE.md 仕様

CLAUDE.md の `## 2. Demo Web App Specification` セクションから以下を読み取る:

- **Demo Screens テーブル**: 各画面のパス、名称、種類（type）、概要
- **Sample Data Domain**: モックデータの業務ドメイン
- **Theme Color**: テーマカラー設定（`DESIGN.md` と不整合がある場合は `DESIGN.md` を優先）
- **Tech Stack**: 使用ライブラリ
- **Environment Variables**: プラットフォーム接続設定

`demo-app-spec.md` がプロジェクトルートに存在する場合はそちらも参照する（Phase 6 で自動生成される詳細仕様）。

### Step 2: 共通基盤の生成

最初の画面構築前に、以下の共通ファイルを生成する:

#### 2-1. 型定義（`src/lib/types.ts`）

Demo Screens テーブルと Sample Data Domain から、必要な型定義を設計・生成する。

- 各画面が扱うデータモデルの型
- 共通で使用する型（KPI、テーブルレコード、チャートデータ等）
- プラットフォーム接続の型

#### 2-2. モックデータ（`src/lib/mock-data.ts`）

Sample Data Domain に基づき、全画面で使用するモックデータを生成する。

- ドメインに適したリアルなサンプルデータ（10〜50件程度）
- 日付は相対日付（`new Date()` ベース）で生成
- 金額・数値はリアリティのある値
- 各画面の種類に応じたデータ構造

#### 2-3. プラットフォーム接続クライアント（`src/lib/platform-client.ts`）

環境変数に基づくプラットフォーム接続の抽象化レイヤーを生成する。

- `getPlatformConfig()`: 環境変数から設定を取得
- `isPlatformConfigured()`: 接続可能判定
- `platformFetch()`: 認証ヘッダー自動付与の fetch ラッパー

#### 2-4. テーマカラー適用（DESIGN.md 準拠）

`DESIGN.md §8 Demo App Rules` の `@theme inline` ブロック全体を `src/app/globals.css` にコピーする。CLAUDE.md の `Theme Color` は参考値とし、最終確定値は `DESIGN.md` を信じる（Phase 2.5 で strategist が両者を整合させる）。

#### 2-5. サイドバー / ナビゲーション（`src/components/sidebar.tsx`）

Demo Screens テーブルの全画面を含むナビゲーションを生成する。

- プロジェクト名・コンセプトをヘッダーに表示
- 画面をグループ分け（フェーズ分けがある場合は Phase ごと、なければカテゴリごと）
- アクティブ状態のハイライト

### Step 3: ルートレイアウトの更新

`src/app/layout.tsx` を更新する:

- Sidebar コンポーネントの import 追加
- 2カラムレイアウト（サイドバー + メインコンテンツ）の構成
- メタデータにプロジェクト名・コンセプトを反映

### Step 4: 各画面の生成

Demo Screens テーブルの各画面について、種類（type）に応じた最適な構成で画面を生成する。

#### 画面種類ごとのガイドライン

各種類は**ガイドライン**であり、厳密な型ではない。プロジェクトの要件に応じて柔軟に組み合わせ・カスタマイズすること。

| 種類 | 典型的な構成要素 | 推奨ライブラリ |
|------|---------------|-------------|
| `dashboard` | KPI カード、グラフ（棒/折れ線/円）、データテーブル、フィルタ | Recharts |
| `table` | 検索・フィルタ、ソート対応テーブル、ページネーション、詳細パネル | — |
| `chat` | メッセージ履歴、入力フォーム、結果表示（テーブル/グラフ切替）、サンプルクエリ | Recharts |
| `builder` | ノードパレット、キャンバス（D&D）、プロパティパネル、ツールバー | Framer Motion |
| `form` | 入力フィールド、バリデーション、プレビュー、送信/保存 | — |
| `realtime` | ライブ指標、ストリーミンググラフ、ステータス一覧、アラート | Recharts, Framer Motion |

#### ファイル構成（1画面あたり）

```
demo-app/src/app/[パス]/
  page.tsx              # ページコンポーネント

demo-app/src/components/[画面名]/
  [必要なコンポーネント].tsx   # 画面固有コンポーネント（必要に応じて分割）
```

小規模な画面は `page.tsx` 1ファイルに収めてよい。複雑な画面のみコンポーネントを分割する。

#### 共通 UI コンポーネント

複数画面で再利用される UI パーツは `src/components/ui/` に配置する:

```
demo-app/src/components/ui/
  [コンポーネント名].tsx    # 画面定義から必要なものだけ生成
```

**生成すべき共通コンポーネントは画面定義から逆算して決定する。** 使わないコンポーネントは生成しない。

### Step 5: ホーム画面の更新

`src/app/page.tsx` を更新し、プロジェクト概要と各画面へのナビゲーションを表示するホーム画面にする:

- プロジェクトコンセプト
- 主要 KPI（モックデータから。KPI が不要な案件ではスキップ）
- 各画面へのリンクカード

### Step 6: API Routes の生成

各画面が必要とする API Route を `src/app/api/` 配下に生成する:

- プラットフォーム接続時は実 API を呼び出し
- 未接続時はモックデータを返却するフォールバック
- chat 型画面の AI 応答はストリーミング対応を推奨

---

## 実装規約

- UI テキスト: **日本語**（CLAUDE.md の指定に従う）
- `"use client"` ディレクティブ: インタラクティブなコンポーネントにのみ付与
- レスポンシブ: デスクトップ優先（デモ用途）
- エラーメッセージ: 日本語

---

## プラットフォーム未接続時のフォールバック

全画面でプラットフォーム未接続時に正常動作することを保証する:

- API Route 内でモックデータフォールバック実装
- 環境変数未設定時の適切なデフォルト動作
- 接続状態を UI に表示（「デモモード」バッジ等）
- チャット型画面の AI 応答も未接続時にサンプル応答を返す
- エラー画面ではなく機能制限付きで正常動作

---

## 引数の説明

### 画面名

- 個別の画面名を指定: `dashboard`, `analysis` 等
- `all` を指定: CLAUDE.md に定義された全画面を順次作成/更新

### 実行例

```
/demo-builder all          # 全画面を一括生成
/demo-builder dashboard    # 特定の画面のみ生成
```

---

## 注意事項

- CLAUDE.md の `## 2. Demo Web App Specification` が未設定（`__VARIABLE__` プレースホルダーが残っている）場合はエラーを表示し、`/setup` の実行を促す
- 既存画面の更新時は、現在の実装を `Read` で確認してから差分変更する
- 新しい npm パッケージが必要な場合は、追加前にユーザーに確認する
- 生成後は `npm run build` でビルド確認を行う
