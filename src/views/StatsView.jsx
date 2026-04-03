import { Header } from '../components/Header'
import { calculateStats } from '../lib/statsCalculator'

export function StatsView({ navigate, games, players }) {
  const stats = calculateStats(games, players)

  const sorted = players
    .map(p => ({ ...stats[p.id], id: p.id, name: p.name }))
    .filter(s => s.totalGames > 0)
    .sort((a, b) => b.totalOkeys - a.totalOkeys)

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Istatistikler" onBack={() => navigate('home')} />

      <div className="p-4">
        {sorted.length === 0 ? (
          <p className="text-slate-500 text-center mt-8">Henuz oyun oynanmadi</p>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map((s, i) => {
              const okeyPerHand = s.totalHands > 0
                ? (s.totalOkeys / s.totalHands).toFixed(2)
                : '0.00'
              const pct = s.totalHands > 0
                ? Math.round((s.handsWithOkey / s.totalHands) * 100)
                : 0

              return (
                <div key={s.id} className="bg-surface rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-lg">
                        {i + 1}. {s.name}
                      </span>
                    </div>
                    <span className="text-okey font-bold text-2xl">{s.totalOkeys}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-surface-light rounded-lg py-2">
                      <p className="text-white font-bold">{s.totalGames}</p>
                      <p className="text-slate-500 text-xs">Oyun</p>
                    </div>
                    <div className="bg-surface-light rounded-lg py-2">
                      <p className="text-white font-bold">{okeyPerHand}</p>
                      <p className="text-slate-500 text-xs">Okey/El</p>
                    </div>
                    <div className="bg-surface-light rounded-lg py-2">
                      <p className="text-white font-bold">%{pct}</p>
                      <p className="text-slate-500 text-xs">Okey Orani</p>
                    </div>
                  </div>

                  {s.handsWithDoubleOkey > 0 && (
                    <p className="text-xs text-okey mt-2 text-center">
                      {s.handsWithDoubleOkey}x cift okey
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
