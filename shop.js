// 定数
const STORAGE_KEY = 'bugsRaceWallet';
const INVENTORY_KEY = 'bugsRaceInventory';
const STOCK_KEY = 'bugsRaceStocks'; // 株価データ
const PORTFOLIO_KEY = 'bugsRacePortfolio'; // 保有株

// 虫データ（名前、アイコン、初期株価計算用のステータス）
const BUG_INFO = {
    'silverfish': { name: '紙魚', icon: '🐟', stats: { speed: 20, hp: 4, attack: 1 } },
    'mantis': { name: 'オオカマキリ', icon: '🦗', stats: { speed: 10, hp: 10, attack: 3 } },
    'isopod': { name: 'ダイオウグソクムシ', icon: '🦐', stats: { speed: 7, hp: 12, attack: 3 } },
    'shrimp': { name: 'モンハナシャコ', icon: '🥊', stats: { speed: 15, hp: 10, attack: 3 } },
    'ladybug': { name: 'ナナホシテントウ', icon: '🐞', stats: { speed: 15, hp: 8, attack: 1 } },
    'antlion': { name: 'ウスバカゲロウ', icon: '🦋', stats: { speed: 15, hp: 5, attack: 1 } },
    'ant': { name: 'クロヤマアリ', icon: '🐜', stats: { speed: 15, hp: 7, attack: 1 } },
    'beetle': { name: 'カブトムシ', icon: '🪲', stats: { speed: 7, hp: 15, attack: 2 } },
    'worm': { name: 'ミミズ', icon: '🪱', stats: { speed: 12, hp: 8, attack: 4 } },
    'cicada': { name: 'アブラゼミ', icon: '📢', stats: { speed: 17, hp: 8, attack: 4 } },
    'samurai': { name: 'サムライアリ', icon: '⚔️', stats: { speed: 12, hp: 6, attack: 5 } },
    'dung': { name: 'フンコロガシ', icon: '💩', stats: { speed: 10, hp: 12, attack: 2 } },
    'butterfly': { name: 'オオムラサキ', icon: '🦋', stats: { speed: 5, hp: 6, attack: 2 } },
    'centipede': { name: 'オオムカデ', icon: '🐛', stats: { speed: 15, hp: 8, attack: 4 } }
};

