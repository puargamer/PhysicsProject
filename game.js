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

        //collision event
        //(enemy pushes player)
        this.scene.physics.add.collider(this, this.scene.noob, (enemy, noob) =>
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

            if (Math.abs(noob.x - enemy.x) < 50) {
                if (noob.y < enemy.y) {
                enemy.setVelocityY(-2000*Math.random());
                }
                else {
                enemy.setVelocityY(2000*Math.random());
                }
            }
        });

    }
    update()
    {
        //collide with ball and player
        this.scene.physics.collide(this, this.scene.ball);
        this.scene.physics.collide(this, this.scene.noob);


        //y axis movement
        if (this.y < 50) {
            this.body.setVelocityY(300);
        } 
        else if (this.y > 500){
            this.body.setVelocityY(-300);
        }

        //x axis movement
        if (this.x > 600) {
            this.body.setVelocityX(-300);
        } 
        
        if (this.x < 100) {
            this.body.setVelocityX(300);
        }
    
    }
}

class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'ball');

        scene.add.existing(this);
        scene.physics.world.enableBody(this);

        //this. = this.physics.add.sprite(360, 270, 'ball')
        this.setCollideWorldBounds(true);
        this.body.onCollide = true;
        this.setBounce(.5);
        this.setCircle(15,10,10);
        this.setMass(.5);

        //collision event
        //(sets random ball velocities on collison)
        this.scene.physics.add.collider(this, this.scene.noob, (ball, player) =>
            {
                if (ball.x < player.x) {
                ball.setVelocityX(-1000*Math.random());
                }
                else {
                ball.setVelocityX(1000*Math.random());
                }

                if(ball.y < player.y) {
                    ball.setVelocityY(-100*Math.random());
                }
                else {
                    ball.setVelocityY(100*Math.random());
                }
            })

}
}

//creates goal hitbox
class Goal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, nextscene) {
        super(scene, x, y);

        scene.add.existing(this);
        scene.physics.world.enableBody(this);

        this.body.onCollide = true;
        this.setSize(16,128);
        this.setPushable(false);

        this.leftpost = scene.physics.add.sprite(x,y-70)
        this.leftpost.setSize(76,12)
        this.leftpost.body.onCollide = true
        this.leftpost.setPushable(false);

        this.rightpost = scene.physics.add.sprite(x,y+70)
        this.rightpost.setSize(76,12)
        this.rightpost.body.onCollide = true
        this.rightpost.setPushable(false);

        this.scene.physics.add.collider(this.scene.ball, this, (ball, goal) =>
        {
            this.scene.scene.start(`${nextscene}`);
        });
        
    }
    update() {
        this.scene.physics.collide(this.scene.ball, this.leftpost);
        this.scene.physics.collide(this.scene.ball, this.rightpost);
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
        this.cameras.main.fadeIn(1000);
        //assets
        let background = this.add.image(0,0, 'background').setOrigin(0);
        let owngoal = this.add.image(55,270, 'goal');
        let enemygoal = this.add.image(665,270, 'goal');
    

        //player
        this.noob = new Player(this, 100, 100);

        //enemies
        this.enemy = new Enemy(this, 500,300);

        //ball
        this.ball = new Ball(this, 360, 270);

        //goals
        this.owngoal = new Goal(this, 40,270, 'lose');
        this.enemygoal = new Goal(this, 680,270, 'level2');

    
    }
    update() {

        this.noob.update();
        this.enemy.update();
        this.owngoal.update();
        this.enemygoal.update();
    }
}

class level2 extends Phaser.Scene {
    constructor(){
        super('level2')
    }
    preload() {
        this.load.image('background', './assets/field.png');
        this.load.image('player', './assets/player.png');
        this.load.image('enemy', './assets/enemy.png');
        this.load.image('ball', './assets/ball.png');
        this.load.image('goal', './assets/goal.png');
    }
    create() {
        this.cameras.main.fadeIn(1000);
        //assets
        let background = this.add.image(0,0, 'background').setOrigin(0);
        let owngoal = this.add.image(55,270, 'goal');
        let enemygoal = this.add.image(665,270, 'goal');
    

        //player
        this.noob = new Player(this, 100, 100);

        //enemies
        this.enemy = new Enemy(this, 500,125);
        this.enemy2 = new Enemy(this, 500,425);
        this.enemy3 = new Enemy(this, 600,275);

        //ball
        this.ball = new Ball(this, 360, 270);

        //goals
        this.owngoal = new Goal(this, 40,270, 'lose');
        this.enemygoal = new Goal(this, 680,270, 'level3');

    }
    update() {
        this.noob.update();
        this.enemy.update();
        this.enemy2.update();
        this.enemy3.update();
        this.owngoal.update();
        this.enemygoal.update();
    }
}

