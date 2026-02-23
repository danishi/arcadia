# Phase 1: RFP Research Guide

RFP資料の解析、参照ドキュメントのカタログ化、要件の構造的抽出を行うフェーズ。

---

## Overview

| Attribute | Value |
|-----------|-------|
| Phase | 1. Research |
| Duration | 2-3 days |
| Human/AI Split | 20% / 80% |
| Primary Actor | AI (Claude Code) |
| Parallelizable | No (first phase; must complete before Phase 2) |

RFPおよび関連資料を機械的に読み取り、要件・ドキュメント構造・ドメイン用語を抽出する。ここで生成した成果物が、以降すべてのフェーズのインプットとなる。

---

## Input

| Item | Source | Description |
|------|--------|-------------|
| RFP本紙 | `docs/rfp.md` | Markdownに変換済みのRFP文書 |
| 参照資料 | `docs/rfp_reference/` | RFP添付資料群（設計書、IF定義、テーブル定義等） |
| プロジェクト設定 | `.claude/CLAUDE.md` | Phase 0 (Kickoff) で生成済みの変数定義 |

---

## Output

| Deliverable | Location | Description |
|-------------|----------|-------------|
| `docs-catalog.md` | `.claude/skills/rfp-auditor/references/` | 全参照ドキュメントのカタログ（パス、種類、内容要約） |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | RFP要件の構造化チェックリスト（ID付き） |
| `rfp-analysis.md` | `docs/rfp_answer_output/` | RFP解析サマリー（要旨、主要要件、リスク） |

---

## Human Tasks

人間が判断・実行すべき作業:

- [ ] RFP資料を入手し `docs/` および `docs/rfp_reference/` に配置する
- [ ] RFP本紙がPDF/Word形式の場合、Markdownに変換する（またはClaude Codeに依頼）
- [ ] 参照資料のフォルダ構造を維持して配置する
- [ ] 生成された `docs-catalog.md` の正確性をスポットチェックする
- [ ] 生成された `rfp-requirements-checklist.md` の漏れ・誤りをレビューする
- [ ] ドメイン用語テーブル（CLAUDE.md内）に不足がないか確認する
- [ ] クライアントとの質問会（Q&A）がある場合は議事録を `docs/minutes/` に配置する

---

## Claude Code Instructions

以下の指示文をClaude Codeにコピペして使用する。

### 1. ドキュメントカタログ生成

```
docs/rfp_reference/ 配下の全ファイルをスキャンして docs-catalog.md を生成して。
各ファイルについて: パス、ファイル種類、ページ数/行数、主要な内容を記録して。
出力先: .claude/skills/rfp-auditor/references/docs-catalog.md
```

### 2. RFP要件チェックリスト生成

```
docs/rfp.md を読んで、RFP要件チェックリストを生成して。
各要件にIDを振り、カテゴリ（機能/非機能/コンプライアンス/運用/移行）で分類して。
出力先: .claude/skills/rfp-auditor/references/rfp-requirements-checklist.md
```

### 3. RFP解析サマリー生成

```
docs/rfp.md と docs-catalog.md を元に、RFP解析サマリーを作成して。
以下の構成で:
1. RFP概要（1ページ）
2. 主要要件トップ10
3. 技術的な制約・前提条件
4. リスク要因
5. スケジュール要件
6. ドメイン用語表
出力先: docs/rfp_answer_output/rfp-analysis.md
```

### 4. 競合比較表の作成（任意）

```
RFP要件を元に、{{PLATFORM_NAME}} と競合製品（{{COMPETITOR_1}}, {{COMPETITOR_2}}）の比較表を作成して。
各要件に対する適合度を ○/△/× で評価して。
出力先: docs/rfp_answer_output/competitive-analysis.md
```

### 5. ドメイン用語テーブル更新

```
RFP解析で特定したドメイン用語を CLAUDE.md のドメイン用語テーブルに追加して。
```

---

## Skills Used

| Skill | Purpose |
|-------|---------|
| `rfp-auditor` | 要件抽出、ドキュメントカタログ生成、構造化チェックリスト作成 |
| MCP: `context7` | RFPで言及されている技術のドキュメント参照 |

---

## Checklist

Phase完了の判定基準:

- [ ] `docs-catalog.md` が生成され、全参照ドキュメントが網羅されている
- [ ] `rfp-requirements-checklist.md` が生成され、要件にIDが振られている
- [ ] `rfp-analysis.md` が生成され、RFPの要旨が正確にまとめられている
- [ ] CLAUDE.md のドメイン用語テーブルが更新されている
- [ ] 人間によるレビューが完了し、明らかな漏れ・誤りが修正されている
- [ ] 参照資料のうち、解析不能なファイル（暗号化PDF等）がリストアップされている

---

## Tips

- RFP本紙のMarkdown変換品質がこのフェーズ全体の精度を左右する。表やフロー図が崩れている場合は手動補正を推奨
- 参照資料が大量（100+ファイル）の場合、カタログ生成を分割実行する
- Q&A議事録が入手できた場合は、要件チェックリストにQ&A由来の補足を追記する

---

## Next Step

Phase 1完了後、`guides/03-strategy.md` に進む:

```
guides/03-strategy.md を読んでPhase 2（戦略策定）を開始して
```
