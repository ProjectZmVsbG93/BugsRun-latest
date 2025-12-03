// 定数
const INVENTORY_KEY = 'bugsRaceInventory';
const ROOM_KEY = 'bugsRaceRoom';
const ROOM_SETTINGS_KEY = 'bugsRaceRoomSettings';

// アイテムデータ
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
let isPlacingNew = false;
let placingItemId = null;

let selectedItemIndex = null;
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

// --- ユーティリティ: タッチイベント座標取得 ---
function getClientPos(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function init() {
    loadData();

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

    // --- 新規配置モード (マウス & タッチ) ---
    const handleMove = (e) => {
        if (isPlacingNew) {
            // e.preventDefault(); // 必要に応じて
            const pos = getClientPos(e);
            ghostItem.style.left = pos.x + 'px';
            ghostItem.style.top = pos.y + 'px';
        } else if (isDragging) {
            handleDragMove(e);
        }
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });

    // 部屋背景をクリック/タップしたら選択解除
    const handleBgClick = (e) => {
        // placementLayer自体か、roomEl自体をクリックした場合のみ解除
        if (e.target === roomEl || e.target === placementLayer) {
            if (!isPlacingNew) {
                deselectItem();
            } else {
                placeNewItem(e);
            }
        }
    };
    // clickだとドラッグ終わりにも発火しやすいので、明示的に分けるか、
    // ここではシンプルに click / touchstart を併用
    roomEl.addEventListener('click', handleBgClick);

    // ドラッグ終了 (マウス & タッチ)
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
}

// --- アイテム配置・描画ロジック ---

function renderPlacedItems() {
    placementLayer.innerHTML = '';

    placedItems.forEach((item, index) => {
        const info = ITEM_DB[item.id];
        if (!info) return;

        const container = document.createElement('div');
        container.className = 'placed-item';
        if (index === selectedItemIndex) container.classList.add('selected');

        container.style.left = item.x + 'px';
        container.style.top = item.y + 'px';
        container.style.zIndex = Math.floor(item.y);

        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = info.icon;
        emojiSpan.style.display = 'block';
        emojiSpan.style.transform = `scale(${item.scale})`;
        container.appendChild(emojiSpan);

        // クリック/タップで選択
        const handleSelect = (e) => {
            if (isPlacingNew) return;
            // 既に選択中なら伝播止めない（ボタン操作等のため）
            // 未選択なら選択する
            if (selectedItemIndex !== index) {
                e.stopPropagation();
                // e.preventDefault(); // タッチ時の拡大などを防ぐ
                selectItem(index);
            }
        };
        container.addEventListener('mousedown', handleSelect);
        container.addEventListener('touchstart', handleSelect, { passive: false });

        // 選択中なら操作メニューを表示
        if (index === selectedItemIndex) {
            const controls = document.createElement('div');
            controls.className = 'item-controls';

            // ドラッグ移動ボタン
            const btnMove = document.createElement('button');
            btnMove.className = 'control-btn btn-move';
            btnMove.innerHTML = '✥';

            const startDragHandler = (e) => {
                e.stopPropagation();
                // e.preventDefault(); // スクロール防止
                startDrag(e, index, container);
            };
            btnMove.addEventListener('mousedown', startDragHandler);
            btnMove.addEventListener('touchstart', startDragHandler, { passive: false });

            // 縮小ボタン
            const btnShrink = document.createElement('button');
            btnShrink.className = 'control-btn btn-zoom';
            btnShrink.innerHTML = '－';
            const shrinkHandler = (e) => { e.stopPropagation(); changeScale(index, -0.1); };
            btnShrink.addEventListener('mousedown', shrinkHandler);
            btnShrink.addEventListener('touchstart', shrinkHandler, { passive: true });

            // 拡大ボタン
            const btnGrow = document.createElement('button');
            btnGrow.className = 'control-btn btn-zoom';
            btnGrow.innerHTML = '＋';
            const growHandler = (e) => { e.stopPropagation(); changeScale(index, 0.1); };
            btnGrow.addEventListener('mousedown', growHandler);
            btnGrow.addEventListener('touchstart', growHandler, { passive: true });

            // 削除ボタン
            const btnDelete = document.createElement('button');
            btnDelete.className = 'control-btn btn-delete';
            btnDelete.innerHTML = '🗑️';
            const deleteHandler = (e) => { e.stopPropagation(); deleteItem(index); };
            btnDelete.addEventListener('mousedown', deleteHandler);
            btnDelete.addEventListener('touchstart', deleteHandler, { passive: true });

            controls.appendChild(btnMove);
            controls.appendChild(btnShrink);
            controls.appendChild(btnGrow);
            controls.appendChild(btnDelete);

            container.appendChild(controls);
        }

        placementLayer.appendChild(container);
    });
}

function selectItem(index) {
    selectedItemIndex = index;
    renderPlacedItems();
}

function deselectItem() {
    if (selectedItemIndex !== null) {
        selectedItemIndex = null;
        renderPlacedItems();
    }
}

function changeScale(index, delta) {
    let current = placedItems[index].scale || 1.0;
    current += delta;
    if (current < 0.2) current = 0.2;
    if (current > 5.0) current = 5.0;

    placedItems[index].scale = parseFloat(current.toFixed(1));
    saveData();
    renderPlacedItems();
}

function deleteItem(index) {
    const info = ITEM_DB[placedItems[index].id];
    if (confirm(`${info.name} を片付けますか？`)) {
        placedItems.splice(index, 1);
        selectedItemIndex = null;
        saveData();
        renderPlacedItems();
    }
}

// --- ドラッグ移動ロジック (マウス & タッチ共通) ---

function startDrag(e, index, element) {
    isDragging = true;

    const pos = getClientPos(e);
    const itemRect = element.getBoundingClientRect();

    // ズレを計算
    dragOffsetX = pos.x - itemRect.left;
    dragOffsetY = pos.y - itemRect.top;

    element.classList.add('dragging');
}

function handleDragMove(e) {
    if (!isDragging || selectedItemIndex === null) return;

    // タッチ操作で画面スクロールしないようにする
    if (e.cancelable) e.preventDefault();

    const roomRect = roomEl.getBoundingClientRect();
    const pos = getClientPos(e);

    let newX = pos.x - roomRect.left - dragOffsetX;
    let newY = pos.y - roomRect.top - dragOffsetY;

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

        const finalX = parseFloat(itemEl.style.left);
        const finalY = parseFloat(itemEl.style.top);

        placedItems[selectedItemIndex].x = finalX;
        placedItems[selectedItemIndex].y = finalY;

        saveData();
        renderPlacedItems();
    }

    isDragging = false;
}

// --- 新規配置ロジック ---

function startPlacingNew(id) {
    itemModal.classList.add('hidden');
    isPlacingNew = true;
    placingItemId = id;
    deselectItem();

    ghostItem.textContent = ITEM_DB[id].icon;
    ghostItem.classList.remove('hidden');
    roomEl.style.cursor = 'crosshair';
}

function placeNewItem(e) {
    const rect = roomEl.getBoundingClientRect();
    const pos = getClientPos(e);

    const x = pos.x - rect.left - 32;
    const y = pos.y - rect.top - 32;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    placedItems.push({
        id: placingItemId,
        x: x,
        y: y,
        scale: 1.0
    });

    saveData();
    selectedItemIndex = placedItems.length - 1;
    renderPlacedItems();

    isPlacingNew = false;
    placingItemId = null;
    ghostItem.classList.add('hidden');
    roomEl.style.cursor = 'default';
}

// --- UI関連 ---

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