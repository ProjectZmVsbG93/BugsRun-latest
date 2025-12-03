// room.js

// 定数
const INVENTORY_KEY = 'bugsRaceInventory';
const ROOM_KEY = 'bugsRaceRoom';
const ROOM_SETTINGS_KEY = 'bugsRaceRoomSettings';

// アイテムデータ (shop.jsと同じ定義)
const ITEM_DB = {
    'stone': { name: '道端の石', icon: '🪨' },
    'acorn': { name: 'どんぐり', icon: '🌰' },
    'plastic_bag': { name: 'レジ袋 (Sサイズ)', icon: '🛍️' },
    '5yen_choco': { name: 'ごえんがあるよ', icon: '🍫' },
    'used_chopsticks': { name: '使用済み割り箸', icon: '🥢' },
    'umaibo': { name: 'うまい棒', icon: '🌽' },
    'tirol': { name: 'チロルチョコ', icon: '🍫' },
    'eraser_dust': { name: 'ねりけし', icon: '🤏' },
    'water': { name: '空ペットボトル', icon: '🫙' },
    'canned_coffee': { name: '缶コーヒー', icon: '☕' },
    'jump': { name: '少年ジャンプ', icon: '📖' },
    'beef_bowl': { name: '牛丼', icon: '🍚' },
    'plastic_sword': { name: '伝説の聖剣', icon: '🗡️' },
    'twitter_badge': { name: '認証バッジ', icon: '☑️' },
    'manga_abe': { name: '安倍晋三物語', icon: '📚' },
    'insect_jelly': { name: '昆虫ゼリー', icon: '🍮' },
    'tamagotchi': { name: 'たまごっち', icon: '🥚' },
    'ds_lite': { name: 'DS Lite', icon: '🎮' },
    'ps2': { name: 'PS2', icon: '🎮' },
    'gba_sp': { name: 'GBA SP', icon: '👾' },
    'one_seg': { name: 'ワンセグ', icon: '📺' },
    'frank_miura': { name: 'フランク三浦', icon: '⌚' },
    'yamato_cage': { name: '大和型虫籠', icon: '🦗' },
    'tv_toshiba': { name: '55V型テレビ', icon: '📺' },
    'fridge': { name: '冷蔵庫', icon: '🧊' },
    'washer': { name: '洗濯機', icon: '🌀' },
    'gold_30': { name: '金(30g)', icon: '🥇' },
    'gold_50': { name: '金(50g)', icon: '🥇' },
    'gold_100': { name: '金(100g)', icon: '🥇' },
    'prius': { name: 'プリウス', icon: '🚗' },
    'rolex_daytona': { name: 'ロレックス', icon: '⌚' },
    'tesla': { name: 'テスラ', icon: '⚡' },
    'lexus': { name: 'レクサス', icon: '🚙' },
    'moon_land': { name: '月面', icon: '🌑' },
    'home_nagoya': { name: 'マイホーム(名古屋)', icon: '🏯' },
    'home_texas': { name: 'マイホーム(テキサス)', icon: '🤠' },
    'honda_jet': { name: 'ホンダジェット', icon: '🛩️' },
    'baseball_team': { name: '球団', icon: '⚾' }
};

// 部屋タイプ定義
const ROOM_TYPES = [
    { id: 'default', name: '質素な我が家', icon: '🏠', requiredItem: null },
    { id: 'nagoya', name: '名古屋の家', icon: '🏯', requiredItem: 'home_nagoya' },
    { id: 'texas', name: 'テキサスの農園', icon: '🤠', requiredItem: 'home_texas' }
];

// 状態
let inventory = {};
let placedItems = []; // {id, x, y, scale}
let roomSettings = { bgType: null };

// 操作状態
let isPlacingNew = false; // 新規配置モード
let placingItemId = null;

