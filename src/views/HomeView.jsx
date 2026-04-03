export function HomeView({ navigate, activeGame }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white mb-1">101 Okey</h1>
        <p className="text-slate-400">Okey takip uygulamasi</p>
      </div>

      {activeGame && (
        <button
          onClick={() => navigate('game')}
          className="w-full py-4 rounded-2xl bg-success text-white text-lg font-semibold active:scale-95 transition-transform shadow-lg"
        >
          Oyuna Devam Et
          <span className="block text-sm font-normal opacity-80">
            El {activeGame.hands.length + 1}
          </span>
        </button>
      )}

      <button
        onClick={() => navigate('setup')}
        className="w-full py-4 rounded-2xl bg-primary text-white text-lg font-semibold active:scale-95 transition-transform shadow-lg"
      >
        Yeni Oyun
      </button>

      <button
        onClick={() => navigate('players')}
        className="w-full py-4 rounded-2xl bg-surface-light text-white text-lg font-semibold active:scale-95 transition-transform"
      >
        Oyuncular
      </button>

      <button
        onClick={() => navigate('history')}
        className="w-full py-4 rounded-2xl bg-surface-light text-white text-lg font-semibold active:scale-95 transition-transform"
      >
        Oyunlar
      </button>

      <button
        onClick={() => navigate('stats')}
        className="w-full py-4 rounded-2xl bg-surface-light text-white text-lg font-semibold active:scale-95 transition-transform"
      >
        Istatistikler
      </button>
    </div>
  )
}
