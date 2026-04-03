import { useState } from 'react'
import { Header } from '../components/Header'

export function GameSetupView({ navigate, players, startGame }) {
  const [selected, setSelected] = useState([])

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else if (selected.length < 4) {
      setSelected([...selected, id])
    }
  }

  const handleStart = () => {
    if (selected.length >= 3) {
      startGame(selected)
      navigate('game')
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Yeni Oyun" onBack={() => navigate('home')} />

      <div className="p-4">
        <p className="text-slate-400 text-sm mb-3">
          {selected.length}/4 oyuncu secildi (en az 3)
        </p>

        {players.length < 3 ? (
          <div className="text-center mt-8">
            <p className="text-slate-400 mb-4">En az 3 oyuncu gerekli</p>
            <button
              onClick={() => navigate('players')}
              className="px-6 py-3 rounded-xl bg-primary text-white font-medium active:scale-95 transition-transform"
            >
              Oyuncu Ekle
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {players.map(player => {
              const isSelected = selected.includes(player.id)
              return (
                <button
                  key={player.id}
                  onClick={() => toggle(player.id)}
                  className={`py-4 px-5 rounded-xl text-left font-medium text-lg transition-all active:scale-[0.97] ${
                    isSelected
                      ? 'bg-primary text-white ring-2 ring-primary shadow-lg shadow-primary/25'
                      : 'bg-surface text-slate-300'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {player.name}
                    {isSelected && <span className="text-2xl">&#10003;</span>}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected.length >= 3 && (
        <div className="p-4 mt-auto">
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-success text-white text-lg font-semibold active:scale-95 transition-transform shadow-lg"
          >
            Oyunu Baslat ({selected.length} kisi)
          </button>
        </div>
      )}
    </div>
  )
}
