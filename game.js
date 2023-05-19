class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene);
        
        let body = scene.add.rectangle(650,375,250,10,0x3c78d8);
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
    }
    create() {
        let background = this.add.image(0,0, 'background').setOrigin(0);
    
        let noob = this.physics.add.existing(new Player(this));
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
});