import { useState, type FC } from 'react';

import { kalahGameSpec } from '@/games/kalah';
import type { KalahGameState, PitIdx } from '@/games/types';

import { useBot } from './useBot';

import './styles.css';

export function KalahGameBoard() {
  const [gameState, setGameState] = useState<KalahGameState>(
    kalahGameSpec.setup()
  );

  const clearBotState = useBot(gameState, setGameState);

  const winner = kalahGameSpec.winner(gameState);
  const store0 = gameState.snapshot.stores[0];
  const store1 = gameState.snapshot.stores[1];

  const player0Pits = Object.entries(gameState.snapshot.pits[0]).map(
    ([idx, stones]) => ({
      idx: Number(idx) as PitIdx,
      stones,
    })
  );

  const player1Pits = Object.entries(gameState.snapshot.pits[1])
    .map(([idx, stones]) => ({
      idx: Number(idx) as PitIdx,
      stones,
    }))
    .reverse();

  const handleMove = (player: number, pitIdx: PitIdx) => {
    if (gameState.ended || gameState.currentPlayer !== player) return;

    const actions = kalahGameSpec.legalActions(gameState);
    const action = actions.find((a) => a.payload?.pit === pitIdx);

    if (action) {
      setGameState(kalahGameSpec.reducer(gameState, action));
    }
  };

  const resetGame = () => {
    clearBotState();
    setGameState(kalahGameSpec.setup());
  };

  return (
    <div className="kalah-container">
      <div className="controls">
        <NewGameButton onClick={resetGame} />
      </div>

      <PlayerStatusMessage
        id={1}
        currentPlayer={gameState.currentPlayer}
        isGameOver={gameState.ended}
        isBot
      />

      <div className="board">
        <Store value={store1} className="store-1" />

        <div className="pits-container">
          <div className="player-1-pits">
            {player1Pits.map((pit) => (
              <Pit key={pit.idx} isDisabled stones={pit.stones} />
            ))}
          </div>

          <div className="player-0-pits">
            {player0Pits.map((pit) => (
              <Pit
                key={pit.idx}
                isDisabled={gameState.currentPlayer !== 0 || pit.stones === 0}
                stones={pit.stones}
                onClick={() => handleMove(0, pit.idx)}
              />
            ))}
          </div>
        </div>

        <Store value={store0} className="store-0" />
      </div>

      <PlayerStatusMessage
        id={0}
        currentPlayer={gameState.currentPlayer}
        isGameOver={gameState.ended}
      />

      {gameState.ended && winner !== null && (
        <GameOverMessage winner={winner} />
      )}
    </div>
  );
}

const playerIdToDisplayNumber = (id: number) => id + 1;

type GameOverMessageProps = {
  winner: number;
};

const GameOverMessage: FC<GameOverMessageProps> = ({ winner }) => {
  return (
    <div className="game-over">
      Game Over! Winner: Player {playerIdToDisplayNumber(winner)}
    </div>
  );
};

type PlayerStatusMessageProps = {
  id: number;
  currentPlayer: number;
  isGameOver: boolean;
  isBot?: boolean;
};

const PlayerStatusMessage: FC<PlayerStatusMessageProps> = ({
  id,
  currentPlayer,
  isGameOver,
  isBot,
}) => {
  const yourTurnLabel = isBot ? ' (Bot thinking...)' : '(Your turn)';
  return (
    <div className="player-info">
      <h2>
        Player {playerIdToDisplayNumber(id)}
        {isBot ? ' (Bot)' : ''}{' '}
        {currentPlayer === id && !isGameOver ? yourTurnLabel : ''}
      </h2>
    </div>
  );
};

type StoreProps = {
  value: number;
  className?: string;
};

const Store: FC<StoreProps> = ({ value, className }) => {
  return (
    <div className={`store ${className}`}>
      <div className="store-value">{value}</div>
    </div>
  );
};

type NewGameButtonProps = {
  onClick: () => void;
};

const NewGameButton: FC<NewGameButtonProps> = ({ onClick }) => {
  return (
    <button className="new-game-btn" onClick={onClick}>
      New Game
    </button>
  );
};

type PitProps = {
  stones: number;
  isDisabled?: boolean;
  onClick?: () => void;
};

const Pit: FC<PitProps> = ({ isDisabled, onClick, stones }) => {
  return (
    <button className="pit" disabled={isDisabled} onClick={onClick}>
      <div className="marble-count">{stones}</div>
      {Array.from({ length: Math.min(stones, 6) }).map((_, i) => (
        <div key={i} className="marble"></div>
      ))}
    </button>
  );
};
