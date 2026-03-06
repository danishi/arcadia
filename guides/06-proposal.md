# Phase 5: 提案書作成ガイド

提案書（マルチボリューム）の作成、回答シートの記入、スピーカーノートの生成を行うフェーズ。

---

## 概要

| 項目 | 値 |
|------|-------|
| フェーズ | 5. Proposal（提案書作成） |
| 所要期間 | 5-7日 |
| 人間/AI比率 | 40% / 60% |
| 主担当 | AI（Claude Code）+ 編集レビュー |
| 並行可否 | 可 -- Phase 4（見積）、Phase 6（デモ）と並行可能 |

前フェーズまでの成果物（戦略、設計、見積）を提案書という最終的な顧客向けドキュメントに統合する。AIがMarkdownスライド設計書を生成し、人間がトーン・メッセージング・デザインを最終調整する。

---

## インプット

| 項目 | ソース | 説明 |
|------|--------|------|
| `proposal-strategy.md` | `output/plan/` | Winテーマ、差別化ポイント、スコープ |
| `proposal-items-checklist.md` | `output/plan/` | 提出物一覧とステータス |
| `architecture-policy.md` | `output/plan/architecture-plan/` | 設計方針、ADR |
| 構成図 (`.drawio`) | `output/plan/architecture-plan/` | 論理/物理構成図 |
| 移行設計図 (`.drawio`) | `output/plan/migration-plan/` | 移行関連図面 |
| `estimation-policy.md` | `output/plan/` | 見積方針、コスト構造 |
| `rfp-requirements-checklist.md` | `.claude/skills/rfp-auditor/references/` | 要件カバレッジの最終確認用 |

---

## アウトプット

| 成果物 | 出力先 | 説明 |
|--------|--------|------|
| スライド骨子 (MD) | `output/slides/vol{N}-{topic}/slides.md` | proposal-writer が生成するMarkdown設計書 |
| デザイン指示 (MD) | `output/slides/vol{N}-{topic}/design.md` | NanoBanana用のデザイン指示書 |
| スライド画像 (PNG) | `output/slides/vol{N}-{topic}/slide-{NN}.png` | NanoBanana方式: 最終スライド画像 |
| 結合 PDF | `output/proposal-all.pdf` | NanoBanana方式: 全スライド画像を結合した PDF |
| 提案書 (PPTX) | `output/Vol{N}-{topic}.pptx` | PPTX方式: PowerPointファイル |
| 回答シート (XLSX) | `output/` | RFP所定の回答フォーマット |
| スピーカーノート | slides.md 内 | プレゼンテーション用の話者ノート |

> **Note:** スライド作成方法は `/setup` 実行時に選択した `SLIDE_METHOD`（`pptx` or `nanobanana`）に従う。CLAUDE.md の Project Overview テーブルを確認すること。

---

## 人間の作業

人間が判断・実行すべき作業:

- [ ] 提案書全体のトーン・メッセージングを確認する
- [ ] 各ボリュームのドラフトをレビューし、フィードバックを提供する
- [ ] 図面・グラフのデザインを最終調整する
- [ ] 機密情報の取り扱いを確認する（金額、体制図の社名等）
- [ ] スピーカーノートの内容を確認し、プレゼン準備に反映する
- [ ] 最終版のPPTX/XLSXをレイアウト調整する
- [ ] RFP所定フォーマットへの準拠を最終確認する

---

## Claude Codeへの指示

以下の指示文をClaude Codeにコピペして使用する。

### 1. 分冊構成の確認

```
proposal-strategy.md のセクション3「提案書構成案」を読んで、分冊構成（Vol数とそれぞれのテーマ）を確認して。
分冊構成がまだ定義されていない場合は、RFPの要件とチェックリストの内容量を分析して、
分冊構成を提案して。
```

### 2. スライド設計書生成（ボリューム単位）

```
proposal-strategy.md と proposal-items-checklist.md を元に、Vol{N}（{テーマ}）のスライド設計書を生成して。
各スライドについて:
- スライド番号
- タイトル
- 本文（箇条書き）
- 使用する図面（あれば）
- スピーカーノート
出力先: output/slides/vol{N}-{topic}/slides.md
```

### 3. proposal-writerスキルによる生成

```
/proposal-writer でVol{N}のスライド設計書を生成して
```

### 4. スピーカーノート追加

```
output/slides/vol{N}-{topic}/slides.md にスピーカーノートを追加して。
各スライドの要点と、プレゼン時に伝えるべきメッセージを記載して。
話し方のトーンは: 信頼感のある落ち着いたトーン、技術的な正確性を保ちつつ平易な表現
```

### 5. 提案書チェックリストでの漏れ確認

