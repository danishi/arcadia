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
- `CURRENT_SYSTEM` -- 現行システム（例: "Teradata + SAS"）

---

## 実行手順

### Step 1: ディレクトリ構造の作成

以下のディレクトリを作成してください:

```
docs/rfp_reference/
docs/rfp_answer_output/architecture-plan/
docs/rfp_answer_output/migration-plan/
docs/minutes/
RFP_answer/
src/
platform/
```

### Step 2: CLAUDE.md の生成

1. `.claude/CLAUDE.md.tmpl` を読み込む
2. ユーザーから受け取った値で `{{VARIABLE}}` プレースホルダーをすべて置換する
3. 結果を `.claude/CLAUDE.md` に書き出す

### Step 3: settings.json の生成

1. `.claude/settings.json.tmpl` を読み込む
2. そのまま `.claude/settings.json` にコピーする（settings.json にはプロジェクト固有の変数は含まれないため）

### Step 4: .mcp.json の生成

1. `templates/.mcp.json.tmpl` を読み込む
2. `{{CONTEXT7_API_KEY}}` は空文字のまま残す（ユーザーが後で設定する）
3. 結果をプロジェクトルートの `.mcp.json` に書き出す

### Step 5: .gitignore の生成

1. `templates/.gitignore.tmpl` を読み込む
2. そのまま `.gitignore` に書き出す（変数なし）

### Step 6: 環境変数テンプレートの配置

1. `templates/env-example.tmpl` を読み込む
2. `{{PLATFORM_TYPE}}` 等を置換する
3. `.env.example` として書き出す

### Step 7: docs テンプレートの配置

以下のテンプレートを読み込み、**キックオフ段階で確定しているプロジェクト基本変数のみ**（`CLIENT_NAME`, `PROPOSER_NAME`, `PLATFORM_NAME`, `CLOUD_PROVIDER`, `DEADLINE`, `PRESENTATION_DATE` 等）を置換して配置してください。それ以外の `{{VARIABLE}}` はそのまま残してください（フェーズ2以降で埋める）:

| テンプレート | 出力先 |
|------------|--------|
| `templates/docs/rfp-analysis.md.tmpl` | `docs/rfp_answer_output/rfp-analysis.md` |
| `templates/docs/proposal-strategy.md.tmpl` | `docs/rfp_answer_output/proposal-strategy.md` |
| `templates/docs/proposal-items-checklist.md.tmpl` | `docs/rfp_answer_output/proposal-items-checklist.md` |
| `templates/docs/estimation-policy.md.tmpl` | `docs/rfp_answer_output/estimation-policy.md` |
| `templates/docs/architecture-plan/architecture-policy.md.tmpl` | `docs/rfp_answer_output/architecture-plan/architecture-policy.md` |

### Step 8: 完了レポート

セットアップ完了後、以下を表示してください:

1. **生成したファイル一覧**（パスとステータス）
2. **プロジェクト概要テーブル**（設定した変数値の確認）
3. **次のステップ案内**:
   - RFPドキュメントを `docs/` に配置する
   - `guides/02-research.md を読んでRFP解析を開始して` でPhase 1を開始する
   - 必要に応じて `.mcp.json` のAPIキーを設定する
   - org-data が未整備の場合は `arcadia/org-data/README.md` を参照する
