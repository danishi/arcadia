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

### Phase D: デモアプリ & その他

#### Q: DEMO_CONCEPT（デモコンセプト）

デモアプリの一言コンセプトをユーザーに入力してもらう（任意。未指定時は `PROJECT_DESCRIPTION` から自動生成）。

#### Q: DEMO_SCREENS（デモ画面構成）

デモアプリの方向性をヒアリングする。ユーザーに以下の質問を順に行い、回答を `DEMO_SCREENS` として記録する。

##### Q-D1: デモで見せたい画面の種類

ユーザーに以下から**複数選択**させてください:

> **デモアプリで見せたい画面の種類を選んでください（複数選択可）:**
>
> 1. **ダッシュボード / KPI 表示** -- 主要指標をカード・グラフで一覧表示
> 2. **データ一覧 / テーブル** -- データの検索・フィルタ・ソート
> 3. **AI チャット / 自然言語分析** -- AI に質問してデータを分析・可視化
> 4. **フロービルダー / エディタ** -- ワークフローやジャーニーをノードベースで設計
> 5. **フォーム / 入力画面** -- 設定画面やデータ登録
> 6. **リアルタイムモニター** -- ライブデータのストリーミング表示
> 7. **その他**（自由記述）

##### Q-D2: 各画面の具体的な名称・内容

選択した画面タイプごとに、以下をヒアリングしてください:

> **選択した画面タイプそれぞれについて、画面名とURLパスを教えてください。**
>
> 例:
> - ダッシュボード → 画面名:「販売分析ダッシュボード」, パス: `/dashboard`
> - AI チャット → 画面名:「データ探索」, パス: `/explore`
>
> 省略した場合は AI が案件内容から最適な画面名・パスを自動決定します。

##### Q-D3: デモで使うサンプルデータのドメイン

> **デモのモックデータはどのような業務ドメインにしますか？**
>
> 1. **金融**（口座、取引、ローン、投資）
> 2. **小売 / EC**（商品、注文、顧客、在庫）
> 3. **製造**（生産、品質、設備、サプライチェーン）
> 4. **ヘルスケア**（患者、診療、処方、検査）
> 5. **通信**（契約、利用量、解約、ネットワーク）
> 6. **公共 / 自治体**（住民、申請、施設、予算）
> 7. **その他**（自由記述）
> 8. **RFP から自動判定**（RFP の業界・業務内容から AI が最適なドメインを選択）

##### Q-D4: デモのテーマカラー（任意）

> **デモアプリのテーマカラーに希望はありますか？**
>
> 1. **デフォルト（ブルー）** -- 汎用的な配色
> 2. **クライアントのブランドカラー** -- コーポレートカラーを指定（例: `#003366`）
> 3. **おまかせ** -- 業界・案件に合わせて AI が選択

`DEMO_SCREENS` は以下の形式で CLAUDE.md の `## 2. Demo Web App Specification` セクションに記録する:

```markdown
### Demo Screens

| Path | Name | Type | Description |
|------|------|------|-------------|
| /dashboard | 販売分析 | dashboard | KPI表示・売上推移グラフ |
| /explore | データ探索 | chat | 自然言語でデータ分析 |
| ... | ... | ... | ... |

### Sample Data Domain

__DEMO_DATA_DOMAIN__

### Theme Color

__DEMO_THEME_COLOR__
```

#### Q: PROJECT_SLUG（任意）

ディレクトリ名安全なプロジェクトID。未指定時は `CLIENT_NAME` から自動生成する。

---

## 実行モード選択

ヒアリング完了後、ユーザーに実行モードを確認してください:

> **実行モードを選択してください:**
>
> 1. **スタンダードモード**（デフォルト）
>    - 各フェーズを人間と対話しながら順次進行
>    - 戦略・設計・見積の要所で人間がレビュー・承認
>    - 推奨: 初めてのプロジェクト、複雑な案件
>
> 2. **フルオートモード**
>    - セットアップ完了後、Phase 1〜7 を AI推論のみで一気通貫で実行
>    - 人間の判断が必要な箇所も AI が最善の推論で仮決定
>    - 全成果物を「叩き台」として生成し、完了後に Refinement で人間が修正
>    - 推奨: 時間がない場合、まず全体像を素早く把握したい場合

- ユーザーが「1」またはスタンダードを選択した場合 → `EXECUTION_MODE` を `standard` として記録し、通常のセットアップ手順に進む
- ユーザーが「2」またはフルオートを選択した場合 → `EXECUTION_MODE` を `auto` として記録し、以下を注意表示する:

