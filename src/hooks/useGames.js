import { useLocalStorage } from './useLocalStorage'

export function useGames() {
  const [games, setGames] = useLocalStorage('okey101_games', [])
  const [activeGameId, setActiveGameId] = useLocalStorage('okey101_activeGameId', null)

  const activeGame = activeGameId ? games.find(g => g.id === activeGameId) : null

  const startGame = (playerIds) => {
    const game = {
      id: crypto.randomUUID(),
      playerIds,
      hands: [],
      startedAt: new Date().toISOString(),
      endedAt: null,
    }
    setGames([...games, game])
    setActiveGameId(game.id)
    return game
  }

  const addHand = (okeys) => {
    if (!activeGameId) return
    setGames(games.map(g => {
      if (g.id !== activeGameId) return g
      return {
        ...g,
        hands: [...g.hands, {
          handNumber: g.hands.length + 1,
          okeys,
          timestamp: new Date().toISOString(),
        }],
      }
    }))
  }

  const undoLastHand = () => {
    if (!activeGameId) return
    setGames(games.map(g => {
      if (g.id !== activeGameId) return g
      return { ...g, hands: g.hands.slice(0, -1) }
    }))
  }

  const endGame = () => {
    if (!activeGameId) return
    const endedGame = games.find(g => g.id === activeGameId)
    setGames(games.map(g => {
      if (g.id !== activeGameId) return g
      return { ...g, endedAt: new Date().toISOString() }
    }))
    setActiveGameId(null)
    return endedGame
  }

  const deleteGame = (gameId) => {
    setGames(games.filter(g => g.id !== gameId))
    if (activeGameId === gameId) setActiveGameId(null)
  }

  return { games, activeGame, activeGameId, startGame, addHand, undoLastHand, endGame, deleteGame }
}
