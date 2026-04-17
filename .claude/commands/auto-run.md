# フルオート実行パイプライン

`/setup` でフルオートモード（`EXECUTION_MODE=auto`）が選択された場合、またはユーザーが手動で `/auto-run` を実行した場合に、Phase 1〜7 を AI推論のみで一気通貫で実行するコマンドです。

$ARGUMENTS

---

## 前提条件チェック

実行前に以下を必ず確認してください。いずれかが満たされない場合はエラーメッセージを表示して停止する:

1. **`/setup` が完了していること**: `.claude/CLAUDE.md` に `__VARIABLE__` プレースホルダーが残っていないことを確認
2. **RFP資料が存在すること**: `source/` に RFP 本体（`rfp.md` または PDF/Word ファイル）が存在すること
3. **`phase-state.md` が存在すること**: セットアップで生成済みであること

いずれかが欠けている場合:

> **フルオート実行に必要な前提条件が満たされていません。**
>
> - [ ] `/setup` が完了していること
> - [ ] `source/` に RFP 資料が配置されていること
> - [ ] `phase-state.md` が存在すること
>
> まず `/setup` を実行し、RFP 資料を `input/` に配置してください。

---

## 実行原則

### AI推論による仮決定ルール

通常モードでは人間が判断する箇所を、以下のルールで AI が仮決定する:

1. **証拠ベース優先**: RFP資料、`org-data/`、`source/` の記載に基づき判断する。推測は最小限に留める
2. **保守的なデフォルト**: 迷った場合は安全側（リスクが低い方）を選択する
3. **全決定を記録**: AI が仮決定した項目は `phase-state.md` の Key Decisions に `[AUTO]` プレフィックス付きで記録する
4. **仮決定の根拠を明記**: 各決定に「なぜその判断をしたか」の根拠を1行で併記する
5. **不確実度の表明**: 判断に自信がない項目は `[AUTO][要確認]` マークを付ける

### 実行フロー制御

- 各フェーズの開始時に `phase-state.md` を更新（Status: `in_progress`）
- 各フェーズの完了時に `phase-state.md` を更新（Status: `completed`）
- 成果物の変更前後に `change-log.md` に `PLAN` / `DONE` エントリを追記（WAL 先書き）
- **エラー発生時**: 当該フェーズを `blocked` にし、ブロッカーを記録して次のフェーズに進む（可能な場合）
- **コンテキスト圧縮対策**: 各フェーズ完了時に `phase-state.md` の Checkpoint を詳細に書く（次のフェーズ開始時の復帰用）

### サブエージェント実行戦略（コンテキスト最適化）

各フェーズの実行は `.claude/agents/` に定義された**ロール特化サブエージェント**に委譲する。これにより親コンテキストの消費を最小化し、全 7 フェーズを 1 セッションで完走できる確率を大幅に高める。

#### ロール別エージェント定義

`.claude/agents/` に以下のエージェントが定義されている。各エージェントは担当スキル・ガイドへの参照と戻り値フォーマットが組み込み済み:

| エージェント | 担当 Phase | 主な責務 |
|-------------|-----------|---------|
| `researcher` | Pre-Phase, 1, 7 | RFP分析、ドキュメントカタログ化、会社情報取得、品質レビュー |
| `strategist` | 2, 2.5 | Win戦略定義、スコープ確認、チェックリスト生成、デザインシステム確定 |
| `architect` | 3 | アーキテクチャ設計、論理構成図、移行要件定義 |
| `estimator` | 4 | 見積方針書、WBS、コスト内訳算出 |
| `writer` | 5 | スライド設計書、PPTX/画像生成、PDF結合（DESIGN.md 強制参照） |
| `developer` | 6 | デモアプリ画面実装、モックデータ、ビルド検証（DESIGN.md 強制参照） |

#### 親エージェントの役割（オーケストレーター）

親エージェントは**フェーズ実行そのものを行わず**、以下のオーケストレーションに専念する:

1. `phase-state.md` を読み、現在のフェーズ状態を把握する
2. 次に実行すべきフェーズの **サブエージェントプロンプト** を構築する
3. Agent ツールでロール別エージェントを起動する
4. サブエージェントの結果サマリーを受け取る
5. 結果に基づき `phase-state.md` の Phase Summary / Key Decisions / Checkpoint を更新する
6. `change-log.md` に DONE エントリを追記する
7. 次のフェーズへ進む（またはブロッカーをスキップ）

