<p align="center">
  <img src="assets/hero-banner.png" alt="ARCADIA" width="100%" />
</p>

<h1 align="center">ARCADIA</h1>

<p align="center">
  <strong>AI-driven Requirement Comprehension & Automated Deliverable Integration Architecture</strong><br/>
  断片的なインプットから、提案のすべてをAIが組み上げる
</p>

---

RFP・議事録・既存資料・既存ソースなど、揃わないインプットからでも、提案書・システムアーキテクチャ・WBS/スケジュール・見積・デモアプリを、人 + Claude Code + MCP + Skills のセミオートで一貫生産するテンプレートリポジトリ。

> **本リポジトリはテンプレートリポジトリです。** GitHub の「Use this template」ボタンから新しいプロジェクトリポジトリを作成して使用してください。

---

## Why ARCADIA?

| 課題 | ARCADIA のアプローチ |
|------|---------------------|
| RFP 対応が属人的で工数がかかる | 分析から成果物までのセミオートパイプライン |
| ナレッジが個人に閉じている | 構造化ドキュメント + Claude Code による永続コンテキスト |
| 提案品質にばらつきがある | 再現可能な 7 フェーズワークフローとビルトインチェック |
| テンプレートがプラットフォーム固定 | テンプレート変数（`__PLATFORM_NAME__` 等）であらゆるスタックに対応 |

---

## Directory Structure

```
__PROJECT_SLUG__/                        # "Use this template" で生成したリポジトリ
  README.md                              # 本ファイル
  tasks.md                               # タスクトラッカー（手書き / Skill / Claude 自動）
  guides/
    00-overview.md                       # 7 フェーズワークフロー概要
    01-kickoff.md                        # プロジェクト初期化ガイド（テンプレート変数一覧あり）
    02-research.md                       # (Phase 1) RFP 分析ガイド
    03-strategy.md                       # (Phase 2) 提案戦略ガイド
    04-design.md                         # (Phase 3) アーキテクチャ・移行計画
    05-estimation.md                     # (Phase 4) 見積ガイド
    06-proposal.md                       # (Phase 5) 提案書作成
    07-demo.md                           # (Phase 6) デモアプリ開発
    08-review.md                         # (Phase 7) 品質チェック・RFP 準拠確認
  .claude/
    CLAUDE.md                            # Claude Code プロジェクト指示（/setup で .tmpl から生成）
    settings.json                        # Claude Code 設定（/setup で .tmpl から生成）
    commands/
      setup.md                           # /setup カスタムコマンド（初期セットアップ）
    skills/
      rfp-auditor/                       # RFP 要件チェック Skill
      proposal-writer/                   # 提案書ドラフト Skill
      estimation-advisor/                # 見積支援 Skill
      demo-builder/                      # デモアプリ生成 Skill
      data-import/                       # 資料取込・自動分類 Skill
      task-tracker/                      # タスク起票 Skill
      task-process/                      # タスク処理・トリアージ Skill
      nanobanana/                        # AI 画像生成 Skill（Gemini）
  templates/
    .mcp.json.tmpl                       # MCP 設定テンプレート
    env-example.tmpl                     # 環境変数テンプレート
    docs/                                # 提案ドキュメントテンプレート
      proposal-strategy.md.tmpl
      proposal-items-checklist.md.tmpl
      estimation-policy.md.tmpl
      rfp-analysis.md.tmpl
      architecture-plan/
        architecture-policy.md.tmpl
  input/                                 # 資料投入口（全種別対応 → data-import で自動分類）
  org-data/                              # 組織固有データ（単価表・サービスカタログ等）
    rate-card.md                         # 人月単価・値引基準
    service-catalog.md                   # サービス仕様・差別化ポイント
    company-profile.md                   # 会社概要・導入実績
    whitepapers/index.md                 # ホワイトペーパー索引
  demo-app/                              # Next.js デモアプリボイラープレート
  tmp/                                     # AI 作業用一時ディレクトリ（中身は Git 管理外）
  platform/
    cloud/                               # クラウドインフラテンプレート（aws/ gcp/ other/）
    data/                                # データ基盤テンプレート（databricks/ snowflake/ bigquery/ common/）
  assets/                                # README 用画像等
```

