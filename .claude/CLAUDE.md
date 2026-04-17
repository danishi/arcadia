# Project Instructions

> **Project context:** See **`README.md`** for repository structure, design philosophy, workflow, skill list, and naming conventions. This file contains only Claude Code behavior directives and project-specific parameters.

## Principles of Action

- **Completely align with users:** For any ambiguity, break it down into smaller parts and conduct interviews using the AskUserQuestion Tool.
- **Respect permission denials:** If a tool call is denied via settings or permissions, do NOT attempt to bypass or work around the restriction using alternative methods.
- **MCP/Skills First (mandatory):** Before using WebSearch/WebFetch for any technical research or documentation lookup, you MUST:
  1. Run `ToolSearch` with relevant keywords to check for specialized MCP tools
  2. Use the matching MCP tool if found
  3. Fall back to WebSearch/WebFetch only when MCP tools return insufficient results
  - Similarly, prefer matching Skills over generic approaches when available
- **Document-skills First:** For generating, combining, or editing rich documents (PDF / PPTX / DOCX / XLSX), always prefer the `document-skills` plugin over custom scripts
- MUST use subagents for complex problem verification
- **Subagent delegation for context efficiency:** `/auto-run` の各フェーズ実行や `/setup` の重いステップは Agent ツールでサブエージェントに委譲し、親コンテキストの消費を最小化すること。詳細は各コマンドファイル内の「サブエージェント実行戦略」セクションを参照
- Optimize tool usage with parallel calling for maximum efficiency
- **Auto-register tasks:** When you discover items requiring further discussion, unresolved ambiguities, or pending decisions during any conversation, register them to `tasks.md` using the task-tracker skill procedure. Always notify the user when auto-registering.
- **Session resume:** At the start of every new session, read `phase-state.md` to restore context. Follow the protocol in `guides/09-resume.md`. Update `phase-state.md` at phase transitions, deliverable completions, key decisions, and before session end.
- **Write-Ahead Log:** Before modifying any deliverable, append a `PLAN` entry to `change-log.md`. After completion, append a `DONE` entry. **Do NOT read** `change-log.md` during normal operation — only read it when recovering from an interrupted session or when the user explicitly requests history.

## Language

- Always respond in **Japanese**. Technical terms and code identifiers remain in their original form.

---

> **Note:** `__VARIABLE__` placeholders below are replaced with actual values when `/setup` is run. If placeholders remain, the project is not yet initialized — run `/setup` first.

## Role

Responsible for (1) RFP analysis, (2) demo web app development, and (3) RFP response document creation for the __CLIENT_NAME__ proposal project.

## Project Overview

| Item | Value |
|------|-------|
| Client | __CLIENT_NAME__ |
| Lead Proposer | __PROPOSER_NAME__ |
| Co-Proposer(s) | __PARTNER_NAMES__ |
| Project | __PROJECT_DESCRIPTION__ |
| Infrastructure | __INFRA_TYPE__ |
| System Type | __SYSTEM_TYPE__ |
| Proposed Product | __PROPOSED_PRODUCTS__ |
| Submission Deadline | __DEADLINE__ |
| Presentation Date | __PRESENTATION_DATE__ |
| Slide Method | __SLIDE_METHOD__ |
| Proposal Strategy | `output/plan/proposal-strategy.md` |

## Key Paths

| Path | Purpose |
|------|---------|
| `phase-state.md` | Phase state tracking — single source of truth for phase progress, checkpoints, and session resume |
| `change-log.md` | Write-Ahead Log — append-only change history from setup to submission (do NOT read unless recovering) |
| `DESIGN.md` | Design system single source of truth — colors, typography, components, slide/demo rules (confirmed in Phase 2.5; Phase 5/6 read this as required input) |
| `input/` | Universal intake — all documents go here; `data-import` skill auto-classifies to `source/` or `org-data/` |
| `source/rfp.md` | RFP main document |
| `source/rfp_reference/` | Original reference documents |
| `source/minutes/` | Meeting notes, hearing memos |
| `source/client-profile.md` | Client company profile (auto-fetched from web by `company-research` skill) |
| `output/` | Final deliverables (PPTX, XLSX) |
| `output/slides/` | Slide deliverables — per-volume subfolders with outline MD, design MD, and final images |
| `output/plan/` | Intermediate deliverables (strategy, checklist, estimation, architecture, migration) |
| `demo-app/` | Demo app (Next.js App Router + TypeScript) |
| `org-data/` | Organization-specific data (rate cards, services, whitepapers, etc.) |
| `tmp/` | AI working directory for temporary files (Git-ignored except `.gitkeep`) |

> Full directory structure & skill list: see `README.md`

---

## Autonomous Maintenance

CLAUDE.md is included in every conversation's system prompt. Keep it current and concise. Execute autonomously:

1. **On skill/plugin or structure changes**: Update `README.md` (Directory Structure, Skills table)
2. **Prevent bloat**: Delegate details to README.md, guides/, references/; keep only project-specific parameters here
3. **Token efficiency**: Prefer tables over prose, eliminate duplication with README.md

---

## Quality Standards

### Commit Messages

- Write in English, imperative mood ("Add feature" not "Added feature"), first line under 72 characters.

### DrawIO Diagrams

Architecture diagrams (`output/plan/architecture-plan/*.drawio`) and migration diagrams (`output/plan/migration-plan/*.drawio`) are key deliverables. When creating or editing `.drawio` files:
- Use MCP tools for diagram creation, but always save as actual `.drawio` files (do NOT open in browser)
- Use only DrawIO's built-in official icon sets (shape libraries). Do not embed external image URLs or custom images.
- **Required**: Logical architecture diagrams (`logical-architecture-ph{N}.drawio`) — always create these. フェーズ分けしない場合は `logical-architecture.drawio` とする
- **Optional**: Physical, network, data-flow diagrams — create only when explicitly required by the RFP

---

## 1. RFP Analysis Guidelines

### Target Documents

Stored under `source/rfp_reference/`. RFP main document is `source/rfp.md`. Detailed catalog at `.claude/skills/rfp-auditor/references/docs-catalog.md`.

### Analysis Principles

- Interpret from the **__PROPOSED_PRODUCTS__ proposal** perspective (current system: __CURRENT_SYSTEM__)
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

"__DEMO_CONCEPT__"

### Tech Stack

Next.js 15 (App Router) / React 19 / TypeScript (strict) / Tailwind CSS 4 / Recharts / Framer Motion / date-fns

### Architecture

- Serverless (__PLATFORM_NAME__ = single Source of Truth)
- Frontend -> API Route -> __PLATFORM_NAME__ API (token managed server-side)
- AI responses are streamed
- Mock data fallback when __PLATFORM_NAME__ is not connected

### Demo Screens

<!-- /setup の Phase D ヒアリングで以下のテーブルが自動生成される -->

| Path | Name | Type | Description |
|------|------|------|-------------|
| __DEMO_SCREENS__ |

### Sample Data Domain

__DEMO_DATA_DOMAIN__

### Theme Color

__DEMO_THEME_COLOR__

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `PLATFORM_HOST` | __PLATFORM_NAME__ workspace URL |
| `PLATFORM_TOKEN` | __PLATFORM_NAME__ API token |
| `PLATFORM_WAREHOUSE_ID` | __PLATFORM_NAME__ compute/warehouse ID |
| `AI_SPACE_ID` | AI assistant space/room ID |
| `AI_ENDPOINT` | AI agent/model endpoint URL |

### Coding Standards

- UI text: **Japanese**
- Components: `demo-app/src/components/` (organized by feature)
- API Routes: `demo-app/src/app/api/`
- Error messages: Japanese