> **重要**: 親エージェントは成果物ファイルの直接読み込み・生成を行わない。ファイル操作はすべてサブエージェント内で完結させる。

#### サブエージェントプロンプトの構築ルール

各エージェントにはスキル参照・戻り値フォーマット・制約が組み込み済みだが、プロンプトで以下を渡す必要がある:

| 項目 | 内容 | 例 |
|------|------|-----|
| **フェーズ指示** | 本ファイル内の該当フェーズセクション全文をコピー | `## Phase 1: Research` 全体 |
| **プロジェクトコンテキスト** | `.claude/CLAUDE.md` の Project Overview + Key Paths テーブル | — |
| **前フェーズの成果サマリー** | `phase-state.md` から前フェーズの Key Decisions + Checkpoint | 直近2フェーズ分で十分 |

> **ファイル内容の渡し方**: 大量のファイル内容をプロンプトに直接埋め込まない。ファイルパスを指定し、サブエージェント内で Read ツールで読み取らせる。スキル・ガイドの参照パスはエージェント定義に組み込み済み。

#### Agent ツール起動パラメータ

| パラメータ | 値 | 備考 |
|-----------|-----|------|
| `name` | ロール名（`researcher`, `strategist` 等） | `.claude/agents/{name}.md` を使用 |
| `mode` | `"bypassPermissions"` | 各エージェント定義の permissionMode と一致 |
| `model` | 省略（親を継承） | フェーズ処理は親と同等の推論力が必要 |
| `run_in_background` | `false` / `true` | 順次実行時は `false`、並列実行時は `true` |

> **注意**: サブエージェントは他のサブエージェントを起動できない（ネスト不可）。各エージェントは自己完結する必要がある。

#### 実行フロー: 順次モード（デフォルト）

```
researcher (Pre-Phase) → researcher (Phase 1) → strategist (Phase 2) →
strategist (Phase 2.5 / DESIGN.md) → architect (Phase 3) → estimator (Phase 4) →
writer (Phase 5) → developer (Phase 6) → researcher (Phase 7) → 完了レポート
```

各フェーズは前のフェーズのサブエージェント完了後に開始する。依存関係の確実な解決を保証する。

#### 実行フロー: 並列モード（`--parallel` 指定時）

Phase 2.5 完了後、依存関係に基づいたウェーブ実行で並列化する:

```
Wave 0: researcher (Pre-Phase → Phase 1) [sequential]
Wave 1: strategist (Phase 2) [sequential]
Wave 2: strategist (Phase 2.5 / DESIGN.md) [sequential, must complete before Phase 5/6]
Wave 3: architect (Phase 3) + developer (Phase 6) [parallel, run_in_background]
Wave 4: estimator (Phase 4) [after Phase 3 completed]
Wave 5: writer (Phase 5) [after Phase 4 completed]
Wave 6: researcher (Phase 7) [after all completed]
```

**並列実行の手順:**
1. Phase 2 完了後、`strategist` を Phase 2.5 モードで再度起動し `DESIGN.md` を確定する
2. `architect` と `developer` を同時に Agent ツールで起動する（`developer` は `run_in_background: true`）
3. `architect` の結果を待ち、`phase-state.md` を更新する
4. `developer` のバックグラウンド完了通知を受け取る
5. 両方完了後、`estimator` → `writer` → `researcher`(Phase 7) を順次実行する

> **Phase 2.5 は Phase 5/6 の前提条件**: `DESIGN.md` が未確定のまま Phase 5/6 を実行することは禁止。writer/developer は `DESIGN.md` を必ず Read してから画面・スライド生成を行う。

---

## Pre-Phase: 会社情報の自動取得（必須）

Phase 1 開始前に、自社および提案先の公開情報をWebから取得し、提案書作成に必要な企業コンテキストを整備する。

### 実行条件

- `org-data/company-profile.md` がテンプレート状態（主要項目が空欄）の場合 → 自社情報を取得
- `source/client-profile.md` が存在しない場合 → 提案先情報を取得
- 両方とも既にデータが充実している場合 → スキップ

### 実行手順

1. `org-data/company-profile.md` を読み込み、会社名・設立・資本金・従業員数の各セルが空欄かどうかを判定する

