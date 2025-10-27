import { games } from '@/data/games';

import './GameList.css';

function GameList() {
  const handleGameClick = (gameId: string) => {
    console.log(`Selected game: ${gameId}`);
    // TODO: Navigate to game
  };

  return (
    <div className="game-list">
      {games.map((game) => (
        <div
          key={game.id}
          className="game-item"
          onClick={() => handleGameClick(game.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleGameClick(game.id);
            }
          }}
        >
          <div className="game-item-content">
            <h3>{game.name}</h3>
            <p>{game.description}</p>
          </div>
          <div className="game-item-arrow">→</div>
        </div>
      ))}
    </div>
  );
}

export default GameList;
