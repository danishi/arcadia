<p align="center">
  <img src="assets/hero-banner.png" alt="ARCADIA" width="100%" />
</p>

<h1 align="center">ARCADIA</h1>

<p align="center">
  <strong>AI-driven Requirement Comprehension & Automated Deliverable Integration Architecture</strong><br/>
  断片的なインプットから、提案のすべてをAIが組み上げる
</p>

---

RFP・議事録・既存資料・既存ソースなど、揃わないインプットからでも、提案書・システムアーキテクチャ・WBS/スケジュール・見積・デモアプリを、人 + Claude Code + MCP + Skills のセミオートで一貫生産するテンプレートリポジトリ。

> **本リポジトリはテンプレートリポジトリです。** GitHub の「Use this template」ボタンから新しいプロジェクトリポジトリを作成して使用してください。

---

## Why ARCADIA?

| 課題 | ARCADIA のアプローチ |
|------|---------------------|
| RFP 対応が属人的で工数がかかる | 分析から成果物までのセミオートパイプライン |
| ナレッジが個人に閉じている | 構造化ドキュメント + Claude Code による永続コンテキスト |
| 提案品質にばらつきがある | 再現可能な 7 フェーズワークフローとビルトインチェック |
| テンプレートがプラットフォーム固定 | テンプレート変数（`__PLATFORM_NAME__` 等）であらゆるスタックに対応 |

---

## Directory Structure

```
__PROJECT_SLUG__/                        # "Use this template" で生成したリポジトリ
  README.md                              # 本ファイル
  tasks.md                               # タスクトラッカー（手書き / Skill / Claude 自動）
  phase-state.md                         # フェーズ状態管理（セッション中断・復帰用）
  change-log.md                          # Write-Ahead Log（append-only 変更履歴）
  guides/
    00-overview.md                       # 7 フェーズワークフロー概要
    01-kickoff.md                        # プロジェクト初期化ガイド（テンプレート変数一覧あり）
    02-research.md                       # (Phase 1) RFP 分析ガイド
    03-strategy.md                       # (Phase 2) 提案戦略ガイド
    04-design.md                         # (Phase 3) アーキテクチャ・移行計画
    05-estimation.md                     # (Phase 4) 見積ガイド
    06-proposal.md                       # (Phase 5) 提案書作成
    07-demo.md                           # (Phase 6) デモアプリ開発
    08-review.md                         # (Phase 7) 品質チェック・RFP 準拠確認
    09-resume.md                         # セッション復帰ガイド（中断からの再開手順）
  .claude/
    CLAUDE.md                            # Claude Code プロジェクト指示（/setup で .tmpl から生成）
    settings.json                        # Claude Code 設定（/setup で .tmpl から生成）
    commands/
      setup.md                           # /setup カスタムコマンド（初期セットアップ）
    skills/
      rfp-auditor/                       # RFP 要件チェック Skill
      proposal-writer/                   # 提案書ドラフト Skill
      estimation-advisor/                # 見積支援 Skill
      demo-builder/                      # デモアプリ生成 Skill
      data-import/                       # 資料取込・自動分類 Skill
      task-tracker/                      # タスク起票 Skill
      task-process/                      # タスク処理・トリアージ Skill
      company-research/                  # 会社情報自動取得 Skill（Web検索）
      nanobanana/                        # AI 画像生成 Skill（Gemini）
  templates/
    .mcp.json.tmpl                       # MCP 設定テンプレート
    env-example.tmpl                     # 環境変数テンプレート
    docs/                                # 提案ドキュメントテンプレート
      proposal-strategy.md.tmpl
      proposal-items-checklist.md.tmpl
      estimation-policy.md.tmpl
      rfp-analysis.md.tmpl
      phase-state.md.tmpl
      change-log.md.tmpl
      client-profile.md.tmpl
      architecture-plan/
        architecture-policy.md.tmpl
  input/                                 # 資料投入口（全種別対応 → data-import で自動分類）
  org-data/                              # 組織固有データ（単価表・サービスカタログ等）
    rate-card.md                         # 人月単価・値引基準
    service-catalog.md                   # サービス仕様・差別化ポイント
    company-profile.md                   # 会社概要・導入実績
    whitepapers/index.md                 # ホワイトペーパー索引
  demo-app/                              # Next.js デモアプリボイラープレート
  output/                                  # 提案成果物（最終 PPTX/XLSX & スライド画像）
    proposal-all.pdf                       # 全ボリューム結合 PDF（NanoBanana モード時）
    slides/                                # スライド成果物
      vol{N}-{topic}/                      #   Volume 別サブフォルダ
        slides.md                          #     スライド骨子（proposal-writer 出力）
        design.md                          #     デザイン指示 MD（NanoBanana 入力）
        slide-01.png                       #     最終スライド画像（NanoBanana 出力）
        vol{N}-{topic}.pdf                 #     ボリューム別 PDF（combine_pdf.py 出力）
    plan/                                  # 中間成果物
      architecture-plan/                   #   アーキテクチャ設計
        architecture-policy.md             #     アーキテクチャ方針・ADR
        logical-architecture.drawio        #     論理構成図（必須。フェーズ分けする場合は ph{N} 付き）
        physical-architecture.drawio       #     物理構成図（RFP要求時のみ）
      migration-plan/                      #   移行計画
  scripts/                                 # ユーティリティスクリプト
    combine_pdf.py                         #   スライド画像を結合して PDF 生成
  tmp/                                     # AI 作業用一時ディレクトリ（中身は Git 管理外）
  assets/                                # README 用画像等
```