let selectedItemIndex = null; // 現在選択中のアイテム（-1 or null は未選択）
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// DOM
const roomEl = document.getElementById('my-room');
const placementLayer = document.getElementById('placement-layer');
const btnAdd = document.getElementById('btn-add-item');
const btnChangeRoom = document.getElementById('btn-change-room');

// モーダル類
const itemModal = document.getElementById('item-select-modal');
const btnCloseItemModal = document.getElementById('btn-close-item-modal');
const itemGrid = document.getElementById('selectable-items-grid');

const roomModal = document.getElementById('room-select-modal');
const btnCloseRoomModal = document.getElementById('btn-close-room-modal');
const roomGrid = document.getElementById('room-select-grid');

const ghostItem = document.getElementById('ghost-item');

function init() {
    loadData();

    // 部屋設定がまだない場合は部屋選択モーダルを開く
    if (!roomSettings.bgType) {
        openRoomSelectModal(false);
    } else {
        updateRoomBackground();
    }

    renderPlacedItems();
    setupEventListeners();
}

function loadData() {
    const invData = localStorage.getItem(INVENTORY_KEY);
    inventory = invData ? JSON.parse(invData) : {};

    const roomData = localStorage.getItem(ROOM_KEY);
    placedItems = roomData ? JSON.parse(roomData) : [];

    // データ移行: 古いデータにscaleがない場合、1.0を追加
    placedItems.forEach(item => {
        if (typeof item.scale === 'undefined') item.scale = 1.0;
    });

    const settingData = localStorage.getItem(ROOM_SETTINGS_KEY);
    roomSettings = settingData ? JSON.parse(settingData) : { bgType: null };
}

function saveData() {
    localStorage.setItem(ROOM_KEY, JSON.stringify(placedItems));
    localStorage.setItem(ROOM_SETTINGS_KEY, JSON.stringify(roomSettings));
}

// --- イベントリスナー設定 ---
function setupEventListeners() {
    btnAdd.addEventListener('click', openItemSelectModal);
    btnCloseItemModal.addEventListener('click', () => itemModal.classList.add('hidden'));

    btnChangeRoom.addEventListener('click', () => openRoomSelectModal(true));
    btnCloseRoomModal.addEventListener('click', () => roomModal.classList.add('hidden'));

    // --- 新規配置モード ---
    document.addEventListener('mousemove', (e) => {
        if (isPlacingNew) {
            ghostItem.style.left = e.clientX + 'px';
            ghostItem.style.top = e.clientY + 'px';
        } else if (isDragging) {
            handleDragMove(e);
        }
    });

    // 部屋背景をクリックしたら選択解除
    roomEl.addEventListener('mousedown', (e) => {
        if (e.target === roomEl || e.target === placementLayer) {
            // 新規配置モードでなければ選択解除
            if (!isPlacingNew) {
                deselectItem();
            }
        }
    });

    roomEl.addEventListener('click', (e) => {
        if (isPlacingNew) {
            placeNewItem(e);
        }
    });

    // ドラッグ終了
    document.addEventListener('mouseup', handleDragEnd);
}

// --- アイテム配置・描画ロジック ---

