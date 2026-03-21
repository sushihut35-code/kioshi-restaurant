# Canva連携セットアップガイド

旬食工房きよし - Canva連携メニューサイトのセットアップ手順

## 🎯 概要

このシステムを使うと、Canvaで作成したメニュー表をウェブサイトに自動的に表示できます！Canvaでメニューを更新すると、サイトにも自動反映される素敵な仕組みですのじゃ♡

## 📋 前提条件

- Node.js 14.0以上がインストールされていること
- Canvaアカウントを持っていること
- Canva Developerアカウントを作成すること（無料）

## 🚀 セットアップ手順

### 1. Canva Developerアプリの登録

1. [Canva Developers](https://www.canva.com/developers/api) にアクセス
2. 「Create an app」をクリック
3. アプリ名を入力（例: きよしメニューサイト）
4. リダイレクトURIを設定: `http://localhost:3000/auth/canva/callback`
5. 作成後に「Client ID」と「Client Secret」をコピー

### 2. 環境変数の設定

1. `.env.example` を `.env` にリネーム
2. `.env` ファイルを開いて、以下の情報を入力：

```bash
# Canva Developer Portal から取得
CANVA_CLIENT_ID=あなたのClient_ID
CANVA_CLIENT_SECRET=あなたのClient_Secret
CANVA_REDIRECT_URI=http://localhost:3000/auth/canva/callback

# メニュー表のデザインID（後で説明）
CANVA_MENU_DESIGN_ID=
```

### 3. Canvaでメニュー表を作成

1. Canvaで「メニュー表」デザインを作成
2. デザインのURLからデザインIDを取得：
   - URL: `https://www.canva.com/design/DAF_xxxxxxxxxx/Edit`
   - デザインID: `DAF_xxxxxxxxxx`
3. `.env` ファイルの `CANVA_MENU_DESIGN_ID` に入力

### 4. 依存関係のインストール

ターミナルで以下を実行：

```bash
cd kioshi-restaurant
npm install
```

### 5. サーバーの起動

```bash
npm start
```

または開発モード：

```bash
npm run dev
```

### 6. 動作確認

ブラウザで以下を開きます：

- サイト: http://localhost:3000
- ヘルスチェック: http://localhost:3000/health
- メニューAPI: http://localhost:3000/api/menu

## 🎨 メニューの更新方法

1. Canvaでメニューデザインを編集
2. 保存して公開
3. ウェブサイトに自動反映されます（最大1時間）

または、キャッシュをクリアして即座に更新：

```bash
# キャッシュディレクトリを削除
rm -rf canva-exports/
```

## 📁 ファイル構成

```
kioshi-restaurant/
├── server.js                 # メインサーバーファイル
├── canva-config.js           # Canva API設定
├── canva-api.js              # Canva APIクライアント
├── canva-menu.js             # メニューローダー
├── canva-embed.js            # 埋め込みスクリプト（フロントエンド）
├── styles-canva.css          # Canvaメニュー用スタイル
├── .env                      # 環境変数（git外対象）
├── .env.example              # 環境変数テンプレート
├── package.json              # Node.js依存関係
├── index-japanese.html       # メインのHTMLファイル
└── canva-exports/            # メニューキャッシュ（自動生成）
```

## 🔧 トラブルシューティング

### メニューが表示されない場合

1. `.env` ファイルの設定を確認
2. Canva APIキーが正しいか確認
3. デザインIDが正しいか確認
4. ヘルスチェック `/health` でCanva連携状態を確認

### APIエラーが発生する場合

1. Canva Developerコンソールでアプリが承認されているか確認
2. リダイレクトURIが正しいか確認
3. トークンが有効か確認

## 🔗 関連リンク

- [Canva Developers](https://www.canva.com/developers/api)
- [Canva APIドキュメント](https://www.canva.com/developers/documentation)
- [Canva埋め込みガイド](https://www.canva.com/help/embed-designs-website)

## 💡 ヒント

- メニュー表はA4サイズで作成すると綺麗に表示されます
- フォントはCanvaで日本語フォントを使用してください
- 高画質で表示するには、画像サイズは大きめに作成しましょう

---

作成者: わらわ（アンドロイド美少女）♡
最終更新: 2026年3月21日
