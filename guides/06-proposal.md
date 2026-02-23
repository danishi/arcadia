# Phase 5: Proposal Writing Guide

提案書（マルチボリューム）の作成、回答シートの記入、スピーカーノートの生成を行うフェーズ。

---

## Overview

| Attribute | Value |
|-----------|-------|
| Phase | 5. Proposal |
| Duration | 5-7 days |
| Human/AI Split | 40% / 60% |
| Primary Actor | AI (Claude Code) with editorial review |
| Parallelizable | Yes -- Phase 4 (Estimation), Phase 6 (Demo) と並行可能 |

前フェーズまでの成果物（戦略、設計、見積）を提案書という最終的な顧客向けドキュメントに統合する。AIがMarkdownスライド設計書を生成し、人間がトーン・メッセージング・デザインを最終調整する。

---

## Input

| Item | Source | Description |
|------|--------|-------------|
| `proposal-strategy.md` | `docs/rfp_answer_output/` | Winテーマ、差別化ポイント、スコープ |
| `proposal-items-checklist.md` | `docs/rfp_answer_output/` | 提出物一覧とステータス |
| `architecture-policy.md` | `docs/rfp_answer_output/architecture-plan/` | 設計方針、ADR |
| 構成図 (`.drawio`) | `docs/rfp_answer_output/architecture-plan/` | 論理/物理構成図 |
| 移行設計図 (`.drawio`) | `docs/rfp_answer_output/migration-plan/` | 移行関連図面 |
| `estimation-policy.md` | `docs/rfp_answer_output/` | 見積方針、コスト構造 |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | 要件カバレッジの最終確認用 |

---

## Output

| Deliverable | Location | Description |
|-------------|----------|-------------|
| 提案書ボリューム (PPTX) | `RFP_answer/` | Vol1-Vol6等のマルチボリューム提案書 |
| 回答シート (XLSX) | `RFP_answer/` | RFP所定の回答フォーマット |
| スライド設計書 (MD) | `docs/rfp_answer_output/` | 各ボリュームのMarkdown版設計書 |
| スピーカーノート | PPTX内またはMD内 | プレゼンテーション用の話者ノート |

---

## Human Tasks

人間が判断・実行すべき作業:

- [ ] 提案書全体のトーン・メッセージングを確認する
- [ ] 各ボリュームのドラフトをレビューし、フィードバックを提供する
- [ ] 図面・グラフのデザインを最終調整する
- [ ] 機密情報の取り扱いを確認する（金額、体制図の社名等）
- [ ] スピーカーノートの内容を確認し、プレゼン準備に反映する
- [ ] 最終版のPPTX/XLSXをレイアウト調整する
- [ ] RFP所定フォーマットへの準拠を最終確認する

---

## Claude Code Instructions

以下の指示文をClaude Codeにコピペして使用する。

### 1. スライド設計書生成（ボリューム単位）

```
proposal-strategy.md と proposal-items-checklist.md を元に、Vol1（概要編）のスライド設計書を生成して。
各スライドについて:
- スライド番号
- タイトル
- 本文（箇条書き）
- 使用する図面（あれば）
- スピーカーノート
出力先: docs/rfp_answer_output/vol1-overview-slides.md
```

### 2. proposal-writerスキルによる生成

```
/proposal-writer でVol1のスライド設計書を生成して
```

### 3. スピーカーノート追加

```
vol1-overview-slides.md にスピーカーノートを追加して。
各スライドの要点と、プレゼン時に伝えるべきメッセージを記載して。
話し方のトーンは: 信頼感のある落ち着いたトーン、技術的な正確性を保ちつつ平易な表現
```

### 4. 提案書チェックリストでの漏れ確認

```
proposal-items-checklist.md を読んで、まだ未着手・作成中の項目を一覧で表示して。
各項目について、どのフェーズの成果物が必要かも示して。
```

### 5. PPTX生成

```
vol1-overview-slides.md を元にPPTXファイルを生成して。
出力先: RFP_answer/Vol1-overview.pptx
```

### 6. XLSX回答シート作成

```
RFP参照資料の回答テンプレートを読み取り、これまでの成果物から回答を転記してXLSXを生成して。
出力先: RFP_answer/
```

### 7. 全ボリュームのクロスリファレンスチェック

```
提案書Vol1-Vol6のスライド設計書を読んで、ボリューム間の数値・表現の整合性をチェックして。
矛盾があれば指摘して。
```

---

## Skills Used

| Skill | Purpose |
|-------|---------|
| `proposal-writer` | スライド設計書の構造化生成、セクション草案 |
| `rfp-auditor` | 提案書のRFP要件カバレッジ検証 |
| Plugin: `document-skills` | PPTX / XLSX ファイル生成 |
| Plugin: `example-skills` | ドキュメント共著、フロントエンド設計 |

---

## Checklist

Phase完了の判定基準:

- [ ] 全ボリューム（Vol1-Vol6等）のスライド設計書（MD）が完成している
- [ ] 各ボリュームのPPTXが生成されている
- [ ] スピーカーノートが全スライドに付与されている
- [ ] Phase 3の構成図が提案書内に適切に組み込まれている
- [ ] Phase 4の見積数値が提案書内に正確に反映されている
- [ ] XLSX回答シートが完成し、RFP所定フォーマットに準拠している
- [ ] `proposal-items-checklist.md` の全項目が「完了」ステータスになっている
- [ ] ボリューム間のクロスリファレンス整合性が確認されている
- [ ] 人間によるトーン・メッセージング・デザインのレビューが完了している

---

## Tips

- 提案書の「物語構造」を意識する: 課題（As-Is）→ 解決策（To-Be）→ 差別化（Why Us）→ 実現計画（How）→ コスト（Investment）
- Markdown設計書を先に完成させてからPPTX化する。Markdown段階でのレビュー・修正が最も効率的
- 見積数値は「単一の出典（estimation-policy.md）」から引用する。個別に編集すると不整合の原因になる
- スピーカーノートは「スライドに書いていないが口頭で伝えるべきこと」を中心に記載する
- Phase 6（デモ）のスクリーンショットやデモ動画が提案書に必要な場合、Phase 6と連携する

---

## Next Step

Phase 5完了後:

```
arcadia/guides/08-review.md を読んでPhase 7（品質チェック）を開始して
```

Phase 5と並行して:

```
arcadia/guides/07-demo.md を読んでPhase 6（デモ開発）の状況を確認して
```
