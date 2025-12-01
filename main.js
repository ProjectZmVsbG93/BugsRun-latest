// main.js
import { gameState } from './state.js';
import * as El from './elements.js';
import * as UI from './ui.js';
import { setupNewRace, processTurn } from './mechanics.js';
import { WEATHER_INFO } from './data.js';

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
    if (El.nextRaceBtn) El.nextRaceBtn.addEventListener('click', startGameFlow);

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

// 起動
document.addEventListener('DOMContentLoaded', init);