> **フルオートモードの注意事項:**
>
> - `input/` に RFP 資料が配置されていることが**必須**です（資料なしでは実行できません）
> - AI が行った全ての判断は `phase-state.md` に `[AUTO]` マーク付きで記録されます
> - 完了後は Refinement モードに移行し、人間が各成果物をレビュー・修正できます
> - フルオート実行中もいつでも中断可能です

---

## サブエージェント実行戦略（コンテキスト最適化）

セットアップの対話的ヒアリング（Phase A-D）は親コンテキストで実行するが、ファイル操作を伴う重いステップはサブエージェントに委譲してコンテキストを節約する。

### 委譲対象ステップ

| ステップ | サブエージェント化 | 理由 |
|---------|:---:|------|
| Step 0 (資料配置案内) | ❌ | 対話的。親で実行 |
| Phase A-D (ヒアリング) | ❌ | 対話的。親で実行 |
| 実行モード選択 | ❌ | 対話的。親で実行 |
| Step 1 (ディレクトリ作成) | ❌ | 軽量。親で実行 |
| Step 2 (資料整理) | ✅ | `input/` 内の複数ファイル読み取り・分類が重い |
| Step 2.5 (会社情報取得) | ✅ | WebSearch/WebFetch が多量のコンテキストを消費 |
| Step 3 (スライド方法選択) | ❌ | 対話的。親で実行 |
| Steps 4-8 (ファイル生成) | ✅ | テンプレート読み取り + 変数置換 + 書き出しが重い |
| Step 9 (完了レポート) | ❌ | 親がサブエージェント結果を集約して表示 |

### サブエージェントプロンプトの構築

各サブエージェントに渡すプロンプトには以下を含める:

1. **タスク指示**: 該当ステップのセクション全文
2. **ヒアリング結果**: Phase A-D で収集した全変数値（`CLIENT_NAME`, `PROPOSER_NAME`, ... など）
3. **実行モード**: `EXECUTION_MODE` の値
4. **スライド方法**: `SLIDE_METHOD` の値
5. **スキル参照指示**: 該当スキルのパスを明示する（スキルは自動継承されない。例: `.claude/skills/company-research/SKILL.md` を読め）
6. **言語指示**: 「日本語で応答すること」

### エージェント定義ファイル

| エージェント | 用途 | 定義ファイル |
|-------------|------|-------------|
| `setup-generator` | 資料整理、テンプレート展開、ファイル生成 | `.claude/agents/setup-generator.md` |
| `researcher` | 会社情報の自動取得（Step 2.5） | `.claude/agents/researcher.md` |

Step 2.5（会社情報取得）は `researcher` エージェントに委譲する。`researcher` は `/auto-run` でも使用される共通エージェント。

### Agent ツール起動パラメータ

| パラメータ | 値 | 備考 |
|-----------|-----|------|
| `name` | `"setup-generator"` or `"researcher"` | ステップに応じて使い分ける |
| `mode` | `"bypassPermissions"` | 各エージェント定義の permissionMode と一致 |
| `model` | 省略（親を継承） | — |

> **注意**: サブエージェントはネスト不可。各サブエージェントは他のサブエージェントを起動できないため、タスクは自己完結させること。

### 戻り値規約

各サブエージェントは以下を返すこと:

- **完了ステータス**: 成功 / 部分成功 / 失敗
- **生成・変更したファイル一覧**: パスとステータス
- **注意事項・警告**: ユーザーに伝えるべき事項

> **重要**: 戻り値は簡潔なサマリーに留めること。ファイル内容全体を返すとコンテキスト爆発の原因となる。

---

## 実行手順

### Step 1: ディレクトリ構造の作成

以下のディレクトリを作成してください:

```
source/rfp_reference/
output/plan/architecture-plan/
output/plan/migration-plan/
source/minutes/
output/
```

> **Note**: `demo-app/` はテンプレートリポジトリに同梱済みのため、作成不要です。

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

### Step 2.5: 会社情報の自動取得

自社（提案主体）と提案先（クライアント）の公開情報をWebから取得し、`org-data/company-profile.md` と `source/client-profile.md` を充実させる。

#### フルオートモードの場合（`EXECUTION_MODE=auto`）:
- ユーザー確認なしで自動実行する（必須ステップ）
- `company-research` スキルの手順に従い、`both`（自社＋提案先の両方）を対象に実行する
- 取得結果は `[AUTO]` マーク付きで記録する