### `input/` — 統合資料投入口

`input/` はプロジェクトに取り込むすべての資料の投入口。`data-import` スキルがファイル名・内容から自動分類し、`source/`（案件固有）または `org-data/`（組織横断）の適切な場所に振り分ける。

| 投入できる資料 | 分類先 |
|-------------|-------|
| RFP 本体・別紙・仕様書 | `source/rfp.md` / `source/rfp_reference/` |
| 議事録・ヒアリングメモ | `source/minutes/` |
| Q&A・質問回答書 | `source/rfp_reference/qa/` |
| RFP 正誤表・修正版 | `source/rfp_reference/amendments/` |
| 現行システム設計書・技術仕様 | `source/rfp_reference/specs/` |
| 見積関連資料 | `source/rfp_reference/estimation/` |
| 単価表・原価表 | `org-data/rate-card.md` を更新 |
| サービスカタログ・製品資料 | `org-data/service-catalog.md` を更新 |
| 会社概要・導入実績 | `org-data/company-profile.md` を更新 |
| ホワイトペーパー・技術資料 | `org-data/whitepapers/` |

> **手動振り分けも可能**: `input/org-data/` または `input/source/` サブフォルダにファイルを配置すると、振り分け先を明示指定できる。詳細は `data-import` スキル（`.claude/skills/data-import/SKILL.md`）を参照。

---

## 7 Phases at a Glance

| # | Phase | 内容 | 主な成果物 | 人/AI |
|---|-------|------|-----------|-------|
| 1 | **Research** | RFP 分析、参考資料カタログ作成 | docs-catalog.md、要件チェックリスト | 20/80 |
| 2 | **Strategy** | 提案戦略策定、スコープ定義 | proposal-strategy.md、スコープマトリクス | 60/40 |
| 3 | **Design** | アーキテクチャ設計、移行計画 | アーキテクチャ図、ADR、移行計画 | 40/60 |
| 4 | **Estimation** | 工数・コスト算出 | estimation-policy.md、コスト内訳 | 50/50 |
| 5 | **Proposal** | 提案書作成（複数巻） | PPTX 提案書、Excel 回答シート | 40/60 |
| 6 | **Demo** | デモアプリ + データ基盤構築 | Web アプリ、プラットフォームスクリプト | 20/80 |
| 7 | **Review** | RFP 準拠確認、品質保証 | 監査レポート、ギャップ分析 | 10/90 |

---

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) がインストール・設定済みであること
- MCP サーバー: `context7`、`drawio`（最低限）

### 1. テンプレートからリポジトリを作成

GitHub 上で本リポジトリの **「Use this template」** ボタンをクリックし、新しいプロジェクトリポジトリを作成します。

```bash
# 作成したリポジトリをクローン
git clone https://github.com/your-org/__PROJECT_SLUG__.git
cd __PROJECT_SLUG__
```

### 2. `/setup` カスタムコマンドでプロジェクトを初期化

Claude Code を起動し、**`/setup` カスタムコマンド**を実行します。

```bash
# Claude Code を起動
claude
```

```
# Claude Code 内で /setup を実行（引数なしで対話的に確認）
/setup

# または、プロジェクト情報を引数として渡す
/setup クライアント名: ABC銀行, 提案主体: XYZ株式会社, 案件概要: 次世代DWH刷新, ...
```

`/setup` コマンドが以下を自動実行します:

1. テンプレート変数の対話的な入力（クライアント名、プラットフォーム、提出期限など）
2. `.claude/CLAUDE.md.tmpl` からプロジェクト固有の `CLAUDE.md` を生成
3. RFP ドキュメント用のディレクトリ構造を作成（`source/`、`output/` 等）
4. `.mcp.json`、`.gitignore`、`.env.example` を生成
5. `output/plan/` にドキュメントテンプレートを配置

#### セットアップで生成されるディレクトリ

`/setup` 実行後、以下のディレクトリとファイルがプロジェクトルートに作成されます（`demo-app/` と `platform/` はテンプレートに同梱済み）:

```
source/                                   # RFP 関連ドキュメント（セットアップで生成）
  rfp_reference/                          #   RFP 参考資料・別紙・仕様書の格納先
  minutes/                                #   議事録・ヒアリングメモの格納先
output/                                   # 提案成果物（セットアップで生成）
  plan/                                   #   各フェーズの中間成果物
    rfp-analysis.md                       #     RFP 分析結果
    proposal-strategy.md                  #     提案戦略
    proposal-items-checklist.md           #     提案項目チェックリスト
    estimation-policy.md                  #     見積方針
    architecture-plan/                    #     アーキテクチャ設計ドキュメント
      architecture-policy.md              #       アーキテクチャ方針・ADR
    migration-plan/                       #     移行計画ドキュメント
demo-app/                                 # Next.js デモアプリ（テンプレート同梱済み）
platform/                                 # データ基盤・クラウド環境（テンプレート同梱済み）
```

| ディレクトリ | 用途 | 対応フェーズ |
|-------------|------|-------------|
| `source/rfp_reference/` | RFP 本体・別紙・仕様書などの原典資料を格納 | Phase 1 (Research) |
| `source/minutes/` | クライアントとの打ち合わせ議事録・ヒアリングメモ | 全フェーズ |
| `output/` | 最終提出する提案書（PPTX）、回答シート（Excel）等 | Phase 5 (Proposal) |
| `output/plan/` | 分析結果・戦略・設計・見積など各フェーズの中間成果物 | Phase 1–5 |
| `demo-app/` | デモアプリのソースコード（Next.js App Router + TypeScript） | Phase 6 (Demo) |
| `platform/` | データ基盤のセットアップスクリプト・インフラ設定 | Phase 6 (Demo) |
| `tmp/` | AI（Claude Code）の作業用一時ディレクトリ。中間ファイル生成等に使用。中身は Git 管理外 | 全フェーズ |

また、以下の設定ファイルも自動生成されます:

| ファイル | 用途 |
|---------|------|
| `.claude/CLAUDE.md` | プロジェクト固有の Claude Code 指示ファイル（テンプレート変数を適用済み） |
| `.mcp.json` | MCP サーバー接続設定 |
| `.env.example` | 環境変数のテンプレート（`PLATFORM_HOST`、`PLATFORM_TOKEN` 等） |

> **詳細**: `guides/01-kickoff.md` に完全なセットアップ手順（org-data の準備、プラットフォーム選定、RFP ドキュメント配置など）を記載しています。

---

## Claude Code Tool Ecosystem

ARCADIA は Claude Code の**カスタムコマンド**、**Skills**、**MCP サーバー**を組み合わせて動作します。

### Custom Commands

`.claude/commands/` に定義されたコマンドは、Claude Code 内で `/<コマンド名>` で呼び出せます。

| コマンド | 用途 | 定義ファイル |
|---------|------|-------------|
| `/setup` | プロジェクト初期セットアップ（テンプレート変数の適用、ディレクトリ・設定ファイル生成） | `.claude/commands/setup.md` |

### Skills

`.claude/skills/` に定義された再利用可能なドメイン知識です。Claude Code が各フェーズで自動的に参照します。

| Skill | 用途 | 主な利用フェーズ |
|-------|------|----------------|
| `rfp-auditor` | RFP 要件チェック・コンプライアンス監査 | 1, 2, 7 |
| `proposal-writer` | 提案書ドラフト作成支援 | 2, 5 |
| `estimation-advisor` | 見積・WBS 生成支援 | 4 |
| `demo-builder` | デモアプリ画面生成 | 6 |
| `data-import` | 資料取込・自動分類（`input/` → `source/` or `org-data/`） | 1 |
| `task-tracker` | タスク・検討事項の起票（`/task-add`） | 全フェーズ |
| `task-process` | 蓄積タスクのトリアージ・対話的処理（`/task-process`） | 全フェーズ |
| `nanobanana` | AI 画像生成・編集（Gemini、図表・スライド向け） | 5, 6 |
| `example-skills` | フロントエンドデザイン、ドキュメント共著、Web アプリテスト、PDF/PPTX/DOCX/XLSX 生成 | 5, 6 |
| `document-skills` | ドキュメント生成（example-skills ファミリー） | 5 |

