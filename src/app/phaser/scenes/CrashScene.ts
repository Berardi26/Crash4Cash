import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    rocket!: Phaser.GameObjects.Image;
    sky!: Phaser.GameObjects.TileSprite;
    station!: Phaser.GameObjects.Image;
    smokey!: Phaser.GameObjects.Particles.ParticleEmitter;
    crashed = false;

    private startTime!: number;
    private scrollSpeed: number = 2;
    private launched = false;

    constructor() {
        super('MainScene');
    }





    preload() {
        this.load.setPath("assets/game");
        this.load.image('station', 'image/station.png');
        this.load.image('airship', 'image/rocket.png');
        this.load.image('sky', 'image/sky.png');
        // this.load.spritesheet('explosion', 'explosion.png', {
        //   frameWidth: 64,
        //   frameHeight: 64,
        // });
        this.load.atlas('rocket', 'animations/rocket.png', 'animations/rocket.json');
        this.load.atlas('flares', 'particles/flares.png', 'particles/flares.json');
        this.load.spritesheet('boom', 'sprites/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
    }

    create() {
        this.crashed = false;
        this.launched = false;
        this.startTime = this.time.now;
        this.events.on('launch', this.triggerLaunch, this);
        this.events.on('crash', this.triggerCrash, this);
        this.sky = this.add.tileSprite(400, 300, 800, 600, 'sky');

        this.anims.create({ key: 'trail', frames: this.anims.generateFrameNames('rocket', { prefix: 'trail_', start: 0, end: 12, zeroPad: 2 }), repeat: -1 });
        this.anims.create({
            key: 'explode',
            frames: 'boom',
            frameRate: 20,
            showOnStart: true,
            hideOnComplete: true
        });

        const container = this.add.container(400, 300);

        //  A container must have a size in order to receive input
        container.setSize(120, 80);
        container.setInteractive({ draggable: true });

        const trail = this.add.sprite(-125, 0, 'trail').play('trail');
        const smokeyManager = this.add.particles(0, -180, 'flares');
        const smokey = this.add.particles(0, -180, 'flares',
            {
                frame: 'white',
                color: [0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404],
                lifespan: 1500,
                angle: { min: -100, max: -80 },
                scale: 0.75,
                speed: { min: 200, max: 300 },
                advance: 2000,
                blendMode: 'ADD'
            });
        smokey.setVisible(false);
        this.smokey = smokey;
        this.station = this.add.image(this.cameras.main.width / 2, this.cameras.main.height, 'station', 'station');
        this.station.setOrigin(0.5, 1);
        this.station.setScale(0.7);
        this.rocket = this.add.image(0, 0, 'airship', 'airship');
        this.rocket.setOrigin(0.5, 1);
        container.add([smokey, this.rocket]);

        container.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => container.setPosition(dragX, dragY));
        container.setRotation(Phaser.Math.DegToRad(-180));
    }

    triggerCrash() {
        if (this.crashed) return;
        this.crashed = true;

        // Hide the rocket
        this.rocket.setVisible(false);
        const { x, y } = this.rocket.parentContainer;
        console.log("crash triggered", x, y);

        // Add explosion at rocket's position
        const explosion = this.add.sprite(x, y, 'boom');
        explosion.setBlendMode('ADD');
        explosion.setScale(6);
        explosion.setOrigin(0.5);
        explosion.play('explode');
        this.smokey.stop(); // stop emission
        // Optional: remove explosion after animation
        explosion.on('animationcomplete', () => {
            explosion.destroy();
            // Optional: slight delay before restart
            this.time.delayedCall(1000, () => {
                this.scene.restart();
            });
        });

        // Notify React if needed
        this.events.emit('gameOver');

    }

    triggerLaunch() {
        console.log("launch")
        if (this.launched) return;

        this.launched = true;
        this.startTime = this.time.now;

        this.smokey.setVisible(true); // show trail
        this.smokey.start(); // start emission
    }



    update() {
        if (!this.launched) return;
        if (this.crashed) return;
        const elapsed = (this.time.now - this.startTime) / 1000;
        let speed = 2 + elapsed * 0.3;
        speed = Math.min(speed, 12);

        this.sky.tilePositionY -= speed;
        this.station.y += speed;
    }
}