class level3 extends Phaser.Scene {
    constructor(){
        super('level3')
    }
    preload() {
        this.load.image('background', './assets/field.png');
        this.load.image('player', './assets/player.png');
        this.load.image('enemy', './assets/enemy.png');
        this.load.image('ball', './assets/ball.png');
        this.load.image('goal', './assets/goal.png');
    }
    create() {
        this.cameras.main.fadeIn(1000);
        //assets
        let background = this.add.image(0,0, 'background').setOrigin(0);
        let owngoal = this.add.image(55,270, 'goal');
        let enemygoal = this.add.image(665,270, 'goal');
    

        //player
        this.noob = new Player(this, 100, 100);

        //enemies
        this.enemy = new Enemy(this, 500,200);
        this.enemy2 = new Enemy(this, 500,350);
        this.enemy3 = new Enemy(this, 600,275);

        this.enemy4 = new Enemy(this, 550,275);
        this.enemy5 = new Enemy(this, 550,125);
        this.enemy6 = new Enemy(this, 550,425);

        this.enemy7 = new Enemy(this, 450,200);
        this.enemy8 = new Enemy(this, 450,350);
        this.enemy9 = new Enemy(this, 450,100);
        this.enemy10 = new Enemy(this, 450,450);
        this.enemy11 = new Enemy(this, 400,275);


        //ball
        this.ball = new Ball(this, 360, 270);

        //goals
        this.owngoal = new Goal(this, 40,270, 'lose');
        this.enemygoal = new Goal(this, 680,270, 'win');

    }
    update() {
        this.noob.update();
        this.enemy.update();
        this.enemy2.update();
        this.enemy3.update();
        this.enemy4.update();
        this.enemy5.update();
        this.enemy6.update();
        this.enemy7.update();
        this.enemy8.update();
        this.enemy9.update();
        this.enemy10.update();
        this.enemy11.update();
        this.owngoal.update();
        this.enemygoal.update();
    }
}

class win extends Phaser.Scene {
    constructor(){
        super('win')
    }
    create() {
        this.add.text(game.config.width/2, game.config.height/3, "You Win!!!", {font: "40px Arial"}).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "You have survived the tournament.", {font: "40px Arial"}).setOrigin(0.5);;
        this.add.text(game.config.width/2, game.config.height/1.25, "Click to restart", {font: "40px Arial"}).setOrigin(0.5);;


        let fx = this.cameras.main.postFX.addWipe();
        this.input.once('pointerdown', () => {  
            //transition
            this.scene.transition({
                target: 'level1',
                duration: 500,
                moveBelow: true,
                onUpdate: (progress) => {
                    fx.progress = progress;
                }
            });
        })
        
    }
}

class lose extends Phaser.Scene {
    constructor(){
        super('lose')
    }
    create() {
        this.add.text(game.config.width/2, game.config.height/3, "You lose!", {font: "40px Arial"}).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "Click to restart", {font: "40px Arial"}).setOrigin(0.5);;


        let fx = this.cameras.main.postFX.addWipe();
        this.input.once('pointerdown', () => {  
            //transition
            this.scene.transition({
                target: 'level1',
                duration: 500,
                moveBelow: true,
                onUpdate: (progress) => {
                    fx.progress = progress;
                }
            });
        })
        
    }
}

class intro extends Phaser.Scene {
    constructor(){
        super('intro')
    }
    create() {
        this.add.text(game.config.width/2, game.config.height/3, "Can you beat the tournament?", {font: "20px Arial"}).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "Use arrow keys to move", {font: "40px Arial"}).setOrigin(0.5);;
        this.add.text(game.config.width/2, game.config.height/1.25, "Click to start", {font: "40px Arial"}).setOrigin(0.5);;


        let fx = this.cameras.main.postFX.addWipe();
        this.input.once('pointerdown', () => {  
            //transition
            this.scene.transition({
                target: 'level1',
                duration: 500,
                moveBelow: true,
                onUpdate: (progress) => {
                    fx.progress = progress;
                }
            });
        })
        
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
    scene: [intro, level1, level2, level3,win, lose],
    title: "Physics Game",
})