### `input/` — 統合資料投入口

`input/` はプロジェクトに取り込むすべての資料の投入口。`data-import` スキルがファイル名・内容から自動分類し、`source/`（案件固有）または `org-data/`（組織横断）の適切な場所に振り分ける。

| 投入できる資料 | 分類先 |
|-------------|-------|
| RFP 本体・別紙・仕様書 | `source/rfp.md` / `source/rfp_reference/` |
| 議事録・ヒアリングメモ | `source/minutes/` |
| Q&A・質問回答書 | `source/rfp_reference/qa/` |
| RFP 正誤表・修正版 | `source/rfp_reference/amendments/` |
| 現行システム設計書・技術仕様 | `source/rfp_reference/specs/` |
| 見積関連資料 | `source/rfp_reference/estimation/` |
| 単価表・原価表 | `org-data/rate-card.md` を更新 |
| サービスカタログ・製品資料 | `org-data/service-catalog.md` を更新 |
| 会社概要・導入実績 | `org-data/company-profile.md` を更新 |
| ホワイトペーパー・技術資料 | `org-data/whitepapers/` |

> **手動振り分けも可能**: `input/org-data/` または `input/source/` サブフォルダにファイルを配置すると、振り分け先を明示指定できる。詳細は `data-import` スキル（`.claude/skills/data-import/SKILL.md`）を参照。

---

## 7 Phases at a Glance

| # | Phase | 内容 | 主な成果物 | 人/AI |
|---|-------|------|-----------|-------|
| 1 | **Research** | RFP 分析、参考資料カタログ作成 | docs-catalog.md、要件チェックリスト | 20/80 |
| 2 | **Strategy** | 提案戦略策定、スコープ定義 | proposal-strategy.md、スコープマトリクス | 60/40 |
| 3 | **Design** | アーキテクチャ設計、移行計画 | アーキテクチャ図、ADR、移行計画 | 40/60 |
| 4 | **Estimation** | 工数・コスト算出 | estimation-policy.md、コスト内訳 | 50/50 |
| 5 | **Proposal** | 提案書作成（複数巻） | PPTX 提案書、Excel 回答シート | 40/60 |
| 6 | **Demo** | デモアプリ + データ基盤構築 | Web アプリ、プラットフォームスクリプト | 20/80 |
| 7 | **Review** | RFP 準拠確認、品質保証 | 監査レポート、ギャップ分析 | 10/90 |
| — | **Refinement** | 対話的な成果物修正・追加資料取込・品質向上 | 修正版成果物 | 50/50 |

