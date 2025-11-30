import { gameState } from './state.js';
import * as El from './elements.js';
import { RACE_DISTANCE, WEATHER_INFO } from './data.js';

export function switchScreen(screenName) {
    Object.values(El.screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    El.screens[screenName].classList.remove('hidden');
    El.screens[screenName].classList.add('active');
}

export function updateWalletDisplay() {
    El.walletDisplay.textContent = gameState.wallet.toLocaleString();

    const loanDisplay = document.getElementById('loan-display');
    const loanAmount = document.getElementById('loan-amount');
    if (loanDisplay && loanAmount) {
        if (gameState.wallet < 0) {
            loanDisplay.classList.remove('hidden');
            loanAmount.textContent = Math.abs(gameState.wallet).toLocaleString();
        } else {
            loanDisplay.classList.add('hidden');
        }
    }

    localStorage.setItem('bugsRaceWallet', gameState.wallet);
}

// ログ出力関数を大幅に変更
export function logMessage(bugId, msg) {
    // ターゲットとなるログボックスを取得
    let targets = [];

    if (bugId) {
        // 特定の虫へのメッセージなら、その虫のログボックスだけ
        const el = document.getElementById(`status-log-${bugId}`);
        if (el) targets.push(el);
    } else {
        // 全体メッセージ（天気変更など）なら、全員のログボックスに追加
        document.querySelectorAll('.status-log').forEach(el => targets.push(el));
    }

    targets.forEach(target => {
        const p = document.createElement('div');
        p.className = 'log-entry';

        // バグ名が含まれていないメッセージの場合のみ名前を付けるなどの処理は
        // 狭いスペースでは省略し、メッセージ本文を重視
        p.textContent = msg;

        target.appendChild(p);
        // 常に最新（一番下）を表示
        target.scrollTop = target.scrollHeight;
    });
}

export function renderRaceTrack() {
    El.raceStatusList.innerHTML = '';
    const oldRacers = El.raceTrack.querySelectorAll('.bug-racer');
    oldRacers.forEach(r => r.remove());
    const oldLanes = El.raceTrack.querySelectorAll('.lane');
    oldLanes.forEach(l => l.remove());
    const oldRankDisplay = document.getElementById('race-rank');
    if (oldRankDisplay) oldRankDisplay.innerHTML = '';

    gameState.bugs.forEach((bug, index) => {
        // Left Panel
        const row = document.createElement('div');
        row.className = 'status-row';
        row.id = `status-${bug.id}`;

        // HTML構造を変更：体力バーの下にログ用ボックスを追加
        row.innerHTML = `
            <div class="status-main-info">
                <div class="status-name-wrap">
                    <div class="status-name">${bug.name}</div>
                    <div class="status-extra" id="status-extra-${bug.id}"></div>
                </div>
                <div class="status-dist">${Math.floor(bug.currentPos)}cm</div>
            </div>
            <div class="status-hp-bar-container">
                <span>HP ${bug.currentHp}/${bug.maxHp}</span>
                <div class="status-hp-bar"><div class="status-hp-fill" id="status-hp-${bug.id}" style="width: 100%"></div></div>
            </div>
            <!-- ここにログボックスを追加 -->
            <div class="status-log" id="status-log-${bug.id}"></div>
        `;
        El.raceStatusList.appendChild(row);

        // Right Panel
        const laneDiv = document.createElement('div');
        laneDiv.className = 'lane';

        const racerDiv = document.createElement('div');
        racerDiv.className = 'bug-racer';
        racerDiv.id = `racer-${bug.id}`;
        racerDiv.style.left = '0%';
        racerDiv.innerHTML = `${bug.icon}`;

        laneDiv.appendChild(racerDiv);
        El.raceTrack.appendChild(laneDiv);
    });

    updateRaceRanking();
}

export function updateRacerVisuals(bug) {
    const racer = document.getElementById(`racer-${bug.id}`);
    if (racer) {
        const visualPercent = (bug.currentPos / RACE_DISTANCE) * 100;
        racer.style.left = `${visualPercent}%`;
        if (!bug.isDead) {
            racer.classList.add('moving');
            setTimeout(() => racer.classList.remove('moving'), 500);
            racer.classList.remove('dead');
        } else {
            racer.classList.add('dead');
        }
    }

    const statusRow = document.getElementById(`status-${bug.id}`);
    if (statusRow) {
        statusRow.querySelector('.status-dist').textContent = `${Math.floor(bug.currentPos)}cm`;
        statusRow.querySelector('.status-hp-bar-container span').textContent = `HP ${bug.currentHp}/${bug.maxHp}`;
        const hpPercent = (bug.currentHp / bug.maxHp) * 100;
        statusRow.querySelector('.status-hp-fill').style.width = `${hpPercent}%`;

        let extra = '';
        if (bug.counters.northStar > 0) extra += `★${bug.counters.northStar} `;
        if (bug.counters.minions > 0) extra += `🐜${bug.counters.minions} `;
        if (bug.counters.poopSize > 0) extra += `💩${bug.counters.poopSize}cm `;
        statusRow.querySelector('.status-extra').textContent = extra;
    }

    updateRaceRanking();
}

export function updateRaceRanking() {
    const rankDisplay = document.getElementById('race-rank');
    if (!rankDisplay) return;

    const sortedBugs = [...gameState.bugs]
        .filter(b => !b.isDead)
        .sort((a, b) => b.currentPos - a.currentPos);

    rankDisplay.innerHTML = '';
    sortedBugs.forEach((bug, index) => {
        const rank = index + 1;
        const badge = document.createElement('div');
        badge.className = `rank-badge rank-${rank}`;
        badge.textContent = `${rank}位: ${bug.name}`;
        rankDisplay.appendChild(badge);
    });
}

export function updateWeatherDisplay() {
    const wInfo = WEATHER_INFO[gameState.weather] || { icon: '❓', desc: '不明' };
    El.weatherBox.innerHTML = `
        <div class="weather-icon">${wInfo.icon}</div>
        <div class="weather-info-text">
            <strong>${gameState.weather}</strong>
            <span>${wInfo.desc}</span>
        </div>
    `;
}

export function clearAttackVisuals() {
    const oldSvgs = document.querySelectorAll('.attack-arrow-svg');
    oldSvgs.forEach(el => el.remove());
}

export function showAttackVisual(attackerId, targetId, color = null) {
    const attackerEl = document.getElementById(`racer-${attackerId}`);
    const targetEl = document.getElementById(`racer-${targetId}`);
    if (!attackerEl || !targetEl) return;

    const trackRect = El.raceTrack.getBoundingClientRect();
    const attRect = attackerEl.getBoundingClientRect();
    const tarRect = targetEl.getBoundingClientRect();

    const x1 = attRect.left + attRect.width / 2 - trackRect.left + El.raceTrack.scrollLeft;
    const y1 = attRect.top + attRect.height / 2 - trackRect.top + El.raceTrack.scrollTop;
    const x2 = tarRect.left + tarRect.width / 2 - trackRect.left + El.raceTrack.scrollLeft;
    const y2 = tarRect.top + tarRect.height / 2 - trackRect.top + El.raceTrack.scrollTop;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add('attack-arrow-svg');

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", `arrowhead-${attackerId}-${targetId}`);
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "9");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
    polygon.classList.add('attack-arrow-head');
    if (color) polygon.style.fill = color;

    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.classList.add('attack-arrow-line');
    line.setAttribute("marker-end", `url(#arrowhead-${attackerId}-${targetId})`);
    if (color) line.style.stroke = color;

    svg.appendChild(line);
    El.raceTrack.appendChild(svg);
}

