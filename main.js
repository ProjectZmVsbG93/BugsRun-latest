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