2. `source/client-profile.md` の存在を確認する。存在しない場合は `templates/docs/client-profile.md.tmpl` から生成する（`__CLIENT_NAME__` と `__TODAY__` を置換）

3. `company-research` スキルの手順に従い、自社・提案先の情報を WebSearch / WebFetch で取得する
   - 対象: `both`（自社 + 提案先）
   - ユーザー確認: スキップ（フルオートのため）

4. 取得した情報を構造化してファイルに反映する:
   - 自社 → `org-data/company-profile.md` のテンプレート空欄を埋める
   - 提案先 → `source/client-profile.md` に書き込む

5. `phase-state.md` に記録:
   - `[AUTO] Pre-Phase: 会社情報をWebから自動取得（自社: {N}項目、提案先: {N}項目）`

### 完了条件

- `org-data/company-profile.md` の会社概要セクションに基本情報が記入されている
- `source/client-profile.md` が存在し、企業概要が記入されている

---

## Phase 1: Research（調査）— AI比率: 100%

通常 AI 80% のフェーズ。フルオートでは人間レビューをスキップし、全工程を AI が実行する。

### 実行手順

1. `source/rfp_reference/` 配下の全ファイルをスキャンし、`docs-catalog.md` を生成する
   - 出力先: `.claude/skills/rfp-auditor/references/docs-catalog.md`

2. `source/rfp.md`（または RFP 本体ファイル）を解析し、`rfp-requirements-checklist.md` を生成する
   - 各要件に ID を振り、カテゴリ（機能/非機能/コンプライアンス/運用/移行）で分類する
   - 出力先: `.claude/skills/rfp-auditor/references/rfp-requirements-checklist.md`

3. RFP 解析サマリー `rfp-analysis.md` を生成する
   - 構成: エグゼクティブサマリー、主要要件トップ10、技術的制約、リスク、スケジュール要件、ドメイン用語
   - 出力先: `output/plan/rfp-analysis.md`

4. ドメイン用語を `.claude/CLAUDE.md` のドメイン用語テーブルに追加する

5. `phase-state.md` を更新:
   - Phase 1 Status: `completed`
   - Key Decisions に抽出した要件数とカテゴリ分布を記録

### 完了条件

- `docs-catalog.md` が存在し、全参照ドキュメントが網羅されている
- `rfp-requirements-checklist.md` が存在し、要件に ID が振られている
- `rfp-analysis.md` が存在し、RFP の要旨が正確にまとめられている

---

## Phase 2: Strategy（戦略策定）— AI比率: 100%

通常 人間 60% のフェーズ。フルオートでは AI が戦略判断も代行する。

### AI仮決定ルール（Phase 2固有）

| 判断項目 | AI仮決定の方針 |
|---------|--------------|
| Winテーマ（3つ） | RFP の重点要件 + `PROPOSED_PRODUCTS` の強みから導出。`org-data/service-catalog.md` があれば参照 |
| 差別化ポイント | 技術面（プラットフォーム機能）を中心に、RFP 要件との適合度から判断 |
| フェーズ分けの要否 | RFP が明示的に要求していなければ「初期開発 + 保守」の2区分をデフォルトとする |
| 価格方針 | 「バランス型」（適正マージン）をデフォルトとする |
| スコープ境界 | RFP 要件チェックリストの全項目をスコープに含める |

### 実行手順

1. `rfp-analysis.md` と `rfp-requirements-checklist.md` を読み込む

2. 提案戦略書 `proposal-strategy.md` のドラフトを生成する
   - 構成: エグゼクティブサマリー、As-Is/To-Be 分析、Winテーマ（3つ）、差別化ポイント、スコープ定義、リスクと対策、体制・パートナー方針
   - 出力先: `output/plan/proposal-strategy.md`

3. プラットフォーム機能マッピング表を生成する
   - 各 RFP 要件に対する適合度（○/△/×）を評価
   - 出力先: `output/plan/platform-capability-mapping.md`

4. 提案書作成チェックリスト `proposal-items-checklist.md` を生成する
   - 出力先: `output/plan/proposal-items-checklist.md`

5. `phase-state.md` を更新:
   - Phase 2 Status: `completed`
   - Key Decisions に `[AUTO]` マーク付きで Winテーマ、差別化ポイント、スコープ判断を記録

