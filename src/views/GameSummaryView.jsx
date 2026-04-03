import { Header } from '../components/Header'
import { calculateGameStats } from '../lib/statsCalculator'

export function GameSummaryView({ navigate, games, getPlayer, viewData }) {
  const gameId = viewData?.gameId
  const game = games.find(g => g.id === gameId)

  if (!game) {
    return (
      <div className="flex-1 flex flex-col">
        <Header title="Oyun Ozeti" onBack={() => navigate('home')} />
        <p className="text-slate-400 text-center mt-8">Oyun bulunamadi</p>
      </div>
    )
  }

  const stats = calculateGameStats(game)
  const sorted = game.playerIds
    .map(pid => ({ pid, ...stats[pid], name: getPlayer(pid)?.name || '?' }))
    .sort((a, b) => b.totalOkeys - a.totalOkeys)

  const middleCount = game.hands.filter(h => h.okeys.length === 0).length

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Oyun Ozeti" />

      <div className="p-4">
        <div className="text-center mb-6">
          <p className="text-slate-400 text-sm">Toplam</p>
          <p className="text-white text-3xl font-bold">{game.hands.length} el</p>
        </div>

        {/* Player stats */}
        <div className="flex flex-col gap-3 mb-6">
          {sorted.map((s, i) => {
            const pct = game.hands.length > 0
              ? Math.round((s.handsWithOkey / game.hands.length) * 100)
              : 0
            return (
              <div key={s.pid} className="bg-surface rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}</span>
                    <span className="text-white font-semibold text-lg">{s.name}</span>
                  </div>
                  <span className="text-okey font-bold text-xl">{s.totalOkeys}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-okey rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-500">
                  <span>{s.handsWithOkey} elde okey geldi</span>
                  <span>%{pct}</span>
                </div>
                {s.handsWithDoubleOkey > 0 && (
                  <p className="text-xs text-okey mt-1">
                    {s.handsWithDoubleOkey}x cift okey!
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {middleCount > 0 && (
          <p className="text-slate-500 text-sm text-center mb-6">
            {middleCount} elde okey ortada kaldi
          </p>
        )}

        <button
          onClick={() => navigate('home')}
          className="w-full py-4 rounded-2xl bg-primary text-white text-lg font-semibold active:scale-95 transition-transform"
        >
          Ana Sayfaya Don
        </button>
      </div>
    </div>
  )
}
