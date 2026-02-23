# ARCADIA Workflow Overview

The 7 phases of an ARCADIA-driven RFP response.

---

## Phase Flow

```
[1. Research] --> [2. Strategy] --> [3. Design] --> [4. Estimation]
                                        |                |
                                        v                v
                                  [6. Demo]        [5. Proposal]
                                        |                |
                                        +-----> [7. Review] <----+
```

Phases 1-2 are sequential. Phases 3-6 can overlap. Phase 7 runs continuously and intensifies at the end.

---

## Phase 1: Research

**RFP analysis, reference document cataloging, requirement extraction**

| Attribute | Value |
|-----------|-------|
| Duration | 2-3 days |
| Human/AI Split | 20% / 80% |
| Primary Actor | AI (Claude Code) |
| Human Role | Provide RFP documents, validate extraction accuracy |

### Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| `docs-catalog.md` | Catalog of all reference documents with metadata | `.claude/skills/rfp-auditor/references/` |
| `rfp-requirements-checklist.md` | Structured list of all RFP requirements | `.claude/skills/rfp-auditor/references/` |
| RFP summary | Executive summary of the RFP | `docs/rfp_answer_output/` |

### Skills Used

- `rfp-auditor` -- Extracts and catalogs requirements
- MCP: `context7` -- Looks up technology documentation referenced in RFP

### Activities

1. Claude Code reads and parses the RFP document
2. Reference documents are cataloged (file path, type, page count, key contents)
3. Requirements are extracted into a structured checklist
4. Domain terminology is identified and added to CLAUDE.md
5. Human reviews and corrects the extraction results

---

## Phase 2: Strategy

**Win strategy definition, scope confirmation, competitive positioning**

| Attribute | Value |
|-----------|-------|
| Duration | 2-3 days |
| Human/AI Split | 60% / 40% |
| Primary Actor | Human (Strategy Lead) |
| Human Role | Define win themes, approve scope, set pricing direction |

### Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| `proposal-strategy.md` | Win strategy with themes, differentiators, risks | `docs/rfp_answer_output/` |
| `proposal-items-checklist.md` | Complete list of proposal deliverable items | `docs/rfp_answer_output/` |
| Scope matrix | Ph1/Ph2 scope breakdown | `docs/rfp_answer_output/` |

### Skills Used

- `rfp-auditor` -- Cross-references strategy against requirements
- `proposal-writer` -- Drafts strategy document structure

### Activities

1. Human defines win themes and differentiators
2. Claude Code drafts proposal-strategy.md based on human input + RFP analysis
3. Claude Code generates the proposal items checklist from RFP requirements
4. Human reviews and approves scope boundaries (Ph1 vs Ph2)
5. Strategy document is finalized as the reference for all subsequent phases

---

## Phase 3: Design

**Architecture design, migration planning, technical approach**

| Attribute | Value |
|-----------|-------|
| Duration | 3-5 days |
| Human/AI Split | 40% / 60% |
| Primary Actor | AI (Claude Code) with architect review |
| Human Role | Validate architecture decisions, approve migration approach |

### Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| `architecture-policy.md` | Design principles, ADRs, security, infrastructure | `docs/rfp_answer_output/architecture-plan/` |
| Logical architecture diagrams | Per-phase logical views | `docs/rfp_answer_output/architecture-plan/` |
| Physical architecture diagrams | Per-phase physical/infra views | `docs/rfp_answer_output/architecture-plan/` |
| `ph1-migration-requirements.md` | Migration requirements and approach | `docs/rfp_answer_output/migration-plan/` |
| Migration design diagrams | Current state, target state, data flow, schedule | `docs/rfp_answer_output/migration-plan/` |

### Skills Used

- `rfp-auditor` -- Validates design against RFP requirements
- MCP: `drawio` -- Generates architecture and migration diagrams
- MCP: `context7` -- Looks up platform documentation
- Platform-specific skills -- Platform best practices

### Activities

1. Claude Code drafts architecture policy based on RFP requirements + strategy
2. Logical and physical architecture diagrams are generated via DrawIO MCP
3. Migration approach is designed (current state analysis, target state, data flow)
4. ADRs are written for key decisions
5. Architect reviews and provides feedback; Claude Code iterates

---

## Phase 4: Estimation

**Effort calculation, cost breakdown, pricing strategy**

| Attribute | Value |
|-----------|-------|
| Duration | 2-3 days |
| Human/AI Split | 50% / 50% |
| Primary Actor | Shared (PM + Claude Code) |
| Human Role | Set unit rates, validate effort estimates, approve pricing |

### Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| `estimation-policy.md` | Estimation methodology, unit rates, assumptions | `docs/rfp_answer_output/` |
| Cost breakdown sheets | Detailed per-phase, per-role cost tables | `docs/rfp_answer_output/` |
| WBS | Work Breakdown Structure | `docs/rfp_answer_output/` |

### Skills Used

