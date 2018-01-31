import * as PIXI from 'pixi.js';

export default class StateObject {
    constructor(x, y, width, height, textureData, isAnimated = false, animationSpeed = 0) {
        if (isAnimated) {
            this.sprite = new PIXI.extras.AnimatedSprite(textureData);
            this.setAnimationSpeed(animationSpeed);
            this.playAnimation();
        } else {
            this.sprite = new PIXI.Sprite(textureData);
        }
        this.setSpritePosition(x, y);
        this.setSpriteDimensions(width, height);
    }

    setSpritePosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    setSpriteDimensions(width, height) {
        this.sprite.width = width;
        this.sprite.height = height;
    }

    setSpriteAnchors(x, y) {
        this.sprite.anchor.x = x;
        this.sprite.anchor.y = y;
    }

    // Animation related functions
    setAnimationSpeed(speed) {
        this.sprite.animationSpeed = speed;
    }

    playAnimation() {
        this.sprite.play();
    }

    pauseAnimation() {
        this.sprite.stop();
    }

    // Methods to add and remove sprites
    addSprite(stage) {
        stage.addChild(this.sprite);
    }

    removeSprite(stage) {
        stage.removeChild(this.sprite);
    }
}