Phase 7 完了後は **Refinement（叩き上げ）** に移行する。人間と AI が対話しながら、成果物の修正・追加資料の読み込み・提案内容のブラッシュアップを繰り返す。

---

## Execution Modes

ARCADIA は 2 つの実行モードをサポートする。`/setup` 実行時に選択する。

### Standard Mode（デフォルト）

各フェーズを人間と対話しながら順次進行する。戦略・設計・見積の要所で人間がレビュー・承認する。

```
/setup                       # 対話型セットアップ → フェーズごとに人間が指示
```

### Full Auto Mode

セットアップ完了後、Phase 1〜7 を AI推論のみで一気通貫実行する。人間の判断が必要な箇所も AI が最善の推論で仮決定し、全成果物を「叩き台」として生成する。

```
/setup                       # セットアップ時にフルオートモードを選択
/auto-run                    # 手動で全フェーズ自動実行（セットアップ完了後）
/auto-run 3-5                # 特定フェーズ範囲のみ自動実行
```

| 特徴 | Standard | Full Auto |
|------|----------|-----------|
| 実行速度 | フェーズごとに人間確認 | 一気通貫（1セッション） |
| 人間の関与 | 各フェーズで必須 | 事後レビュー（Refinement） |
| 判断の精度 | 人間主導で高精度 | AI推論による叩き台 |
| 推奨シーン | 初回/複雑案件 | 時間制約/全体像把握 |

**Full Auto Mode の仕組み:**
- **Pre-Phase**: 自社・提案先の会社情報をWebから自動取得し `org-data/` と `source/` に格納
- AI が行った全ての判断は `phase-state.md` に `[AUTO]` マーク付きで記録
- 不確実な判断には `[AUTO][要確認]` マークを付与
- 完了後に `[AUTO][要確認]` 項目の一覧を表示し、人間の確認を促す
- Refinement モードで対話的に修正・改善できる

---

## Quick Start

### Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) がインストール・設定済みであること
- MCP サーバー: `context7`、`drawio`（最低限）

### 1. テンプレートからリポジトリを作成

GitHub 上で本リポジトリの **「Use this template」** ボタンをクリックし、新しいプロジェクトリポジトリを作成します。

```bash
# 作成したリポジトリをクローン
git clone https://github.com/your-org/__PROJECT_SLUG__.git
cd __PROJECT_SLUG__
```

### 2. `/setup` カスタムコマンドでプロジェクトを初期化

Claude Code を起動し、**`/setup` カスタムコマンド**を実行します。

```bash
# Claude Code を起動
claude
```

```
# Claude Code 内で /setup を実行（引数なしで対話的に確認）
/setup

# または、プロジェクト情報を引数として渡す
/setup クライアント名: ABC銀行, 提案主体: XYZ株式会社, 案件概要: 次世代DWH刷新, ...
```

`/setup` コマンドが以下を自動実行します:

1. テンプレート変数の対話的な入力（クライアント名、プラットフォーム、提出期限など）
2. **実行モードの選択**（スタンダード or フルオート）
3. `.claude/CLAUDE.md.tmpl` からプロジェクト固有の `CLAUDE.md` を生成
4. RFP ドキュメント用のディレクトリ構造を作成（`source/`、`output/` 等）
5. `.mcp.json`、`.gitignore`、`.env.example` を生成
6. `output/plan/` にドキュメントテンプレートを配置
7. フルオートモード選択時: `/auto-run` で Phase 1〜7 を自動実行

#### セットアップで生成されるディレクトリ

