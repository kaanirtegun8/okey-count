import { useState } from 'react'
import { usePlayers } from './hooks/usePlayers'
import { useGames } from './hooks/useGames'
import { HomeView } from './views/HomeView'
import { PlayerManagementView } from './views/PlayerManagementView'
import { GameSetupView } from './views/GameSetupView'
import { ActiveGameView } from './views/ActiveGameView'
import { GameSummaryView } from './views/GameSummaryView'
import { StatsView } from './views/StatsView'

function App() {
  const [view, setView] = useState('home')
  const [viewData, setViewData] = useState(null)

  const { players, addPlayer, removePlayer, getPlayer } = usePlayers()
  const { games, activeGame, activeGameId, startGame, addHand, undoLastHand, endGame, deleteGame } = useGames()

  const navigate = (nextView, data = null) => {
    setView(nextView)
    setViewData(data)
  }

  switch (view) {
    case 'home':
      return <HomeView navigate={navigate} activeGame={activeGame} />
    case 'players':
      return (
        <PlayerManagementView
          navigate={navigate}
          players={players}
          addPlayer={addPlayer}
          removePlayer={removePlayer}
          games={games}
          activeGameId={activeGameId}
        />
      )
    case 'setup':
      return <GameSetupView navigate={navigate} players={players} startGame={startGame} />
    case 'game':
      return (
        <ActiveGameView
          navigate={navigate}
          activeGame={activeGame}
          getPlayer={getPlayer}
          addHand={addHand}
          undoLastHand={undoLastHand}
          endGame={endGame}
        />
      )
    case 'summary':
      return (
        <GameSummaryView
          navigate={navigate}
          games={games}
          getPlayer={getPlayer}
          viewData={viewData}
        />
      )
    case 'stats':
      return <StatsView navigate={navigate} games={games} players={players} />
    default:
      return <HomeView navigate={navigate} activeGame={activeGame} />
  }
}

export default App
