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
    if (!game.endedAt && game.hands.length === 0) continue

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
    stats[pid] = { totalOkeys: 0, handsWithOkey: 0, handsWithDoubleOkey: 0 }
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

  return stats
}
