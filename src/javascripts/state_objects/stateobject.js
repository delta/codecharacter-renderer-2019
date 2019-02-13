import * as PIXI from 'pixi.js';
import * as filters from "pixi-filters";
import { type } from 'os';

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

    setSpriteAnchors() {
        this.sprite.anchor.x = StateObject.anchor.x;
        this.sprite.anchor.y = StateObject.anchor.y;
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
        console.log(this.sprite.play);
        if (this.constructor.name != "TerrainElement") {
            this.sprite.interactive = true;
            this.sprite.buttonMode = true;
        }
        let outlineFilterRed = new filters.GlowFilter(15, 2, 1, 0x1700FF, 0.5);
        this.sprite.on('pointerover', ()=>{
            console.log("in");
            document.getElementById("unit-type").innerHTML = this.constructor.name;
            this.sprite.filters = [outlineFilterRed];
        }).on("pointerout", ()=>{
            this.sprite.filters = null;
            console.log("out");
            document.getElementById("unit-type").innerHTML = "";
        })
        stage.addChild(this.sprite);
    }

    removeSprite(stage) {
        stage.removeChild(this.sprite);
    }


    static setSpriteAnchors(anchorData) {
        this.anchor = anchorData;
    }
}
