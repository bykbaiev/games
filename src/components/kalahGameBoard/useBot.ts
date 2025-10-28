import { useRef, useState, useEffect, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import type { KalahGameState } from '@/games/types';
import { logger } from '@/utils/logger';
import { kalahGameSpec } from '@/games/kalah';
import { botTurn } from '@/bots/play';

const createWorker = () => {
  if (typeof Worker !== 'undefined') {
    return new Worker(new URL('../../workers/botWorker.ts', import.meta.url), {
      type: 'module',
    });
  }
  return null;
};

export const useBot = (
  gameState: KalahGameState,
  setGameState: Dispatch<SetStateAction<KalahGameState>>
) => {
  const [isBotThinking, setIsBotThinking] = useState(false);
  const botThinkingTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const workerRef = useRef<Worker | null>(null);
  const gameStateRef = useRef<KalahGameState>(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    workerRef.current = createWorker();

    if (!workerRef.current) {
      return;
    }

    const handleWorkerMessage = (e: MessageEvent) => {
      if (e.data.error) {
        logger.error('Worker error:', e.data.error);
        setIsBotThinking(false);
        return;
      }

      logger.debug('Worker message:', e.data);

      const currentState = gameStateRef.current;
      const nextState = kalahGameSpec.reducer(currentState, e.data.action);

      if (botThinkingTimeoutId.current) {
        clearTimeout(botThinkingTimeoutId.current);
      }

      botThinkingTimeoutId.current = setTimeout(() => {
        setGameState(nextState);
        setIsBotThinking(false);
      }, 1000);
    };

    workerRef.current.addEventListener('message', handleWorkerMessage);

    return () => {
      if (botThinkingTimeoutId.current) {
        clearTimeout(botThinkingTimeoutId.current);
      }
      workerRef.current?.removeEventListener('message', handleWorkerMessage);
      workerRef.current?.terminate();
    };
  }, [setGameState]);

  const clearBotState = useCallback(() => {
    if (botThinkingTimeoutId.current) {
      clearTimeout(botThinkingTimeoutId.current);
    }

    setIsBotThinking(false);
  }, []);

  useEffect(() => {
    if (gameState.ended || gameState.currentPlayer !== 1 || isBotThinking) {
      return;
    }

    setIsBotThinking(true);

    if (workerRef.current) {
      workerRef.current.postMessage(gameState);
    } else {
      const botAction = botTurn(gameState);
      const nextState = kalahGameSpec.reducer(gameState, botAction);

      if (botThinkingTimeoutId.current) {
        clearTimeout(botThinkingTimeoutId.current);
      }

      botThinkingTimeoutId.current = setTimeout(() => {
        setGameState(nextState);
        setIsBotThinking(false);
      }, 1000);
    }
  }, [gameState, isBotThinking, setGameState]);

  return clearBotState;
};
