# ARCADIA Design Philosophy

**AI-driven RFP Craft and Delivery Intelligence Architecture**

---

## 1. Design Principles

### 1.1 Reproducibility

Every RFP response follows the same 7-phase workflow. Phase gates ensure quality checkpoints before proceeding. The workflow is documented in `guides/00-overview.md` so that any team member -- human or AI -- can pick up where another left off.

### 1.2 Semi-automation

ARCADIA does not aim for full automation. RFP responses require human judgment for strategy, pricing decisions, and relationship context. The framework optimizes the split:

| Activity Type | Automation Target | Examples |
|--------------|-------------------|---------|
| Analysis & Checking | 80-90% | RFP requirement extraction, compliance audit, gap analysis |
| Drafting & Generation | 60-70% | Proposal text, architecture diagrams, demo scaffolding |
| Strategy & Estimation | 30-40% | Win themes, pricing, resource allocation |
| Relationship & Negotiation | 0-10% | Client meetings, partner coordination |

### 1.3 Platform Independence

All templates use `{{VARIABLE}}` syntax. No template file references a specific data platform, cloud provider, or product name. Platform-specific configurations live in `data-platform/{platform}/`.

### 1.4 Claude Code-native

ARCADIA is designed to run inside Claude Code sessions:
- **MCP servers** provide external tool access (documentation lookup, diagram generation)
- **Skills** encapsulate reusable domain expertise (RFP checking, proposal writing)
- **Agent Teams** enable parallel workstreams (research + design simultaneously)
- **CLAUDE.md** serves as the persistent project context across all sessions

### 1.5 Evidence-based

Every statement in a proposal deliverable must trace to either:
- An RFP requirement (by section/item number)
- A reference document (by file path in `docs/rfp_reference/`)
- An Architecture Decision Record (ADR) with documented rationale
- An organization data source (by ID in `org-data/` -- e.g., SVC-001, REF-003, WP-002)

### 1.6 Dual-axis Information Architecture

Proposals require two orthogonal axes of information. ARCADIA manages both explicitly:

| Axis | Source | Lifecycle | Location |
|------|--------|-----------|----------|
| **Customer/RFP** | RFP documents, QA, meetings | Per-project | `docs/` in each project |
| **Organization** | Rate cards, service specs, whitepapers, credentials | Cross-project | `arcadia/org-data/` |

Skills resolve information from both axes: `estimation-advisor` combines org rate cards with RFP scope; `proposal-writer` merges org credentials/services with RFP requirements.

---

## 2. Template Variables

All template files (`.tmpl`) use the following variables. Replace them during project initialization (see `guides/01-kickoff.md`).

| Variable | Purpose | Example |
|----------|---------|---------|
| `{{CLIENT_NAME}}` | Client organization name | "ABC Bank" |
| `{{PROPOSER_NAME}}` | Lead proposing company | "XYZ Corp" |
| `{{PARTNER_NAMES}}` | Co-proposing partners (comma-separated) | "Partner A, Partner B" |
| `{{PROJECT_DESCRIPTION}}` | One-line project description | "Next-gen DWH & MA platform renewal" |
| `{{PROPOSED_PRODUCTS}}` | Primary product/platform being proposed | "Snowflake Data Cloud" |
| `{{PLATFORM_NAME}}` | Technical platform name (may equal PROPOSED_PRODUCTS) | "Snowflake" |
| `{{PLATFORM_TYPE}}` | Platform category | "Cloud Data Warehouse" / "Lakehouse" / "Data Platform" |
| `{{CLOUD_PROVIDER}}` | Underlying cloud infrastructure | "AWS" / "Azure" / "GCP" |
| `{{DEADLINE}}` | Proposal submission deadline | "2026-03-15" |
| `{{PRESENTATION_DATE}}` | Presentation/defense date | "2026-03-20" |
| `{{PROJECT_SLUG}}` | URL/directory-safe project identifier | "abc-bank-dwh" |
| `{{DEMO_CONCEPT}}` | Demo app one-liner concept | "No SQL needed. Just talk to your data." |
| `{{CURRENT_SYSTEM}}` | Current system being replaced | "Teradata + SAS CIS + SAS EG" |

### Variable Usage Rules

1. **Required variables** -- `CLIENT_NAME`, `PROPOSER_NAME`, `PROJECT_DESCRIPTION`, `PROPOSED_PRODUCTS`, `DEADLINE` must be set during kickoff
2. **Optional variables** -- `PARTNER_NAMES`, `PRESENTATION_DATE`, `DEMO_CONCEPT` can be set later
3. **Derived variables** -- `PROJECT_SLUG` is auto-generated from `CLIENT_NAME` if not explicitly set
4. **Platform variables** -- `PLATFORM_NAME`, `PLATFORM_TYPE`, `CLOUD_PROVIDER` are set by platform selection in kickoff

---

## 3. Patterns Extracted from Production Use

The following patterns were identified from a real RFP response project (financial institution, DWH/MA platform renewal) and generalized into ARCADIA.

### 3.1 Three-Layer Structure: Strategy -> Checklist -> Deliverable

```
proposal-strategy.md          -- WHY: Win themes, differentiators, risk mitigation
  |
  v
proposal-items-checklist.md   -- WHAT: Every required deliverable item, status-tracked
  |
  v
Vol1.pptx ... Vol6.pptx       -- HOW: Actual proposal documents
estimation-policy.md           -- HOW: Cost breakdown with rationale
```

