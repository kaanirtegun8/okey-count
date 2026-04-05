import { useState } from 'react'
import { Header } from '../components/Header'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { calculateGameStats } from '../lib/statsCalculator'

const PLAYER_COLORS = [
  { bg: 'bg-sky-500', ring: 'ring-sky-400', shadow: 'shadow-sky-500/30' },
  { bg: 'bg-rose-500', ring: 'ring-rose-400', shadow: 'shadow-rose-500/30' },
  { bg: 'bg-amber-500', ring: 'ring-amber-400', shadow: 'shadow-amber-500/30' },
  { bg: 'bg-emerald-500', ring: 'ring-emerald-400', shadow: 'shadow-emerald-500/30' },
]

export function ActiveGameView({ navigate, activeGame, getPlayer, addHand, undoLastHand, endGame }) {
  const [selectedOkeys, setSelectedOkeys] = useState([])
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showUndoConfirm, setShowUndoConfirm] = useState(false)

  if (!activeGame) return null

  const handNumber = activeGame.hands.length + 1

  const togglePlayer = (playerId) => {
    const count = selectedOkeys.filter(id => id === playerId).length
    const totalSelected = selectedOkeys.length

    if (count === 0 && totalSelected < 2) {
      setSelectedOkeys([...selectedOkeys, playerId])
      vibrate()
    } else if (count === 1 && totalSelected < 2) {
      setSelectedOkeys([...selectedOkeys, playerId])
      vibrate()
    } else if (count > 0) {
      // Remove one instance
      const idx = selectedOkeys.indexOf(playerId)
      setSelectedOkeys(selectedOkeys.filter((_, i) => i !== idx))
      vibrate()
    }
  }

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(30)
  }

  const handleSaveHand = () => {
    addHand(selectedOkeys)
    setSelectedOkeys([])
    vibrate()
  }

  const handleEndGame = () => {
    const game = endGame()
    navigate('summary', { gameId: game?.id })
  }

  const handleUndo = () => {
    undoLastHand()
    setShowUndoConfirm(false)
  }

  const getPlayerOkeyCount = (playerId) => {
    return selectedOkeys.filter(id => id === playerId).length
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title={`El ${handNumber}`}
        onBack={() => navigate('home')}
        rightAction={
          <button
            onClick={() => setShowEndConfirm(true)}
            className="text-danger text-sm font-medium"
          >
            Bitir
          </button>
        }
      />

      {/* Okey selection counter */}
      <div className="text-center py-3 text-slate-400">
        <span className="text-okey font-bold text-lg">{selectedOkeys.length}</span>
        <span className="text-sm"> / 2 okey secildi</span>
      </div>

      {/* Player buttons */}
      <div className={`grid gap-3 px-4 ${activeGame.playerIds.length === 3 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {activeGame.playerIds.map((pid, idx) => {
          const player = getPlayer(pid)
          const count = getPlayerOkeyCount(pid)
          const color = PLAYER_COLORS[idx % PLAYER_COLORS.length]
          const isSelected = count > 0

          return (
            <button
              key={pid}
              onClick={() => togglePlayer(pid)}
              className={`relative py-6 px-4 rounded-2xl text-white font-semibold text-xl transition-all active:scale-95 ${
                isSelected
                  ? `${color.bg} ring-4 ${color.ring} shadow-xl ${color.shadow}`
                  : 'bg-surface-light'
              }`}
            >
              {player?.name || '?'}
              {count > 0 && (
                <span className="absolute top-2 right-3 bg-white/20 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Save hand button */}
      <div className="px-4 mt-4">
        <button
          onClick={handleSaveHand}
          className="w-full py-4 rounded-2xl bg-primary text-white text-lg font-semibold active:scale-95 transition-transform shadow-lg"
        >
          {selectedOkeys.length === 0 ? 'Ortada Kaldi' : 'Eli Kaydet'}
        </button>
      </div>

      {/* Player stats */}
      {activeGame.hands.length > 0 && (() => {
        const gameStats = calculateGameStats(activeGame)
        return (
          <div className="px-4 mt-4">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Oyuncu Istatistikleri</h3>
            <div className="flex flex-col gap-2">
              {activeGame.playerIds.map((pid, idx) => {
                const player = getPlayer(pid)
                const s = gameStats[pid]
                if (!s) return null
                const color = PLAYER_COLORS[idx % PLAYER_COLORS.length]
                return (
                  <div key={pid} className="bg-surface rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white font-semibold text-sm">{player?.name || '?'}</span>
                      <span className="text-okey font-bold text-sm">{s.totalOkeys} okey</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="bg-surface-light rounded-lg py-1.5">
                        <p className="text-white font-bold text-xs">{s.handsWithDoubleOkey}</p>
                        <p className="text-slate-500 text-[10px]">Cift Okey</p>
                      </div>
                      <div className="bg-surface-light rounded-lg py-1.5">
                        <p className="text-emerald-400 font-bold text-xs">{s.currentOkeyStreak}</p>
                        <p className="text-slate-500 text-[10px]">Seri Okey</p>
                      </div>
                      <div className="bg-surface-light rounded-lg py-1.5">
                        <p className="text-rose-400 font-bold text-xs">{s.currentDryStreak}</p>
                        <p className="text-slate-500 text-[10px]">Seri Kuru</p>
                      </div>
                      <div className="bg-surface-light rounded-lg py-1.5">
                        <p className="text-amber-400 font-bold text-xs">{s.maxOkeyStreak}</p>
                        <p className="text-slate-500 text-[10px]">Max Seri</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* Hand history */}
      <div className="flex-1 mt-4 px-4 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-slate-400 text-sm font-medium">El Gecmisi</h3>
          {activeGame.hands.length > 0 && (
            <button
              onClick={() => setShowUndoConfirm(true)}
              className="text-slate-500 text-xs px-2 py-1 rounded-lg active:bg-surface-light transition-colors"
            >
              Geri Al
            </button>
          )}
        </div>

        {activeGame.hands.length === 0 ? (
          <p className="text-slate-600 text-sm text-center mt-4">Henuz el oynanmadi</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {[...activeGame.hands].reverse().map(hand => (
              <div key={hand.handNumber} className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg text-sm">
                <span className="text-slate-500 w-8">#{hand.handNumber}</span>
                <span className="text-slate-300">
                  {hand.okeys.length === 0
                    ? 'Ortada kaldi'
                    : hand.okeys.map(pid => getPlayer(pid)?.name || '?').join(', ')}
                </span>
                {hand.okeys.length > 0 && (
                  <span className="ml-auto text-okey text-xs font-semibold">
                    {hand.okeys.length} okey
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showEndConfirm && (
        <ConfirmDialog
          title="Oyunu Bitir"
          message={`${activeGame.hands.length} el oynandi. Oyunu bitirmek istediginize emin misiniz?`}
          confirmText="Bitir"
          onConfirm={handleEndGame}
          onCancel={() => setShowEndConfirm(false)}
        />
      )}

      {showUndoConfirm && (
        <ConfirmDialog
          title="Son Eli Geri Al"
          message="Son kaydedilen el silinecek. Emin misiniz?"
          confirmText="Geri Al"
          onConfirm={handleUndo}
          onCancel={() => setShowUndoConfirm(false)}
        />
      )}
    </div>
  )
}