function renderPlacedItems() {
    placementLayer.innerHTML = '';

    placedItems.forEach((item, index) => {
        const info = ITEM_DB[item.id];
        if (!info) return;

        // コンテナ
        const container = document.createElement('div');
        container.className = 'placed-item';
        if (index === selectedItemIndex) container.classList.add('selected');

        container.style.left = item.x + 'px';
        container.style.top = item.y + 'px';
        container.style.zIndex = Math.floor(item.y);

        // 絵文字部分 (scale適用)
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = info.icon;
        emojiSpan.style.display = 'block';
        emojiSpan.style.transform = `scale(${item.scale})`;
        container.appendChild(emojiSpan);

        // クリックで選択
        container.addEventListener('mousedown', (e) => {
            // 既に選択中なら何もしない（ドラッグ操作などはボタン側でやる）
            // 未選択なら選択する
            if (selectedItemIndex !== index) {
                e.stopPropagation(); // 背景クリックでの解除を防ぐ
                selectItem(index);
            }
        });

        // 選択中なら操作メニューを表示
        if (index === selectedItemIndex) {
            const controls = document.createElement('div');
            controls.className = 'item-controls';

            // ドラッグ移動ボタン
            const btnMove = document.createElement('button');
            btnMove.className = 'control-btn btn-move';
            btnMove.innerHTML = '✥'; // 移動記号
            btnMove.title = 'ドラッグして移動';
            btnMove.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // 親のclickイベント等を止める
                startDrag(e, index, container);
            });

            // 縮小ボタン
            const btnShrink = document.createElement('button');
            btnShrink.className = 'control-btn btn-zoom';
            btnShrink.innerHTML = '－';
            btnShrink.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                changeScale(index, -0.1);
            });

            // 拡大ボタン
            const btnGrow = document.createElement('button');
            btnGrow.className = 'control-btn btn-zoom';
            btnGrow.innerHTML = '＋';
            btnGrow.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                changeScale(index, 0.1);
            });

            // 削除ボタン
            const btnDelete = document.createElement('button');
            btnDelete.className = 'control-btn btn-delete';
            btnDelete.innerHTML = '🗑️';
            btnDelete.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                deleteItem(index);
            });

            controls.appendChild(btnMove);
            controls.appendChild(btnShrink);
            controls.appendChild(btnGrow);
            controls.appendChild(btnDelete);

            container.appendChild(controls);
        }

        placementLayer.appendChild(container);
    });
}

// アイテムを選択状態にする
function selectItem(index) {
    selectedItemIndex = index;
    renderPlacedItems();
}

// 選択解除
function deselectItem() {
    if (selectedItemIndex !== null) {
        selectedItemIndex = null;
        renderPlacedItems();
    }
}

// スケール変更
function changeScale(index, delta) {
    let current = placedItems[index].scale || 1.0;
    current += delta;
    if (current < 0.2) current = 0.2; // 最小サイズ制限
    if (current > 5.0) current = 5.0; // 最大サイズ制限

    placedItems[index].scale = parseFloat(current.toFixed(1)); // 浮動小数点誤差対策
    saveData();
    renderPlacedItems();
}

// 削除
function deleteItem(index) {
    const info = ITEM_DB[placedItems[index].id];
    if (confirm(`${info.name} を片付けますか？`)) {
        placedItems.splice(index, 1);
        selectedItemIndex = null;
        saveData();
        renderPlacedItems();
    }
}

// --- ドラッグ移動ロジック ---

function startDrag(e, index, element) {
    isDragging = true;

    const roomRect = roomEl.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();

    // マウス位置と要素の左上とのズレを計算
    dragOffsetX = e.clientX - itemRect.left;
    dragOffsetY = e.clientY - itemRect.top;

    // ドラッグ中は選択維持
    element.classList.add('dragging');
}

function handleDragMove(e) {
    if (!isDragging || selectedItemIndex === null) return;

    const roomRect = roomEl.getBoundingClientRect();
    // 新しい座標（部屋基準）
    // dragOffsetXは画面全体座標系でのオフセットなので、
    // e.clientX (画面全体マウスX) - roomRect.left (部屋の左端) - dragOffsetX (マウスと要素のズレ)
    let newX = e.clientX - roomRect.left - (dragOffsetX);
    let newY = e.clientY - roomRect.top - (dragOffsetY);

    // 一時的にDOMを動かす（描画負荷軽減のためrenderPlacedItemsは呼ばない）
    // placementLayerの子要素の該当インデックスを取得
    // DOMの順序と配列の順序は一致している前提
    const itemEl = placementLayer.children[selectedItemIndex];
    if (itemEl) {
        itemEl.style.left = newX + 'px';
        itemEl.style.top = newY + 'px';
    }
}

