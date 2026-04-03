import { useState } from 'react'
import { Header } from '../components/Header'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function GamesHistoryView({ navigate, games, getPlayer, deleteGame, activeGameId }) {
  const [deleteTarget, setDeleteTarget] = useState(null)

  const finishedGames = games
    .filter(g => g.endedAt)
    .sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt))

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteGame(deleteTarget)
      setDeleteTarget(null)
    }
  }

  const targetGame = deleteTarget ? games.find(g => g.id === deleteTarget) : null

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Oyunlar" onBack={() => navigate('home')} />

      <div className="flex-1 px-4 py-4">
        {finishedGames.length === 0 ? (
          <p className="text-slate-500 text-center mt-8">Henuz tamamlanan oyun yok</p>
        ) : (
          <div className="flex flex-col gap-3">
            {finishedGames.map(game => {
              const playerNames = game.playerIds.map(pid => getPlayer(pid)?.name || '?').join(', ')
              const totalOkeys = game.hands.reduce((sum, h) => sum + h.okeys.length, 0)

              return (
                <div key={game.id} className="bg-surface rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{playerNames}</p>
                      <p className="text-slate-500 text-sm">{formatDate(game.endedAt)}</p>
                    </div>
                    <button
                      onClick={() => navigate('summary', { gameId: game.id })}
                      className="text-primary text-sm px-2 py-1 rounded-lg active:bg-primary/20 transition-colors shrink-0"
                    >
                      Detay
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-sm text-slate-400">
                      <span>{game.hands.length} el</span>
                      <span>{totalOkeys} okey</span>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(game.id)}
                      className="text-danger text-sm px-2 py-1 rounded-lg active:bg-danger/20 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {deleteTarget && targetGame && (
        <ConfirmDialog
          title="Oyunu Sil"
          message={`${targetGame.hands.length} ellik oyun silinecek ve istatistiklerden dusecek. Emin misiniz?`}
          confirmText="Sil"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
