# プロジェクト初期セットアップ

ARCADIA テンプレートリポジトリから新しいRFP対応プロジェクトを初期化するコマンドです。

以下の手順を**すべて**実行してください。

---

## Step 0: インプット資料の配置案内

**ヒアリング開始前に**、まずユーザーに以下のメッセージを表示し、インプット資料の配置を促してください:

> **📂 まず、RFP 関連資料を `input/` フォルダに入れてください。**
>
> プロジェクトルートの `input/` フォルダに、以下の資料をすべて格納してください:
>
> - RFP 本体（PDF、Word、Excel 等）
> - 参考資料・別紙・仕様書
> - 議事録・ヒアリングメモ（あれば）
>
> フォルダ構造は気にせず、ファイルをそのまま入れてください。セットアップ後に自動で整理します。
>
> 配置が完了したら「OK」と入力してください。後で配置する場合は「スキップ」と入力してください。

- ユーザーが「OK」または配置完了を示す応答をした場合 → 「入力情報」のヒアリングに進む
- ユーザーが「スキップ」または後回しを示す応答をした場合 → 「Phase 1（Research）開始前に必ず `input/` フォルダに資料を配置してください」と注意を表示し、「入力情報」のヒアリングに進む

---

## 入力情報

ユーザーから以下の情報を受け取ってください:

$ARGUMENTS

上記が空の場合、または不足情報がある場合は、以下の **Phase A → B → C → D** の順序で対話的にヒアリングしてください。各フェーズの条件分岐に従い、不要な質問はスキップしてください。

---

### Phase A: 基本情報

**必須項目:**
- `CLIENT_NAME` -- クライアント名（例: "ABC銀行"）
- `PROPOSER_NAME` -- 提案主体（例: "XYZ株式会社"）
- `PROJECT_DESCRIPTION` -- 案件概要（例: "次世代データ基盤刷新", "ECサイトリニューアル", "基幹系クラウド移行"）
- `DEADLINE` -- 提出期限（YYYY-MM-DD）

**任意項目（未指定なら空欄のまま残す）:**
- `PARTNER_NAMES` -- 共同提案パートナー（カンマ区切り）
- `PRESENTATION_DATE` -- プレゼン日（YYYY-MM-DD）
- `CURRENT_SYSTEM` -- 現行システム（例: "オンプレ Oracle + Struts", "AWS上のレガシーシステム"）

---

### Phase B: インフラ & システム分類

#### Q: INFRA_TYPE（インフラ種別）

ユーザーに以下を選択させてください:

> **インフラストラクチャの種別を選択してください:**
>
> 1. **クラウド** -- パブリッククラウド上に構築（AWS, Azure, GCP 等）
> 2. **オンプレミス** -- 自社データセンター / プライベートクラウド上に構築
> 3. **ハイブリッド** -- クラウドとオンプレミスの併用

| 選択 | `INFRA_TYPE` の値 | 次のアクション |
|------|-------------------|--------------|
| 1 (クラウド) | `cloud` | → `CLOUD_PROVIDER` を聞く |
| 2 (オンプレミス) | `on-premises` | → `CLOUD_PROVIDER` = `"オンプレミス"`, `CLOUD_REGION` = `"自社DC"` として Q: CLOUD_PROVIDER をスキップ |
| 3 (ハイブリッド) | `hybrid` | → `CLOUD_PROVIDER` を聞く（クラウド側のプロバイダーを選択） |

#### Q: CLOUD_PROVIDER（クラウドプロバイダー）-- INFRA_TYPE ≠ on-premises の場合のみ

> **クラウドプロバイダーを選択してください:**
>
> 1. **AWS** (Amazon Web Services)
> 2. **Azure** (Microsoft Azure)
> 3. **GCP** (Google Cloud Platform)
> 4. **その他**（手動入力）

`CLOUD_PROVIDER` の値に応じて `CLOUD_REGION` のデフォルト値を自動設定:

| CLOUD_PROVIDER | CLOUD_REGION デフォルト |
|---------------|----------------------|
| AWS | `ap-northeast-1` |
| Azure | `japaneast` |
| GCP | `asia-northeast1` |
| その他 | （ユーザーに入力を求める） |

#### Q: SYSTEM_TYPE（システム種別）

ユーザーに以下を選択させてください:

> **提案対象のシステム種別を選択してください:**
>
> 1. **基幹系システム** -- ERP、会計、人事、SCM 等の業務基幹システム
> 2. **Webサービス / Webアプリケーション** -- ECサイト、ポータル、SaaS 等
> 3. **モバイルアプリケーション** -- iOS / Android ネイティブアプリ、クロスプラットフォームアプリ
> 4. **データ基盤（DWH / データレイク）** -- データウェアハウス、ETL、BI、分析基盤
> 5. **AI / ML プラットフォーム** -- 機械学習基盤、生成AI、MLOps

| 選択 | `SYSTEM_TYPE` の値 | `PLATFORM_TYPE` の扱い |
|------|-------------------|---------------------|
| 1 (基幹系) | `enterprise` | 自動 = `enterprise-system` |
| 2 (Web系) | `web` | 自動 = `web-application` |
| 3 (モバイル) | `mobile` | 自動 = `mobile-application` |
| 4 (データ基盤) | `data-platform` | → Phase C で個別に聞く |
| 5 (AI/ML) | `ai-ml` | 自動 = `ai-ml-platform` |

---

### Phase C: 製品 & プラットフォーム詳細

#### Q: PROPOSED_PRODUCTS（提案製品）

`SYSTEM_TYPE` に応じた例文を表示してください:

| SYSTEM_TYPE | 表示する例 |
|-------------|-----------|
| `enterprise` | "SAP S/4HANA", "Oracle EBS", "Microsoft Dynamics 365" |
| `web` | "AWS + Next.js", "Vercel + Supabase", "Azure App Service" |
| `mobile` | "Flutter + Firebase", "React Native + AWS Amplify" |
| `data-platform` | "Snowflake Data Cloud", "Databricks", "Google BigQuery" |
| `ai-ml` | "AWS SageMaker", "Azure AI Studio", "Google Vertex AI" |

#### Q: PLATFORM_NAME（主要プラットフォーム / 製品名）

`SYSTEM_TYPE` に応じた説明と例文を表示してください:

| SYSTEM_TYPE | 説明 | 表示する例 |
|-------------|------|-----------|
| `enterprise` | 提案の中核となる製品/プラットフォーム名 | "SAP", "Oracle", "ServiceNow" |
| `web` | 主要プラットフォーム/フレームワーク名 | "Next.js", "Vercel", "AWS" |
| `mobile` | 主要プラットフォーム/フレームワーク名 | "Flutter", "React Native", "Swift" |
| `data-platform` | データプラットフォーム名 | "Snowflake", "Databricks", "BigQuery" |
| `ai-ml` | AI/ML プラットフォーム名 | "SageMaker", "Vertex AI", "Azure AI" |

#### Q: PLATFORM_TYPE（プラットフォーム種別）-- SYSTEM_TYPE = data-platform の場合のみ

> **プラットフォーム種別を選択してください:**
>
> 1. **Cloud Data Warehouse** （例: Snowflake, Redshift）
> 2. **Lakehouse** （例: Databricks, Delta Lake）
> 3. **Data Platform** （例: Google BigQuery, Microsoft Fabric）

`SYSTEM_TYPE` ≠ `data-platform` の場合、`PLATFORM_TYPE` は Phase B の SYSTEM_TYPE 選択時に自動導出された値を使用します。

---

### Phase D: デモ & その他

