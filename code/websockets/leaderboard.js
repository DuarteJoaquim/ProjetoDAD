const leaderboard = {};

const addWin = (playerId, nickname) => {
    if (!leaderboard[playerId]) {
      leaderboard[playerId] = { nickname, wins: 0 };
    }
    leaderboard[playerId].wins += 1;
    console.log("Leaderboard atualizado:", leaderboard);
  };
  

  const getLeaderboard = () => {
    return Object.values(leaderboard)
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 10)
      .map(({ nickname, wins }) => ({ nickname, wins }));
  };
  
  

module.exports = { addWin, getLeaderboard };
