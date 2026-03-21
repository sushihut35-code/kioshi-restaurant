/**
 * Canva メニュー API サーバー
 * 旬食工房きよし - Canvaからメニュー表を配信
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const canvaApiClient = require('./canva-api');
const canvaMenuLoader = require('./canva-menu');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ルート
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-japanese.html'));
});

// メニューAPIエンドポイント
app.get('/api/menu', async (req, res) => {
    try {
        console.log('メニューAPIリクエストを受信しました');

        // Canvaからメニューデータを取得
        const menuData = await canvaMenuLoader.getMenuDesign();

        res.json({
            success: true,
            data: menuData
        });
    } catch (error) {
        console.error('メニューAPIエラー:', error);

        res.status(500).json({
            success: false,
            error: 'メニュー表の取得に失敗しました',
            message: error.message
        });
    }
});

// メニュー画像エクスポートAPI
app.get('/api/menu/image', async (req, res) => {
    try {
        console.log('メニュー画像エクスポートリクエストを受信しました');

        // メニューを画像としてエクスポート
        const imagePath = await canvaMenuLoader.exportMenuAsImage();

        // 画像を送信
        res.sendFile(imagePath);
    } catch (error) {
        console.error('メニュー画像エクスポートエラー:', error);

        res.status(500).json({
            success: false,
            error: 'メニュー画像のエクスポートに失敗しました',
            message: error.message
        });
    }
});

// ヘルスチェック
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        canva: {
            connected: !!process.env.CANVA_CLIENT_ID,
            designId: process.env.CANVA_MENU_DESIGN_ID || 'not set'
        }
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`サーバーが起動しました: http://localhost:${PORT}`);
    console.log(`ヘルスチェック: http://localhost:${PORT}/health`);

    // 環境変数のチェック
    if (!process.env.CANVA_CLIENT_ID || !process.env.CANVA_CLIENT_SECRET) {
        console.warn('警告: Canva APIの認証情報が設定されていません');
        console.warn('.envファイルを確認してください');
    } else if (!process.env.CANVA_MENU_DESIGN_ID) {
        console.warn('警告: CANVA_MENU_DESIGN_IDが設定されていません');
    } else {
        console.log('Canva連携: 準備完了');
    }
});

module.exports = app;