**任意項目（未指定なら空欄のまま残す）:**
- `DEMO_CONCEPT` -- デモアプリのコンセプト（一言）
- `PROJECT_SLUG` -- ディレクトリ名安全なプロジェクトID（未指定時は CLIENT_NAME から自動生成）

---

## 実行手順

### Step 1: ディレクトリ構造の作成

以下のディレクトリを作成してください:

```
source/rfp_reference/
source/rfp_answer_output/architecture-plan/
source/rfp_answer_output/migration-plan/
source/minutes/
output/
```

> **Note**: `demo-app/` と `platform/` はテンプレートリポジトリに同梱済みのため、作成不要です。

### Step 2: インプット資料の整理

`input/` フォルダに配置された資料を、所定のディレクトリに整理してください。

#### Step 0 で資料が配置済みの場合:

1. `input/` フォルダ内のファイルを確認する
2. ファイル名・拡張子・内容からカテゴリを判定し、以下のルールで振り分ける:

| カテゴリ判定 | コピー先 |
|-------------|---------|
| RFP 本体と思われるもの（ファイル名に「RFP」「提案依頼」等を含む、または最も主要な文書） | `source/` |
| 参考資料・別紙・仕様書（上記以外の資料） | `source/rfp_reference/` |
| 議事録・ヒアリングメモ（ファイル名に「議事」「メモ」「minutes」等を含む） | `source/minutes/` |

3. 振り分け結果をユーザーに表示し、確認を求める:
   > **以下のように資料を振り分けました。問題なければ「OK」と入力してください:**
   >
   > （振り分け結果の一覧）
   >
   > 修正が必要な場合は指示してください。

4. ユーザーの確認後、ファイルを**移動**する（`input/` からは削除される）

#### Step 0 でスキップした場合:

以下のメッセージを表示して Step 3 に進む:

> Phase 1（Research）開始前に `input/` フォルダに資料を配置し、手動で `source/` 以下に整理してください。

### Step 3: スライド作成方法の選択

ユーザーに提案スライドの作成方法を確認してください:

> **スライドの作成方法を選択してください:**
>
> 1. **PowerPoint（PPTX）で作成**（デフォルト）
>    - Claude の pptx スキル（example-skills / document-skills）を使用
>    - `.pptx` ファイルを直接生成
>    - 追加設定不要
>
> 2. **NanoBanana（AI画像生成）で作成**（おすすめ）
>    - NanoBanana スキルを使い、スライドを1枚ずつ画像として生成
>    - 高品質なビジュアルスライドを AI が自動デザイン
>    - プロンプトの複雑さに応じてモデルを自動選択（Pro / Flash）
>    - **要事前設定**（下記参照）

- ユーザーが「1」またはPowerPointを選択した場合 → `SLIDE_METHOD` を `pptx` として記録し、Step 4 に進む
- ユーザーが「2」またはNanoBananaを選択した場合 → `SLIDE_METHOD` を `nanobanana` として記録し、以下のセットアップを案内する:

#### NanoBanana 利用条件の確認

`.claude/skills/nanobanana/SKILL.md` の Prerequisites セクションを参照し、以下を案内してください:

1. **依存パッケージのインストール**:
   ```bash
   pip install google-genai Pillow
   ```

2. **API クレデンシャルの設定**（いずれか一方）:
   - **Option A: Gemini Developer API**（個人利用推奨）
     ```bash
     export GEMINI_API_KEY="your-api-key"
     ```
     キーの取得先: https://aistudio.google.com/apikey
   - **Option B: Vertex AI API**（Google Cloud ユーザー向け）
     ```bash
     export GOOGLE_CLOUD_PROJECT="your-project-id"
     export GOOGLE_CLOUD_LOCATION="us-central1"
     ```
     事前に `gcloud auth application-default login` が必要

3. ユーザーに「セットアップが完了したら OK と入力してください。後で設定する場合は スキップ と入力してください。」と案内する
   - 「OK」の場合 → Step 4 に進む
   - 「スキップ」の場合 → 「Phase 5（Proposal）開始前に必ず NanoBanana の設定を完了してください」と注意を表示し、Step 4 に進む

