//
//PREFABS
//
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        
        this.body.onCollide = true;
        this.setCollideWorldBounds(true);
        
        this.setPushable(true);


        //keyboard input
        this.scene.cursors = scene.input.keyboard.createCursorKeys();

    }
    update()
    {
        //x movement
        if(this.scene.cursors.left.isDown) { 
            this.angle = 180;
            this.setVelocityX(-200);
        }
        else if (this.scene.cursors.right.isDown) {
            this.angle = 0;
            this.setVelocityX(200);
        }
        else{
            this.setVelocityX(0);
        }

        //y movement
        if(this.scene.cursors.up.isDown) {
            this.angle = -90;
            this.setVelocityY(-200);

            //angles character for diagonal movement
            if (this.scene.cursors.right.isDown) {
                this.angle = 315}
            else if (this.scene.cursors.left.isDown) {
                this.angle = 225}
        }
        else if (this.scene.cursors.down.isDown) {
            this.angle = 90;
            this.setVelocityY(200);

            //angles character for diagonal movement
            if (this.scene.cursors.right.isDown) {
                this.angle = 45}
            else if (this.scene.cursors.left.isDown) {
                this.angle = 135}
        }
        else{
            this.setVelocityY(0);
        }
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');

        scene.add.existing(this);
        scene.physics.world.enableBody(this);

        this.angle = 180;
        this.body.onCollide = true;
        this.setCollideWorldBounds(true);

        this.body.setVelocityY(300);
        //this.setPushable(false);


    }
    update()
    {
        //y axis movement
        if (this.y < 50) {
            this.body.setVelocityY(300);
        } 
        else if (this.y > 500){
            this.body.setVelocityY(-300);
        }

        //x axis movement
        if (this.x > 500) {
            this.body.setVelocityX(-100);
        } 
        
        if (this.x < 100) {
            this.body.setVelocityX(300);
        }
    
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
        this.load.image('goal', './assets/goal.png');
    }
    create() {
        //keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        //assets
        let background = this.add.image(0,0, 'background').setOrigin(0);
        let owngoal = this.add.image(55,270, 'goal');
        let enemygoal = this.add.image(665,270, 'goal');
    

        //player
        this.noob = new Player(this, 100, 100);
        //this.noob = this.physics.add.sprite(100, 100, 'player')

        this.enemy = new Enemy(this, 300,300);

        //ball
        this.ball = this.physics.add.sprite(360, 270, 'ball')
        this.ball.setCollideWorldBounds(true);
        this.ball.body.onCollide = true;
        this.ball.setBounce(.5);
        this.ball.setCircle(15,10,10);
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

        });

        //collision event
        //(enemy pushes player)
        this.physics.add.collider(this.enemy, this.noob, (enemy, noob) =>
        {

            //if player is in front/behind the enemy's line of sight
            if (Math.abs(noob.y - enemy.y) < 50) {
                if (noob.x < enemy.x) {
                enemy.setVelocityX(-2000*Math.random());
                }
                else {
                enemy.setVelocityX(2000*Math.random());
                }
            }

        });

    }
    update() {
        this.physics.collide(this.ball, this.enemy);
        this.physics.collide(this.noob, this.enemy);

        this.noob.update();
        this.enemy.update();
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