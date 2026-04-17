# Phase 3: アーキテクチャ設計ガイド

アーキテクチャ設計、移行計画策定、技術的アプローチの定義を行うフェーズ。

---

## 事前: Phase 2.5（Design System）の完了確認

Phase 3 に入る前に、**Phase 2.5（Design System）が完了していること**を確認する。
Phase 2.5 は Phase 2 の直後に実施される独立フェーズで、プロジェクトルートの
`DESIGN.md` に色・タイポ・コンポーネント規約を確定する。

### Phase 2.5 の実施手順

| ステップ | 実施内容 |
|---------|---------|
| 1 | `DESIGN.md`（`/setup` で配置済み）、`proposal-strategy.md`、`source/client-profile.md` を読み込む |
| 2 | `strategist` エージェント（または手動）が Design Preset を判断: クライアントブランド指定 → `client-brand` / 業界トーン調整 → `custom` / 情報なし → `arcadia-neutral`（デフォルト） |
| 3 | 必要セクションのみ更新（色・Slide-Specific Rules・Tailwind 変数）。Change Log に 1 行追加 |
| 4 | `phase-state.md` の Phase 2.5 Status を `completed` にし、判断根拠を Key Decisions に記録 |

### 実行コマンド（フルオートの場合）

```
/auto-run 2.5
```

### なぜ Phase 2.5 が必要か

- **Phase 5（提案書）と Phase 6（デモアプリ）の前提条件**。両フェーズのエージェントは `DESIGN.md` を必ず Read し、色・タイポ・コンポーネントのトークンを厳密に適用する
- 提案戦略（Win テーマ、クライアント像）が固まった時点で決めることで、トーンと戦略の整合性を担保する
- Phase 3（アーキテクチャ設計）の図面（DrawIO）は任意の色規約に従ってよいが、提案書・デモとトーンを合わせるため `DESIGN.md` のカラートークンを参照することを推奨

---

## 概要

| 項目 | 値 |
|------|-------|
| フェーズ | 3. Design（設計） |
| 所要期間 | 3-5日 |
| 人間/AI比率 | 40% / 60% |
| 主担当 | AI（Claude Code）+ アーキテクトレビュー |
| 並行可否 | 可 -- Phase 4（見積）、Phase 6（デモ）と並行可能 |

RFP要件と提案戦略に基づき、論理アーキテクチャ、移行計画、セキュリティ設計を策定する。物理構成図・ネットワーク構成図等はRFPで明示的に要求された場合のみ作成する。人間（アーキテクト）は技術選定の最終判断とADRレビューを担う。

---

## インプット

| 項目 | ソース | 説明 |
|------|--------|------|
| `proposal-strategy.md` | `output/plan/` | Phase 2で確定した提案戦略 |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | RFP要件チェックリスト |
| RFP参照資料（基盤設計、IF定義等） | `source/rfp_reference/` | 現行システムの設計書群 |
| プラットフォーム機能マッピング | `output/plan/` | Phase 2で生成した適合度表 |

---

## アウトプット

| 成果物 | 出力先 | 説明 |
|--------|--------|------|
| `architecture-policy.md` | `output/plan/architecture-plan/` | 設計原則、ADR、セキュリティ方針、インフラ方針 |
| 論理構成図 (`.drawio`) **必須** | `output/plan/architecture-plan/` | フェーズ別の論理アーキテクチャ図 |
| 物理構成図 (`.drawio`) **オプション** | `output/plan/architecture-plan/` | RFP要求時のみ。物理/インフラ構成図 |
| `ph1-migration-requirements.md` | `output/plan/migration-plan/` | 移行要件定義書 |
| 移行設計図 (`.drawio`) | `output/plan/migration-plan/` | 現行構成、移行構成、データフロー、スケジュール |

---

## 人間の作業

人間が判断・実行すべき作業:

- [ ] 技術選定の最終判断（データベース、ETLツール、セキュリティ製品等）
- [ ] ADR（アーキテクチャ決定記録）のレビューと承認
- [ ] 非機能要件（SLA、可用性、パフォーマンス）の設計判断
- [ ] セキュリティ要件の充足確認（クラウドセキュリティ、暗号化、アクセス制御）
- [ ] 移行方針（ビッグバン vs 段階移行）の最終決定
- [ ] 並行稼働期間・切替判定基準の確認
- [ ] 論理/物理構成図の正確性レビュー

