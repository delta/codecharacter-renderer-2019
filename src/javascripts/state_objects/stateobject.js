import * as PIXI from 'pixi.js';

export default class StateObject {
    constructor(x, y, width, height, texture) {
        this.sprite = new PIXI.Sprite(texture);
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

    addSprite(stage) {
        stage.addChild(this.sprite);
    }

    removeSprite(stage) {
        stage.removeChild(this.sprite);
    }
}