### 完了条件

- `proposal-strategy.md` が完成し、Winテーマ・差別化ポイントが記載されている
- `proposal-items-checklist.md` が完成し、全提出物が網羅されている
- プラットフォーム機能マッピングが完成している

---

## Phase 2.5: Design System（デザインシステム確定）— AI比率: 100%

Phase 2 で固まった Win テーマ・クライアント像・業界トーンに基づき、プロジェクトルートの `DESIGN.md` を確定する。Phase 5（提案書）と Phase 6（デモ）で共通の色・タイポ・コンポーネント規約を定義し、生成成果物の統率感を担保する独立フェーズ。

### 前提

- `/setup` により `templates/docs/DESIGN.md.tmpl` から `DESIGN.md` の初期骨格が配置済み（デフォルトは ARCADIA ニュートラルプリセット）
- Phase 2 の `proposal-strategy.md`、`source/client-profile.md` が生成済み

### AI仮決定ルール（Phase 2.5固有）

| 判断項目 | AI仮決定の方針 |
|---------|--------------|
| Design Preset | 以下の優先順位で決定: (1) クライアントブランドカラーが `source/client-profile.md` or RFPに明記 → `client-brand`、(2) 業界慣例（金融/公共=保守、IT/エンタメ=先進、製造/物流=実直）を踏まえ調整 → `custom`、(3) いずれもなし → `arcadia-neutral` を維持 |
| Primary Color | クライアントブランド色があれば採用。HSL で明度 20-35% / 彩度 30-60% の範囲に正規化 |
| Accent Color | Primary の補色または類似色相差 ±150° を目安に、業界トーンに合わせ選定 |
| トーンの強度 | 業界別に `density` と余白を調整（保守的業界=余白広め、先進的業界=密度高め） |
| Guardrails | 業界・クライアント固有の NG 表現があれば `Never ...` として追記 |

### 実行手順

1. `DESIGN.md` を Read する（`/setup` で配置済みの骨格）
2. `output/plan/proposal-strategy.md`、`source/client-profile.md`、`org-data/company-profile.md` を Read する
3. 上記の AI 仮決定ルールに従い、`DESIGN.md` の以下セクションを更新する:
   - `Meta.Design Preset`
   - `1. Visual Theme & Atmosphere`（業界・Win テーマに応じた調整）
   - `2. Color Palette & Roles`（ブランド反映時のみ色トークンを更新）
   - `7. Slide-Specific Rules`（クライアント固有の装飾指示があれば追記）
   - `8. Demo App Rules` の Tailwind 変数ブロック（色トークン変更時のみ）
   - `9. Change Log` に 1 行追加（`Phase 2.5 / [AUTO] ...`）
4. `change-log.md` に `PLAN` → `DONE` エントリを追記する（WAL）
5. `phase-state.md` を更新:
   - Phase 2.5 Status: `completed`
   - Key Decisions に `[AUTO]` マーク付きで Design Preset とトーン判断根拠を記録

### 完了条件

- `DESIGN.md` の `Meta.Design Preset` が `__DESIGN_PRESET__` から確定値に更新されている
- `Change Log` に Phase 2.5 の更新エントリが追加されている
- ブランド色採用時: `2. Color Palette` と `8. Demo App Rules` の変数値が整合している

### 重要

- **Phase 2.5 は Phase 5 と Phase 6 の前提条件**。writer / developer は `DESIGN.md` を **必ず Read** してから成果物生成を行う
- トーン判断に迷う場合は `arcadia-neutral`（デフォルト）を維持し `[AUTO][要確認]` マークを付与する
- スライドの per-volume `design.md` は本ファイルを継承し、ボリューム固有の装飾のみを追加する

---

## Phase 3: Design（設計）— AI比率: 100%

通常 AI 60% のフェーズ。フルオートでは技術選定も AI が仮決定する。

### AI仮決定ルール（Phase 3固有）

| 判断項目 | AI仮決定の方針 |
|---------|--------------|
| 技術スタック | `PROPOSED_PRODUCTS` と `PLATFORM_NAME` を中核とし、RFP 要件に合致するベストプラクティス構成を選択 |
| 非機能要件（SLA等） | RFP に明記されている値を採用。未記載の場合は業界標準値を適用 |
| 移行方式 | 段階移行をデフォルトとする（ビッグバンよりリスクが低い） |
| セキュリティ方式 | クラウドプロバイダーの標準セキュリティ機能 + RFP 要件を満たす構成 |

