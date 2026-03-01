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

### Step 2: インプット資料の配置確認

ディレクトリ作成後、ユーザーに以下のインプット資料を所定フォルダへ格納するよう案内し、**準備ができたか対話的に確認**してください:

| 資料 | 格納先 | 必須 |
|------|--------|:---:|
| RFP 本体（PDF/Word/Excel） | `docs/` | Yes |
| RFP 参考資料・別紙・仕様書 | `docs/rfp_reference/` | Yes |
| 議事録・ヒアリングメモ | `docs/minutes/` | No |

ユーザーに以下のメッセージを表示してください:

> **インプット資料を配置してください。**
>
> Step 1 で作成したディレクトリに、RFP 関連資料を格納してください:
> - `docs/` -- RFP 本体（PDF、Word、Excel 等）
> - `docs/rfp_reference/` -- 参考資料・別紙・仕様書など
> - `docs/minutes/` -- 議事録やヒアリングメモ（あれば）
>
> 資料の配置が完了したら「OK」と入力してください。後で配置する場合は「スキップ」と入力してください。

- ユーザーが「OK」または配置完了を示す応答をした場合 → Step 3 に進む
- ユーザーが「スキップ」または後回しを示す応答をした場合 → 「Phase 1（Research）開始前に必ず配置してください」と注意を表示し、Step 3 に進む

### Step 3: CLAUDE.md の生成

1. `.claude/CLAUDE.md.tmpl` を読み込む
2. ユーザーから受け取った値で `{{VARIABLE}}` プレースホルダーをすべて置換する
3. 結果を `.claude/CLAUDE.md` に書き出す

### Step 4: settings.json の生成

1. `.claude/settings.json.tmpl` を読み込む
2. そのまま `.claude/settings.json` にコピーする（settings.json にはプロジェクト固有の変数は含まれないため）

### Step 5: .mcp.json の生成

1. `templates/.mcp.json.tmpl` を読み込む
2. `{{CONTEXT7_API_KEY}}` は空文字のまま残す（ユーザーが後で設定する）
3. 結果をプロジェクトルートの `.mcp.json` に書き出す

### Step 6: .gitignore の生成

1. `templates/.gitignore.tmpl` を読み込む
2. そのまま `.gitignore` に書き出す（変数なし）

### Step 7: 環境変数テンプレートの配置

1. `templates/env-example.tmpl` を読み込む
2. `{{PLATFORM_TYPE}}` 等を置換する
3. `.env.example` として書き出す

### Step 8: docs テンプレートの配置

以下のテンプレートを読み込み、**キックオフ段階で確定しているプロジェクト基本変数のみ**（`CLIENT_NAME`, `PROPOSER_NAME`, `PLATFORM_NAME`, `CLOUD_PROVIDER`, `DEADLINE`, `PRESENTATION_DATE` 等）を置換して配置してください。それ以外の `{{VARIABLE}}` はそのまま残してください（フェーズ2以降で埋める）:

| テンプレート | 出力先 |
|------------|--------|
| `templates/docs/rfp-analysis.md.tmpl` | `docs/rfp_answer_output/rfp-analysis.md` |
| `templates/docs/proposal-strategy.md.tmpl` | `docs/rfp_answer_output/proposal-strategy.md` |
| `templates/docs/proposal-items-checklist.md.tmpl` | `docs/rfp_answer_output/proposal-items-checklist.md` |
| `templates/docs/estimation-policy.md.tmpl` | `docs/rfp_answer_output/estimation-policy.md` |
| `templates/docs/architecture-plan/architecture-policy.md.tmpl` | `docs/rfp_answer_output/architecture-plan/architecture-policy.md` |

### Step 9: 完了レポート

セットアップ完了後、以下を表示してください:

1. **生成したファイル一覧**（パスとステータス）
2. **プロジェクト概要テーブル**（設定した変数値の確認）
3. **次のステップ案内**:
   - Step 2 で資料配置をスキップした場合は、Phase 1 開始前に必ず `docs/` および `docs/rfp_reference/` にRFP関連資料を配置する
   - `guides/02-research.md を読んでRFP解析を開始して` でPhase 1を開始する
   - 必要に応じて `.mcp.json` のAPIキーを設定する
   - org-data が未整備の場合は `arcadia/org-data/README.md` を参照する
