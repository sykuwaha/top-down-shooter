"use strict";

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 800,
    scene: [OneDMovement] // Updated scene class name
};

const game = new Phaser.Game(config);