```
proposal-items-checklist.md を読んで、まだ未着手・作成中の項目を一覧で表示して。
各項目について、どのフェーズの成果物が必要かも示して。
```

### 6. スライド生成

#### PPTX方式（`SLIDE_METHOD=pptx` の場合）

```
output/slides/vol{N}-{topic}/slides.md を元にPPTXファイルを生成して。
出力先: output/Vol{N}-{topic}.pptx
```

#### NanoBanana方式（`SLIDE_METHOD=nanobanana` の場合）

```
output/slides/vol{N}-{topic}/slides.md を元に、NanoBananaスキルでスライド画像を1枚ずつ生成して。
出力先: output/slides/vol{N}-{topic}/slide-01.png 〜 slide-XX.png
アスペクト比: 16:9
```

### 7. PDF結合（NanoBanana方式の場合）

```
全ボリュームのスライド画像を結合して1つのPDFを生成して。
document-skills プラグインを使用して、output/slides/ 配下の全 vol{N}-{topic}/ フォルダの
slide-*.png を自然順で読み取り、output/proposal-all.pdf に出力して。
```

### 8. XLSX回答シート作成

```
RFP参照資料の回答テンプレートを読み取り、これまでの成果物から回答を転記してXLSXを生成して。
出力先: output/
```

### 9. 全ボリュームのクロスリファレンスチェック

```
提案書の全ボリュームのスライド設計書を読んで、ボリューム間の数値・表現の整合性をチェックして。
矛盾があれば指摘して。
```

---

## 使用スキル

| スキル | 用途 |
|--------|------|
| `proposal-writer` | スライド設計書の構造化生成、セクション草案 |
| `rfp-auditor` | 提案書のRFP要件カバレッジ検証 |
| `nanobanana` | AI画像生成によるスライド作成（NanoBanana方式選択時） |
| Plugin: `document-skills` | PPTX / XLSX ファイル生成（PPTX方式選択時） |
| Plugin: `example-skills` | ドキュメント共著、フロントエンド設計 |

---

## 完了チェックリスト

Phase完了の判定基準:

- [ ] `proposal-strategy.md` で定義された全ボリュームのスライド設計書（MD）が完成している
- [ ] 各ボリュームのスライド（PPTXまたはスライド画像）が生成されている
- [ ] NanoBanana方式の場合: 結合 PDF（`output/proposal-all.pdf`）が生成されている
- [ ] スピーカーノートが全スライドに付与されている
- [ ] Phase 3の構成図が提案書内に適切に組み込まれている
- [ ] Phase 4の見積数値が提案書内に正確に反映されている
- [ ] XLSX回答シートが完成し、RFP所定フォーマットに準拠している
- [ ] `proposal-items-checklist.md` の全項目が「完了」ステータスになっている
- [ ] ボリューム間のクロスリファレンス整合性が確認されている
- [ ] 人間によるトーン・メッセージング・デザインのレビューが完了している

---

## ヒント

- 提案書の「物語構造」を意識する: 課題（As-Is）→ 解決策（To-Be）→ 差別化（Why Us）→ 実現計画（How）→ コスト（Investment）
- Markdown設計書を先に完成させてからPPTX化する。Markdown段階でのレビュー・修正が最も効率的
- 見積数値は「単一の出典（`estimation-policy.md`）」から引用する。個別に編集すると不整合の原因になる
- スピーカーノートは「スライドに書いていないが口頭で伝えるべきこと」を中心に記載する
- Phase 6（デモ）のスクリーンショットやデモ動画が提案書に必要な場合、Phase 6と連携する

---

## phase-state.md の更新

Phase 5の作業に伴い `phase-state.md` を更新する:

| タイミング | 更新内容 |
|-----------|---------|
| 開始時 | Phase Summary → Status: `in_progress`, Started に日付記入 |
| 成果物変更前 | `change-log.md` に `PLAN` エントリを追記（WAL 先書き） |
| 成果物変更後 | `change-log.md` に `DONE` エントリを追記 |
| 成果物完成時 | Deliverables の該当チェックボックスを `[x]` に変更（各Volume完了ごと） |
| 意思決定時 | Key Decisions に判断内容と理由を追記（分冊構成、トーン決定等） |
| セッション終了前 | Checkpoint に進捗メモ、Last Checkpoint の Next Action を更新 |
| 完了時 | Status: `completed`, Completed に日付記入 |

---

## 次のステップ

Phase 5完了後:

```
guides/08-review.md を読んでPhase 7（品質チェック）を開始して
```

Phase 5と並行して:

```
guides/07-demo.md を読んでPhase 6（デモ開発）の状況を確認して
```
