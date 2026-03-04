# セッション復帰ガイド

コンテキストが消去された後、または新しいセッションの開始時に、作業状態を復元してフェーズ作業を継続するための手順。

---

## 概要

| 項目 | 値 |
|------|-------|
| 対象 | Claude Code セッション開始時 |
| トリガー | 新規セッション、コンテキスト消去後の復帰、フェーズ間の中断からの再開 |
| 所要時間 | 1-2分（自動） |

ARCADIA のフェーズ作業は、セッション間で中断・復帰できるよう設計されている。`phase-state.md` がフェーズ状態の Single Source of Truth として機能し、コンテキストが完全に消去されても、このファイルから現在の進行状態を復元できる。

---

## 復帰プロトコル

### Step 1: phase-state.md の読み取り

```
phase-state.md を読む
```

`phase-state.md` が存在しない場合:
- `/setup` が未実行の可能性がある → ユーザーに `/setup` の実行を案内する
- または `phase-state.md` が削除された → 後述の「状態の再構築」セクションに従う

### Step 2: 成果物の存在検証

`phase-state.md` の各フェーズの Deliverables セクションに記載されたファイルの存在を確認する。記録されたステータスと実際のファイル存在状況に差異がある場合は、ユーザーに報告する。

確認すべきパス:

| Phase | 確認対象 |
|-------|---------|
| 0 | `.claude/CLAUDE.md`, `source/`, `output/plan/` |
| 1 | `.claude/skills/rfp-auditor/references/docs-catalog.md`, `.claude/skills/rfp-auditor/references/rfp-requirements-checklist.md`, `output/plan/rfp-analysis.md` |
| 2 | `output/plan/proposal-strategy.md`, `output/plan/proposal-items-checklist.md` |
| 3 | `output/plan/architecture-plan/architecture-policy.md`, `output/plan/architecture-plan/*.drawio` |
| 4 | `output/plan/estimation-policy.md` |
| 5 | `output/slides/*/slides.md` |
| 6 | `demo-app/src/app/*/page.tsx`, `demo-app-spec.md` |
| 7 | `output/plan/audit-report.md` |

### Step 3: 状態サマリーの提示

ユーザーに以下の形式で現在の状態を提示する:

```
## 現在の状態

| Phase | Status | 進捗 |
|-------|--------|------|
| ...   | ...    | ...  |

### 前回のチェックポイント
- 最終更新: YYYY-MM-DD
- 作業中フェーズ: Phase N
- 次のアクション: ...

### 推奨アクション
1. ...
2. ...
```

### Step 4: ユーザーの指示を待つ

推奨アクションを提示した上で、ユーザーの指示を待つ。ユーザーが:

- **「続きから」「再開」「resume」** と指示した場合 → チェックポイントの Next Action から再開する
- **特定のフェーズを指定** した場合 → そのフェーズの Entry Criteria を確認し、満たされていれば開始する
- **別の作業を指示** した場合 → 指示に従う（phase-state.md の更新は適宜行う）

---

## phase-state.md の更新タイミング

以下のイベント発生時に `phase-state.md` を更新する:

| イベント | 更新内容 |
|---------|---------|
| フェーズ開始 | Phase Summary テーブルの Status を `in_progress` に変更、Started 日付を記入 |
| 成果物完成 | 該当フェーズの Deliverables チェックボックスを `[x]` に変更 |
| 重要な意思決定 | 該当フェーズの Key Decisions に追記 |
| セッション終了前 | Last Checkpoint テーブルを更新（Active Phase, Next Action, Blocked By） |
| フェーズ完了 | Phase Summary テーブルの Status を `completed` に変更、Completed 日付を記入 |
| ブロッカー発生 | Status を `blocked` に変更、Blocked By を Last Checkpoint に記載 |

### チェックポイントの書き方

Checkpoint セクションには、セッション間で失われるコンテキスト情報を記録する:

**良い例:**
```markdown
### Checkpoint

- architecture-policy.md のドラフト完了。ADR-001（Snowflake選定）とADR-002（dbt採用）を記述済み
- 論理構成図は Bronze/Silver/Gold の3層構造で合意済み。DrawIOでの図面化が次のステップ
- 移行要件定義は未着手。現行システムのテーブル定義書（source/rfp_reference/table-spec.xlsx）の分析から開始する
- 人間レビュー待ち: ADR-003（セキュリティ方式）の選択肢をユーザーに提示済み
```

**悪い例:**
```markdown
### Checkpoint

- 作業中
```

---

## Write-Ahead Log（change-log.md）