### MCP Servers

| MCP | 用途 | 必須 |
|-----|------|:---:|
| `context7` | ライブラリ・フレームワークのドキュメント検索 | Yes |
| `drawio` | アーキテクチャ図の生成・編集 | Yes |
| `aws-knowledge` | AWS ドキュメント参照（AWS 利用時） | No |
| `google-developer-knowledge` | GCP ドキュメント参照（GCP 利用時） | No |

### Task Tracking

プロジェクトルートの `tasks.md` で、提案策定中に発生するタスク・検討事項・課題を一元管理します。

#### 起票方法（3パターン）

| 方法 | やり方 |
|------|-------|
| **手書き** | `tasks.md` の `## Open` セクションにタイトルと説明を直接書く（メタデータは Claude が自動補完） |
| **スキル経由** | Claude Code で `/task-add セキュリティ要件の確認` |
| **Claude 自動** | 会話中に検討事項を発見すると Claude が自動登録＆通知 |

手書きの場合、最小限これだけで起票できます:

```markdown
### TASK-1: RFP要件3.2.1の解釈を確認する

クライアントに確認が必要。複数の読み方がありえる。
```

#### 蓄積タスクの処理

```
/task-process          # ダッシュボード表示
/task-process --triage # 優先度の一括見直し
/task-process TASK-5   # 特定タスクを対話的に処理
```

---

## Principles

1. **Reproducibility** -- 同じ 7 フェーズに従うことで、どのチームでも一貫した成果を生み出せる
2. **Semi-automation** -- 戦略・意思決定は人間、分析・ドラフト・チェックは AI が担当
3. **Platform Independence** -- テンプレート変数（`__VARIABLE__`）でプラットフォーム固有の詳細を抽象化
4. **Claude Code-native** -- Claude Code のツールエコシステム（MCP、Skills、Agents）を前提に設計
5. **Evidence-based** -- 提案書のすべての記述は RFP 要件または参考資料に紐づく
6. **Dual-axis Information** -- 顧客/RFP 情報（`source/`）と組織固有情報（`org-data/`）を二軸で管理し、Skills が両軸を横断参照

---

## Design Patterns

ARCADIA に組み込まれている主要なデザインパターン。

### Three-Layer Structure: Strategy → Checklist → Deliverable

```
proposal-strategy.md          -- WHY: Win themes, differentiators, risk mitigation
  ↓
proposal-items-checklist.md   -- WHAT: Every required deliverable item, status-tracked
  ↓
Vol{N}-{topic}.pptx           -- HOW: Actual proposal documents
estimation-policy.md          -- HOW: Cost breakdown with rationale
```

各レイヤーは上位を参照。戦略変更はチェックリスト→成果物へカスケードする。

### Evidence-based Verification

`rfp-auditor` Skill による体系的検証: 要件抽出→成果物マッピング→MATCH / MISMATCH / MISSING 判定→カバレッジレポート。

### Phased Delivery (Ph1/Ph2)

- **Ph1**: 必須スコープ、確定価格
- **Ph2**: 拡張機能、参考価格

### Mock-first Demo

1. ドメインに合ったサンプルデータを定義
2. 全画面をモックデータで実装
3. プラットフォーム API を接続
4. API 未接続時はモックにフォールバック

---

## File Naming Conventions

| パターン | 例 | 用途 |
|---------|---|------|
| `{topic}.md` | `proposal-strategy.md` | 戦略・方針ドキュメント |
| `{topic}-checklist.md` | `proposal-items-checklist.md` | トラッカブルなチェックリスト |
| `{prefix}-{topic}.drawio` | `logical-architecture-ph1.drawio` | アーキテクチャ図 |
| `ph{n}-{seq}-{topic}.drawio` | `ph1-01-current-system.drawio` | フェーズ別設計図 |
| `Vol{N}-{topic}.pptx` | `Vol1-overview.pptx` | 提案書（PPTX 方式） |
| `Vol{N}-{topic}/slide-{NN}.png` | `Vol1-overview/slide-01.png` | 提案書（NanoBanana 方式） |
