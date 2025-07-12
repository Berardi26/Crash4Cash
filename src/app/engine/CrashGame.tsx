'use client';
import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import MainScene from '../phaser/scenes/CrashScene';

export default function PhaserGame({ onReady }: { onReady?: (game: Phaser.Game) => void }) {
    const gameRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.WEBGL,
            parent: 'phaser-container',
            backgroundColor: '#FFFF0000',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
            scale: {
                mode: Phaser.Scale.ScaleModes.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: 'phaser-container',
            },
            scene: [MainScene],
        };

        gameRef.current = new Phaser.Game(config);
        if (onReady) {
            onReady(gameRef.current);
            window.game = gameRef.current
        }

        return () => {
            gameRef.current?.destroy(true);
        };
    }, []);

    window.sizeChanged = () => {
        if (window.game.isBooted) {
            const parent = document.getElementById('phaser-container');
            if (!parent) return;

            const width = parent.clientWidth;
            const height = parent.clientHeight;

            console.log(width, height)
            if (width > 0) {
                // window.game.scale.resize(width, height);
                // OPTIONAL: force canvas size for rare edge cases
                window.game.canvas.setAttribute(
                    'style',
                    `display: block; width: ${width}px; height: ${height}px;`
                );
            }
        }
    };
    window.onresize = () => window.sizeChanged();
    return <div id="phaser-container" className='w-[500px] aspect-square' />;
}
