"use strict";

class OneDMovement extends Phaser.Scene {
    constructor() {
        super('OneDMovementScene');
        this.my = {sprite: {}, blasts: [], lastBlastTime: 0}; 
        this.bodyX = 300;
        this.bodyY = 350;
        this.blueBlasts = []; 
        this.blueLastShotTime = 0; 
        this.blueShotInterval = 1000; 
        this.healthCount = 400;
        this.scoreCount = 0;
        this.pinkAlienHit = false;
        this.blueAlienHit = false;
        this.destroyedAlienCount = 0;
        this.totalAlienCount = 2; 
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.atlasXML("spaceships", "sheet.png", "sheet.xml");
        this.load.atlasXML("aliens", "spritesheet_spaceships.png", "spritesheet_spaceships.xml");
        this.load.atlasXML("hud", "spritesheet_hud.png", "spritesheet_hud.xml");
    }

    create() {
        let my = this.my;
        my.sprite.body = this.add.sprite(this.bodyX + 80, this.bodyY + 300, "spaceships", "playerShip2_red.png");
        my.spaceKey = this.input.keyboard.addKey('SPACE');
        my.spaceKey.isDown = false; 
        let blastFrame = this.textures.getFrame("spaceships", "laserRed16.png");
       // this.numeralSprite = this.add.sprite(this.sys.game.config.width - 20, this.sys.game.config.height - 20, 'spaceships', 'numeral3.png');
       // this.numeralSprite.setOrigin(1, 1);
        this.scoreText = this.add.text(this.sys.game.config.width - 60, 20, `Score: ${this.scoreCount}`, { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.scoreText.setOrigin(1, 0);
        this.healthText = this.add.text(this.sys.game.config.width - 20, this.sys.game.config.height - 20, `Health: ${this.healthCount}`, { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' });
        this.healthText.setOrigin(1, 1);

        this.pinkEnemy = this.add.sprite(this.sys.game.config.width / 2, 0, "aliens","shipPink_manned.png");
        this.pinkEnemy.setOrigin(0.5, 0);
        this.pinkEnemy.speedX = 1.5;
        this.pinkEnemy.speedY = 50; 
        this.pinkEnemy.moveRight = true; 

        this.BlueEnemy = this.add.sprite(this.sys.game.config.width / 2, 0, "aliens","shipBlue_manned.png");
        this.BlueEnemy.setOrigin(0.5, 0);
        this.BlueEnemy.speedX = 1.5; 
        this.BlueEnemy.moveRight = true; 

        if (blastFrame) {
            my.blastFrame = blastFrame;
        } else {
            console.error("Blast frame not found in the texture atlas.");
        }

        this.input.keyboard.on('keydown-SPACE', () => {
            my.spaceKey.isDown = true;
        });

        this.input.keyboard.on('keyup-SPACE', () => {
            my.spaceKey.isDown = false;
        });
    }

    update() {
        let my = this.my;
        if (this.scoreCount >= 2) {
            this.stopAllSprites();
            this.showGameOver();
            return;
        }

        if (this.destroyedAlienCount === this.totalAlienCount) {
            this.winGame();
            return;
        }

        if (this.healthCount <= 0) {
            this.gameOver();
            return;
        }
        if (this.destroyedAlienCount === this.totalAlienCount) {
            this.winGame();
        }
        if (this.blueAlienHit) {
            if (this.time.now - this.blueLastShotTime > this.blueShotInterval) {
                let blast = this.add.sprite(this.BlueEnemy.x, this.BlueEnemy.y, "spaceships", "laserBlue04.png");
                blast.setOrigin(0.5, 0);
                this.blueBlasts.push(blast);
                this.blueLastShotTime = this.time.now;
            }
        }
    
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('A'), 1)) {
            if (my.sprite.body.x > 0) {
                my.sprite.body.x -= 2;
            }
        }
    
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('D'), 1)) {
            if (my.sprite.body.x < this.sys.game.config.width - my.sprite.body.width) {
                my.sprite.body.x += 2;
            }
        }
    
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('W'), 1)) {
            if (my.sprite.body.y > 0) {
                my.sprite.body.y -= 2;
            }
        }
    
        if (this.input.keyboard.checkDown(this.input.keyboard.addKey('S'), 1)) {
            if (my.sprite.body.y < this.sys.game.config.height - my.sprite.body.height) {
                my.sprite.body.y += 2;
            }
        }
    
        if (this.input.keyboard.checkDown(my.spaceKey, 500)) {
            if (!my.lastBlastTime || this.time.now - my.lastBlastTime > 500) {
                if (my.sprite.body.y > 0) {
                    let blast = this.add.sprite(my.sprite.body.x, my.sprite.body.y, "spaceships", "laserRed16.png");
                    blast.setOrigin(0.5, 1);
                    my.blasts.push(blast);
                    my.lastBlastTime = this.time.now;
                }
            }
        }

        if (this.time.now - this.blueLastShotTime > this.blueShotInterval) {
            let blast = this.add.sprite(this.BlueEnemy.x, this.BlueEnemy.y, "spaceships", "laserBlue04.png");
            blast.setOrigin(0.5, 0);
            this.blueBlasts.push(blast);
            this.blueLastShotTime = this.time.now; 
        }
        
        for (let i = 0; i < my.blasts.length; i++) {
            let blast = my.blasts[i];
            if (blast.active) {
                blast.y -= 2;
                if (blast.y < 0) {
                    blast.destroy();
                    my.blasts.splice(i, 1);
                    i--;
                }
            } else {
                my.blasts.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < this.blueBlasts.length; i++) {
            let blast = this.blueBlasts[i];
            blast.y += 1; 
            if (blast.y > this.sys.game.config.height + blast.height) { 
                blast.destroy();
                this.blueBlasts.splice(i, 1);
                i--;
            }
        }

        this.pinkEnemy.x += this.pinkEnemy.speedX * (this.pinkEnemy.moveRight ? 1 : -1);
        if (this.pinkEnemy.x <= 0 || this.pinkEnemy.x >= this.sys.game.config.width) {
            this.pinkEnemy.moveRight = !this.pinkEnemy.moveRight;
            this.pinkEnemy.y += this.pinkEnemy.speedY;
        }

        this.checkEnemyCollisions();

        this.checkPlayerBlastCollisions();

        this.checkEnemyBlastCollisions();
    }

        checkEnemyCollisions() {
        let my = this.my;
        let playerShip = my.sprite.body;

      
        if (this.checkCollision(playerShip, this.pinkEnemy)) {

            this.handlePlayerDamage();
        }
        if (this.checkCollision(playerShip, this.BlueEnemy)) {
            this.handlePlayerDamage();
        }
    }

    checkPlayerBlastCollisions() {
        let my = this.my;

        my.blasts.forEach(blast => {
            if (!this.pinkAlienHit && this.checkCollision(blast, this.pinkEnemy)) {
                this.destroyAlien(this.pinkEnemy);
                this.pinkAlienHit = true;
                this.destroyedAlienCount++;
                this.increaseScore();
            }

            if (!this.blueAlienHit && this.checkCollision(blast, this.BlueEnemy)) {
                this.destroyAlien(this.BlueEnemy);
                this.blueAlienHit = true;
                this.destroyedAlienCount++;
                this.increaseScore();
            }
        });
    }
    
        destroyAlien(alien) {
        alien.destroy(); 
    }
        checkEnemyBlastCollisions() {
        let my = this.my;
        let playerShip = my.sprite.body;

        this.blueBlasts.forEach(blast => {
            if (this.checkCollision(playerShip, blast)) {
                this.handlePlayerDamage();
            }
        });
    }

        handlePlayerDamage() {
        this.healthCount--;
        this.healthText.setText(`Health: ${this.healthCount}`);
    
        if (this.my.healthCount <= 0) {
            this.gameOver();
        }
    }

        increaseScore() {
        this.scoreCount++;
        this.scoreText.setText(`Score: ${this.scoreCount}`);
    }
        checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }
    stopAllSprites() {
        
    }
        showGameOver() {
        this.gameOverImage = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "hud","text_gameover.png");
        this.gameOverImage.setOrigin(0.5);
        this.gameOverImage.setInteractive();
        this.gameOverImage.on('pointerdown', () => {
        this.resetGame();
    });
    }

        gameOver() {
            this.stopAllSprites(); 
            this.showGameOver();

    
    }
        winGame() {
            this.stopAllSprites();
            this.showGameOver();
    }
    resetGame() {
        this.scoreCount = 0;
        this.healthCount = 400;
        this.destroyedAlienCount = 0;
    
        this.blueBlasts.forEach(blast => blast.destroy());
        this.blueBlasts = [];
    
        this.gameOverImage.destroy();
        
        this.pinkEnemy.setPosition(this.sys.game.config.width / 2, 0);
        this.pinkEnemy.setActive(true);
        this.pinkEnemy.setVisible(true);
    
        this.BlueEnemy.setPosition(this.sys.game.config.width / 2, 0);
        this.BlueEnemy.setActive(true);
        this.BlueEnemy.setVisible(true);
    
        this.pinkAlienHit = false;
        this.blueAlienHit = false;
    
        this.scene.restart();
    }
}