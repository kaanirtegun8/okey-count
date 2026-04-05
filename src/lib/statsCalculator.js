export function calculateStats(games, players) {
  const stats = {}

  for (const player of players) {
    stats[player.id] = {
      name: player.name,
      totalGames: 0,
      totalHands: 0,
      totalOkeys: 0,
      handsWithOkey: 0,
      handsWithDoubleOkey: 0,
    }
  }

  for (const game of games) {
    if (!game.endedAt) continue

    for (const pid of game.playerIds) {
      if (!stats[pid]) continue
      stats[pid].totalGames++
      stats[pid].totalHands += game.hands.length
    }

    for (const hand of game.hands) {
      const counts = {}
      for (const pid of hand.okeys) {
        counts[pid] = (counts[pid] || 0) + 1
      }
      for (const [pid, count] of Object.entries(counts)) {
        if (!stats[pid]) continue
        stats[pid].totalOkeys += count
        stats[pid].handsWithOkey++
        if (count >= 2) stats[pid].handsWithDoubleOkey++
      }
    }
  }

  return stats
}

export function calculateGameStats(game) {
  const stats = {}
  for (const pid of game.playerIds) {
    stats[pid] = {
      totalOkeys: 0,
      handsWithOkey: 0,
      handsWithDoubleOkey: 0,
      currentOkeyStreak: 0,
      maxOkeyStreak: 0,
      currentDryStreak: 0,
      maxDryStreak: 0,
    }
  }

  for (const hand of game.hands) {
    const counts = {}
    for (const pid of hand.okeys) {
      counts[pid] = (counts[pid] || 0) + 1
    }

    for (const pid of game.playerIds) {
      if (!stats[pid]) continue
      const count = counts[pid] || 0

      if (count > 0) {
        stats[pid].totalOkeys += count
        stats[pid].handsWithOkey++
        if (count >= 2) stats[pid].handsWithDoubleOkey++
        stats[pid].currentOkeyStreak++
        stats[pid].currentDryStreak = 0
        if (stats[pid].currentOkeyStreak > stats[pid].maxOkeyStreak) {
          stats[pid].maxOkeyStreak = stats[pid].currentOkeyStreak
        }
      } else {
        stats[pid].currentDryStreak++
        stats[pid].currentOkeyStreak = 0
        if (stats[pid].currentDryStreak > stats[pid].maxDryStreak) {
          stats[pid].maxDryStreak = stats[pid].currentDryStreak
        }
      }
    }
  }

  return stats
}
