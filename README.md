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

| Challenge | ARCADIA's Answer |
|-----------|-----------------|
| RFP response is labor-intensive and error-prone | Semi-automated pipeline from analysis to deliverables |
| Knowledge is siloed in individuals | Structured docs + Claude Code as persistent context |
| Quality varies across proposals | Reproducible 7-phase workflow with built-in checks |
| Platform lock-in in templates | Template variables (`{{PLATFORM_NAME}}` etc.) for any stack |

---

## Directory Structure

```
{{PROJECT_SLUG}}/                      # "Use this template" で生成したリポジトリ
  README.md                            # This file
  arcadia.md                           # Design philosophy & template variable reference
  guides/
    00-overview.md                     # 7-phase workflow overview
    01-kickoff.md                      # Interactive project initialization guide
    02-research.md                     # (Phase 1) RFP analysis guide
    03-strategy.md                     # (Phase 2) Win strategy guide
    04-design.md                       # (Phase 3) Architecture & migration planning
    05-estimation.md                   # (Phase 4) Cost estimation guide
    06-proposal.md                     # (Phase 5) Proposal document creation
    07-demo.md                         # (Phase 6) Demo app development
    08-review.md                       # (Phase 7) Quality check & RFP compliance
  .claude/
    CLAUDE.md.tmpl                     # Claude Code project instructions template
    settings.json.tmpl                 # Claude Code settings template
    skills/
      rfp-auditor/                     # RFP requirement checker skill
      proposal-writer/                 # Proposal drafting skill
      estimation-advisor/              # Estimation assistant skill
      demo-builder/                    # Demo app scaffolding skill
  platform/
    cloud/                             # Cloud infrastructure templates
      aws/                             # AWS-specific infrastructure
      gcp/                             # GCP-specific infrastructure
      other/                           # Other providers (Azure, etc.)
    data/                              # Data platform templates
      databricks/                      # Databricks-specific configurations
      snowflake/                       # Snowflake-specific configurations
      bigquery/                        # BigQuery-specific configurations
      common/                          # Platform-agnostic baseline
  templates/                           # Proposal & documentation templates
  demo-app/                            # Next.js demo app boilerplate
```

---

## 7 Phases at a Glance

| # | Phase | Description | Key Deliverables | Human/AI |
|---|-------|------------|-----------------|----------|
| 1 | **Research** | RFP analysis, reference doc cataloging | docs-catalog.md, requirements checklist | 20/80 |
| 2 | **Strategy** | Win strategy, scope definition | proposal-strategy.md, scope matrix | 60/40 |
| 3 | **Design** | Architecture, migration planning | Architecture diagrams, ADRs, migration plan | 40/60 |
| 4 | **Estimation** | Effort & cost calculation | estimation-policy.md, cost breakdown sheets | 50/50 |
| 5 | **Proposal** | Document authoring (multi-volume) | PPTX volumes, Excel answer sheets | 40/60 |
| 6 | **Demo** | Demo app + data platform setup | Working web app, platform scripts | 20/80 |
| 7 | **Review** | RFP compliance verification | Audit report, gap analysis | 10/90 |

---

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed and configured
- MCP servers: `context7`, `drawio` (minimum)

### 1. テンプレートからリポジトリを作成

GitHub 上で本リポジトリの **「Use this template」** ボタンをクリックし、新しいプロジェクトリポジトリを作成します。

```bash
# 作成したリポジトリをクローン
git clone https://github.com/your-org/{{PROJECT_SLUG}}.git
cd {{PROJECT_SLUG}}
```

### 2. Claude Code でプロジェクトを初期化

```bash
# Claude Code を起動して:
#   "guides/01-kickoff.md を読んでプロジェクトを初期化して"
claude
```

Claude Code will walk you through an interactive setup:

1. Fill in template variables (client name, platform, deadlines, etc.)
2. Generate your project's `CLAUDE.md` from the template
3. Set up the directory structure for RFP documents
4. Create the initial docs-catalog.md
5. Configure platform-specific settings

---

## Principles

1. **Reproducibility** -- Any team can follow the same 7 phases to produce consistent results
2. **Semi-automation** -- Human judgment for strategy and decisions; AI for analysis, drafting, and checking
3. **Platform Independence** -- Template variables abstract away platform-specific details
4. **Claude Code-native** -- Designed to work within Claude Code's tool ecosystem (MCP, Skills, Agents)
5. **Evidence-based** -- Every claim in the proposal traces back to an RFP requirement or reference document

---

## License

Internal use. Adapt freely for your organization's RFP response workflows.
