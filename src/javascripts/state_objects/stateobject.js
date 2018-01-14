import * as PIXI from 'pixi.js';

export default class StateObject {
    constructor(x, y, width, height, texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.buildSprite(x, y, width, height);
    }

    buildSprite(x, y, width, height) {
        this.sprite.width = width;
        this.sprite.height = height;
        this.setSpritePosition(x, y);
    }

    setSpritePosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    addSprite(stage) {
        stage.addChild(this.sprite);
    }

    removeSprite(stage) {
        stage.removeChild(this.sprite);
    }
}