- `estimation-advisor` -- Calculates effort from scope items
- `rfp-auditor` -- Ensures all required cost items are covered

### Activities

1. Human provides unit rates and pricing constraints
2. Claude Code generates WBS from scope matrix and architecture plan
3. Effort is estimated per WBS item using historical ratios
4. Platform licensing costs are calculated (referencing vendor pricing)
5. Human reviews and adjusts estimates; final pricing is approved

---

## Phase 5: Proposal

**Multi-volume proposal document creation**

| Attribute | Value |
|-----------|-------|
| Duration | 5-7 days |
| Human/AI Split | 40% / 60% |
| Primary Actor | AI (Claude Code) with editorial review |
| Human Role | Review drafts, refine messaging, approve final content |

### Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| Proposal volumes (PPTX) | Multi-volume presentation set | `RFP_answer/` |
| Answer sheets (XLSX) | RFP response spreadsheets | `RFP_answer/` |
| Speaker notes | Presentation talking points | Embedded in PPTX |

### Skills Used

- `proposal-writer` -- Drafts proposal sections
- `rfp-auditor` -- Validates coverage of all requirements
- Plugin: `document-skills` -- PPTX/XLSX generation
- Plugin: `example-skills` -- Document co-authoring

### Activities

1. Claude Code generates proposal outline from checklist + strategy
2. Each volume is drafted section by section
3. Diagrams from Phase 3 are incorporated
4. Cost tables from Phase 4 are formatted
5. Human reviews each volume; Claude Code incorporates feedback
6. Speaker notes are generated for presentation slides
7. Final compliance check against the requirements checklist

---

## Phase 6: Demo

**Demo application development and data platform setup**

| Attribute | Value |
|-----------|-------|
| Duration | 5-7 days (parallel with Phase 5) |
| Human/AI Split | 20% / 80% |
| Primary Actor | AI (Claude Code) |
| Human Role | Define demo scenarios, review UX, test flows |

### Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| Demo web app | Next.js application with demo screens | `src/` |
| Platform scripts | Data platform setup and sample data | `platform/` |
| `demo-app-spec.md` | Detailed demo application specification | Project root |

### Skills Used

- `demo-builder` -- Scaffolds demo screens and API routes
- Plugin: `example-skills` -- Frontend design, web app testing
- MCP: `context7` -- Framework documentation (Next.js, React, etc.)
- Platform-specific skills -- Platform API integration

### Activities

1. Demo concept and screen list are defined (from strategy)
2. Claude Code scaffolds the Next.js application
3. Mock data is generated matching the client's domain
4. Each screen is implemented with mock data fallback
5. Platform API connections are wired up
6. Human tests demo scenarios and provides feedback
7. Demo is polished for presentation day

---

## Phase 7: Review

**RFP compliance verification, quality assurance, final checks**

| Attribute | Value |
|-----------|-------|
| Duration | Continuous; intensive 1-2 days before submission |
| Human/AI Split | 10% / 90% |
| Primary Actor | AI (Claude Code) |
| Human Role | Review audit results, make final go/no-go decision |

### Deliverables

| Deliverable | Description | Location |
|-------------|-------------|----------|
| Audit report | Requirement-by-requirement compliance status | `docs/rfp_answer_output/` |
| Gap analysis | Missing or mismatched items with remediation plan | `docs/rfp_answer_output/` |
| Final checklist sign-off | All items confirmed as addressed | `docs/rfp_answer_output/` |

### Skills Used

- `rfp-auditor` -- Systematic compliance scan
- `proposal-writer` -- Fixes identified gaps

### Activities

1. `rfp-auditor` skill runs a full compliance scan
2. Each requirement is checked: MATCH / MISMATCH / MISSING
3. Coverage percentage is calculated
4. Gaps are flagged with specific remediation suggestions
5. Claude Code fixes addressable gaps automatically
6. Human reviews the audit report and approves submission

---

## Phase Timing Summary

| Phase | Days | Can Overlap With |
|-------|------|-----------------|
| 1. Research | 2-3 | -- |
| 2. Strategy | 2-3 | -- |
| 3. Design | 3-5 | 4, 6 |
| 4. Estimation | 2-3 | 3, 5 |
| 5. Proposal | 5-7 | 4, 6 |
| 6. Demo | 5-7 | 3, 5 |
| 7. Review | Continuous | All |
| **Total (sequential)** | **20-31** | |
| **Total (with overlap)** | **14-20** | |

---

## Agent Team Structure (Optional)

For larger proposals, ARCADIA supports Claude Code Agent Teams:

| Agent | Role | Phases |
|-------|------|--------|
| `team-lead` | Coordination, strategy, review | All |
| `researcher` | RFP analysis, document cataloging | 1, 7 |
| `architect` | Design, diagrams, migration planning | 3 |
| `estimator` | Cost calculation, WBS | 4 |
| `writer` | Proposal document drafting | 5 |
| `developer` | Demo app, platform scripts | 6 |
