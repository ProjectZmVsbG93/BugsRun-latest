// main.js
import { gameState } from './state.js';
import * as El from './elements.js';
import * as UI from './ui.js';
import { setupNewRace, processTurn } from './mechanics.js';
import { WEATHER_INFO } from './data.js';
import { BUG_TEMPLATES } from './data.js';

function init() {
    console.log("Initializing BugsRace (Modules)...");
    const savedWallet = localStorage.getItem('bugsRaceWallet');
    if (savedWallet) {
        gameState.wallet = parseInt(savedWallet);
    }
    const savedStats = localStorage.getItem('bugsRaceStats');
    if (savedStats) {
        gameState.stats = JSON.parse(savedStats);
    }
    UI.updateWalletDisplay();
    UI.updateHomeStats();

    // Event Listeners
    if (El.gameStartBtn) {
        El.gameStartBtn.addEventListener('click', startGameFlow);
    }
    if (El.shopBtn) {
        El.shopBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
    }
    if (El.toBettingBtn) El.toBettingBtn.addEventListener('click', () => UI.switchScreen('betting'));
    if (El.nextTurnBtn) El.nextTurnBtn.addEventListener('click', processTurn);

    // ★修正: 「次のレースへ」ボタンを押したとき、モード選択画面に戻る
    if (El.nextRaceBtn) {
        El.nextRaceBtn.addEventListener('click', () => {
            UI.switchScreen('mode-select');
        });
    }

    // Statistics Modal
    if (El.statsToggleBtn) El.statsToggleBtn.addEventListener('click', () => {
        El.statsModal.classList.remove('hidden');
        UI.updateStatsDisplay();
    });
    if (El.statsCloseBtn) El.statsCloseBtn.addEventListener('click', () => {
        El.statsModal.classList.add('hidden');
    });
    if (El.statsModal) El.statsModal.addEventListener('click', (e) => {
        if (e.target === El.statsModal) El.statsModal.classList.add('hidden');
    });

    // --- データ管理モーダルのロジック ---
    const dataModal = document.getElementById('data-modal');
    const dataManageBtn = document.getElementById('data-manage-btn');
    const dataCloseBtn = document.getElementById('data-close-btn');
    const exportArea = document.getElementById('export-area');
    const btnCopy = document.getElementById('btn-copy-data');
    const importArea = document.getElementById('import-area');
    const btnImport = document.getElementById('btn-import-data');

    // 開く
    if (dataManageBtn) {
        dataManageBtn.addEventListener('click', () => {
            dataModal.classList.remove('hidden');
            // 現在のデータをJSON化して表示
            const allData = {
                wallet: localStorage.getItem('bugsRaceWallet'),
                stats: localStorage.getItem('bugsRaceStats'),
                // ショップ関連のデータも一緒に
                inventory: localStorage.getItem('bugsRaceInventory'),
                stocks: localStorage.getItem('bugsRaceStocks'),
                portfolio: localStorage.getItem('bugsRacePortfolio'),
                fx: localStorage.getItem('bugsRaceFxPositions') // 旧FXデータも念のため
            };
            // null除外
            Object.keys(allData).forEach(key => {
                if (allData[key] === null) delete allData[key];
            });

            exportArea.value = JSON.stringify(allData);
        });
    }

    // 閉じる
    if (dataCloseBtn) {
        dataCloseBtn.addEventListener('click', () => dataModal.classList.add('hidden'));
    }
    if (dataModal) {
        dataModal.addEventListener('click', (e) => {
            if (e.target === dataModal) dataModal.classList.add('hidden');
        });
    }

    // コピー
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            exportArea.select();
            document.execCommand('copy');
            alert('データをクリップボードにコピーしました！');
        });
    }

    // インポート
    if (btnImport) {
        btnImport.addEventListener('click', () => {
            const jsonStr = importArea.value.trim();
            if (!jsonStr) {
                alert('データが空です');
                return;
            }

            try {
                const data = JSON.parse(jsonStr);

                if (!confirm('現在のデータを上書きして読み込みますか？\n(この操作は取り消せません)')) return;

                // データをローカルストレージに保存
                if (data.wallet) localStorage.setItem('bugsRaceWallet', data.wallet);
                if (data.stats) localStorage.setItem('bugsRaceStats', data.stats);
                if (data.inventory) localStorage.setItem('bugsRaceInventory', data.inventory);
                if (data.stocks) localStorage.setItem('bugsRaceStocks', data.stocks);
                if (data.portfolio) localStorage.setItem('bugsRacePortfolio', data.portfolio);
                if (data.fx) localStorage.setItem('bugsRaceFxPositions', data.fx);

                alert('データの読み込みに成功しました！\nページをリロードします。');
                location.reload();

            } catch (e) {
                alert('データの形式が正しくありません。\n' + e);
            }
        });
    }
    // Quick bet buttons
    document.querySelectorAll('.btn-quick-bet').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            document.querySelectorAll('.bet-input').forEach(input => {
                if (amount === 'all') {
                    input.value = gameState.wallet;
                } else {
                    const numAmount = parseInt(amount);
                    input.value = Math.min(numAmount, gameState.wallet);
                }
            });
        });
    });

    // Clear log button
    if (El.clearLogBtn) {
        El.clearLogBtn.addEventListener('click', () => {
            if (El.raceActionLog) {
                El.raceActionLog.innerHTML = '';
            }
        });
    }

    // Initial Screen
    UI.switchScreen('home');
}

