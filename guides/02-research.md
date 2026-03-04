# Phase 1: RFP調査ガイド

RFP資料の解析、参照ドキュメントのカタログ化、要件の構造的抽出を行うフェーズ。

---

## 概要

| 項目 | 値 |
|------|-------|
| フェーズ | 1. Research（調査） |
| 所要期間 | 2-3日 |
| 人間/AI比率 | 20% / 80% |
| 主担当 | AI（Claude Code） |
| 並行可否 | 不可（最初のフェーズ; Phase 2 開始前に完了が必要） |

RFPおよび関連資料を機械的に読み取り、要件・ドキュメント構造・ドメイン用語を抽出する。ここで生成した成果物が、以降すべてのフェーズのインプットとなる。

---

## インプット

| 項目 | ソース | 説明 |
|------|--------|------|
| RFP本紙 | `source/rfp.md` | Markdownに変換済みのRFP文書 |
| 参照資料 | `source/rfp_reference/` | RFP添付資料群（設計書、IF定義、テーブル定義等） |
| プロジェクト設定 | `.claude/CLAUDE.md` | Phase 0 (Kickoff) で生成済みの変数定義 |

---

## アウトプット

| 成果物 | 出力先 | 説明 |
|--------|--------|------|
| `docs-catalog.md` | `.claude/skills/rfp-auditor/references/` | 全参照ドキュメントのカタログ（パス、種類、内容要約） |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | RFP要件の構造化チェックリスト（ID付き） |
| `rfp-analysis.md` | `output/plan/` | RFP解析サマリー（要旨、主要要件、リスク） |

---

## 人間の作業

人間が判断・実行すべき作業:

- [ ] RFP資料を入手し `source/` および `source/rfp_reference/` に配置する
- [ ] RFP本紙がPDF/Word形式の場合、Markdownに変換する（またはClaude Codeに依頼）
- [ ] 参照資料のフォルダ構造を維持して配置する
- [ ] 生成された `docs-catalog.md` の正確性をスポットチェックする
- [ ] 生成された `rfp-requirements-checklist.md` の漏れ・誤りをレビューする
- [ ] ドメイン用語テーブル（CLAUDE.md内）に不足がないか確認する
- [ ] クライアントとの質問会（Q&A）がある場合は議事録を `source/minutes/` に配置する

---

## Claude Codeへの指示

以下の指示文をClaude Codeにコピペして使用する。

### 1. ドキュメントカタログ生成

```
source/rfp_reference/ 配下の全ファイルをスキャンして docs-catalog.md を生成して。
各ファイルについて: パス、ファイル種類、ページ数/行数、主要な内容を記録して。
出力先: .claude/skills/rfp-auditor/references/docs-catalog.md
```

### 2. RFP要件チェックリスト生成

```
source/rfp.md を読んで、RFP要件チェックリストを生成して。
各要件にIDを振り、カテゴリ（機能/非機能/コンプライアンス/運用/移行）で分類して。
出力先: .claude/skills/rfp-auditor/references/rfp-requirements-checklist.md
```

### 3. RFP解析サマリー生成

```
source/rfp.md と docs-catalog.md を元に、RFP解析サマリーを作成して。
以下の構成で:
1. RFP概要（1ページ）
2. 主要要件トップ10
3. 技術的な制約・前提条件
4. リスク要因
5. スケジュール要件
6. ドメイン用語表
出力先: output/plan/rfp-analysis.md
```

### 4. 競合比較表の作成（任意）

```
RFP要件を元に、__PLATFORM_NAME__ と競合製品（__COMPETITOR_1__, __COMPETITOR_2__）の比較表を作成して。
各要件に対する適合度を ○/△/× で評価して。
出力先: output/plan/competitive-analysis.md
```

### 5. ドメイン用語テーブル更新

```
RFP解析で特定したドメイン用語を CLAUDE.md のドメイン用語テーブルに追加して。
```

---

## 使用スキル

| スキル | 用途 |
|--------|------|
| `rfp-auditor` | 要件抽出、ドキュメントカタログ生成、構造化チェックリスト作成 |
| MCP: `context7` | RFPで言及されている技術のドキュメント参照 |

---

## 完了チェックリスト

Phase完了の判定基準:

- [ ] `docs-catalog.md` が生成され、全参照ドキュメントが網羅されている
- [ ] `rfp-requirements-checklist.md` が生成され、要件にIDが振られている
- [ ] `rfp-analysis.md` が生成され、RFPの要旨が正確にまとめられている
- [ ] CLAUDE.md のドメイン用語テーブルが更新されている
- [ ] 人間によるレビューが完了し、明らかな漏れ・誤りが修正されている
- [ ] 参照資料のうち、解析不能なファイル（暗号化PDF等）がリストアップされている

---

## ヒント

- RFP本紙のMarkdown変換品質がこのフェーズ全体の精度を左右する。表やフロー図が崩れている場合は手動補正を推奨
- 参照資料が大量（100+ファイル）の場合、カタログ生成を分割実行する
- Q&A議事録が入手できた場合は、要件チェックリストにQ&A由来の補足を追記する

---

## phase-state.md の更新

Phase 1の作業に伴い `phase-state.md` を更新する:

| タイミング | 更新内容 |
|-----------|---------|
| 開始時 | Phase Summary → Status: `in_progress`, Started に日付記入 |
| 成果物完成時 | Deliverables の該当チェックボックスを `[x]` に変更 |
| 意思決定時 | Key Decisions に判断内容と理由を追記 |
| セッション終了前 | Checkpoint に進捗メモ、Last Checkpoint の Next Action を更新 |
| 完了時 | Status: `completed`, Completed に日付記入、Session Log に記録 |

---

## 次のステップ

Phase 1完了後、`guides/03-strategy.md` に進む:

```
guides/03-strategy.md を読んでPhase 2（戦略策定）を開始して
```
