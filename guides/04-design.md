# Phase 3: Architecture Design Guide

アーキテクチャ設計、移行計画策定、技術的アプローチの定義を行うフェーズ。

---

## Overview

| Attribute | Value |
|-----------|-------|
| Phase | 3. Design |
| Duration | 3-5 days |
| Human/AI Split | 40% / 60% |
| Primary Actor | AI (Claude Code) with architect review |
| Parallelizable | Yes -- Phase 4 (Estimation), Phase 6 (Demo) と並行可能 |

RFP要件と提案戦略に基づき、論理/物理アーキテクチャ、移行計画、セキュリティ設計を策定する。人間（アーキテクト）は技術選定の最終判断とADRレビューを担う。

---

## Input

| Item | Source | Description |
|------|--------|-------------|
| `proposal-strategy.md` | `docs/rfp_answer_output/` | Phase 2で確定した提案戦略 |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | RFP要件チェックリスト |
| RFP参照資料（基盤設計、IF定義等） | `docs/rfp_reference/` | 現行システムの設計書群 |
| プラットフォーム機能マッピング | `docs/rfp_answer_output/` | Phase 2で生成した適合度表 |

---

## Output

| Deliverable | Location | Description |
|-------------|----------|-------------|
| `architecture-policy.md` | `docs/rfp_answer_output/architecture-plan/` | 設計原則、ADR、セキュリティ方針、インフラ方針 |
| 論理構成図 (`.drawio`) | `docs/rfp_answer_output/architecture-plan/` | フェーズ別の論理アーキテクチャ図 |
| 物理構成図 (`.drawio`) | `docs/rfp_answer_output/architecture-plan/` | フェーズ別の物理/インフラ構成図 |
| `ph1-migration-requirements.md` | `docs/rfp_answer_output/migration-plan/` | 移行要件定義書 |
| 移行設計図 (`.drawio`) | `docs/rfp_answer_output/migration-plan/` | 現行構成、移行構成、データフロー、スケジュール |

---

## Human Tasks

人間が判断・実行すべき作業:

- [ ] 技術選定の最終判断（データベース、ETLツール、セキュリティ製品等）
- [ ] ADR（アーキテクチャ決定記録）のレビューと承認
- [ ] 非機能要件（SLA、可用性、パフォーマンス）の設計判断
- [ ] セキュリティ要件の充足確認（クラウドセキュリティ、暗号化、アクセス制御）
- [ ] 移行方針（ビッグバン vs 段階移行）の最終決定
- [ ] 並行稼働期間・切替判定基準の確認
- [ ] 論理/物理構成図の正確性レビュー

---

## Claude Code Instructions

以下の指示文をClaude Codeにコピペして使用する。

### 1. アーキテクチャ方針書ドラフト

```
proposal-strategy.md と rfp-requirements-checklist.md を元に、アーキテクチャ方針書のドラフトをADR形式で作成して。
以下の構成で:
1. 設計原則（5つ以内）
2. ADR一覧（主要な技術選定ごと）
3. セキュリティ設計方針
4. インフラ設計方針
5. 非機能要件への対応方針（SLA、可用性、DR）
出力先: docs/rfp_answer_output/architecture-plan/architecture-policy.md
```

### 2. 論理構成図の生成

```
architecture-policy.md を元に、Ph1の論理構成図をDrawIOで作成して。
データフロー（ソースシステム → 取込 → 加工 → 分析/配信）を中心に描いて。
出力先: docs/rfp_answer_output/architecture-plan/logical-architecture-ph1.drawio
```

### 3. 物理構成図の生成

```
architecture-policy.md を元に、Ph1の物理構成図をDrawIOで作成して。
ネットワーク区画、各コンポーネントの配置、接続経路を描いて。
出力先: docs/rfp_answer_output/architecture-plan/physical-architecture-ph1.drawio
```

### 4. 移行要件定義書の作成

```
RFP参照資料（基盤設計、IF定義、テーブル定義）を分析して、移行要件定義書を作成して。
以下の構成で:
1. 現行システム構成の整理
2. 移行対象の棚卸し（テーブル数、ジョブ数、IF数）
3. 移行方式（データ移行、ロジック移行、IF移行）
4. 並行稼働計画
5. 切替判定基準
6. リスクと対策
出力先: docs/rfp_answer_output/migration-plan/ph1-migration-requirements.md
```

### 5. 移行設計図の生成

```
ph1-migration-requirements.md を元に、以下の移行設計図をDrawIOで作成して:
1. 現行システム構成図 → ph1-01-current-system.drawio
2. 移行後構成図 → ph1-02-target-system.drawio
3. データフロー図 → ph1-03-data-flow.drawio
4. 移行スケジュール → ph1-04-migration-schedule.drawio
出力先: docs/rfp_answer_output/migration-plan/
```

### 6. RFP要件との整合性チェック

```
architecture-policy.md と ph1-migration-requirements.md が RFP要件チェックリストの技術要件をすべてカバーしているか確認して。
カバレッジレポートを生成して。
```

---

## Skills Used

| Skill | Purpose |
|-------|---------|
| `rfp-auditor` | 設計内容とRFP要件の整合性検証 |
| MCP: `drawio` | 論理/物理構成図、移行設計図の生成 |
| MCP: `context7` | プラットフォームのドキュメント参照 |

---

## Checklist

Phase完了の判定基準:

- [ ] `architecture-policy.md` が生成され、ADRが主要決定ごとに記載されている
- [ ] 論理構成図（Ph1、必要に応じてPh2）が生成されている
- [ ] 物理構成図（Ph1、必要に応じてPh2）が生成されている
- [ ] `ph1-migration-requirements.md` が生成され、移行対象が定量的に棚卸しされている
- [ ] 移行設計図（現行/移行後/データフロー/スケジュール）が生成されている
- [ ] アーキテクトによるレビューが完了し、主要ADRが承認されている
- [ ] RFP要件チェックリストの技術要件に対するカバレッジが90%以上である
- [ ] DrawIO図面にプラットフォーム固有のアイコンではなく、汎用的な記法が使用されている

---

## Tips

- DrawIO図面はMCPで生成し、DrawIO公式の組み込みアイコンのみを使用する（外部画像URL埋め込み不可）
- 大規模案件ではPh1/Ph2それぞれの論理/物理構成図が必要になる
- ADRは「なぜその技術を選んだか」を記録するもの。競合技術との比較も記載すると提案書に再利用しやすい
- 移行設計は Phase 4（見積）の工数算出に直結するため、テーブル数・ジョブ数・IF数を正確に数えることが重要
- Phase 4（見積）および Phase 6（デモ）との並行作業を推奨

---

## Next Step

Phase 3の成果物が揃ったら:

```
guides/05-estimation.md を読んでPhase 4（見積）を開始して
```

Phase 3と並行して:

```
guides/07-demo.md を読んでPhase 6（デモ開発）を並行で開始して
```