export function updateHomeStats() {
    const stats = gameState.stats;
    document.getElementById('home-total-races').textContent = stats.totalRaces || 0;
    const winRate = stats.totalRaces > 0 ? Math.round((stats.wins / stats.totalRaces) * 100) : 0;
    document.getElementById('home-win-rate').textContent = winRate + '%';
    document.getElementById('home-max-win').textContent = (stats.maxWin || 0).toLocaleString() + '円';
}

export function updateStatsDisplay() {
    const stats = gameState.stats;
    document.getElementById('stat-total-races').textContent = stats.totalRaces || 0;
    document.getElementById('stat-wins').textContent = stats.wins || 0;
    const winRate = stats.totalRaces > 0 ? Math.round((stats.wins / stats.totalRaces) * 100) : 0;
    document.getElementById('stat-win-rate').textContent = winRate + '%';
    document.getElementById('stat-total-earned').textContent = (stats.totalEarned || 0).toLocaleString() + '円';
    document.getElementById('stat-max-win').textContent = (stats.maxWin || 0).toLocaleString() + '円';
    document.getElementById('stat-total-bet').textContent = (stats.totalBet || 0).toLocaleString() + '円';

    const winnersList = document.getElementById('stat-winners-list');
    winnersList.innerHTML = '';
    const sortedWinners = Object.entries(stats.winners || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    if (sortedWinners.length === 0) {
        winnersList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">まだデータがありません</p>';
    } else {
        sortedWinners.forEach(([name, count]) => {
            const item = document.createElement('div');
            item.className = 'winner-item';
            item.innerHTML = `
                <span class="winner-name">${name}</span>
                <span class="winner-count">${count}回</span>
            `;
            winnersList.appendChild(item);
        });
    }
}