`/setup` 実行後、以下のディレクトリとファイルがプロジェクトルートに作成されます（`demo-app/` はテンプレートに同梱済み）:

```
source/                                   # RFP 関連ドキュメント（セットアップで生成）
  rfp_reference/                          #   RFP 参考資料・別紙・仕様書の格納先
  minutes/                                #   議事録・ヒアリングメモの格納先
output/                                   # 提案成果物（セットアップで生成）
  slides/                                 #   スライド成果物（Volume 別サブフォルダ）
    vol{N}-{topic}/                       #     骨子 MD / デザイン MD / 最終画像を集約
  plan/                                   #   各フェーズの中間成果物
    rfp-analysis.md                       #     RFP 分析結果
    proposal-strategy.md                  #     提案戦略
    proposal-items-checklist.md           #     提案項目チェックリスト
    estimation-policy.md                  #     見積方針
    architecture-plan/                    #     アーキテクチャ設計ドキュメント
      architecture-policy.md              #       アーキテクチャ方針・ADR
      logical-architecture-ph{N}.drawio   #       論理構成図（必須）
    migration-plan/                       #     移行計画ドキュメント
demo-app/                                 # Next.js デモアプリ（テンプレート同梱済み）
```

| ディレクトリ | 用途 | 対応フェーズ |
|-------------|------|-------------|
| `source/rfp_reference/` | RFP 本体・別紙・仕様書などの原典資料を格納 | Phase 1 (Research) |
| `source/minutes/` | クライアントとの打ち合わせ議事録・ヒアリングメモ | 全フェーズ |
| `output/` | 最終提出する提案書（PPTX）、回答シート（Excel）等 | Phase 5 (Proposal) |
| `output/slides/` | スライド成果物（骨子MD、デザインMD、最終画像をVolume別に集約） | Phase 5 (Proposal) |
| `output/plan/` | 分析結果・戦略・設計・見積など各フェーズの中間成果物 | Phase 1–5 |
| `demo-app/` | デモアプリのソースコード（Next.js App Router + TypeScript） | Phase 6 (Demo) |
| `tmp/` | AI（Claude Code）の作業用一時ディレクトリ。中間ファイル生成等に使用。中身は Git 管理外 | 全フェーズ |

また、以下の設定ファイルも自動生成されます:

| ファイル | 用途 |
|---------|------|
| `.claude/CLAUDE.md` | プロジェクト固有の Claude Code 指示ファイル（テンプレート変数を適用済み） |
| `.mcp.json` | MCP サーバー接続設定 |
| `.env.example` | 環境変数のテンプレート（`PLATFORM_HOST`、`PLATFORM_TOKEN` 等） |

> **詳細**: `guides/01-kickoff.md` に完全なセットアップ手順（org-data の準備、プラットフォーム選定、RFP ドキュメント配置など）を記載しています。

---

## セッションの中断と復帰

ARCADIA は Claude Code のセッションが中断されたり、コンテキストが消去されても、途中から作業を再開できるように設計されています。

### 仕組み

`/setup` 実行時に生成される `phase-state.md` が、フェーズ進行状態の Single Source of Truth として機能します。各フェーズの Status（進行状況）、成果物の完了状態、重要な意思決定の記録、および次のアクションがこのファイルに記録されます。

### 復帰方法

新しいセッションを開始するだけで自動的に復帰します:

```bash
# Claude Code を起動（新しいセッション）
claude
```

```
# 以下のいずれかで復帰
続きから           # 前回のチェックポイントから再開
Phase 3を再開して  # 特定のフェーズを指定して再開
```

Claude Code はセッション開始時に `phase-state.md` を自動的に読み取り、以下を行います:

1. 各フェーズの進行状態を確認
2. 成果物ファイルの存在を検証
3. 現在の状態サマリーと推奨アクションを提示

> `/setup` は初回のプロジェクト初期化時のみ使用します。復帰には不要です。

