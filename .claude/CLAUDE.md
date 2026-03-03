# Project Instructions

## Principles of Action

- **Completely align with users:** For any ambiguity, break it down into smaller parts and conduct interviews using the AskUserQuestion Tool.
- **Respect permission denials:** If a tool call is denied via settings or permissions, do NOT attempt to bypass or work around the restriction using alternative methods.
- **MCP/Skills First (mandatory):** Before using WebSearch/WebFetch for any technical research or documentation lookup, you MUST:
  1. Run `ToolSearch` with relevant keywords to check for specialized MCP tools
  2. Use the matching MCP tool if found
  3. Fall back to WebSearch/WebFetch only when MCP tools return insufficient results
  - Similarly, prefer matching Skills over generic approaches when available
- MUST use subagents for complex problem verification
- Optimize tool usage with parallel calling for maximum efficiency

## Language

- Always respond in **Japanese**. Technical terms and code identifiers remain in their original form.

---

> **Note:** `{{VARIABLE}}` placeholders below are replaced with actual values when `/setup` is run. If placeholders remain, the project is not yet initialized — run `/setup` first.

## Role

Responsible for (1) RFP analysis, (2) demo web app development, and (3) RFP response document creation for the {{CLIENT_NAME}} proposal project.

## Project Overview

| Item | Value |
|------|-------|
| Client | {{CLIENT_NAME}} |
| Lead Proposer | {{PROPOSER_NAME}} |
| Co-Proposer(s) | {{PARTNER_NAMES}} |
| Project | {{PROJECT_DESCRIPTION}} |
| Proposed Product | {{PROPOSED_PRODUCTS}} |
| Submission Deadline | {{DEADLINE}} |
| Presentation Date | {{PRESENTATION_DATE}} |
| Slide Method | {{SLIDE_METHOD}} |
| Proposal Strategy | `docs/rfp_answer_output/proposal-strategy.md` |

## Repository Structure

```
docs/
  rfp.md                                # RFP main document
  rfp_reference/                        # Original reference documents
    (organized by source category)
  rfp_answer_output/                    # Intermediate deliverables
    proposal-strategy.md                #   Win strategy
    proposal-items-checklist.md         #   Deliverable item checklist
    estimation-policy.md                #   Estimation methodology & rates
    architecture-plan/                  #   Architecture design
      architecture-policy.md            #     Principles, ADRs, security, infra
      logical-architecture-ph{1,2}.drawio
      physical-architecture-ph{1,2}.drawio
    migration-plan/                     #   Migration design
      ph1-migration-requirements.md
      ph1-{01..04}-*.drawio
  minutes/                              # Meeting notes
RFP_answer/                             # Final deliverables
  Vol{N}-{topic}.pptx                   #   Proposal volumes (PPTX method)
  Vol{N}-{topic}/slide-{NN}.png         #   Proposal volumes (NanoBanana method)
  *.xlsx                                #   Answer sheets
src/                                    # Demo app (Next.js App Router + TypeScript)
platform/                               # Platform setup scripts
.claude/skills/                         # Project-local skills
demo-app-spec.md                        # Demo app specification
arcadia/org-data/                       # Organization-specific data (rate cards, services, etc.)
```

---

## Active Skills & Plugins

| Name | Purpose |
|------|---------|
| **rfp-auditor** | RFP requirement compliance checking (`.claude/skills/rfp-auditor/`) |
| **proposal-writer** | Proposal document drafting assistance (references `arcadia/org-data/`) |
| **estimation-advisor** | Cost estimation and WBS generation (references `arcadia/org-data/rate-card.md`) |
| **demo-builder** | Demo app scaffolding and mock data |
| **nanobanana** | AI image generation/editing for diagrams & slides (auto-selects Pro / Flash based on complexity) (`.claude/skills/nanobanana/`) |
| **example-skills** | Frontend design, document co-authoring, web app testing, PDF/PPTX/DOCX/XLSX generation |
| **document-skills** | Document generation skills (same family as example-skills) |

---

## Autonomous Maintenance

CLAUDE.md is included in every conversation's system prompt. Keep it current and concise. Execute autonomously:

1. **On skill/plugin changes**: Update the "Active Skills & Plugins" table immediately
2. **On repository structure changes**: Update the structure diagram when new directories or key files are added
3. **Prevent bloat**: Delegate details to sub-files (docs/, references/, etc.); keep only summaries here
4. **Token efficiency**: Prefer tables over prose, eliminate duplication

---

## Quality Standards

### Commit Messages

- Write in English, imperative mood ("Add feature" not "Added feature"), first line under 72 characters.

### DrawIO Diagrams

Architecture diagrams (`architecture-plan/*.drawio`) and migration diagrams (`migration-plan/*.drawio`) are key deliverables. When creating or editing `.drawio` files, use only DrawIO's built-in official icon sets (shape libraries). Do not embed external image URLs or custom images.

---

## 1. RFP Analysis Guidelines

### Target Documents

Stored under `docs/rfp_reference/`. RFP main document is `docs/rfp.md`. Detailed catalog at `.claude/skills/rfp-auditor/references/docs-catalog.md`.

### Analysis Principles

- Interpret from the **{{PROPOSED_PRODUCTS}} proposal** perspective (current system: {{CURRENT_SYSTEM}})
- Consider regulatory/compliance requirements relevant to the client's industry
- Cite specific RFP sections when summarizing or answering
- Use platform-specific Skills and MCP servers for technical validation

### Domain Terminology

| Term | Meaning |
|------|---------|
| (Add project-specific terms during Phase 1 Research) | |

---

## 2. Demo Web App Specification

### Concept

"{{DEMO_CONCEPT}}"

### Tech Stack

Next.js 15 (App Router) / React 19 / TypeScript (strict) / Tailwind CSS 4 / Recharts / Framer Motion / date-fns

### Architecture

- Serverless ({{PLATFORM_NAME}} = single Source of Truth)
- Frontend -> API Route -> {{PLATFORM_NAME}} API (token managed server-side)
- AI responses are streamed
- Mock data fallback when {{PLATFORM_NAME}} is not connected

### Demo Screens

**Ph1 Core:**
1. `/dashboard` **Data Pipeline** -- Pipeline visualization, data flow diagrams
2. `/analysis` **Data Analysis (AI-powered)** -- Chat UI, natural language queries, table/chart display
3. `/scenario` **Scenario Generation** -- Segment -> message/timing auto-suggestion, A/B test design

**Ph2 Customer Experience:**
4. `/journey` **Journey Builder** -- Customer journey visualization & editing
5. `/engagement` **Engagement** -- Web/app engagement analytics
6. `/realtime` **Real-time Monitor** -- Live data display

### Sample Data (6 tables)

customers, transactions, web_logs, applications, campaign_history, partner_data

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `PLATFORM_HOST` | {{PLATFORM_NAME}} workspace URL |
| `PLATFORM_TOKEN` | {{PLATFORM_NAME}} API token |
| `PLATFORM_WAREHOUSE_ID` | {{PLATFORM_NAME}} compute/warehouse ID |
| `AI_SPACE_ID` | AI assistant space/room ID |
| `AI_ENDPOINT` | AI agent/model endpoint URL |

### Coding Standards

- UI text: **Japanese**
- Components: `src/components/` (organized by feature)
- API Routes: `src/app/api/`
- Error messages: Japanese