### Step 4: CLAUDE.md の更新

1. `.claude/CLAUDE.md` を読み込む（リポジトリにプレースホルダー付きで同梱済み）
2. ユーザーから受け取った値で `__VARIABLE__` プレースホルダーをすべて置換する
   - `__INFRA_TYPE__` と `__SYSTEM_TYPE__` も Phase B で取得した値で置換する
   - `__PLATFORM_TYPE__` は Phase C で取得した値（または SYSTEM_TYPE からの自動導出値）で置換する
3. Step 3 で選択された `SLIDE_METHOD` を Project Overview テーブルの `__SLIDE_METHOD__` に反映する
4. `> **Note:** \`__VARIABLE__\` placeholders below...` で始まる注記ブロック（blockquote 1行）を削除する
5. 結果を `.claude/CLAUDE.md` に上書き保存する

### Step 5: settings.json の確認

`.claude/settings.json` はリポジトリに同梱済みです。内容を確認し、必要に応じてユーザーに変更点がないか確認してください（通常は変更不要）。

### Step 6: .mcp.json の生成

1. `templates/.mcp.json.tmpl` を読み込む
2. `__CONTEXT7_API_KEY__` は空文字のまま残す（ユーザーが後で設定する）
3. 結果をプロジェクトルートの `.mcp.json` に書き出す

> **注意**: Context7 MCP サーバーを使用するには、セットアップ完了後に `.mcp.json` の `CONTEXT7_API_KEY` を実際のキーに置き換えてください。

### Step 7: 環境変数テンプレートの配置

1. `templates/env-example.tmpl` を読み込む
2. `__PLATFORM_TYPE__` 等を置換する
3. `.env.example` として書き出す

### Step 8: docs テンプレートの配置

以下のテンプレートを読み込み、**キックオフ段階で確定しているプロジェクト基本変数のみ**（`CLIENT_NAME`, `PROPOSER_NAME`, `PLATFORM_NAME`, `CLOUD_PROVIDER`, `DEADLINE`, `PRESENTATION_DATE` 等）を置換して配置してください。それ以外の `__VARIABLE__` はそのまま残してください（フェーズ2以降で埋める）:

| テンプレート | 出力先 |
|------------|--------|
| `templates/docs/rfp-analysis.md.tmpl` | `source/rfp_answer_output/rfp-analysis.md` |
| `templates/docs/proposal-strategy.md.tmpl` | `source/rfp_answer_output/proposal-strategy.md` |
| `templates/docs/proposal-items-checklist.md.tmpl` | `source/rfp_answer_output/proposal-items-checklist.md` |
| `templates/docs/estimation-policy.md.tmpl` | `source/rfp_answer_output/estimation-policy.md` |
| `templates/docs/architecture-plan/architecture-policy.md.tmpl` | `source/rfp_answer_output/architecture-plan/architecture-policy.md` |

### Step 9: 完了レポート

セットアップ完了後、以下を表示してください:

1. **生成したファイル一覧**（パスとステータス）
2. **プロジェクト概要テーブル**（設定した変数値の確認。`INFRA_TYPE`, `SYSTEM_TYPE` を含む）
3. **次のステップ案内**:
   - Step 0 で資料配置をスキップした場合は、Phase 1 開始前に必ず `input/` フォルダにRFP関連資料を配置し、`source/` 以下に整理する
   - Step 3 で NanoBanana を選択し設定をスキップした場合は、Phase 5（Proposal）開始前に `pip install google-genai Pillow` と API キーの設定を完了する
   - `guides/02-research.md を読んでRFP解析を開始して` でPhase 1を開始する
   - 必要に応じて `.mcp.json` のAPIキーを設定する
   - org-data が未整備の場合は `arcadia/org-data/README.md` を参照する
