import { useState, useEffect, useRef } from 'react';

import { kalahGameSpec } from '@/games/kalah';
import { botTurn } from '@/bots/play';
import type { GameState } from '@/engine/types';
import type { KalahSnapshot, PitIdx } from '@/games/types';

import './styles.css';

export function KalahGameBoard() {
  const [gameState, setGameState] = useState<GameState<KalahSnapshot>>(
    kalahGameSpec.setup()
  );
  const [isBotThinking, setIsBotThinking] = useState(false);
  const botThinkingTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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
    if (botThinkingTimeoutId.current) {
      clearTimeout(botThinkingTimeoutId.current);
    }

    setIsBotThinking(false);
    setGameState(kalahGameSpec.setup());
  };

  useEffect(() => {
    if (gameState.ended || gameState.currentPlayer !== 1 || isBotThinking) {
      return;
    }

    setIsBotThinking(true);
    const nextState = kalahGameSpec.reducer(gameState, botTurn(gameState));

    if (botThinkingTimeoutId.current) {
      clearTimeout(botThinkingTimeoutId.current);
    }

    botThinkingTimeoutId.current = setTimeout(() => {
      setGameState(nextState);
      setIsBotThinking(false);
    }, 1000);
  }, [gameState, isBotThinking]);

  return (
    <div className="kalah-container">
      <div className="controls">
        <button className="new-game-btn" onClick={resetGame}>
          New Game
        </button>
      </div>

      <div className="player-info">
        <h2>
          Player 2 (Bot)
          {gameState.currentPlayer === 1 && !gameState.ended
            ? ' (Bot thinking...)'
            : ''}
        </h2>
      </div>

      <div className="board">
        <div className="store store-1">
          <div className="store-value">{store1}</div>
        </div>

        <div className="pits-container">
          <div className="player-1-pits">
            {player1Pits.map((pit) => (
              <button
                key={pit.idx}
                className="pit"
                disabled
                onClick={() => handleMove(1, pit.idx)}
              >
                <div className="marble-count">{pit.stones}</div>
                {Array.from({ length: Math.min(pit.stones, 6) }).map((_, i) => (
                  <div key={i} className="marble"></div>
                ))}
              </button>
            ))}
          </div>

          <div className="player-0-pits">
            {player0Pits.map((pit) => (
              <button
                key={pit.idx}
                className="pit"
                disabled={gameState.currentPlayer !== 0 || pit.stones === 0}
                onClick={() => handleMove(0, pit.idx)}
              >
                <div className="marble-count">{pit.stones}</div>
                {Array.from({ length: Math.min(pit.stones, 6) }).map((_, i) => (
                  <div key={i} className="marble"></div>
                ))}
              </button>
            ))}
          </div>
        </div>

        <div className="store store-0">
          <div className="store-value">{store0}</div>
        </div>
      </div>

      <div className="player-info">
        <h2>Player 1 {gameState.currentPlayer === 0 ? '(Your turn)' : ''}</h2>
      </div>

      {gameState.ended && winner !== null && (
        <div className="game-over">Game Over! Winner: Player {winner + 1}</div>
      )}
    </div>
  );
}
