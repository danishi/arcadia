# Phase 2: Strategy Guide

提案戦略の策定、差別化ポイントの定義、スコープ（Ph1/Ph2）の確定を行うフェーズ。

---

## Overview

| Attribute | Value |
|-----------|-------|
| Phase | 2. Strategy |
| Duration | 2-3 days |
| Human/AI Split | 60% / 40% |
| Primary Actor | Human (Strategy Lead) |
| Parallelizable | No (Phase 1完了が前提; Phase 3-6の起点) |

人間が主導して「なぜ我々が勝つのか」を定義する。AIはAs-Is/To-Be分析、課題マッピング、ドラフト生成を担う。ここで確定した戦略が、以降すべてのフェーズの方針となる。

---

## Input

| Item | Source | Description |
|------|--------|-------------|
| `rfp-analysis.md` | `docs/rfp_answer_output/` | Phase 1で生成したRFP解析サマリー |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | Phase 1で生成した要件チェックリスト |
| `docs-catalog.md` | `.claude/skills/rfp-auditor/references/` | Phase 1で生成したドキュメントカタログ |
| 人間の戦略判断 | (口頭/メモ) | 差別化ポイント、価格方針、パートナー戦略 |

---

## Output

| Deliverable | Location | Description |
|-------------|----------|-------------|
| `proposal-strategy.md` | `docs/rfp_answer_output/` | 提案戦略書（Winテーマ、差別化、リスク対策） |
| `proposal-items-checklist.md` | `docs/rfp_answer_output/` | 提案書作成チェックリスト（全提出物の一覧とステータス） |
| スコープマトリクス | `docs/rfp_answer_output/` | Ph1/Ph2のスコープ分割表 |

---

## Human Tasks

人間が判断・実行すべき作業:

- [ ] Winテーマ（なぜクライアントが我々を選ぶべきか）を3つ以内で定義する
- [ ] 差別化ポイント（技術、価格、体制、パートナー）を明確にする
- [ ] Ph1/Ph2のスコープ境界を判断・承認する
- [ ] 価格方針の方向性を決定する（攻めの価格 vs 安全マージン）
- [ ] パートナー分担（共同提案がある場合）を確認する
- [ ] 競合情報があれば共有する
- [ ] `proposal-strategy.md` のドラフトをレビュー・承認する

---

## Claude Code Instructions

以下の指示文をClaude Codeにコピペして使用する。

### 1. 提案戦略書ドラフト生成

```
rfp-analysis.md と rfp-requirements-checklist.md を元に、提案戦略書のドラフトを作成して。
以下の構成で:
1. エグゼクティブサマリー
2. As-Is/To-Be分析
3. Winテーマ（3つ）
4. 差別化ポイント
5. Ph1/Ph2スコープ案
6. リスクと対策
7. 体制・パートナー方針
出力先: docs/rfp_answer_output/proposal-strategy.md
```

### 2. RFP課題 x プラットフォーム機能マッピング

```
RFP要件チェックリストを元に、{{PLATFORM_NAME}} の機能マッピング表を作って。
各要件に対して:
- 対応する {{PLATFORM_NAME}} 機能/サービス名
- 適合度（○完全対応 / △カスタマイズ要 / ×非対応）
- 補足説明
出力先: docs/rfp_answer_output/platform-capability-mapping.md
```

### 3. 提案書作成チェックリスト生成

```
rfp-requirements-checklist.md と proposal-strategy.md を元に、提案書作成チェックリストを生成して。
各提出物について:
- 提出物名
- 対応するRFP要件ID
- 担当（人間 / AI）
- ステータス（未着手 / 作成中 / レビュー待ち / 完了）
出力先: docs/rfp_answer_output/proposal-items-checklist.md
```

### 4. As-Is / To-Be 比較表

```
RFP参照資料から現行システム構成を読み取り、As-Is/To-Be比較表を作成して。
カテゴリ別（データ基盤、ETL、分析、MA、セキュリティ、運用）で整理して。
出力先: docs/rfp_answer_output/as-is-to-be-comparison.md
```

---

## Skills Used

| Skill | Purpose |
|-------|---------|
| `rfp-auditor` | 要件と戦略の整合性チェック |
| `proposal-writer` | 戦略書ドラフト生成、チェックリスト構造化 |

---

## Checklist

Phase完了の判定基準:

- [ ] `proposal-strategy.md` が生成され、人間がレビュー・承認している
- [ ] Winテーマが3つ以内で明確に定義されている
- [ ] Ph1/Ph2のスコープ境界が確定している
- [ ] `proposal-items-checklist.md` が生成され、全提出物が網羅されている
- [ ] プラットフォーム機能マッピングが完成し、×（非対応）項目の対策が記載されている
- [ ] パートナー分担（ある場合）が明確になっている
- [ ] 戦略書の内容がRFP要件チェックリストと矛盾していないことが確認されている

---

## Tips

- 戦略策定は最も「人間依存度」が高いフェーズ。AIのドラフトはあくまで叩き台であり、最終判断は必ず人間が行う
- 競合情報が不足している場合、AIに一般的な競合製品の強み/弱みの調査を依頼できる
- Q&A（質問会）で得た情報は、戦略書にただちに反映する
- 戦略が固まった段階で Phase 3（設計）と Phase 6（デモ）は並行着手可能

---

## Next Step

Phase 2完了後、以下のフェーズに分岐して進行可能:

```
arcadia/guides/04-design.md を読んでPhase 3（アーキテクチャ設計）を開始して
```

```
arcadia/guides/07-demo.md を読んでPhase 6（デモ開発）を並行で開始して
```
