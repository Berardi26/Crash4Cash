import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    rocket!: Phaser.GameObjects.Image;
    sky!: Phaser.GameObjects.TileSprite;
    station!: Phaser.GameObjects.Image;
    smokey!: Phaser.GameObjects.Particles.ParticleEmitter;
    crashed = false;
    rocketContainer!: Phaser.GameObjects.Container;
    private startTime!: number;
    private scrollSpeed: number = 2;

    private baseX!: number;
    private vibrationOffset!: number;

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

        this.rocketContainer = this.add.container(400, 300);

        //  A container must have a size in order to receive input
        this.rocketContainer.setSize(120, 80);
        this.rocketContainer.setInteractive({ draggable: true });

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
        this.rocketContainer.add([smokey, this.rocket]);
        this.rocketContainer.setRotation(Phaser.Math.DegToRad(-180));


        this.baseX = this.rocketContainer.x;
        this.vibrationOffset = 2;
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
        // this.tweens.add({
        //     targets: this.rocketContainer,
        //     x: this.rocketContainer.x + 2,
        //     y: this.rocketContainer.y + 2,
        //     duration: 50,
        //     yoyo: true,
        //     repeat: 40,
        //     ease: 'Sine.easeInOut',
        // });
    }



    update() {
        if (!this.launched) return;
        if (this.crashed) return;
        const elapsed = (this.time.now - this.startTime) / 1000;
        let speed = 0.5 + elapsed * 0.3;
        speed = Math.min(speed, 12);

        this.sky.tilePositionY -= speed;
        this.station.y += speed;
        
        this.vibrationOffset = Math.min(this.vibrationOffset, 2);

        if (this.launched && this.vibrationOffset > 0) {
            const offsetX = Phaser.Math.Between(-this.vibrationOffset, this.vibrationOffset);
            const offsetY = Phaser.Math.Between(-this.vibrationOffset, this.vibrationOffset);
            this.rocketContainer.x = this.baseX + offsetX;

            this.vibrationOffset -= 0.003;
            this.vibrationOffset = Math.max(this.vibrationOffset, 0);
        }

        if (this.launched && !this.crashed) {
            // Compute progress of red effect (0 to 1)
            const elapsed = (this.time.now - this.startTime) / 1000;
            const redProgress = Math.min(elapsed / 50, 1); // fully red after 5 seconds

            // Interpolate from white (0xFFFFFF) to red (0xFF0000)
            if(redProgress === 1){
                this.vibrationOffset += 0.01; // reset vibration offset when fully red
            }
            const r = 255;
            const g = Math.floor(255 * (1 - redProgress));
            const b = Math.floor(255 * (1 - redProgress));
            const tintColor = (r << 16) + (g << 8) + b;

            this.rocket.setTint(tintColor);
        }
    }
}
