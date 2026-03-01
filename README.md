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
| テンプレートがプラットフォーム固定 | テンプレート変数（`{{PLATFORM_NAME}}` 等）であらゆるスタックに対応 |

---

## Directory Structure

```
{{PROJECT_SLUG}}/                      # "Use this template" で生成したリポジトリ
  README.md                            # 本ファイル
  arcadia.md                           # 設計思想・テンプレート変数リファレンス
  guides/
    00-overview.md                     # 7 フェーズワークフロー概要
    01-kickoff.md                      # プロジェクト初期化ガイド
    02-research.md                     # (Phase 1) RFP 分析ガイド
    03-strategy.md                     # (Phase 2) 提案戦略ガイド
    04-design.md                       # (Phase 3) アーキテクチャ・移行計画
    05-estimation.md                   # (Phase 4) 見積ガイド
    06-proposal.md                     # (Phase 5) 提案書作成
    07-demo.md                         # (Phase 6) デモアプリ開発
    08-review.md                       # (Phase 7) 品質チェック・RFP 準拠確認
  .claude/
    CLAUDE.md.tmpl                     # Claude Code プロジェクト指示テンプレート
    settings.json.tmpl                 # Claude Code 設定テンプレート
    commands/
      setup.md                         # /setup カスタムコマンド（初期セットアップ）
    skills/
      rfp-auditor/                     # RFP 要件チェック Skill
      proposal-writer/                 # 提案書ドラフト Skill
      estimation-advisor/              # 見積支援 Skill
      demo-builder/                    # デモアプリ生成 Skill
  platform/
    cloud/                             # クラウドインフラテンプレート
      aws/                             # AWS 固有設定
      gcp/                             # GCP 固有設定
      other/                           # その他プロバイダー（Azure 等）
    data/                              # データ基盤テンプレート
      databricks/                      # Databricks 固有設定
      snowflake/                       # Snowflake 固有設定
      bigquery/                        # BigQuery 固有設定
      common/                          # プラットフォーム共通ベースライン
  templates/                           # 提案・ドキュメントテンプレート
  demo-app/                            # Next.js デモアプリボイラープレート
```

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
git clone https://github.com/your-org/{{PROJECT_SLUG}}.git
cd {{PROJECT_SLUG}}
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
3. RFP ドキュメント用のディレクトリ構造を作成（`docs/`、`RFP_answer/`、`src/` 等）
4. `.mcp.json`、`.gitignore`、`.env.example` を生成
5. `docs/rfp_answer_output/` にドキュメントテンプレートを配置

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

### MCP Servers

| MCP | 用途 | 必須 |
|-----|------|:---:|
| `context7` | ライブラリ・フレームワークのドキュメント検索 | Yes |
| `drawio` | アーキテクチャ図の生成・編集 | Yes |
| `aws-knowledge` | AWS ドキュメント参照（AWS 利用時） | No |
| `google-developer-knowledge` | GCP ドキュメント参照（GCP 利用時） | No |

---

## Principles

1. **Reproducibility** -- 同じ 7 フェーズに従うことで、どのチームでも一貫した成果を生み出せる
2. **Semi-automation** -- 戦略・意思決定は人間、分析・ドラフト・チェックは AI が担当
3. **Platform Independence** -- テンプレート変数でプラットフォーム固有の詳細を抽象化
4. **Claude Code-native** -- Claude Code のツールエコシステム（MCP、Skills、Agents）を前提に設計
5. **Evidence-based** -- 提案書のすべての記述は RFP 要件または参考資料に紐づく

---

## License

社内利用。組織の RFP 対応ワークフローに合わせて自由にカスタマイズしてください。