#### スタンダードモードの場合:
- ユーザーに以下を確認する:

> **自社・提案先の会社情報をWebから自動取得しますか？**
>
> 1. **両方取得**（推奨）-- 自社と提案先の公開情報をWebから収集し、`org-data/company-profile.md` と `source/client-profile.md` に反映します
> 2. **提案先のみ取得** -- 提案先の公開情報のみ取得します（自社情報は手動で整備済みの場合）
> 3. **スキップ** -- 後で手動で整備します

- 「1」の場合 → `company-research` スキルを `both` で実行
- 「2」の場合 → `company-research` スキルを `client` で実行
- 「3」の場合 → スキップし、Step 3 に進む

#### テンプレート配置:
- `source/client-profile.md` が存在しない場合、`templates/docs/client-profile.md.tmpl` から生成する（`__CLIENT_NAME__` と `__TODAY__` を置換）

---

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
| `templates/docs/phase-state.md.tmpl` | `phase-state.md` |
| `templates/docs/change-log.md.tmpl` | `change-log.md` |
| `templates/docs/rfp-analysis.md.tmpl` | `output/plan/rfp-analysis.md` |
| `templates/docs/proposal-strategy.md.tmpl` | `output/plan/proposal-strategy.md` |
| `templates/docs/proposal-items-checklist.md.tmpl` | `output/plan/proposal-items-checklist.md` |
| `templates/docs/estimation-policy.md.tmpl` | `output/plan/estimation-policy.md` |
| `templates/docs/architecture-plan/architecture-policy.md.tmpl` | `output/plan/architecture-plan/architecture-policy.md` |
| `templates/docs/client-profile.md.tmpl` | `source/client-profile.md` |
| `templates/docs/DESIGN.md.tmpl` | `DESIGN.md` （プロジェクトルート） |

`phase-state.md` および `change-log.md` の `__TODAY__` はセットアップ実行日の日付（YYYY-MM-DD）で置換してください。Phase 0 (Setup) は `completed` として記録してください。

`DESIGN.md` の `__DESIGN_PRESET__` には以下の値を設定してください:

- Phase D の `DEMO_THEME_COLOR` が **"クライアントのブランドカラー"** → `client-brand`
- `DEMO_THEME_COLOR` が **"おまかせ"** → `custom`
- `DEMO_THEME_COLOR` が **"デフォルト（ブルー）"** または未指定 → `arcadia-neutral`

> `DESIGN.md` の詳細確定（色トークンの上書き・業界トーン反映）は Phase 2.5 (Design System) で strategist サブエージェントが実施します。セットアップ時点ではデフォルトの骨格のみを配置します。

### Step 9: 完了レポート

セットアップ完了後、以下を表示してください:

1. **生成したファイル一覧**（パスとステータス）
2. **プロジェクト概要テーブル**（設定した変数値の確認。`INFRA_TYPE`, `SYSTEM_TYPE`, `EXECUTION_MODE` を含む）
3. **次のステップ案内**:

#### スタンダードモードの場合（`EXECUTION_MODE=standard`）:

   - Step 0 で資料配置をスキップした場合は、Phase 1 開始前に必ず `input/` フォルダにRFP関連資料を配置し、`source/` 以下に整理する
   - Step 3 で NanoBanana を選択し設定をスキップした場合は、Phase 5（Proposal）開始前に `pip install google-genai Pillow` と API キーの設定を完了する
   - `guides/02-research.md を読んでRFP解析を開始して` でPhase 1を開始する
   - 必要に応じて `.mcp.json` のAPIキーを設定する
   - org-data が未整備の場合は `arcadia/org-data/README.md` を参照する
   - Phase 2 完了後は `guides/04-design.md` の冒頭に従い **Phase 2.5 (Design System)** を実行し、`DESIGN.md` を確定する（Phase 5/6 の前提条件）

#### フルオートモードの場合（`EXECUTION_MODE=auto`）:

   - 完了レポートの表示後、ユーザーの確認（「OK」等）を得たら、**ただちに `/auto-run` コマンドを実行**する
   - ユーザーには以下を表示する:

> **フルオートモードを開始します。**
>
> セットアップが完了しました。これから Phase 1〜7 を自動実行します。
> 全フェーズの完了まで、しばらくお待ちください。
> いつでも中断できます（中断後は Refinement モードで続行可能です）。
