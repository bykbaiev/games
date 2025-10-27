import { bestMove } from '@/engine/minimax';
import { kalahGameSpec } from '@/games/kalah';
import type { GameState } from '@/engine/types';
import type { KalahSnapshot } from '@/games/types';

const DEPTH = 8;

export function botTurn(gameState: GameState<KalahSnapshot>) {
  return bestMove(kalahGameSpec, gameState, gameState.currentPlayer, DEPTH);
}