// 商品リスト
const SHOP_ITEMS = [
    // --- 激安・駄菓子・ゴミ (BAD枠) ---
    { id: 'stone', name: '道端の石', price: 0, icon: '🪨', desc: 'ただの石。投げても飛ばない。' },
    { id: 'acorn', name: 'どんぐり', price: 0, icon: '🌰', desc: '秋の落とし物。リスにあげよう。' },
    { id: 'plastic_bag', name: 'レジ袋 (Sサイズ)', price: 3, icon: '🛍️', desc: 'エコバッグを忘れた末路。' },
    { id: '5yen_choco', name: 'ごえんがあるよ', price: 5, icon: '🍫', desc: 'ご縁がありますように。' },
    { id: 'used_chopsticks', name: '使用済み割り箸', price: 10, icon: '🥢', desc: '誰かが使った形跡がある。' },
    { id: 'umaibo', name: 'うまい棒 (コンポタ味)', price: 12, icon: '🌽', desc: '国民的駄菓子。インフレに負けないで。' },
    { id: 'tirol', name: 'チロルチョコ', price: 20, icon: '🍫', desc: 'コンビニのレジ横の誘惑。' },
    { id: 'eraser_dust', name: 'ねりけし (自作)', price: 50, icon: '🤏', desc: '授業中に作った大作。いい匂いがする。' },
    { id: 'water', name: '「南アルプスの天然水」の空ペットボトル', price: 100, icon: '🫙', desc: '水道水を入れると美味しく感じる。' },
    { id: 'canned_coffee', name: '微糖缶コーヒー', price: 130, icon: '☕', desc: '働く大人の休憩時間。' },
    { id: 'jump', name: '週刊少年ジャンプ', price: 290, icon: '📖', desc: '友情・努力・勝利。' },
    { id: 'beef_bowl', name: '牛丼 (並)', price: 400, icon: '🍚', desc: '早い、安い、美味い。' },

    // --- 雑貨・日用品 (N枠) ---
    { id: 'plastic_sword', name: '伝説の聖剣 (プラスチック製)', price: 500, icon: '🗡️', desc: 'サービスエリアで売ってるやつ。' },
    { id: 'twitter_badge', name: 'X の認証バッジ', price: 1380, icon: '☑️', desc: '月額課金。強くなった気がする。' },
    { id: 'manga_abe', name: '漫画 安倍晋三物語', price: 2000, icon: '📚', desc: '感動のベストセラー' },
    { id: 'insect_jelly', name: '高級昆虫ゼリー 50個入り', price: 3980, icon: '🍮', desc: 'プロブリーダー御用達。高タンパク。' },

    // --- レトロ・ガジェット (N〜R枠) ---
    { id: 'tamagotchi', name: 'たまごっち (初代)', price: 2500, icon: '🥚', desc: '世話をサボるとすぐ死ぬ。' },
    { id: 'ds_lite', name: 'DS Lite', price: 3780, icon: '🎮', desc: '懐かしの名機' },
    { id: 'ps2', name: 'PS2', price: 5280, icon: '🎮', desc: 'DVDも見れるぞ' },
    { id: 'gba_sp', name: 'ゲームボーイアドバンスSP', price: 8800, icon: '👾', desc: 'バックライト液晶の衝撃。折りたたみ式。' },
    { id: 'one_seg', name: 'ワンセグ受信アダプタ', price: 7980, icon: '📺', desc: 'DSテレビ' },

    // --- 高級品？ (R枠) ---
    { id: 'frank_miura', name: '高級腕時計 (フランク三浦)', price: 6800, icon: '⌚', desc: '遠目で見ればバレない天才的デザイン。' },
    { id: 'yamato_cage', name: '大和型虫籠(小)', price: 28380, icon: '🦗', desc: '虫たちの高級マンション' },
    { id: 'tv_toshiba', name: '東芝55V型液晶テレビ', price: 74000, icon: '📺', desc: '大画面でレース観戦' },
    { id: 'fridge', name: 'アイリスオーヤマ冷蔵庫', price: 98000, icon: '🧊', desc: '両開きタイプ' },
    { id: 'washer', name: 'Panasonicドラム式洗濯機', price: 370000, icon: '🌀', desc: '最新鋭の洗浄力' },

    // --- 資産・ゴールド (SR枠) ---
    { id: 'gold_30', name: 'ゴールド (30g)', price: 700000, icon: '🥇', desc: '安全資産' },
    { id: 'gold_50', name: 'ゴールド (50g)', price: 1100000, icon: '🥇', desc: '輝きが増す' },
    { id: 'gold_100', name: 'ゴールド (100g)', price: 2350000, icon: '🥇', desc: '延べ棒' },

    // --- 車・高級時計 (SSR枠) ---
    { id: 'prius', name: 'トヨタ プリウス', price: 2770000, icon: '🚗', desc: '環境にやさしい' },
    { id: 'rolex_daytona', name: 'ロレックス デイトナ', price: 4500000, icon: '⌚', desc: '成功者の証。正規店では買えない。' },
    { id: 'tesla', name: 'テスラ モデル3', price: 5300000, icon: '⚡', desc: '電気の力で走る' },
    { id: 'lexus', name: 'レクサス RX500h', price: 9000000, icon: '🚙', desc: '成功者の証' },

    // --- 不動産・権利 (SSR枠) ---
    { id: 'moon_land', name: '月面 (1エーカー)', price: 3000, icon: '🌑', desc: '意外と安く買えるらしい。権利書付き。' },
    { id: 'home_nagoya', name: 'マイホーム (名古屋)', price: 35000000, icon: '🏯', desc: '住みやすい街' },
    { id: 'home_texas', name: 'マイホーム (テキサス)', price: 50000000, icon: '🤠', desc: '広大な庭付き' },

    // --- 超高額 (SSR枠) ---
    { id: 'honda_jet', name: 'プライベートジェット (HondaJet)', price: 750000000, icon: '🛩️', desc: '渋滞知らずの空の旅。維持費もヤバい。' },
    { id: 'baseball_team', name: '球団買収 (プロ野球)', price: 30000000000, icon: '⚾', desc: 'オーナー気分を味わえる。赤字覚悟。' },
];

// 状態変数
let wallet = 0;
let inventory = {};
let stockData = { prices: {}, streaks: {}, history: {} };
let portfolio = [];
let selectedStockId = null;

// DOM要素
const walletEl = document.getElementById('wallet-amount');
const itemsGrid = document.getElementById('items-grid');
const inventoryGrid = document.getElementById('inventory-grid');

// 株関連DOM
const stockBoard = document.getElementById('stock-board');
const orderTargetName = document.getElementById('order-target-name');
const stockAmountInput = document.getElementById('stock-amount');
const stockLeverageSelect = document.getElementById('stock-leverage');
const orderSummary = document.getElementById('order-summary');
const btnBuyStock = document.getElementById('btn-buy-stock');
const portfolioContainer = document.getElementById('stock-portfolio');
const portfolioList = document.getElementById('portfolio-list');