### 実行手順

1. `proposal-strategy.md` と `rfp-requirements-checklist.md` を読み込む

2. アーキテクチャ方針書 `architecture-policy.md` を ADR 形式で生成する
   - 構成: 設計原則（5つ以内）、ADR一覧、セキュリティ設計、インフラ設計、非機能要件対応
   - 出力先: `output/plan/architecture-plan/architecture-policy.md`

3. 論理構成図を DrawIO MCP で生成する
   - フェーズ分けしない場合: `logical-architecture.drawio`
   - フェーズ分けする場合: `logical-architecture-ph{N}.drawio`
   - 出力先: `output/plan/architecture-plan/`

4. 移行要件定義書 `ph1-migration-requirements.md` を生成する
   - RFP 参照資料から現行構成を読み取り、移行対象を棚卸し
   - 出力先: `output/plan/migration-plan/ph1-migration-requirements.md`

5. `phase-state.md` を更新:
   - Phase 3 Status: `completed`
   - Key Decisions に `[AUTO]` マーク付きで主要 ADR を記録

### 完了条件

- `architecture-policy.md` が完成し、ADR が記載されている
- 論理構成図（.drawio）が生成されている
- 移行要件定義書が生成されている

---

## Phase 4: Estimation（見積）— AI比率: 100%

通常 50/50 のフェーズ。フルオートでは単価・バッファ率も AI が仮決定する。

### AI仮決定ルール（Phase 4固有）

| 判断項目 | AI仮決定の方針 |
|---------|--------------|
| 人月単価 | `org-data/rate-card.md` が存在すればその値を使用。なければ一般的な IT コンサル単価（PM: 200万/月、アーキテクト: 180万/月、SE: 150万/月、テスター: 120万/月）を仮設定し `[AUTO][要確認]` を付与 |
| バッファ率 | 20%（標準的なリスク引当）をデフォルトとする |
| 価格戦略 | Phase 2 で決定した方針に従う（デフォルト: バランス型） |
| ライセンスコスト | 公開情報ベースの概算。正確な見積はベンダーに確認が必要として `[AUTO][要確認]` を付与 |

### 実行手順

1. `proposal-strategy.md`、`architecture-policy.md`、`ph1-migration-requirements.md` を読み込む

2. `org-data/rate-card.md` が存在すればロール別単価を読み込む

3. 見積方針書 `estimation-policy.md` を生成する
   - 構成: 前提条件、スコープ、単価テーブル、算出方式、ライセンスコスト、バッファ方針
   - 出力先: `output/plan/estimation-policy.md`

4. WBS（作業分解構造）を生成する
   - 出力先: `output/plan/wbs.md`

5. 工程別コスト内訳を生成する
   - 初期構築費用、ランニング費用（年額）、TCO（5年間）
   - 出力先: `output/plan/cost-breakdown.md`

6. `phase-state.md` を更新:
   - Phase 4 Status: `completed`
   - Key Decisions に `[AUTO]` マーク付きで単価設定とバッファ率を記録

### 完了条件

- `estimation-policy.md` が完成し、単価・算出ロジックが明記されている
- `wbs.md` が完成し、工数とロールが割り当てられている
- `cost-breakdown.md` が完成し、TCO が算出されている

---

## Phase 5: Proposal（提案書作成）— AI比率: 100%

通常 AI 60% のフェーズ。フルオートではトーン・メッセージングも AI が決定する。

### AI仮決定ルール（Phase 5固有）

| 判断項目 | AI仮決定の方針 |
|---------|--------------|
| 提案書構成 | 原則として単冊（Single Volume）で構成する。RFPが分冊を明示的に指定している場合、または40スライドを超えてコンテキスト品質が維持困難な場合に限り、ユーザーに確認の上で分冊する。エグゼクティブ・サマリー以外の重複記述は排除しMECEを徹底 |
| トーン・色・タイポ | **Phase 2.5 で確定した `DESIGN.md` に厳密に従う**（独自判断禁止）。writer は `DESIGN.md` を必ず Read してから設計書を作成する |
| メッセージ構造 | 課題（As-Is）→ 解決策（To-Be）→ 差別化（Why Us）→ 実現計画（How）→ コスト（Investment） |