`change-log.md` は append-only の変更ログ。セットアップから提出まで、全成果物への変更を Git や Claude Code のコンテキストに依存せず記録する。

### WAL プロトコル

```
1. 変更を実行する前に PLAN エントリを追記する
2. 変更を実行する
3. 変更完了後に DONE エントリを追記する
```

**エントリ形式:**
```markdown
- `YYYY-MM-DD` **PLAN** Phase N: 変更内容の説明 → `対象ファイルパス`
- `YYYY-MM-DD` **DONE** Phase N: 変更内容の説明
```

### 通常時の運用

- `change-log.md` は**書き込みのみ**。読まない
- 書き込みは常にファイル末尾に追記（append）
- 既存のエントリは変更しない

### 復帰時の WAL リカバリ

セッション復帰時に `phase-state.md` の Last Checkpoint で中断が検出された場合のみ、`change-log.md` の**末尾数行**を確認する:

1. 末尾の `PLAN` エントリに対応する `DONE` があるか確認
2. `DONE` がない `PLAN` がある場合 → その変更は中断された
3. 対象ファイルの状態を確認し、変更が完了しているか判定
4. 完了していれば `DONE` を追記、未完了であれば再実行またはユーザーに確認

---

## 状態の再構築

`phase-state.md` が存在しない、または破損している場合に、成果物の存在状況から状態を再構築する手順:

### 1. プロジェクト設定の確認

```
.claude/CLAUDE.md を読んで、プロジェクトの基本設定を確認する
```

`__VARIABLE__` プレースホルダーが残っている場合は `/setup` 未実行 → セットアップから開始。

### 2. 成果物スキャン

以下のファイル存在チェックにより、各フェーズの完了状態を推定する:

```
# Phase 1 成果物
.claude/skills/rfp-auditor/references/docs-catalog.md
.claude/skills/rfp-auditor/references/rfp-requirements-checklist.md
output/plan/rfp-analysis.md

# Phase 2 成果物
output/plan/proposal-strategy.md  (テンプレートでなく実コンテンツがあるか)
output/plan/proposal-items-checklist.md

# Phase 3 成果物
output/plan/architecture-plan/architecture-policy.md  (テンプレートでなく実コンテンツがあるか)
output/plan/architecture-plan/*.drawio

# Phase 4 成果物
output/plan/estimation-policy.md  (テンプレートでなく実コンテンツがあるか)
output/plan/wbs.md
output/plan/cost-breakdown.md

# Phase 5 成果物
output/slides/*/slides.md

# Phase 6 成果物
demo-app-spec.md
demo-app/src/app/dashboard/page.tsx (etc.)

# Phase 7 成果物
output/plan/audit-report.md
```

### 3. phase-state.md の再生成

スキャン結果に基づき `phase-state.md` を再生成する。不明な点はユーザーに確認する。

---

## フェーズ間の依存関係

復帰時にフェーズの開始可否を判断するための依存関係図:

```
Phase 0 (Setup)
    │
    v
Phase 1 (Research)          ← 順次: Phase 0 完了必須
    │
    v
Phase 2 (Strategy)          ← 順次: Phase 1 完了必須
    │
    ├──> Phase 3 (Design)   ← 並行可能
    ├──> Phase 4 (Estimation) ← 並行可能（Phase 3 推奨）
    ├──> Phase 5 (Proposal) ← 並行可能（Phase 3, 4 推奨）
    └──> Phase 6 (Demo)     ← 並行可能
              │
              v
         Phase 7 (Review)   ← 継続的; 最終チェックは全フェーズ完了後
              │
              v
         Refinement         ← 反復ループ: 対話的に成果物を修正・改善
```

### Refinement モードでの復帰

Phase 7 完了後に Refinement モードに入っている場合、復帰時は以下を確認する:

1. phase-state.md の全フェーズが `completed` であること
2. Refinement セクションの修正履歴と追加取込資料を確認
3. Session Log の直近のエントリから、前回の作業内容を把握
4. ユーザーに「前回の続きから修正を続けますか？」と確認

---

## ヒント

- `phase-state.md` はコミットに含める。チーム内での状態共有にも使える
- Checkpoint セクションには「次のセッションの自分」に向けたメモを書く
- Key Decisions には「なぜその判断をしたか」の理由も記録する。復帰時に判断の経緯が分かる
- Session Log は簡潔に。詳細は git log で追跡できる
- `tasks.md` と `phase-state.md` は補完関係。`tasks.md` は個別タスク、`phase-state.md` はフェーズ全体の状態を管理する