// ガチャモーダル
const gachaModal = document.getElementById('gacha-modal');
const btnOpenGacha = document.getElementById('btn-open-gacha-modal');
const btnCloseGacha = document.getElementById('btn-close-gacha');
const btnPlayGacha = document.getElementById('btn-play-gacha');
const gachaDisplayIcon = document.querySelector('.gacha-main-icon');
const gachaDisplayText = document.querySelector('.gacha-result-text');
const gachaHistory = document.getElementById('gacha-history');

// 初期化
function init() {
    loadData();
    initializeStockDataIfNeeded();
    updateDisplay();
    renderShopItems();
    renderInventory();
    renderStockBoard();
    renderPortfolio();

    if (stockAmountInput) stockAmountInput.addEventListener('input', updateOrderSummary);
    if (stockLeverageSelect) stockLeverageSelect.addEventListener('change', updateOrderSummary);
}

// データ読み込み
function loadData() {
    const savedWallet = localStorage.getItem(STORAGE_KEY);
    wallet = savedWallet ? parseInt(savedWallet) : 10000;

    const savedInventory = localStorage.getItem(INVENTORY_KEY);
    inventory = savedInventory ? JSON.parse(savedInventory) : {};

    const savedStock = localStorage.getItem(STOCK_KEY);
    stockData = savedStock ? JSON.parse(savedStock) : { prices: {}, streaks: {}, history: {} };

    const savedPortfolio = localStorage.getItem(PORTFOLIO_KEY);
    portfolio = savedPortfolio ? JSON.parse(savedPortfolio) : [];
}

// 株価データ初期化
function initializeStockDataIfNeeded() {
    let updated = false;
    Object.keys(BUG_INFO).forEach(bugId => {
        if (!stockData.prices[bugId]) {
            const t = BUG_INFO[bugId].stats;
            const basePrice = Math.floor((t.speed * 2 + t.hp * 2 + t.attack * 5) * (1.8 + Math.random() * 0.4));
            stockData.prices[bugId] = basePrice;
            stockData.streaks[bugId] = 0;
            stockData.history[bugId] = [basePrice];
            updated = true;
        }
    });
    if (updated) saveData();
}

// データ保存
function saveData() {
    localStorage.setItem(STORAGE_KEY, wallet);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
    localStorage.setItem(STOCK_KEY, JSON.stringify(stockData));
    updateDisplay();
}

function updateDisplay() {
    if (walletEl) walletEl.textContent = wallet.toLocaleString();
}

// --- 株取引ロジック ---

function renderStockBoard() {
    if (!stockBoard) return;
    stockBoard.innerHTML = '';

    if (Object.keys(stockData.prices).length === 0) {
        stockBoard.innerHTML = '<div class="loading">データを読み込んでいます...</div>';
        return;
    }

    Object.keys(stockData.prices).forEach(id => {
        const info = BUG_INFO[id] || { name: '謎の虫', icon: '❓' };
        const price = stockData.prices[id];
        const history = stockData.history[id] || [];

        let diff = 0;
        if (history.length >= 2) {
            diff = price - history[history.length - 2];
        }

        const diffClass = diff > 0 ? 'price-up' : (diff < 0 ? 'price-down' : '');
        const diffSign = diff > 0 ? '+' : '';
        const cardClass = diff > 0 ? 'card-up' : (diff < 0 ? 'card-down' : '');

        const div = document.createElement('div');
        div.className = `stock-card ${cardClass} ${selectedStockId === id ? 'selected' : ''}`;
        div.onclick = () => selectStock(id);
        div.innerHTML = `
            <div class="stock-name">${info.icon} ${info.name}</div>
            <div class="stock-price">¥${price.toLocaleString()}</div>
            <div class="stock-diff ${diffClass}">${diffSign}${diff}</div>
        `;
        stockBoard.appendChild(div);
    });
}

function selectStock(id) {
    selectedStockId = id;
    const info = BUG_INFO[id] || { name: '謎の虫', icon: '❓' };
    const price = stockData.prices[id];

    if (orderTargetName) orderTargetName.innerHTML = `${info.icon} ${info.name} <span style="font-size:0.8em">(@${price}円)</span>`;
    if (btnBuyStock) btnBuyStock.disabled = false;

    document.querySelectorAll('.stock-card').forEach(card => card.classList.remove('selected'));
    renderStockBoard();
    updateOrderSummary();
}