### 実行手順

1. 全中間成果物（戦略書、設計書、見積書、チェックリスト）を読み込む

2. 提案書構成を決定し（原則単冊）、`proposal-strategy.md` に反映する。40スライド超でコンテキスト品質維持が困難な場合、またはRFPが分冊を指定している場合のみ分冊を検討

3. 各ボリュームのスライド設計書（MD）を `proposal-writer` スキルの手順に従って生成する
   - 出力先: `output/slides/vol{N}-{topic}/slides.md`

4. 各スライドにスピーカーノートを追加する

5. SLIDE_METHOD に応じたスライド生成:
   - `pptx`: PPTX ファイルを生成 → `output/Vol{N}-{topic}.pptx`
   - `nanobanana`: NanoBanana スキルでスライド画像を生成 → `output/slides/vol{N}-{topic}/slide-{NN}.png`
   - **NanoBanana 未設定の場合**: スライド設計書（MD）の完成をもって Phase 5 の成果とし、画像生成はスキップ。`[AUTO]` で「NanoBanana 未設定のためスライド画像生成をスキップ」を記録

6. **PDF結合（NanoBanana モード時のみ）**: スライド画像生成完了後、`document-skills` プラグインを使用して全ボリュームのスライド画像を結合した PDF を生成する:
   - 各ボリュームの `output/slides/vol{N}-{topic}/slide-*.png` を自然順（slide-01, slide-02, ...）で読み取る
   - 全ボリュームの画像を結合した PDF を `output/proposal-all.pdf` に出力する
   - PDF 生成に失敗した場合は `[AUTO][要確認]` で記録して次に進む

7. `phase-state.md` を更新:
   - Phase 5 Status: `completed`
   - Key Decisions に `[AUTO]` マーク付きで提案書構成（単冊 or 分冊理由）を記録

### 完了条件

- 全ボリュームのスライド設計書（MD）が完成している
- スピーカーノートが全スライドに付与されている
- PPTX またはスライド画像が生成されている（環境が整っている場合）
- NanoBanana モード時: 結合 PDF（`output/proposal-all.pdf`）が生成されている

---

## Phase 6: Demo（デモ開発）— AI比率: 100%

通常 AI 80% のフェーズ。フルオートではデモシナリオも AI が定義する。

### AI仮決定ルール（Phase 6固有）

| 判断項目 | AI仮決定の方針 |
|---------|--------------|
| 画面構成 | CLAUDE.md の Demo Screens セクションに定義されている Core 画面を優先実装 |
| デモシナリオ | Winテーマに沿って「課題 → 解決 → 効果」のストーリーを構成 |
| モックデータ | RFP のドメインに合わせたリアリティのあるデータ（各テーブル 50-100 レコード） |
| カラー・タイポ・コンポーネント | **Phase 2.5 で確定した `DESIGN.md` の Tailwind 変数マッピング（§8）に厳密に従う**。Tailwind 素のカラートークン（`bg-slate-*`, `bg-blue-*` 等）は使用禁止 |

### 実行手順

1. `proposal-strategy.md` と CLAUDE.md の Demo Screens 定義を読み込む

2. デモアプリ仕様書 `demo-app-spec.md` を生成する
   - 出力先: プロジェクトルート `demo-app-spec.md`

3. `demo-builder` スキルの手順に従い、Core 画面を実装する
   - `/dashboard`: dashboard パターン
   - `/analysis`: chat パターン
   - `/scenario`: wizard パターン

4. モックデータを生成する
   - CLAUDE.md の Sample Data テーブル定義に基づく

5. `npm run build` でビルドエラーがないか確認する
   - エラーがある場合は修正を試みる
   - 修正不能な場合は `[AUTO][要確認]` で記録して次に進む

6. `phase-state.md` を更新:
   - Phase 6 Status: `completed`（ビルド成功時）または `blocked`（ビルドエラー解消不能時）
   - Key Decisions に `[AUTO]` マーク付きで実装した画面一覧を記録

### 完了条件

- `demo-app-spec.md` が存在する
- Core 画面が実装されている
- モックデータが生成されている
- `npm run build` がエラーなく完了する（理想）

---

## Phase 7: Review（品質チェック）— AI比率: 100%