function startGameFlow() {
    console.log("Starting game flow...");
    setupNewRace();
    UI.switchScreen('course');

    // Populate Course Reveal
    if (El.revealCourseName) El.revealCourseName.textContent = gameState.currentCourse.name;
    if (El.revealCourseDesc) El.revealCourseDesc.textContent = gameState.currentCourse.desc;
    if (El.revealWeatherIcon) El.revealWeatherIcon.innerHTML = WEATHER_INFO[gameState.weather].icon;
    if (El.revealWeatherText) El.revealWeatherText.textContent = gameState.weather;
}

// --- モード選択 & タイマン機能のロジック ---

// 1. ホーム画面の「レースに出場する」ボタン
const btnToMode = document.getElementById('btn-to-mode-select');
if (btnToMode) {
    btnToMode.addEventListener('click', () => {
        UI.switchScreen('mode-select');
    });
}

// 2. モード選択画面のカードクリックイベント
document.getElementById('mode-normal')?.addEventListener('click', () => {
    // ノーマルモードで開始
    setupNewRace('normal');
    UI.switchScreen('betting');
});

document.getElementById('mode-all')?.addEventListener('click', () => {
    // オールスターモードで開始
    setupNewRace('all');
    UI.switchScreen('betting');
});

document.getElementById('mode-1v1')?.addEventListener('click', () => {
    // タイマン: 虫選択画面へ移動
    renderBugSelectionScreen();
    UI.switchScreen('bug-select');
});

// 戻るボタン
document.getElementById('btn-back-from-mode')?.addEventListener('click', () => {
    UI.switchScreen('home');
});
document.getElementById('btn-back-from-select')?.addEventListener('click', () => {
    UI.switchScreen('mode-select');
});


// --- タイマン用: 虫選択処理 ---
let selectedForDuel = []; // 選択された虫のIDを保存

function renderBugSelectionScreen() {
    const grid = document.getElementById('bug-selection-grid');
    if (!grid) return;
    grid.innerHTML = '';
    selectedForDuel = []; // リセット
    updateDuelButtonState();

    // BUG_TEMPLATES は data.js から import されている前提
    // (もし main.js で import されていない場合は import { BUG_TEMPLATES } from './data.js'; をファイルの先頭に追加してください)

    // インデックス以外の虫を表示
    const bugs = BUG_TEMPLATES.filter(b => !b.id.startsWith('index_'));

    bugs.forEach(bug => {
        const div = document.createElement('div');
        div.className = 'bug-select-card';
        div.innerHTML = `
            <div style="font-size:3rem; margin-bottom:5px;">${bug.icon}</div>
            <div style="font-weight:bold; font-size:0.9rem;">${bug.name}</div>
            <div style="font-size:0.8rem; color:#666;">攻:${bug.attack} 速:${bug.speed} HP:${bug.hp}</div>
        `;

        div.onclick = () => toggleBugSelection(bug.id, div);
        grid.appendChild(div);
    });
}

function toggleBugSelection(id, element) {
    const index = selectedForDuel.indexOf(id);

    if (index >= 0) {
        // 既に選択されていたら解除
        selectedForDuel.splice(index, 1);
        element.classList.remove('selected');
    } else {
        // 未選択なら追加 (ただし2匹まで)
        if (selectedForDuel.length < 2) {
            selectedForDuel.push(id);
            element.classList.add('selected');
        } else {
            // 既に2匹選んでいる場合は、古い方を消して新しい方を入れる（またはアラート）
            // ここではシンプルに何もしない（入れ替えたい場合はUIが複雑になるため）
            // alert("選べるのは2匹までです！"); 
        }
    }
    updateDuelButtonState();
}

function updateDuelButtonState() {
    const status = document.getElementById('select-status');
    const btn = document.getElementById('btn-confirm-1v1');

    if (status) status.textContent = `現在: ${selectedForDuel.length} / 2 匹選択中`;

    if (btn) {
        if (selectedForDuel.length === 2) {
            btn.disabled = false;
            status.style.color = '#e91e63'; // 完了色
        } else {
            btn.disabled = true;
            status.style.color = '#333';
        }
    }
}

// 決定ボタン (1v1開始)
document.getElementById('btn-confirm-1v1')?.addEventListener('click', () => {
    if (selectedForDuel.length === 2) {
        setupNewRace('1v1', selectedForDuel);
        UI.switchScreen('betting');
    }
});

// 起動
document.addEventListener('DOMContentLoaded', init);