function updateOrderSummary() {
    if (!orderSummary) return;
    if (!selectedStockId) {
        orderSummary.textContent = "銘柄を選択してください";
        return;
    }

    const amount = parseInt(stockAmountInput.value) || 0;
    const leverage = parseFloat(stockLeverageSelect.value);
    const price = stockData.prices[selectedStockId];

    const totalCost = price * amount;
    const requiredMargin = Math.ceil(totalCost / leverage);

    orderSummary.innerHTML = `
        総額: ${totalCost.toLocaleString()}円<br>
        必要証拠金: <span style="font-size:1.2em; color:#e91e63">${requiredMargin.toLocaleString()}円</span>
    `;
}

// 株購入
if (btnBuyStock) {
    btnBuyStock.addEventListener('click', () => {
        if (!selectedStockId) return;

        const amount = parseInt(stockAmountInput.value);
        const leverage = parseFloat(stockLeverageSelect.value);
        const price = stockData.prices[selectedStockId];
        const info = BUG_INFO[selectedStockId];

        if (amount <= 0) { alert('株数は1以上で入力してください'); return; }

        const totalCost = price * amount;
        const requiredMargin = Math.ceil(totalCost / leverage);

        if (wallet < requiredMargin) {
            alert('所持金が足りません');
            return;
        }

        if (!confirm(`${info.name}を${amount}株、レバレッジ${leverage}倍で購入しますか？\n必要証拠金: ${requiredMargin.toLocaleString()}円`)) return;

        wallet -= requiredMargin;

        portfolio.push({
            id: selectedStockId,
            name: info.name,
            amount: amount,
            buyPrice: price,
            leverage: leverage,
            margin: requiredMargin,
            date: new Date().toISOString()
        });

        saveData();
        renderPortfolio();
        alert('注文が約定しました！');
    });
}

function renderPortfolio() {
    if (!portfolioList || !portfolioContainer) return;
    portfolioList.innerHTML = '';

    if (portfolio.length > 0) {
        portfolioContainer.classList.remove('hidden');
        portfolio.forEach((pos, index) => {
            const currentPrice = stockData.prices[pos.id];
            const currentValue = currentPrice * pos.amount;
            const initialValue = pos.buyPrice * pos.amount;
            const profit = currentValue - initialValue;
            const profitClass = profit >= 0 ? 'price-up' : 'price-down';
            const profitSign = profit >= 0 ? '+' : '';

            const div = document.createElement('div');
            div.className = 'portfolio-card';
            div.innerHTML = `
                <div class="pf-info">
                    <strong>${pos.name}</strong> x${pos.amount} (Lv.${pos.leverage})<br>
                    取得: ${pos.buyPrice}円 → 現在: ${currentPrice}円
                </div>
                <div class="pf-right">
                    <div class="pf-pl ${profitClass}">${profitSign}${profit.toLocaleString()}円</div>
                    <button class="btn-sell-stock" onclick="sellStock(${index})">決済</button>
                </div>
            `;
            portfolioList.appendChild(div);
        });
    } else {
        portfolioContainer.classList.add('hidden');
    }
}

window.sellStock = function (index) {
    const pos = portfolio[index];
    const currentPrice = stockData.prices[pos.id];
    const profit = (currentPrice - pos.buyPrice) * pos.amount;
    const returnAmount = pos.margin + profit;

    let msg = `決済しますか？\n損益: ${profit.toLocaleString()}円\n`;
    if (returnAmount >= 0) {
        msg += `口座への返還: ${returnAmount.toLocaleString()}円`;
    } else {
        msg += `⚠️ 追証発生: ${Math.abs(returnAmount).toLocaleString()}円 の支払いが必要です`;
    }

    if (!confirm(msg)) return;

    wallet += returnAmount;
    portfolio.splice(index, 1);
    saveData();
    renderPortfolio();
    alert('決済しました。');
}


// --- 買い物 & ガチャ (修正版) ---

