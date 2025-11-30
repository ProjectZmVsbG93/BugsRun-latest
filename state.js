// state.js
export const gameState = {
    wallet: 10000,
    currentRace: null,
    bugs: [],
    bet: { targetId: null, amount: 0, odds: 0, isLoan: false },
    weather: '晴れ',
    currentCourse: null,
    volcanoLavaPos: -10,
    stats: {
        totalRaces: 0,
        wins: 0,
        totalEarned: 0,
        totalBet: 0,
        maxWin: 0,
        winners: {} // bug name -> count
    }
};