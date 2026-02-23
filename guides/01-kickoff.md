# Project Kickoff Guide

This guide walks you through initializing a new RFP response project using the ARCADIA テンプレートリポジトリ and Claude Code.

---

## Prerequisites

- [ ] [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated
- [ ] MCP servers configured: `context7`, `drawio` (minimum)
- [ ] Git installed
- [ ] RFP documents available (PDF/Word/Excel/Markdown)
- [ ] Client and project information ready
- [ ] Organization data prepared (`arcadia/org-data/` -- see Step 1.5)

---

## Step 1: テンプレートからリポジトリを作成

GitHub 上で ARCADIA テンプレートリポジトリの **「Use this template」** ボタンをクリックし、新しいプロジェクトリポジトリを作成します。

```bash
# 作成したリポジトリをクローン
git clone https://github.com/your-org/{{PROJECT_SLUG}}.git
cd {{PROJECT_SLUG}}
```

> **Note**: ディレクトリ構造の作成は Step 2 の `/project:setup` コマンドが自動で行います。手動で作成する必要はありません。

### Standard Directory Structure

```
{{PROJECT_SLUG}}/
  docs/
    rfp.md                              # RFP main document (converted to Markdown)
    rfp_reference/                      # Original reference documents
    rfp_answer_output/                  # Intermediate deliverables
      proposal-strategy.md
      proposal-items-checklist.md
      estimation-policy.md
      architecture-plan/
      migration-plan/
    minutes/                            # Meeting notes
  RFP_answer/                           # Final deliverables (PPTX, XLSX)
  src/                                  # Demo app (Next.js)
  platform/                             # Platform setup scripts
  .claude/
    CLAUDE.md                           # Project instructions (generated from .tmpl)
    settings.json                       # Claude Code settings (generated from .tmpl)
    skills/                             # Skills (included from template)
  guides/                               # ARCADIA phase guides (included from template)
  demo-app-spec.md                      # Demo app specification
```

---

## Step 1.5: Prepare Organization Data

ARCADIA の提案・見積スキルは、RFP（顧客側の情報）に加えて**自社固有の情報**も参照する。
`arcadia/org-data/` 配下のファイルを自社の情報で整備する。

```bash
# org-data の各ファイルを自社情報で編集
vi arcadia/org-data/rate-card.md          # 人月単価（ロール別・値引基準）
vi arcadia/org-data/service-catalog.md    # 自社サービスカタログ
vi arcadia/org-data/company-profile.md    # 会社概要・導入実績
vi arcadia/org-data/whitepapers/index.md  # ホワイトペーパー索引
```

| ファイル | 内容 | 必須 | 参照先スキル |
|---------|------|:---:|-------------|
| `rate-card.md` | 人月単価、原価率、値引基準 | Yes | estimation-advisor |
| `service-catalog.md` | サービス仕様、差別化ポイント | Yes | proposal-writer |
| `company-profile.md` | 会社概要、導入実績、資格 | Yes | proposal-writer |
| `whitepapers/index.md` | 技術資料の索引 | No | proposal-writer, estimation-advisor |

> **初回のみ**: org-data は組織で一度整備すれば、以降のプロジェクトで再利用できる。
> 四半期ごとに単価・実績を更新することを推奨する。
> 詳細は `arcadia/org-data/README.md` を参照。

---

## Step 2: Interactive Variable Setup with Claude Code

Start Claude Code and run the setup command:

```
claude
```

Then run the `/project:setup` command with project information:

```
/project:setup
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

> **Note**: 引数なしで `/project:setup` を実行すると、対話的に各項目を確認します。

Claude Code will:
1. Create the standard directory structure (`docs/`, `RFP_answer/`, `src/`, etc.)
2. Read the template from `.claude/CLAUDE.md.tmpl` and generate `.claude/CLAUDE.md`
3. Generate `.claude/settings.json` from `.claude/settings.json.tmpl`
4. Generate `.mcp.json`, `.gitignore`, `.env.example`
5. Place document templates in `docs/rfp_answer_output/` with project variables applied

### Variable Quick Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `{{CLIENT_NAME}}` | Yes | Client organization name |
| `{{PROPOSER_NAME}}` | Yes | Your company name |
| `{{PARTNER_NAMES}}` | No | Comma-separated partner names |
| `{{PROJECT_DESCRIPTION}}` | Yes | One-line project scope |
| `{{PROPOSED_PRODUCTS}}` | Yes | Product/platform being proposed |
| `{{PLATFORM_NAME}}` | Yes | Technical platform name |
| `{{PLATFORM_TYPE}}` | Yes | "Cloud Data Warehouse" / "Lakehouse" / "Data Platform" |
| `{{CLOUD_PROVIDER}}` | Yes | "AWS" / "Azure" / "GCP" |
| `{{DEADLINE}}` | Yes | Submission deadline (YYYY-MM-DD) |
| `{{PRESENTATION_DATE}}` | No | Presentation date (YYYY-MM-DD) |
| `{{PROJECT_SLUG}}` | Auto | Directory-safe project ID |
| `{{DEMO_CONCEPT}}` | No | Demo app one-liner |
| `{{CURRENT_SYSTEM}}` | No | Systems being replaced |

---

## Step 3: Place RFP Documents

Copy all RFP-related documents into the reference directory:

```bash
# Copy RFP main document
cp /path/to/rfp-document.pdf docs/

# Copy reference documents (maintain original folder structure if possible)
cp -r /path/to/reference-docs/* docs/rfp_reference/
```

### Supported Document Types

| Type | Handling |
|------|----------|
| PDF | Claude Code reads directly |
| Word (.docx) | Convert to Markdown for best results |
| Excel (.xlsx/.xlsm) | Claude Code reads directly; consider CSV export for large files |
| PowerPoint (.pptx) | Convert to Markdown or extract key content |
| Markdown (.md) | Native format, no conversion needed |
| Images (.png/.jpg) | Claude Code reads directly (diagrams, screenshots) |

### Recommended: Convert RFP to Markdown

```
RFPのPDFをMarkdownに変換して docs/rfp.md に保存して
```

---

## Step 4: Generate Requirements Checklist

Instruct Claude Code to analyze the RFP and generate the initial checklist:

```
docs/rfp.md を読んで、RFP要件チェックリストを生成して。
出力先: .claude/skills/rfp-auditor/references/rfp-requirements-checklist.md
```

Claude Code will:
1. Parse the RFP document
2. Extract all explicit and implicit requirements
3. Categorize them (functional, non-functional, compliance, etc.)
4. Generate a structured checklist with requirement IDs
5. Save to the rfp-auditor skill's references directory

### Checklist Format

```markdown
| ID | Category | Requirement | Priority | Status |
|----|----------|-------------|----------|--------|
| R-001 | Functional | ... | Must | Pending |
| R-002 | Non-functional | ... | Must | Pending |
```

---

## Step 5: Generate Document Catalog

```
docs/rfp_reference/ 配下の全ファイルを解析して docs-catalog.md を生成して。
各ファイルについて: パス、種類、ページ数/行数、主要な内容を記録して。
```

Claude Code will:
1. Scan all files in `docs/rfp_reference/`
2. Read and summarize each document
3. Generate a catalog with metadata
4. Save to `.claude/skills/rfp-auditor/references/docs-catalog.md`

---

## Platform Selection Guide

プラットフォームは **クラウドインフラ** と **データ基盤** の2軸で選定する。

### Step A: Cloud Provider Selection

```
platform/cloud/ を参照して、クラウドプロバイダーを選定して
```

| Option | Guide | Template Variable |
|--------|-------|------------------|
| **AWS** | `platform/cloud/aws/README.md` | `{{CLOUD_PROVIDER}}` = `AWS` |
| **GCP** | `platform/cloud/gcp/README.md` | `{{CLOUD_PROVIDER}}` = `GCP` |
| **Other** | `platform/cloud/other/README.md` | `{{CLOUD_PROVIDER}}` = (provider name) |

### Step B: Data Platform Selection

#### Option B-1: Databricks

```
platform/data/databricks/ の設定をプロジェクトに適用して
```

| Setting | Value |
|---------|-------|
| `PLATFORM_NAME` | Databricks |
| `PLATFORM_TYPE` | Lakehouse |
| Skills | databricks-*, spark-*, mlflow-* |
| MCP | aws-knowledge (if on AWS) |
| Demo env vars | DATABRICKS_HOST, DATABRICKS_TOKEN, DATABRICKS_WAREHOUSE_ID |

#### Option B-2: Snowflake

```
platform/data/snowflake/ の設定をプロジェクトに適用して
```

| Setting | Value |
|---------|-------|
| `PLATFORM_NAME` | Snowflake |
| `PLATFORM_TYPE` | Cloud Data Warehouse |
| Skills | (add Snowflake-specific skills) |
| Demo env vars | SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, SNOWFLAKE_WAREHOUSE |

#### Option B-3: BigQuery

```
platform/data/bigquery/ の設定をプロジェクトに適用して
```

| Setting | Value |
|---------|-------|
| `PLATFORM_NAME` | BigQuery |
| `PLATFORM_TYPE` | Cloud Data Warehouse |
| Skills | (add BigQuery-specific skills) |
| MCP | google-developer-knowledge |
| Demo env vars | GCP_PROJECT_ID, BQ_DATASET |

#### Option B-4: Other / Generic

```
platform/data/common/ の設定をプロジェクトに適用して
```

Use the generic baseline and add platform-specific configurations manually.

---

## Next Steps

After completing kickoff (`/project:setup`):

1. **Review generated files:** `/project:setup` が生成したファイル一覧を確認する
2. **Place RFP documents:** Step 3 に従い RFP ドキュメントを配置する
3. **Start Phase 1 (Research):** `guides/02-research.md を読んでRFP解析を開始して`
4. **Configure MCP:** 必要に応じて `.mcp.json` にAPIキーやプラットフォーム固有のMCPサーバーを追加する

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Claude Code cannot read PDF | Install PDF support or convert to Markdown |
| MCP server not available | Check `claude mcp list` and reconfigure |
| Template variables not replaced | Re-run Step 2; check `.claude/CLAUDE.md` for remaining `{{` |
| Skills not loading | Verify `.claude/skills/{name}/SKILL.md` exists |
