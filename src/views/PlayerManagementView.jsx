import { useState } from 'react'
import { Header } from '../components/Header'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function PlayerManagementView({ navigate, players, addPlayer, removePlayer, games, activeGameId }) {
  const [name, setName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (addPlayer(name)) {
      setName('')
    }
  }

  const isInActiveGame = (playerId) => {
    if (!activeGameId) return false
    const game = games.find(g => g.id === activeGameId)
    return game?.playerIds.includes(playerId)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      removePlayer(deleteTarget)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Oyuncular" onBack={() => navigate('home')} />

      <form onSubmit={handleAdd} className="flex gap-2 p-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Oyuncu adi..."
          className="flex-1 px-4 py-3 rounded-xl bg-surface-light text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-5 py-3 rounded-xl bg-primary text-white font-medium disabled:opacity-40 active:scale-95 transition-transform"
        >
          Ekle
        </button>
      </form>

      <div className="flex-1 px-4 pb-4">
        {players.length === 0 ? (
          <p className="text-slate-500 text-center mt-8">Henuz oyuncu eklenmedi</p>
        ) : (
          <div className="flex flex-col gap-2">
            {players.map(player => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-3 bg-surface rounded-xl"
              >
                <span className="text-white font-medium">{player.name}</span>
                {isInActiveGame(player.id) ? (
                  <span className="text-xs text-slate-500">Oyunda</span>
                ) : (
                  <button
                    onClick={() => setDeleteTarget(player.id)}
                    className="text-danger text-sm px-3 py-1 rounded-lg active:bg-danger/20 transition-colors"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Oyuncuyu Sil"
          message={`${players.find(p => p.id === deleteTarget)?.name} silinsin mi?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
