/**
 * Canva API 設定ファイル
 * 旬食工房きよし - Canva連携用設定
 */

const CANVA_CONFIG = {
    // Canva APIのベースURL
    apiBaseUrl: 'https://api.canva.com',

    // APIバージョン
    apiVersion: 'v1',

    // OAuth 2.0 設定
    oauth: {
        // トークンエンドポイント
        tokenEndpoint: 'https://www.canva.com/api/token',

        // 認証エンドポイント
        authEndpoint: 'https://www.canva.com/oauth/authorize',

        // スコープ（必要な権限）
        scopes: [
            'design:content:read',      // デザインコンテンツの読み取り
            'design:metadata:read',     // デザインメタデータの読み取り
            'folder:read',              // フォルダの読み取り
            'asset:read'                // アセットの読み取り
        ]
    },

    // メニュー表用の設定
    menu: {
        // メニュー表のデザインID（Canvaから取得）
        designId: process.env.CANVA_MENU_DESIGN_ID || '',

        // メニュー表を更新する間隔（ミリ秒）
        refreshInterval: 3600000 // 1時間ごと
    },

    // エクスポート設定
    export: {
        // エクスポート形式
        format: 'png',

        // 画質
        quality: 'high',

        // DPI
        dpi: 300
    }
};

// 環境変数のチェック
function validateConfig() {
    const requiredEnvVars = [
        'CANVA_CLIENT_ID',
        'CANVA_CLIENT_SECRET',
        'CANVA_REDIRECT_URI'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.warn('警告: 以下の環境変数が設定されていません:');
        missingVars.forEach(varName => console.warn(`  - ${varName}`));
        console.warn('.envファイルを確認してください。');
        return false;
    }

    return true;
}

module.exports = {
    CANVA_CONFIG,
    validateConfig
};
