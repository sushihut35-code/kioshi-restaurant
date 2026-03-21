/**
 * Canva API ユーティリティ
 * 旬食工房きよし - Canva連携用APIクライアント
 */

const { CANVA_CONFIG } = require('./canva-config');

class CanvaApiClient {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiresAt = null;
        this.clientId = process.env.CANVA_CLIENT_ID;
        this.clientSecret = process.env.CANVA_CLIENT_SECRET;
    }

    /**
     * アクセストークンを設定
     */
    setTokens(accessToken, refreshToken, expiresAt) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenExpiresAt = expiresAt;
    }

    /**
     * アクセストークンが有効かチェック
     */
    isTokenValid() {
        if (!this.accessToken || !this.tokenExpiresAt) {
            return false;
        }
        return new Date() < new Date(this.tokenExpiresAt);
    }

    /**
     * アクセストークンをリフレッシュ
     */
    async refreshAccessToken() {
        try {
            const response = await fetch(CANVA_CONFIG.oauth.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    grant_type: 'refresh_token',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: this.refreshToken
                })
            });

            if (!response.ok) {
                throw new Error('トークンのリフレッシュに失敗しました');
            }

            const data = await response.json();
            this.setTokens(
                data.access_token,
                data.refresh_token || this.refreshToken,
                new Date(Date.now() + data.expires_in * 1000)
            );

            return data.access_token;
        } catch (error) {
            console.error('トークンリフレッシュエラー:', error);
            throw error;
        }
    }

    /**
     * APIリクエストを送信
     */
    async apiRequest(endpoint, options = {}) {
        // トークンが期限切れの場合はリフレッシュ
        if (!this.isTokenValid()) {
            await this.refreshAccessToken();
        }

        const url = `${CANVA_CONFIG.apiBaseUrl}/${CANVA_CONFIG.apiVersion}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, { ...options, ...defaultOptions });

            if (!response.ok) {
                throw new Error(`APIリクエストエラー: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('APIリクエストエラー:', error);
            throw error;
        }
    }

    /**
     * デザインを取得
     */
    async getDesign(designId) {
        try {
            const data = await this.apiRequest(`/designs/${designId}`);
            return data;
        } catch (error) {
            console.error('デザイン取得エラー:', error);
            throw error;
        }
    }

    /**
     * デザインをエクスポート
     */
    async exportDesign(designId, format = 'png') {
        try {
            const data = await this.apiRequest(`/designs/${designId}/export`, {
                method: 'POST',
                body: JSON.stringify({
                    format: format,
                    quality: CANVA_CONFIG.export.quality,
                    dpi: CANVA_CONFIG.export.dpi
                })
            });

            // エクスポートジョブのURLを返す
            return data;
        } catch (error) {
            console.error('デザインエクスポートエラー:', error);
            throw error;
        }
    }

    /**
     * デザインの埋め込みコードを取得
     */
    async getDesignEmbedCode(designId) {
        try {
            // Canvaの埋め込みURLを生成
            const embedUrl = `https://www.canva.com/design/${designId}/view?embed`;

            return {
                url: embedUrl,
                iframeHtml: `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`
            };
        } catch (error) {
            console.error('埋め込みコード取得エラー:', error);
            throw error;
        }
    }

    /**
     * フォルダ内のデザイン一覧を取得
     */
    async getFolderDesigns(folderId) {
        try {
            const data = await this.apiRequest(`/folders/${folderId}/designs`);
            return data;
        } catch (error) {
            console.error('フォルダデザイン取得エラー:', error);
            throw error;
        }
    }
}

// シングルトンインスタンスを作成
const canvaApiClient = new CanvaApiClient();

module.exports = canvaApiClient;
