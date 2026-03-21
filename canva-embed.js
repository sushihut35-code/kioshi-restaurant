/**
 * Canva メニュー埋め込みスクリプト
 * 旬食工房きよし - Canvaメニュー表をウェブサイトに表示
 */

// メニューセクションにCanvaメニューを埋め込む
async function loadCanvaMenu() {
    const menuContainer = document.getElementById('canva-menu-container');

    if (!menuContainer) {
        console.error('メニューコンテナが見つかりません');
        return;
    }

    // ローディング表示
    menuContainer.innerHTML = '<div class="menu-loading">メニュー表を読み込んでいます...</div>';

    try {
        // サーバーからメニューデータを取得
        const response = await fetch('/api/menu');

        if (!response.ok) {
            throw new Error('メニュー表の取得に失敗しました');
        }

        const menuData = await response.json();

        // 埋め込みHTMLを生成
        const embedHtml = generateMenuEmbedHtml(menuData);

        // メニューを表示
        menuContainer.innerHTML = embedHtml;

        console.log('Canvaメニュー表を読み込みました');
    } catch (error) {
        console.error('メニュー読み込みエラー:', error);
        menuContainer.innerHTML = `
            <div class="menu-error">
                <h4>メニュー表の表示エラー</h4>
                <p>申し訳ございません。メニュー表を読み込めませんでした。</p>
                <p>お電話にてお問い合わせください: 0982-XX-XXXX</p>
            </div>
        `;
    }
}

// メニュー埋め込みHTMLを生成
function generateMenuEmbedHtml(menuData) {
    const designId = menuData.designId || '';
    const lastModified = menuData.lastModified ? new Date(menuData.lastModified).toLocaleDateString('ja-JP') : '';

    return `
        <div class="canva-menu-embed">
            <div class="menu-header">
                <h3>メニュー表</h3>
                ${lastModified ? `<p class="menu-update">最終更新: ${lastModified}</p>` : ''}
            </div>
            <div class="menu-embed-container">
                <iframe
                    src="https://www.canva.com/design/${designId}/view?embed"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    allowfullscreen
                    title="メニュー表">
                </iframe>
            </div>
            <p class="menu-note">
                ※メニューは季節や仕入れ状況により変更となる場合がございます
            </p>
        </div>
    `;
}

// ページ読み込み時にメニューを読み込む
document.addEventListener('DOMContentLoaded', function() {
    // メニューセクションが存在する場合のみ実行
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        loadCanvaMenu();
    }
});

// 定期的にメニューを更新（1時間ごと）
setInterval(() => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
        loadCanvaMenu();
    }
}, 3600000); // 1時間 = 60分 × 60秒 × 1000ミリ秒

// エクスポート用（他のスクリプトから使用可能）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadCanvaMenu,
        generateMenuEmbedHtml
    };
}
