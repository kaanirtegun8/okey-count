import { useLocalStorage } from './useLocalStorage'

export function usePlayers() {
  const [players, setPlayers] = useLocalStorage('okey101_players', [])

  const addPlayer = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return false
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) return false
    setPlayers([...players, {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
    }])
    return true
  }

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id))
  }

  const getPlayer = (id) => players.find(p => p.id === id)

  return { players, addPlayer, removePlayer, getPlayer }
}