function renderShopItems() {
    if (!itemsGrid) return;
    itemsGrid.innerHTML = '';

    // ガチャや在庫と関係なく、ショップアイテムを一覧表示
    SHOP_ITEMS.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-image">${item.icon}</div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">¥${item.price.toLocaleString()}</div>
                <div class="item-desc">${item.desc}</div>
                <button class="btn-buy" onclick="buyItem('${item.id}')">購入する</button>
            </div>
        `;
        itemsGrid.appendChild(div);
    });
}

function renderInventory() {
    if (!inventoryGrid) return;
    inventoryGrid.innerHTML = '';
    const itemIds = Object.keys(inventory);

    if (itemIds.length === 0) {
        inventoryGrid.innerHTML = '<p class="empty-msg">持ち物はまだありません</p>';
        return;
    }

    itemIds.forEach(id => {
        const count = inventory[id];
        if (count <= 0) return;

        const itemData = SHOP_ITEMS.find(i => i.id === id);
        if (!itemData) return; // 商品リストにない古いアイテムなどがもしあればスキップ

        const sellPrice = Math.floor(itemData.price / 2);

        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-image">${itemData.icon}</div>
            <div class="item-details">
                <div class="item-name">${itemData.name} <span class="count-badge">x${count}</span></div>
                <div class="item-price" style="color: #ff9800;">売値: ¥${sellPrice.toLocaleString()}</div>
                <button class="btn-sell" onclick="sellItem('${id}')">売却する</button>
            </div>
        `;
        inventoryGrid.appendChild(div);
    });
}

window.buyItem = function (id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item) return;
    if (wallet >= item.price) {
        if (!confirm(`${item.name}を${item.price.toLocaleString()}円で購入しますか？`)) return;
        wallet -= item.price;
        inventory[id] = (inventory[id] || 0) + 1;
        saveData();
        renderInventory();
        alert('購入しました！');
    } else {
        alert('お金が足りません！');
    }
};

window.sellItem = function (id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item || !inventory[id]) return;
    const sellPrice = Math.floor(item.price / 2);
    if (!confirm(`${item.name}を${sellPrice.toLocaleString()}円で売却しますか？`)) return;
    wallet += sellPrice;
    inventory[id] -= 1;
    if (inventory[id] <= 0) delete inventory[id];
    saveData();
    renderInventory();
};

// --- ガチャロジック (全商品対応版) ---

// 確率計算関数: 商品リスト全体からランダムに選出
function getGachaResult() {
    // 確率テーブルを動的に生成

    let weightedList = SHOP_ITEMS.map(item => {
        let weight = 20; // default
        if (item.price <= 500) weight = 64;
        else if (item.price <= 10000) weight = 30;
        else if (item.price <= 100000) weight = 4;
        else if (item.price <= 1000000) weight = 1.5;
        else weight = 0.5;

        return { item, weight };
    });

    const totalWeight = weightedList.reduce((sum, entry) => sum + entry.weight, 0);
    let random = Math.random() * totalWeight;

    for (const entry of weightedList) {
        if (random < entry.weight) {
            return entry.item;
        }
        random -= entry.weight;
    }
    return weightedList[weightedList.length - 1].item;
}

// ランク判定用ヘルパー
function getRank(price) {
    if (price > 1000000) return 'SSR';
    if (price > 100000) return 'SR';
    if (price > 5000) return 'R';
    if (price > 500) return 'N';
    return 'BAD';
}

if (btnOpenGacha) btnOpenGacha.addEventListener('click', () => gachaModal.classList.remove('hidden'));
if (btnCloseGacha) btnCloseGacha.addEventListener('click', () => gachaModal.classList.add('hidden'));

if (btnPlayGacha) {
    btnPlayGacha.addEventListener('click', () => {
        const COST = 500;
        if (wallet < COST) { alert('お金が足りません！'); return; }

        // 支払い
        wallet -= COST;
        saveData();
        updateDisplay();

        btnPlayGacha.disabled = true;
        let count = 0;
        const interval = setInterval(() => {
            gachaDisplayIcon.textContent = ['❓', '🌀', '✨', '📦'][count % 4];
            gachaDisplayText.textContent = '抽選中...';
            count++;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);

            // 結果抽選
            const resultItem = getGachaResult();
            const rank = getRank(resultItem.price);

            // 表示更新
            gachaDisplayIcon.textContent = resultItem.icon;

            // インベントリ追加
            inventory[resultItem.id] = (inventory[resultItem.id] || 0) + 1;
            saveData();
            renderInventory();

            // 履歴
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `<span class="rank-${rank.toLowerCase()}">[${rank}]</span><span>${resultItem.name}</span>`;
            gachaHistory.prepend(historyItem);

            // メッセージ
            if (rank === 'SSR' || rank === 'SR') {
                gachaDisplayText.textContent = `大当たり！ ${resultItem.name}！`;
                gachaDisplayText.style.color = '#ffd700';
            } else if (rank === 'BAD') {
                gachaDisplayText.textContent = `ハズレ... ${resultItem.name}`;
                gachaDisplayText.style.color = '#ccc';
            } else {
                gachaDisplayText.textContent = `${resultItem.name} を入手`;
                gachaDisplayText.style.color = 'white';
            }

            btnPlayGacha.disabled = false;
        }, 2000);
    });
}

// 起動
init();