### 万が一 phase-state.md がない場合

成果物ファイルの存在チェックから状態を再構築するフォールバック手順が `guides/09-resume.md` に記載されています。

---

## Claude Code Tool Ecosystem

ARCADIA は Claude Code の**カスタムコマンド**、**Skills**、**MCP サーバー**を組み合わせて動作します。

### Custom Commands

`.claude/commands/` に定義されたコマンドは、Claude Code 内で `/<コマンド名>` で呼び出せます。

| コマンド | 用途 | 定義ファイル |
|---------|------|-------------|
| `/setup` | プロジェクト初期セットアップ（テンプレート変数の適用、ディレクトリ・設定ファイル生成） | `.claude/commands/setup.md` |
| `/auto-run` | フルオート実行パイプライン（Phase 1〜7 を AI推論のみで一気通貫実行） | `.claude/commands/auto-run.md` |

### Skills

`.claude/skills/` に定義された再利用可能なドメイン知識です。Claude Code が各フェーズで自動的に参照します。

| Skill | 用途 | 主な利用フェーズ |
|-------|------|----------------|
| `rfp-auditor` | RFP 要件チェック・コンプライアンス監査 | 1, 2, 7 |
| `proposal-writer` | 提案書ドラフト作成支援 | 2, 5 |
| `estimation-advisor` | 見積・WBS 生成支援 | 4 |
| `demo-builder` | デモアプリ画面生成 | 6 |
| `data-import` | 資料取込・自動分類（`input/` → `source/` or `org-data/`） | 1 |
| `company-research` | 自社・提案先の会社情報をWebから自動取得 | 0 (Setup) |
| `task-tracker` | タスク・検討事項の起票（`/task-add`） | 全フェーズ |
| `task-process` | 蓄積タスクのトリアージ・対話的処理（`/task-process`） | 全フェーズ |
| `nanobanana` | AI 画像生成・編集（Gemini、図表・スライド向け） | 5, 6 |
| `example-skills` | フロントエンドデザイン、ドキュメント共著、Web アプリテスト、PDF/PPTX/DOCX/XLSX 生成 | 5, 6 |
| `document-skills` | ドキュメント生成（example-skills ファミリー） | 5 |

### MCP Servers

| MCP | 用途 | 必須 |
|-----|------|:---:|
| `context7` | ライブラリ・フレームワークのドキュメント検索 | Yes |
| `drawio` | アーキテクチャ図の生成・編集 | Yes |
| `aws-knowledge` | AWS ドキュメント参照（AWS 利用時） | No |
| `google-developer-knowledge` | GCP ドキュメント参照（GCP 利用時） | No |

### Task Tracking

プロジェクトルートの `tasks.md` で、提案策定中に発生するタスク・検討事項・課題を一元管理します。

#### 起票方法（3パターン）

| 方法 | やり方 |
|------|-------|
| **手書き** | `tasks.md` の `## Open` セクションにタイトルと説明を直接書く（メタデータは Claude が自動補完） |
| **スキル経由** | Claude Code で `/task-add セキュリティ要件の確認` |
| **Claude 自動** | 会話中に検討事項を発見すると Claude が自動登録＆通知 |

手書きの場合、最小限これだけで起票できます:

```markdown
### TASK-1: RFP要件3.2.1の解釈を確認する

クライアントに確認が必要。複数の読み方がありえる。
```

#### 蓄積タスクの処理

```
/task-process          # ダッシュボード表示
/task-process --triage # 優先度の一括見直し
/task-process TASK-5   # 特定タスクを対話的に処理
```

---

## Principles

