import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    rocket!: Phaser.Physics.Arcade.Sprite;
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
    }

    create() {
        this.events.on('launch', this.triggerLaunch, this);
        this.sky = this.add.tileSprite(400, 300, 800, 600, 'sky');

        this.anims.create({ key: 'trail', frames: this.anims.generateFrameNames('rocket', { prefix: 'trail_', start: 0, end: 12, zeroPad: 2 }), repeat: -1 });

        const container = this.add.container(400, 300);

        //  A container must have a size in order to receive input
        container.setSize(120, 80);
        container.setInteractive({ draggable: true });

        const trail = this.add.sprite(-125, 0, 'trail').play('trail');
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
        const rocket = this.add.image(0, 0, 'airship', 'airship');
        rocket.setOrigin(0.5, 1);
        container.add([smokey, rocket]);

        container.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => container.setPosition(dragX, dragY));
        container.setRotation(Phaser.Math.DegToRad(-180));
        this.startTime = this.time.now;

    }

    triggerCrash() {
        if (this.crashed) return;
        this.crashed = true;

        // Stop rocket and explode
        this.rocket.setVelocity(0);
        const explosion = this.add.sprite(this.rocket.x, this.rocket.y, 'explosion');
        explosion.play('explode');
        this.rocket.setVisible(false);

        // You can notify React via a custom event here
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

        const elapsed = (this.time.now - this.startTime) / 1000;
        let speed = 2 + elapsed * 0.3;
        speed = Math.min(speed, 12);

        this.sky.tilePositionY -= speed;
        this.station.y += speed;
    }
}
