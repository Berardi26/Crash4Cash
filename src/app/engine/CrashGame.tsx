'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../phaser/scenes/CrashScene';

export default function PhaserGame({ onReady }: { onReady?: (game: Phaser.Game) => void }) {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'phaser-container',
            backgroundColor: '#000',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false,
                },
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: '100%',
                height: '100%',
            },
            scene: [MainScene],
        };

        gameRef.current = new Phaser.Game(config);

        if (onReady) {
            onReady(gameRef.current);
        }

        return () => {
            gameRef.current?.destroy(true);
        };
    }, []);

    return <div id="phaser-container" className="w-full h-full" />;
}