function handleDragEnd(e) {
    if (!isDragging || selectedItemIndex === null) return;

    const itemEl = placementLayer.children[selectedItemIndex];
    if (itemEl) {
        itemEl.classList.remove('dragging');

        // 最終的な座標をデータに保存
        const finalX = parseFloat(itemEl.style.left);
        const finalY = parseFloat(itemEl.style.top);

        placedItems[selectedItemIndex].x = finalX;
        placedItems[selectedItemIndex].y = finalY;

        saveData();
        renderPlacedItems(); // Z-indexなどを正しく再計算
    }

    isDragging = false;
}

// --- 新規配置ロジック (既存) ---

function startPlacingNew(id) {
    itemModal.classList.add('hidden');
    isPlacingNew = true;
    placingItemId = id;
    deselectItem(); // 既存選択解除

    ghostItem.textContent = ITEM_DB[id].icon;
    ghostItem.classList.remove('hidden');
    roomEl.style.cursor = 'crosshair';
}

function placeNewItem(e) {
    const rect = roomEl.getBoundingClientRect();
    const x = e.clientX - rect.left - 32;
    const y = e.clientY - rect.top - 32;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    placedItems.push({
        id: placingItemId,
        x: x,
        y: y,
        scale: 1.0 // 初期スケール
    });

    saveData();

    // 配置直後にそれを選択状態にする
    selectedItemIndex = placedItems.length - 1;
    renderPlacedItems();

    isPlacingNew = false;
    placingItemId = null;
    ghostItem.classList.add('hidden');
    roomEl.style.cursor = 'default';
}


// --- UI関連 (既存) ---

function openItemSelectModal() {
    itemModal.classList.remove('hidden');
    itemGrid.innerHTML = '';
    const counts = {};
    placedItems.forEach(p => counts[p.id] = (counts[p.id] || 0) + 1);

    let hasItem = false;
    Object.keys(inventory).forEach(id => {
        const owned = inventory[id];
        const used = counts[id] || 0;
        const available = owned - used;

        if (available > 0 && ITEM_DB[id]) {
            hasItem = true;
            const div = document.createElement('div');
            div.className = 'item-select-card';
            div.innerHTML = `
                <div class="item-icon">${ITEM_DB[id].icon}</div>
                <div class="item-name">${ITEM_DB[id].name}</div>
                <div class="item-count">残り: ${available}</div>
            `;
            div.addEventListener('click', () => startPlacingNew(id));
            itemGrid.appendChild(div);
        }
    });

    if (!hasItem) {
        itemGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">飾れるアイテムがありません</p>';
    }
}

function openRoomSelectModal(cancellable) {
    roomModal.classList.remove('hidden');
    roomGrid.innerHTML = '';

    if (cancellable) {
        btnCloseRoomModal.classList.remove('hidden');
    } else {
        btnCloseRoomModal.classList.add('hidden');
    }

    ROOM_TYPES.forEach(type => {
        const isOwned = !type.requiredItem || (inventory[type.requiredItem] && inventory[type.requiredItem] > 0);
        const div = document.createElement('div');
        div.className = `room-select-card ${isOwned ? '' : 'disabled'}`;
        div.innerHTML = `
            <div class="item-icon">${type.icon}</div>
            <div class="item-name" style="font-size:1.2rem;">${type.name}</div>
            ${isOwned ? '<div class="item-count" style="color:blue">所有済み</div>' : '<div class="item-count">未所有</div>'}
        `;

        if (isOwned) {
            div.addEventListener('click', () => {
                roomSettings.bgType = type.id;
                saveData();
                updateRoomBackground();
                roomModal.classList.add('hidden');
            });
        } else {
            div.addEventListener('click', () => {
                alert('この家はまだ持っていません！ショップで購入してください。');
            });
        }
        roomGrid.appendChild(div);
    });
}

function updateRoomBackground() {
    roomEl.className = 'room-container';
    const typeId = roomSettings.bgType || 'default';
    roomEl.classList.add(`${typeId}-bg`);
}

init();