Each layer references the one above. Changes to strategy cascade through checklists to deliverables.

### 3.2 Evidence-based Verification

The `rfp-auditor` skill (generalized from `rfp-checker`) performs systematic verification:

1. Extract all RFP requirements into a structured checklist
2. Map each requirement to a deliverable section
3. Flag: MATCH (addressed), MISMATCH (contradicts RFP), MISSING (not addressed)
4. Generate an audit report with coverage percentage

### 3.3 Architecture Decision Records (ADR)

Design decisions are documented in `architecture-policy.md` using ADR format:

```
### ADR-001: {{DECISION_TITLE}}
- Status: Accepted / Proposed / Deprecated
- Context: Why this decision was needed
- Decision: What was decided
- Consequences: Trade-offs and implications
```

### 3.4 Phased Delivery (Ph1/Ph2)

Most large proposals benefit from phased delivery:
- **Ph1**: Core functionality, mandatory scope, firm pricing
- **Ph2**: Extended features, optional scope, reference pricing

This pattern reduces risk for both client and proposer.

### 3.5 Domain Terminology Table

Each project maintains a terminology table in `CLAUDE.md` to ensure consistent language:

```markdown
| Term | Meaning |
|------|---------|
| DWH  | Data Warehouse (current: {{CURRENT_SYSTEM}}) |
| ...  | ... |
```

### 3.6 Mock-first Demo Development

Demo apps are built with mock data fallback:
1. Define sample data tables matching the client's domain
2. Implement all screens with mock data
3. Wire up real platform API connections
4. Platform unavailable? Mock data keeps the demo working

---

## 4. Automation Distribution (Observed)

Based on production experience, the actual automation rates achieved:

| Activity | AI Automation | Human Input | Notes |
|----------|--------------|-------------|-------|
| RFP requirement extraction | ~90% | Review & correct | Claude reads RFP, human validates |
| Document cataloging | ~95% | Spot-check | File listing + metadata extraction |
| Compliance checking | ~90% | Override false positives | Skill-based systematic scan |
| Proposal draft (text) | ~70% | Edit & refine | AI drafts, human adjusts tone/strategy |
| Architecture diagrams | ~60% | Design review | DrawIO MCP generates, human validates |
| Estimation | ~40% | Set rates, validate | AI calculates from scope, human adjusts |
| Demo app scaffolding | ~80% | Feature refinement | Next.js boilerplate + domain screens |
| Demo data generation | ~85% | Validate realism | Synthetic data matching client domain |
| Presentation slides | ~50% | Design & narrative | AI generates content, human designs |
| Meeting preparation | ~30% | Lead discussions | AI summarizes, human strategizes |

---

## 5. Skill Architecture

ARCADIA defines four core skills. Each is a directory under `skills/` with a `SKILL.md` entry point.

| Skill | Purpose | Key Capabilities |
|-------|---------|-----------------|
| `rfp-auditor` | RFP compliance verification | Requirement extraction, gap analysis, audit reports |
| `proposal-writer` | Proposal document assistance | Section drafting, consistency checks, terminology |
| `estimation-advisor` | Cost estimation support | Effort calculation, rate cards, breakdown generation |
| `demo-builder` | Demo app scaffolding | Screen generation, mock data, API route templates |

Skills are project-local (`.claude/skills/`) and travel with the repository.

Skills reference two data sources:
- **Project data**: `docs/` (RFP, architecture plans, meeting notes)
- **Organization data**: `arcadia/org-data/` (rate cards, service catalog, whitepapers, company profile)

---

## 6. Organization Data (`org-data/`)

Reusable, cross-project information about the proposing organization:

| File | Content | Referenced by |
|------|---------|--------------|
| `rate-card.md` | Role-based unit prices, discount policy, cost basis | `estimation-advisor` |
| `service-catalog.md` | Service specs, differentiators, sizing estimates | `proposal-writer`, `estimation-advisor` |
| `company-profile.md` | Company info, credentials, case studies | `proposal-writer` |
| `whitepapers/index.md` | Technical paper index with topic tags | `proposal-writer`, `estimation-advisor` |

Setup procedure: `guides/01-kickoff.md` Step 1.5. Detail: `org-data/README.md`.

---

### MCP Integration

#### Required (all projects)

| MCP Server | Purpose |
|------------|---------|
| `context7` | Library/framework documentation lookup |
| `drawio` | Architecture diagram generation and editing |

#### Recommended (by platform)

| MCP Server | When to Use |
|------------|-------------|
| `aws-knowledge` | AWS-hosted platform proposals |
| `google-developer-knowledge` | GCP-hosted platform proposals |
| Platform-specific MCPs | Added per `data-platform/{platform}/` config |

---

## 8. File Naming Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| `{topic}.md` | `proposal-strategy.md` | Strategy & policy documents |
| `{topic}-checklist.md` | `proposal-items-checklist.md` | Trackable checklists |
| `{prefix}-{topic}.drawio` | `logical-architecture-ph1.drawio` | Architecture diagrams |
| `ph{n}-{seq}-{topic}.drawio` | `ph1-01-current-system.drawio` | Phased design documents |
| `{NN}-{topic}.py` | `00-setup.py` | Numbered execution scripts |
| `Vol{N}-{topic}.pptx` | `Vol1-overview.pptx` | Proposal volumes |
