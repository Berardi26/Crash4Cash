'use client'
import { useRef, useState, useCallback } from 'react';

export function useGameController() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [score, setScore] = useState(0);
  const [crashed, setCrashed] = useState(false);

  const setGameInstance = useCallback((game: Phaser.Game) => {
    console.log("ready")
    gameRef.current = game;
  }, []);

  const startGame = useCallback(() => {
    gameRef.current?.scene.start('MainScene');
    setCrashed(false);
  }, []);

  const triggerCrash = useCallback(() => {
    gameRef.current?.events.emit('crash');
    setCrashed(true);
  }, []);

  const triggerLaunch = useCallback(() => {
    console.log("launch triggered");
    gameRef.current?.scene.getScene('MainScene').events.emit('launch');
  }, []);

  return {
    setGameInstance,
    startGame,
    triggerCrash,
    triggerLaunch,
    score,
    crashed,
  };
}
