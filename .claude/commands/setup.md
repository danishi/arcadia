# プロジェクト初期セットアップ

ARCADIA テンプレートリポジトリから新しいRFP対応プロジェクトを初期化するコマンドです。

以下の手順を**すべて**実行してください。

---

## 入力情報

ユーザーから以下の情報を受け取ってください:

$ARGUMENTS

上記が空の場合、または不足情報がある場合は、以下の項目をユーザーに対話的に確認してください:

**必須項目:**
- `CLIENT_NAME` -- クライアント名（例: "ABC銀行"）
- `PROPOSER_NAME` -- 提案主体（例: "XYZ株式会社"）
- `PROJECT_DESCRIPTION` -- 案件概要（例: "次世代DWH・MAプラットフォーム刷新"）
- `PROPOSED_PRODUCTS` -- 提案製品（例: "Snowflake Data Cloud"）
- `PLATFORM_NAME` -- プラットフォーム名（例: "Snowflake"）
- `PLATFORM_TYPE` -- プラットフォーム種別（"Cloud Data Warehouse" / "Lakehouse" / "Data Platform"）
- `CLOUD_PROVIDER` -- クラウドプロバイダー（"AWS" / "Azure" / "GCP"）
- `DEADLINE` -- 提出期限（YYYY-MM-DD）

**任意項目（未指定なら空欄のまま残す）:**
- `PARTNER_NAMES` -- 共同提案パートナー（カンマ区切り）
- `PRESENTATION_DATE` -- プレゼン日（YYYY-MM-DD）
- `PROJECT_SLUG` -- ディレクトリ名安全なプロジェクトID（未指定時は CLIENT_NAME から自動生成）
- `DEMO_CONCEPT` -- デモアプリのコンセプト（一言）
- `CURRENT_SYSTEM` -- 現行システム（例: "オンプレ + Struts"）

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

### Step 2: インプット資料の配置確認

ディレクトリ作成後、ユーザーに以下のインプット資料を所定フォルダへ格納するよう案内し、**準備ができたか対話的に確認**してください:

| 資料 | 格納先 | 必須 |
|------|--------|:---:|
| RFP 本体（PDF/Word/Excel） | `source/` | Yes |
| RFP 参考資料・別紙・仕様書 | `source/rfp_reference/` | Yes |
| 議事録・ヒアリングメモ | `source/minutes/` | No |

ユーザーに以下のメッセージを表示してください:

> **インプット資料を配置してください。**
>
> Step 1 で作成したディレクトリに、RFP 関連資料を格納してください:
> - `source/` -- RFP 本体（PDF、Word、Excel 等）
> - `source/rfp_reference/` -- 参考資料・別紙・仕様書など
> - `source/minutes/` -- 議事録やヒアリングメモ（あれば）
>
> 資料の配置が完了したら「OK」と入力してください。後で配置する場合は「スキップ」と入力してください。

- ユーザーが「OK」または配置完了を示す応答をした場合 → Step 3 に進む
- ユーザーが「スキップ」または後回しを示す応答をした場合 → 「Phase 1（Research）開始前に必ず配置してください」と注意を表示し、Step 3 に進む

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
2. ユーザーから受け取った値で `{{VARIABLE}}` プレースホルダーをすべて置換する
3. Step 3 で選択された `SLIDE_METHOD` を Project Overview テーブルの `{{SLIDE_METHOD}}` に反映する
4. `> **Note:** {{VARIABLE}} placeholders below...` で始まる注記ブロック（blockquote 1行）を削除する
5. 結果を `.claude/CLAUDE.md` に上書き保存する

### Step 5: settings.json の確認

`.claude/settings.json` はリポジトリに同梱済みです。内容を確認し、必要に応じてユーザーに変更点がないか確認してください（通常は変更不要）。

### Step 6: .mcp.json の生成

1. `templates/.mcp.json.tmpl` を読み込む
2. `{{CONTEXT7_API_KEY}}` は空文字のまま残す（ユーザーが後で設定する）
3. 結果をプロジェクトルートの `.mcp.json` に書き出す

> **注意**: Context7 MCP サーバーを使用するには、セットアップ完了後に `.mcp.json` の `CONTEXT7_API_KEY` を実際のキーに置き換えてください。

### Step 7: 環境変数テンプレートの配置

1. `templates/env-example.tmpl` を読み込む
2. `{{PLATFORM_TYPE}}` 等を置換する
3. `.env.example` として書き出す

### Step 8: docs テンプレートの配置

以下のテンプレートを読み込み、**キックオフ段階で確定しているプロジェクト基本変数のみ**（`CLIENT_NAME`, `PROPOSER_NAME`, `PLATFORM_NAME`, `CLOUD_PROVIDER`, `DEADLINE`, `PRESENTATION_DATE` 等）を置換して配置してください。それ以外の `{{VARIABLE}}` はそのまま残してください（フェーズ2以降で埋める）:

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
2. **プロジェクト概要テーブル**（設定した変数値の確認）
3. **次のステップ案内**:
   - Step 2 で資料配置をスキップした場合は、Phase 1 開始前に必ず `source/` および `source/rfp_reference/` にRFP関連資料を配置する
   - Step 3 で NanoBanana を選択し設定をスキップした場合は、Phase 5（Proposal）開始前に `pip install google-genai Pillow` と API キーの設定を完了する
   - `guides/02-research.md を読んでRFP解析を開始して` でPhase 1を開始する
   - 必要に応じて `.mcp.json` のAPIキーを設定する
   - org-data が未整備の場合は `arcadia/org-data/README.md` を参照する
