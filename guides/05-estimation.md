# Phase 4: Estimation Guide

見積方針の策定、工数算出、コスト構造の設計を行うフェーズ。

---

## Overview

| Attribute | Value |
|-----------|-------|
| Phase | 4. Estimation |
| Duration | 2-3 days |
| Human/AI Split | 50% / 50% |
| Primary Actor | Shared (PM + Claude Code) |
| Parallelizable | Yes -- Phase 3 (Design), Phase 5 (Proposal) と並行可能 |

戦略とアーキテクチャ設計に基づき、工数見積・ライセンスコスト・TCOを算出する。人間が単価設定・ベンダー見積入手・最終承認を担い、AIがWBS生成・工数計算・整合性チェックを行う。

---

## Input

| Item | Source | Description |
|------|--------|-------------|
| `proposal-strategy.md` | `docs/rfp_answer_output/` | Ph1/Ph2スコープ、提案範囲 |
| `architecture-policy.md` | `docs/rfp_answer_output/architecture-plan/` | 技術スタック、コンポーネント構成 |
| `ph1-migration-requirements.md` | `docs/rfp_answer_output/migration-plan/` | 移行対象の棚卸し結果 |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | RFP要件（見積対象範囲の確認用） |
| 人間の判断 | (口頭/メモ) | 単価設定、ベンダー見積、価格方針 |

---

## Output

| Deliverable | Location | Description |
|-------------|----------|-------------|
| `estimation-policy.md` | `docs/rfp_answer_output/` | 見積方針書（前提条件、単価、算出ロジック） |
| WBS | `docs/rfp_answer_output/` | 工程別作業分解構造 |
| コスト内訳シート | `docs/rfp_answer_output/` or `RFP_answer/` | フェーズ別・ロール別の詳細コスト表 |
| TCO概算 | `docs/rfp_answer_output/` | 初期費用 + ランニング費用の総合試算 |

---

## Human Tasks

人間が判断・実行すべき作業:

- [ ] 人月単価を設定する（ロール別: PM、アーキテクト、SE、テスター等）
- [ ] プラットフォームベンダーから利用料見積を入手する
- [ ] パートナー（共同提案者）の見積を取りまとめる
- [ ] 価格方針を決定する（攻めの価格 / 安全マージン / 段階的ディスカウント）
- [ ] バッファ率（リスク引当）を設定する
- [ ] 生成されたWBSと工数見積をレビュー・調整する
- [ ] 最終見積額を承認する

---

## Claude Code Instructions

以下の指示文をClaude Codeにコピペして使用する。

### 1. 見積方針書ドラフト

```
proposal-strategy.md と architecture-policy.md を元に、見積方針書のドラフトを作成して。
以下の構成で:
1. 見積の前提条件・制約
2. 対象スコープ（Ph1必須 / Ph2参考）
3. 単価テーブル（ロール別、人月単価は {{UNIT_RATE}} 万円/月を基準）
4. 見積算出方式
5. プラットフォームライセンスコスト（参照先を明記）
6. バッファ・リスク引当の方針
出力先: docs/rfp_answer_output/estimation-policy.md
```

### 2. WBS（作業分解構造）生成

```
proposal-items-checklist.md と architecture-policy.md を元に、WBSを生成して。
工程（要件定義/設計/開発/テスト/移行/運用引継ぎ）ごとに作業を分解して。
各作業項目に: 工数（人月）、担当ロール、Ph1/Ph2区分 を付与して。
出力先: docs/rfp_answer_output/wbs.md
```

### 3. 工程別見積の草案生成

```
WBSを元に、工程別の見積草案を生成して。
以下を算出:
- 初期構築費用（Ph1）
- 初期構築費用（Ph2、参考）
- ランニング費用（年額）
- プラットフォーム利用料（年額）
- 合計TCO（5年間）
出力先: docs/rfp_answer_output/cost-breakdown.md
```

### 4. 見積の整合性チェック

```
estimation-policy.md の数値と、proposal-strategy.md のスコープ、architecture-policy.md の構成が整合しているか確認して。
矛盾や漏れがあれば指摘して。
```

### 5. 見積回答シート作成（RFP所定フォーマット）

```
RFP参照資料の見積回答テンプレートを読み取り、estimation-policy.md の数値を転記して回答シートを作成して。
出力先: RFP_answer/
```

---

## Skills Used

| Skill | Purpose |
|-------|---------|
| `estimation-advisor` | WBS生成、工数計算、見積整合性チェック |
| `rfp-auditor` | 見積対象範囲がRFP要件を網羅しているか検証 |

---

## Checklist

Phase完了の判定基準:

- [ ] `estimation-policy.md` が生成され、前提条件・単価・算出ロジックが明記されている
- [ ] WBSが生成され、全作業項目に工数とロールが割り当てられている
- [ ] Ph1必須スコープの見積が完成している
- [ ] Ph2参考スコープの見積が完成している
- [ ] ランニング費用（プラットフォーム利用料含む）が算出されている
- [ ] TCO（5年間等）が算出されている
- [ ] 見積額と戦略（攻め/守り）が整合している
- [ ] ベンダー見積（プラットフォーム利用料）が入手・反映されている
- [ ] 人間によるレビュー・最終承認が完了している
- [ ] RFP所定の回答フォーマットに転記されている（該当する場合）

---

## Tips

- 見積は「戦略」の数値的表現。戦略（攻め/守り）と見積額が矛盾しないよう注意する
- プラットフォーム利用料はベンダー公式の料金表・見積ツールを参照する。AI生成の概算は参考値として明記する
- 移行要件定義書のテーブル数・ジョブ数・IF数が見積の根拠データとなる。Phase 3の成果物精度がここに直結する
- バッファ率は案件リスクに応じて10-30%の範囲で設定するのが一般的
- Phase 3（設計）の完了度が低い段階でも、概算見積は並行で進められる。精緻化は設計確定後に行う

---

## Next Step

Phase 4完了後:

```
arcadia/guides/06-proposal.md を読んでPhase 5（提案書作成）を開始して
```
