import type { GameState } from '@/engine/types';
import type { KalahSnapshot } from '@/games/types';
import { botTurn } from '@/bots/play';
import { logger } from '@/utils/logger';

self.onmessage = (e: MessageEvent<GameState<KalahSnapshot>>) => {
  try {
    logger.debug('Worker received message:', e.data);
    const gameState = e.data;
    const botAction = botTurn(gameState);
    logger.debug('Worker sending message:', botAction);
    self.postMessage({ action: botAction });
  } catch (error) {
    self.postMessage({ error: String(error) });
  }
};