---

## Claude Codeへの指示

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
出力先: output/plan/architecture-plan/architecture-policy.md
```

### 2. 論理構成図の生成

```
architecture-policy.md を元に、Ph1の論理構成図をDrawIOで作成して。
データフロー（ソースシステム → 取込 → 加工 → 分析/配信）を中心に描いて。
出力先: output/plan/architecture-plan/logical-architecture-ph1.drawio
```

### 3. 物理構成図の生成（オプション — RFP要求時のみ）

```
architecture-policy.md を元に、Ph1の物理構成図をDrawIOで作成して。
ネットワーク区画、各コンポーネントの配置、接続経路を描いて。
出力先: output/plan/architecture-plan/physical-architecture-ph1.drawio
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
出力先: output/plan/migration-plan/ph1-migration-requirements.md
```

### 5. 移行設計図の生成

```
ph1-migration-requirements.md を元に、以下の移行設計図をDrawIOで作成して:
1. 現行システム構成図 → ph1-01-current-system.drawio
2. 移行後構成図 → ph1-02-target-system.drawio
3. データフロー図 → ph1-03-data-flow.drawio
4. 移行スケジュール → ph1-04-migration-schedule.drawio
出力先: output/plan/migration-plan/
```

### 6. RFP要件との整合性チェック

```
architecture-policy.md と ph1-migration-requirements.md が RFP要件チェックリストの技術要件をすべてカバーしているか確認して。
カバレッジレポートを生成して。
```

---

## 使用スキル

| スキル | 用途 |
|--------|------|
| `rfp-auditor` | 設計内容とRFP要件の整合性検証 |
| MCP: `drawio` | 論理/物理構成図、移行設計図の生成 |
| MCP: `context7` | プラットフォームのドキュメント参照 |

---

## 完了チェックリスト

Phase完了の判定基準:

- [ ] `architecture-policy.md` が生成され、ADRが主要決定ごとに記載されている
- [ ] 論理構成図が生成されている（フェーズ分けする場合はフェーズごと）
- [ ] 物理構成図（RFPで要求されている場合のみ）が生成されている
- [ ] `ph1-migration-requirements.md` が生成され、移行対象が定量的に棚卸しされている
- [ ] 移行設計図（現行/移行後/データフロー/スケジュール）が生成されている
- [ ] アーキテクトによるレビューが完了し、主要ADRが承認されている
- [ ] RFP要件チェックリストの技術要件に対するカバレッジが90%以上である
- [ ] DrawIO図面にプラットフォーム固有のアイコンではなく、汎用的な記法が使用されている

---

## ヒント

- DrawIO図面はMCPで生成し、DrawIO公式の組み込みアイコンのみを使用する（外部画像URL埋め込み不可）
- フェーズ分けする案件ではフェーズごとの論理/物理構成図が必要になる
- ADRは「なぜその技術を選んだか」を記録するもの。競合技術との比較も記載すると提案書に再利用しやすい
- 移行設計は Phase 4（見積）の工数算出に直結するため、テーブル数・ジョブ数・IF数を正確に数えることが重要
- Phase 4（見積）および Phase 6（デモ）との並行作業を推奨

---

## phase-state.md の更新

Phase 3の作業に伴い `phase-state.md` を更新する:

| タイミング | 更新内容 |
|-----------|---------|
| 開始時 | Phase Summary → Status: `in_progress`, Started に日付記入 |
| 成果物変更前 | `change-log.md` に `PLAN` エントリを追記（WAL 先書き） |
| 成果物変更後 | `change-log.md` に `DONE` エントリを追記 |
| 成果物完成時 | Deliverables の該当チェックボックスを `[x]` に変更 |
| 意思決定時 | Key Decisions に判断内容と理由を追記（ADR採択、移行方式選定等） |
| セッション終了前 | Checkpoint に進捗メモ、Last Checkpoint の Next Action を更新 |
| 完了時 | Status: `completed`, Completed に日付記入 |

---

## 次のステップ

Phase 3の成果物が揃ったら:

```
guides/05-estimation.md を読んでPhase 4（見積）を開始して
```

Phase 3と並行して:

```
guides/07-demo.md を読んでPhase 6（デモ開発）を並行で開始して
```