通常 AI 90% のフェーズ。フルオートでは Go/No-Go 判断を除く全工程を AI が実行する。

### 実行手順

1. `rfp-auditor` スキルの手順に従い、RFP 適合性の全体チェックを実行する
   - 各要件: MATCH / MISMATCH / MISSING を判定
   - カバレッジ率を算出

2. 見積数値の整合性チェックを実行する
   - `estimation-policy.md` 内の自己矛盾チェック
   - 提案書内の金額と `estimation-policy.md` の一致確認

3. ボリューム間のクロスリファレンス整合性チェックを実行する

4. MISMATCH / MISSING 項目のうち AI で修正可能なものを修正する

5. 監査レポートを生成する
   - 出力先: `output/plan/audit-report.md`

6. `phase-state.md` を更新:
   - Phase 7 Status: `completed`
   - Key Decisions に `[AUTO]` マーク付きでカバレッジ率と主要な MISSING 項目を記録

### 完了条件

- 監査レポートが生成されている
- MISMATCH 項目がゼロ、または修正済みである
- カバレッジ率が記録されている

---

## 完了レポート

全 Phase 完了後（または一部 blocked で進行不能になった場合）、以下の完了レポートを表示する:

### 1. フェーズ完了サマリー

| Phase | Status | 主な成果物 | AI決定数 | 要確認数 |
|-------|--------|-----------|---------|---------|
| 1. Research | ✅ / ❌ | docs-catalog.md, rfp-requirements-checklist.md, rfp-analysis.md | N | N |
| 2. Strategy | ✅ / ❌ | proposal-strategy.md, proposal-items-checklist.md | N | N |
| 3. Design | ✅ / ❌ | architecture-policy.md, 論理構成図 | N | N |
| 4. Estimation | ✅ / ❌ | estimation-policy.md, wbs.md, cost-breakdown.md | N | N |
| 5. Proposal | ✅ / ❌ | スライド設計書（MD）、PPTX/PNG、PDF（NanoBanana時） | N | N |
| 6. Demo | ✅ / ❌ | demo-app, demo-app-spec.md | N | N |
| 7. Review | ✅ / ❌ | audit-report.md | N | N |

### 2. `[AUTO][要確認]` 項目の一覧

AI が仮決定したが人間の確認が必要な項目を一覧で表示する:

```markdown
| # | Phase | 項目 | AI仮決定の内容 | 根拠 |
|---|-------|------|--------------|------|
| 1 | 2 | Winテーマ | ... | RFP §X.X に基づく |
| 2 | 4 | 人月単価 | PM: 200万/月 | org-data 未設定のためデフォルト値 |
| ... | | | | |
```

### 3. 次のステップ案内

> **フルオート実行が完了しました。**
>
> 全成果物は「叩き台」として生成されています。以下の手順で品質を高めてください:
>
> 1. **`[AUTO][要確認]` 項目を確認** — 上記一覧の各項目について、AI の仮決定が妥当か確認・修正してください
> 2. **戦略をレビュー** — `output/plan/proposal-strategy.md` の Winテーマ・差別化ポイントを確認してください
> 3. **見積を検証** — `output/plan/estimation-policy.md` の単価・工数を確認してください
> 4. **提案書を通読** — 各ボリュームのスライド設計書を確認してください
> 5. **デモを動作確認** — `cd demo-app && npm run dev` でローカル動作を確認してください
>
> 修正は通常の対話モード（Refinement）で行えます。

---

## 引数による部分実行

`/auto-run` は引数でフェーズ範囲を指定できる:

```
/auto-run                    # Phase 1〜7 全実行
/auto-run 1-3                # Phase 1〜3 のみ実行
/auto-run 3                  # Phase 3 のみ実行
/auto-run 5-7                # Phase 5〜7 のみ実行（Phase 4 までの成果物が前提）
```

引数が与えられた場合、指定範囲のフェーズのみを実行する。前提フェーズの成果物が存在しない場合はエラーメッセージを表示する。

---

## 中断と再開

フルオート実行中にユーザーが中断した場合:

1. `phase-state.md` の最後に更新された Checkpoint から状態を復帰できる
2. 再開時は `/auto-run {中断されたフェーズ番号}-7` で残りのフェーズを実行できる
3. 通常のスタンダードモードに切り替えて、以降を対話的に進めることも可能
