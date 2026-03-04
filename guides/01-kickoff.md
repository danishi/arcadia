# プロジェクトキックオフガイド

ARCADIAテンプレートリポジトリとClaude Codeを使用して、新しいRFP回答プロジェクトを初期化する手順を説明する。

---

## 前提条件

- [ ] [Claude Code](https://docs.anthropic.com/en/docs/claude-code) がインストール・認証済みであること
- [ ] MCPサーバーが設定済みであること: `context7`, `drawio`（最低限）
- [ ] Git がインストール済みであること
- [ ] RFPドキュメントが入手済みであること（PDF/Word/Excel/Markdown）
- [ ] クライアント・案件情報が整理済みであること
- [ ] 組織データが準備済みであること（`arcadia/org-data/` -- Step 1.5 参照）

---

## Step 1: テンプレートからリポジトリを作成

GitHub 上で ARCADIA テンプレートリポジトリの **「Use this template」** ボタンをクリックし、新しいプロジェクトリポジトリを作成します。

```bash
# 作成したリポジトリをクローン
git clone https://github.com/your-org/__PROJECT_SLUG__.git
cd __PROJECT_SLUG__
```

> **Note**: ディレクトリ構造の作成は Step 2 の `/setup` コマンド（Step 1）が自動で行います。手動で作成する必要はありません。

### 標準ディレクトリ構造

```
__PROJECT_SLUG__/
  source/
    rfp.md                              # RFP本紙（Markdownに変換済み）
    rfp_reference/                      # 参照資料群
    minutes/                            # 議事録
  output/                               # 提案成果物（PPTX, XLSX, 中間成果物）
    plan/                               # 中間成果物
      proposal-strategy.md
      proposal-items-checklist.md
      estimation-policy.md
      architecture-plan/
      migration-plan/
  demo-app/                             # デモアプリ（Next.js）
  .claude/
    CLAUDE.md                           # プロジェクト指示書（.tmpl から生成）
    settings.json                       # Claude Code設定（.tmpl から生成）
    skills/                             # スキル（テンプレートから同梱）
  guides/                               # ARCADIAフェーズガイド（テンプレートから同梱）
  demo-app-spec.md                      # デモアプリ仕様書
```

---

## Step 1.5: 組織データの準備

ARCADIA の提案・見積スキルは、RFP（顧客側の情報）に加えて**自社固有の情報**も参照する。
`org-data/` 配下のファイルを自社の情報で整備する。

#### 方法 A: 直接編集（初回セットアップ時に推奨）

```bash
# org-data の各ファイルを自社情報で編集
vi org-data/rate-card.md          # 人月単価（ロール別・値引基準）
vi org-data/service-catalog.md    # 自社サービスカタログ
vi org-data/company-profile.md    # 会社概要・導入実績
vi org-data/whitepapers/index.md  # ホワイトペーパー索引
```

#### 方法 B: `input/` 経由で取り込み（既存資料がある場合に推奨）

既に単価表やサービスカタログなどのファイルがある場合は `input/` に配置して `data-import` スキルで自動分類・取り込みができる。

```bash
# 既存の組織資料を input/ に配置
cp 単価表_2026Q1.xlsx input/
cp サービスカタログ_v3.pdf input/
cp ホワイトペーパー_AI活用.pdf input/
```

```
# Claude Code で data-import を実行
/data-import org-data
```

> ファイル名のキーワード（「単価」「サービス」「会社概要」「ホワイトペーパー」等）から自動的に `org-data/` 配下の適切な場所に振り分けられる。詳細は `.claude/skills/data-import/SKILL.md` を参照。

| ファイル | 内容 | 必須 | 参照先スキル |
|---------|------|:---:|-------------|
| `rate-card.md` | 人月単価、原価率、値引基準 | Yes | estimation-advisor |
| `service-catalog.md` | サービス仕様、差別化ポイント | Yes | proposal-writer |
| `company-profile.md` | 会社概要、導入実績、資格 | Yes | proposal-writer |
| `whitepapers/index.md` | 技術資料の索引 | No | proposal-writer, estimation-advisor |

> **初回のみ**: org-data は組織で一度整備すれば、以降のプロジェクトで再利用できる。
> 四半期ごとに単価・実績を更新することを推奨する。
> 詳細は `org-data/README.md` を参照。

---

## Step 2: Claude Codeによる対話型セットアップ

Claude Codeを起動し、setupコマンドを実行する:

```
claude
```

次に `/setup` コマンドをプロジェクト情報とともに実行する:

```
/setup
クライアント名: ABC銀行
提案主体: XYZ株式会社
案件概要: 次世代DWH・MAプラットフォーム刷新
提案製品: Snowflake Data Cloud
プラットフォーム: Snowflake
プラットフォーム種別: Cloud Data Warehouse
クラウド: AWS
提出期限: 2026-03-15
プレゼン日: 2026-03-20
現行システム: Teradata + SAS
デモコンセプト: SQLなしで、データと会話しよう
```

> **Note**: 引数なしで `/setup` を実行すると、対話的に各項目を確認します。

Claude Codeは以下を実行する:
1. 標準ディレクトリ構造を作成する（`source/`, `output/`, `demo-app/` 等）
2. `.claude/CLAUDE.md.tmpl` からテンプレートを読み取り `.claude/CLAUDE.md` を生成する
3. `.claude/settings.json.tmpl` から `.claude/settings.json` を生成する
4. `.mcp.json`, `.env.example` を生成する
5. プロジェクト変数を適用したドキュメントテンプレートを `output/plan/` に配置する

### 変数クイックリファレンス

| 変数 | 必須 | 説明 |
|------|------|------|
| `__CLIENT_NAME__` | Yes | クライアント組織名 |
| `__PROPOSER_NAME__` | Yes | 自社名（提案主体） |
| `__PARTNER_NAMES__` | No | パートナー名（カンマ区切り） |
| `__PROJECT_DESCRIPTION__` | Yes | 案件概要（1行） |
| `__PROPOSED_PRODUCTS__` | Yes | 提案する製品/プラットフォーム |
| `__PLATFORM_NAME__` | Yes | 技術プラットフォーム名 |
| `__PLATFORM_TYPE__` | Yes | "Cloud Data Warehouse" / "Lakehouse" / "Data Platform" |
| `__CLOUD_PROVIDER__` | Yes | "AWS" / "Azure" / "GCP" |
| `__DEADLINE__` | Yes | 提出期限（YYYY-MM-DD） |
| `__PRESENTATION_DATE__` | No | プレゼンテーション日（YYYY-MM-DD） |
| `__PROJECT_SLUG__` | 自動 | ディレクトリ名に使えるプロジェクトID |
| `__DEMO_CONCEPT__` | No | デモアプリのワンライナー |
| `__CURRENT_SYSTEM__` | No | 置き換え対象の現行システム |

---

## Step 3: ドキュメントの配置

RFP・参考資料・議事録など、案件に関するすべての資料を取り込む。

#### 方法 A: `input/` + `data-import`（推奨）

すべての資料を `input/` に配置し、`data-import` スキルで自動分類する。RFP 本体、別紙、議事録、技術仕様書などファイル種別を問わず投入できる。

```bash
# すべての資料を input/ に配置
cp /path/to/rfp-document.pdf input/
cp /path/to/reference-docs/* input/
cp /path/to/議事録_0301.md input/
cp /path/to/現行システム設計書.pdf input/
```

```
# Claude Code で data-import を実行（自動分類）
/data-import
```

#### 方法 B: 直接配置

ファイルの配置先が明確な場合は、直接コピーしてもよい。

```bash
# RFP 本体
cp /path/to/rfp-document.pdf source/

# 参考資料（既存のフォルダ構成を維持）
cp -r /path/to/reference-docs/* source/rfp_reference/

# 議事録
cp /path/to/議事録_0301.md source/minutes/
```

### 対応ドキュメント形式

| 形式 | 取り扱い |
|------|----------|
| PDF | Claude Codeで直接読み取り可能 |
| Word (.docx) | Markdownに変換するとベスト |
| Excel (.xlsx/.xlsm) | Claude Codeで直接読み取り可能; 大容量ファイルはCSVエクスポートを検討 |
| PowerPoint (.pptx) | Markdownに変換するか、主要コンテンツを抽出 |
| Markdown (.md) | ネイティブ形式、変換不要 |
| 画像 (.png/.jpg) | Claude Codeで直接読み取り可能（図面、スクリーンショット） |

### 推奨: RFPのMarkdown変換

```
RFPのPDFをMarkdownに変換して source/rfp.md に保存して
```

---

## Step 4: 要件チェックリストの生成

Claude CodeにRFPの分析と初期チェックリストの生成を指示する:

```
source/rfp.md を読んで、RFP要件チェックリストを生成して。
出力先: .claude/skills/rfp-auditor/references/rfp-requirements-checklist.md
```

Claude Codeは以下を実行する:
1. RFPドキュメントを解析する
2. 明示的・暗黙的な要件をすべて抽出する
3. カテゴリ別に分類する（機能、非機能、コンプライアンス等）
4. 要件IDを付与した構造化チェックリストを生成する
5. `rfp-auditor` スキルの references ディレクトリに保存する

### チェックリスト形式

```markdown
| ID | カテゴリ | 要件 | 優先度 | ステータス |
|----|----------|------|--------|-----------|
| R-001 | 機能 | ... | 必須 | 未対応 |
| R-002 | 非機能 | ... | 必須 | 未対応 |
```

---

## Step 5: ドキュメントカタログの生成

```
source/rfp_reference/ 配下の全ファイルを解析して docs-catalog.md を生成して。
各ファイルについて: パス、種類、ページ数/行数、主要な内容を記録して。
```

Claude Codeは以下を実行する:
1. `source/rfp_reference/` 内の全ファイルをスキャンする
2. 各ドキュメントを読み取り・要約する
3. メタデータ付きのカタログを生成する
4. `.claude/skills/rfp-auditor/references/docs-catalog.md` に保存する

---

## 次のステップ

キックオフ（`/setup`）完了後:

1. **生成ファイルの確認:** `/setup` が生成したファイル一覧を確認する
2. **RFPドキュメントの配置:** Step 3 に従い RFP ドキュメントを配置する
3. **Phase 1（調査）の開始:** `guides/02-research.md を読んでRFP解析を開始して`
4. **MCPの設定:** 必要に応じて `.mcp.json` にAPIキーやプラットフォーム固有のMCPサーバーを追加する

---

## トラブルシューティング

| 問題 | 解決策 |
|------|--------|
| Claude CodeでPDFが読めない | PDFサポートをインストールするか、Markdownに変換する |
| MCPサーバーが利用できない | `claude mcp list` を確認して再設定する |
| テンプレート変数が置換されていない | Step 2を再実行する; `.claude/CLAUDE.md` に `__` プレースホルダーが残っていないか確認する |
| スキルが読み込まれない | `.claude/skills/{name}/SKILL.md` が存在するか確認する |
