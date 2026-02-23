# Project Kickoff Guide

This guide walks you through initializing a new RFP response project using ARCADIA and Claude Code.

---

## Prerequisites

- [ ] [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated
- [ ] MCP servers configured: `context7`, `drawio` (minimum)
- [ ] Git installed
- [ ] RFP documents available (PDF/Word/Excel/Markdown)
- [ ] Client and project information ready

---

## Step 1: Create Repository and Copy ARCADIA

```bash
# Create project repository
mkdir {{PROJECT_SLUG}} && cd {{PROJECT_SLUG}}
git init

# Copy ARCADIA framework
cp -r /path/to/arcadia ./arcadia

# Create standard directory structure
mkdir -p docs/rfp_reference \
         docs/rfp_answer_output/architecture-plan \
         docs/rfp_answer_output/migration-plan \
         docs/minutes \
         RFP_answer \
         src \
         platform \
         .claude/skills
```

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
    CLAUDE.md                           # Project instructions (generated)
    settings.json                       # Claude Code settings (generated)
    skills/                             # Project-local skills
  arcadia/                              # ARCADIA framework (reference)
  demo-app-spec.md                      # Demo app specification
```

---

## Step 2: Interactive Variable Setup with Claude Code

Start Claude Code and have it generate your project configuration.

```
claude
```

Then instruct:

```
arcadia/.claude/CLAUDE.md.tmpl を読んで、以下の情報でプロジェクトのCLAUDE.mdを生成して:

- クライアント名: [client name]
- 提案主体: [your company]
- 共同提案: [partner companies]
- 案件概要: [project description]
- 提案製品: [product name]
- プラットフォーム: [platform name]
- クラウド: [AWS/Azure/GCP]
- 提出期限: [YYYY-MM-DD]
- プレゼン日: [YYYY-MM-DD]
- 現行システム: [systems being replaced]
- デモコンセプト: [one-liner for demo app]
```

Claude Code will:
1. Read the template from `arcadia/.claude/CLAUDE.md.tmpl`
2. Replace all `{{VARIABLE}}` placeholders with your values
3. Write the result to `.claude/CLAUDE.md`
4. Generate `.claude/settings.json` from `arcadia/.claude/settings.json.tmpl`

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

Choose the data platform that matches your proposal. This determines which platform-specific configurations, skills, and MCP servers to enable.

### Option A: Databricks

```
arcadia/data-platform/databricks/ の設定をプロジェクトに適用して
```

| Setting | Value |
|---------|-------|
| `PLATFORM_NAME` | Databricks |
| `PLATFORM_TYPE` | Lakehouse |
| Skills | databricks-*, spark-*, mlflow-* |
| MCP | aws-knowledge (if on AWS) |
| Demo env vars | DATABRICKS_HOST, DATABRICKS_TOKEN, DATABRICKS_WAREHOUSE_ID |

### Option B: Snowflake

```
arcadia/data-platform/snowflake/ の設定をプロジェクトに適用して
```

| Setting | Value |
|---------|-------|
| `PLATFORM_NAME` | Snowflake |
| `PLATFORM_TYPE` | Cloud Data Warehouse |
| Skills | (add Snowflake-specific skills) |
| Demo env vars | SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, SNOWFLAKE_WAREHOUSE |

### Option C: BigQuery

```
arcadia/data-platform/bigquery/ の設定をプロジェクトに適用して
```

| Setting | Value |
|---------|-------|
| `PLATFORM_NAME` | BigQuery |
| `PLATFORM_TYPE` | Cloud Data Warehouse |
| Skills | (add BigQuery-specific skills) |
| MCP | google-developer-knowledge |
| Demo env vars | GCP_PROJECT_ID, BQ_DATASET |

### Option D: Other / Generic

```
arcadia/data-platform/generic/ の設定をプロジェクトに適用して
```

Use the generic baseline and add platform-specific configurations manually.

---

## Next Steps

After completing kickoff:

1. **Start Phase 1 (Research):** `arcadia/guides/02-research.md を読んでRFP解析を開始して`
2. **Review generated files:** Check `.claude/CLAUDE.md` and `.claude/settings.json`
3. **Set up skills:** Copy skill templates from `arcadia/skills/` to `.claude/skills/`
4. **Configure MCP:** Add platform-specific MCP servers to settings.json

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Claude Code cannot read PDF | Install PDF support or convert to Markdown |
| MCP server not available | Check `claude mcp list` and reconfigure |
| Template variables not replaced | Re-run Step 2; check `.claude/CLAUDE.md` for remaining `{{` |
| Skills not loading | Verify `.claude/skills/{name}/SKILL.md` exists |
