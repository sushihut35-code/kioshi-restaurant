/**
 * Canva メニューローダー
 * 旬食工房きよし - Canvaからメニュー表を読み込む
 */

const canvaApiClient = require('./canva-api');
const { CANVA_CONFIG } = require('./canva-config');
const fs = require('fs').promises;
const path = require('path');

class CanvaMenuLoader {
    constructor() {
        this.cacheDir = path.join(__dirname, 'canva-exports');
        this.cacheFile = path.join(this.cacheDir, 'menu-data.json');
        this.imageCacheFile = path.join(this.cacheDir, 'menu-image.png');
    }

    /**
     * キャッシュディレクトリを初期化
     */
    async initCacheDir() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            console.error('キャッシュディレクトリ作成エラー:', error);
        }
    }

    /**
     * キャッシュされたメニューデータを取得
     */
    async getCachedMenu() {
        try {
            const data = await fs.readFile(this.cacheFile, 'utf8');
            const menuData = JSON.parse(data);

            // キャッシュの有効期限チェック（1時間）
            const cacheAge = Date.now() - menuData.timestamp;
            if (cacheAge > CANVA_CONFIG.menu.refreshInterval) {
                return null;
            }

            return menuData;
        } catch (error) {
            console.log('キャッシュされたメニューデータはありません');
            return null;
        }
    }

    /**
     * メニューデータをキャッシュに保存
     */
    async cacheMenuData(menuData) {
        try {
            await this.initCacheDir();
            const data = {
                ...menuData,
                timestamp: Date.now()
            };
            await fs.writeFile(this.cacheFile, JSON.stringify(data, null, 2));
            console.log('メニューデータをキャッシュしました');
        } catch (error) {
            console.error('キャッシュ保存エラー:', error);
        }
    }

    /**
     * メニューデザインを取得
     */
    async getMenuDesign() {
        try {
            const designId = process.env.CANVA_MENU_DESIGN_ID;

            if (!designId) {
                throw new Error('CANVA_MENU_DESIGN_IDが設定されていません');
            }

            // まずキャッシュをチェック
            const cachedMenu = await this.getCachedMenu();
            if (cachedMenu) {
                console.log('キャッシュされたメニューを使用します');
                return cachedMenu;
            }

            // Canvaからデザインを取得
            console.log('Canvaからメニュー表を取得します...');
            const designData = await canvaApiClient.getDesign(designId);

            // 埋め込みコードを取得
            const embedData = await canvaApiClient.getDesignEmbedCode(designId);

            const menuData = {
                designId: designId,
                title: designData.title || 'メニュー表',
                embedUrl: embedData.url,
                iframeHtml: embedData.iframeHtml,
                lastModified: designData.last_modified || new Date().toISOString()
            };

            // キャッシュに保存
            await this.cacheMenuData(menuData);

            return menuData;
        } catch (error) {
            console.error('メニューデザイン取得エラー:', error);
            throw error;
        }
    }

    /**
     * メニュー表を画像としてエクスポート
     */
    async exportMenuAsImage() {
        try {
            const designId = process.env.CANVA_MENU_DESIGN_ID;

            if (!designId) {
                throw new Error('CANVA_MENU_DESIGN_IDが設定されていません');
            }

            // キャッシュされた画像をチェック
            try {
                const stats = await fs.stat(this.imageCacheFile);
                const cacheAge = Date.now() - stats.mtime.getTime();

                if (cacheAge < CANVA_CONFIG.menu.refreshInterval) {
                    console.log('キャッシュされた画像を使用します');
                    return this.imageCacheFile;
                }
            } catch (error) {
                console.log('キャッシュされた画像はありません');
            }

            // Canvaから画像をエクスポート
            console.log('メニュー表を画像としてエクスポートします...');
            const exportData = await canvaApiClient.exportDesign(designId, CANVA_CONFIG.export.format);

            // エクスポートジョブが完了するまで待機
            const imageUrl = await this.waitForExport(exportData.job_id);

            // 画像をダウンロード
            await this.downloadImage(imageUrl, this.imageCacheFile);

            console.log('メニュー表の画像をエクスポートしました');
            return this.imageCacheFile;
        } catch (error) {
            console.error('メニュー画像エクスポートエラー:', error);
            throw error;
        }
    }

    /**
     * エクスポートジョブの完了を待機
     */
    async waitForExport(jobId, maxAttempts = 30) {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const jobData = await canvaApiClient.apiRequest(`/export-jobs/${jobId}`);

                if (jobData.status === 'completed') {
                    return jobData.result.url;
                } else if (jobData.status === 'failed') {
                    throw new Error('エクスポートジョブが失敗しました');
                }

                // 2秒待機
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error('エクスポートジョブ確認エラー:', error);
                throw error;
            }
        }

        throw new Error('エクスポートジョブがタイムアウトしました');
    }

    /**
     * 画像をダウンロード
     */
    async downloadImage(url, filepath) {
        try {
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            await fs.writeFile(filepath, Buffer.from(buffer));
        } catch (error) {
            console.error('画像ダウンロードエラー:', error);
            throw error;
        }
    }

    /**
     * メニュー表のHTML埋め込みコードを生成
     */
    generateMenuEmbedHtml(menuData) {
        return `
            <div class="canva-menu-embed">
                <div class="menu-header">
                    <h3>メニュー表</h3>
                    <p class="menu-update">最終更新: ${new Date(menuData.lastModified).toLocaleDateString('ja-JP')}</p>
                </div>
                <div class="menu-embed-container">
                    ${menuData.iframeHtml}
                </div>
                <p class="menu-note">
                    ※メニューは季節や仕入れ状況により変更となる場合がございます
                </p>
            </div>
        `;
    }
}

// シングルトンインスタンスを作成
const canvaMenuLoader = new CanvaMenuLoader();

module.exports = canvaMenuLoader;