1. **Reproducibility** -- 同じ 7 フェーズに従うことで、どのチームでも一貫した成果を生み出せる
2. **Semi-automation** -- 戦略・意思決定は人間、分析・ドラフト・チェックは AI が担当
3. **Platform Independence** -- テンプレート変数（`__VARIABLE__`）でプラットフォーム固有の詳細を抽象化
4. **Claude Code-native** -- Claude Code のツールエコシステム（MCP、Skills、Agents）を前提に設計
5. **Evidence-based** -- 提案書のすべての記述は RFP 要件または参考資料に紐づく
6. **Dual-axis Information** -- 顧客/RFP 情報（`source/`）と組織固有情報（`org-data/`）を二軸で管理し、Skills が両軸を横断参照

---

## Design Patterns

ARCADIA に組み込まれている主要なデザインパターン。

### Three-Layer Structure: Strategy → Checklist → Deliverable

```
proposal-strategy.md          -- WHY: Win themes, differentiators, risk mitigation
  ↓
proposal-items-checklist.md   -- WHAT: Every required deliverable item, status-tracked
  ↓
Vol{N}-{topic}.pptx           -- HOW: Actual proposal documents
estimation-policy.md          -- HOW: Cost breakdown with rationale
```

各レイヤーは上位を参照。戦略変更はチェックリスト→成果物へカスケードする。

### Evidence-based Verification

`rfp-auditor` Skill による体系的検証: 要件抽出→成果物マッピング→MATCH / MISMATCH / MISSING 判定→カバレッジレポート。

### Phased Delivery（条件付き）

- **デフォルト**: 初期開発 + 保守の2区分（フェーズ分けしない）
- **フェーズ分け提案の条件**: RFPがフェーズ分けを要求している場合、またはスケジュール・予算に無理が生じている場合
- フェーズ数・名称・スコープ境界はRFP要件に従い柔軟に設計する

### Resumable Phase Transitions

セッション間でフェーズ作業を中断・復帰できるチェックポイント機構:

1. `phase-state.md` がフェーズ状態の Single Source of Truth
2. 各フェーズの Status / Deliverables / Key Decisions / Checkpoint を記録
3. 新規セッション開始時に `phase-state.md` を読み取り、成果物存在を検証してコンテキスト復元
4. `change-log.md` に全変更を append-only で記録（Write-Ahead Log）— 通常時は読まない
5. 詳細: `guides/09-resume.md`

### Mock-first Demo

1. ドメインに合ったサンプルデータを定義
2. 全画面をモックデータで実装
3. プラットフォーム API を接続
4. API 未接続時はモックにフォールバック

---

## File Naming Conventions

| パターン | 例 | 用途 |
|---------|---|------|
| `{topic}.md` | `proposal-strategy.md` | 戦略・方針ドキュメント |
| `{topic}-checklist.md` | `proposal-items-checklist.md` | トラッカブルなチェックリスト |
| `{prefix}-{topic}.drawio` | `logical-architecture.drawio` | アーキテクチャ図（論理構成図は必須）。フェーズ分けする場合は `logical-architecture-ph{N}.drawio` |
| `ph{n}-{seq}-{topic}.drawio` | `ph1-01-current-system.drawio` | フェーズ別設計図（フェーズ分けする場合のみ） |
| `Vol{N}-{topic}.pptx` | `Vol1-overview.pptx` | 提案書（PPTX 方式） |
| `vol{N}-{topic}/slides.md` | `vol1-overview/slides.md` | スライド骨子（`output/slides/` 配下） |
| `vol{N}-{topic}/design.md` | `vol1-overview/design.md` | デザイン指示 MD（`output/slides/` 配下） |
| `vol{N}-{topic}/slide-{NN}.png` | `vol1-overview/slide-01.png` | スライド画像（NanoBanana 出力、`output/slides/` 配下） |
| `vol{N}-{topic}/vol{N}-{topic}.pdf` | `vol1-overview/vol1-overview.pdf` | ボリューム別 PDF（`output/slides/` 配下） |
| `proposal-all.pdf` | `proposal-all.pdf` | 全ボリューム結合 PDF（`output/` 配下） |
