// betting.js
import { gameState } from './state.js';
import * as El from './elements.js';
import { CONDITIONS } from './data.js';
import { updateWalletDisplay } from './ui.js';
import { startRace } from './mechanics.js';

export function renderBettingScreen() {
    if (!El.bettingBugList) return;
    El.bettingBugList.innerHTML = '';
    
    const canLoanBet = gameState.wallet < 100;
    const loanNotice = document.getElementById('loan-bet-notice');
    if (loanNotice) {
        if (canLoanBet) {
            loanNotice.classList.remove('hidden');
        } else {
            loanNotice.classList.add('hidden');
        }
    }

    gameState.bugs.forEach(bug => {
        const row = document.createElement('div');
        row.className = 'betting-row';

        const speedStars = '★'.repeat(Math.min(5, Math.ceil(bug.speed / 4)));
        const hpStars = '★'.repeat(Math.min(5, Math.ceil(bug.hp / 3)));
        const atkStars = '★'.repeat(Math.min(5, bug.attack));

        const potentialWin100 = Math.floor(100 * bug.odds);
        const potentialWin500 = Math.floor(500 * bug.odds);
        const canBet = gameState.wallet >= 100;
        
        row.innerHTML = `
            <div class="bet-info-col">
                <div class="bug-name">${bug.name}</div>
                <div class="bug-condition-wrap">
                    <span class="condition-badge ${CONDITIONS[bug.condition].class}">${bug.condition}</span>
                    <span class="odds-display">${bug.odds}倍</span>
                </div>
            </div>
            <div class="card-body">
                <div class="bet-image-col">
                    ${bug.icon}
                </div>
                <div class="bet-stats-col">
                    <div>Spd: ${speedStars}</div>
                    <div>HP : ${hpStars}</div>
                    <div>Atk: ${atkStars}</div>
                    <div style="font-size: 0.7rem; color: #999; margin-top: 5px;">
                        ${canBet ? `100円で勝つと: ${potentialWin100.toLocaleString()}円` : `借金500円で勝つと: ${potentialWin500.toLocaleString()}円`}
                    </div>
                </div>
            </div>
            <div class="bet-action-col">
                ${canBet ? `
                <div class="bet-input-wrap">
                    <input type="number" id="bet-input-${bug.id}" class="bet-input" min="100" step="100" placeholder="0" max="${gameState.wallet}">
                    <span>円</span>
                </div>
                <button class="btn-bet" onclick="placeBetOnBug('${bug.id}')">ベット</button>
                ` : `
                <div class="bet-input-wrap">
                    <input type="number" id="bet-input-${bug.id}" class="bet-input" value="500" disabled style="background: #f0f0f0;">
                    <span>円 (借金)</span>
                </div>
                <button class="btn-bet btn-loan-bet" onclick="placeLoanBetOnBug('${bug.id}')">借金ベット</button>
                `}
            </div>
            <div class="bet-desc-col">
                ${bug.desc}
            </div>
        `;
        El.bettingBugList.appendChild(row);
    });
}

// Window関数への登録（HTMLのonclick属性から呼ぶため）
window.placeBetOnBug = function (bugId) {
    const input = document.getElementById(`bet-input-${bugId}`);
    const amount = parseInt(input.value);

    if (!amount || amount <= 0) {
        alert('掛け金を入力してください');
        return;
    }
    if (amount > gameState.wallet) {
        alert('所持金が足りません');
        return;
    }
    if (amount % 100 !== 0) {
        alert('掛け金は100円単位でお願いします');
        return;
    }

    gameState.bet = { targetId: bugId, amount: amount, odds: gameState.bugs.find(b => b.id === bugId).odds, isLoan: false };
    gameState.wallet -= amount;
    updateWalletDisplay();

    const inputs = document.querySelectorAll('.bet-input');
    const buttons = document.querySelectorAll('.btn-bet');
    inputs.forEach(i => i.disabled = true);
    buttons.forEach(b => b.disabled = true);

    document.querySelectorAll('.betting-row').forEach(row => row.classList.remove('selected'));
    const selectedRow = input.closest('.betting-row');
    selectedRow.classList.add('selected');

    const bug = gameState.bugs.find(b => b.id === bugId);
    const potentialWin = Math.floor(amount * bug.odds);
    if (confirm(`${bug.name}に${amount.toLocaleString()}円賭けてレースを開始しますか？\n\n勝った場合の払い戻し: ${potentialWin.toLocaleString()}円`)) {
        startRace();
    } else {
        gameState.wallet += amount;
        updateWalletDisplay();
        gameState.bet = { targetId: null, amount: 0, odds: 0, isLoan: false };
        inputs.forEach(i => i.disabled = false);
        buttons.forEach(b => b.disabled = false);
        selectedRow.classList.remove('selected');
    }
};

window.placeLoanBetOnBug = function (bugId) {
    const LOAN_AMOUNT = 500;
    
    const bug = gameState.bugs.find(b => b.id === bugId);
    const potentialWin = Math.floor(LOAN_AMOUNT * bug.odds);
    
    if (confirm(`${bug.name}に借金${LOAN_AMOUNT}円で賭けてレースを開始しますか？\n\n勝った場合の払い戻し: ${potentialWin.toLocaleString()}円 (借金${LOAN_AMOUNT}円を返済後、残りを獲得)\n負けた場合: 借金${LOAN_AMOUNT}円が残ります`)) {
        gameState.bet = { targetId: bugId, amount: LOAN_AMOUNT, odds: bug.odds, isLoan: true };
        
        const buttons = document.querySelectorAll('.btn-bet');
        buttons.forEach(b => b.disabled = true);
        
        document.querySelectorAll('.betting-row').forEach(row => row.classList.remove('selected'));
        const row = document.querySelector(`#bet-input-${bugId}`).closest('.betting-row');
        row.classList.add('selected');
        
        startRace();
    }
};