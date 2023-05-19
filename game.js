//
//PREFABS
//
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        let image = scene.add.image(x, y, 'player');

        
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');

        let image = scene.add.image(x, y, 'enemy');
    }
}

//
//LEVELS
//
class level1 extends Phaser.Scene {
    constructor(){
        super('level1')
    }
    preload() {
        this.load.image('background', './assets/field.png');
        this.load.image('player', './assets/player.png');
        this.load.image('enemy', './assets/enemy.png');
        this.load.image('ball', './assets/ball.png');
    }
    create() {
        //keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        //assets
        let background = this.add.image(0,0, 'background').setOrigin(0);
    
        this.noob = this.physics.add.sprite(100, 100, 'player')
        //this.noob.setCircle(25);
        this.noob.setCollideWorldBounds(true);

        //ball
        this.ball = this.physics.add.sprite(360, 270, 'ball')
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(.5);
        this.ball.setCircle(25);
        this.ball.setMass(.5);
        this.ball.body.allowRotation = true; 

        //collision event
        //(sets random ball velocities on collison)
        this.physics.add.collider(this.ball, this.noob, (ball, noob) =>
        {

            if (ball.x < noob.x) {
            ball.setVelocityX(-1000*Math.random());
            }
            else {
            ball.setVelocityX(1000*Math.random());
            }

            if (ball.y < noob.y) {
            ball.setVelocityY(-1000*Math.random());
            }
            else {
            ball.setVelocityY(1000*Math.random());
            }

        });

    }
    update() {
        //x movement
        if(this.cursors.left.isDown) { 

            this.noob.angle = 180;
            this.noob.setVelocityX(-200);

        }
        else if (this.cursors.right.isDown) {
            this.noob.angle = 0;
            this.noob.setVelocityX(200);
        }
        else{
            this.noob.setVelocityX(0);
        }

        //y movement
        if(this.cursors.up.isDown) {
            this.noob.angle = -90;
            this.noob.setVelocityY(-200);

            //angles character for diagonal movement
            if (this.cursors.right.isDown) {
                this.noob.angle = 315}
            else if (this.cursors.left.isDown) {
                this.noob.angle = 225}
        }
        else if (this.cursors.down.isDown) {
            this.noob.angle = 90;
            this.noob.setVelocityY(200);

            //angles character for diagonal movement
            if (this.cursors.right.isDown) {
                this.noob.angle = 45}
            else if (this.cursors.left.isDown) {
                this.noob.angle = 135}
        }
        else{
            this.noob.setVelocityY(0);
        }
        
    }
}

const game = new Phaser.Game({
    scale: {
        //mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 540
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [level1],
    title: "Physics Game",
})