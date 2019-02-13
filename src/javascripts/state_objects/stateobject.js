import * as PIXI from 'pixi.js';
import * as filters from "pixi-filters";

export default class StateObject {
    constructor(x, y, width, height, textureData, isAnimated = false, animationSpeed = 0) {
        StateObject.gameStatus = false;
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

    pointerEventBinder() {
        let detailsDiv = document.getElementById("details-div");
        if (this.constructor.name != "TerrainElement") {
            let outlineFilterRed = new filters.GlowFilter(15, 2, 1, 0x1700FF, 0.5);
            if (StateObject.gameStatus) {
                this.sprite.interactive = true;
                this.sprite.buttonMode = true;
                this.sprite.on('pointerover', () => {
                    detailsDiv.innerHTML = JSON.stringify(this.createSpriteObject(),undefined,2);
                    this.sprite.filters = [outlineFilterRed];
                }).on("pointerout", () => {
                    this.sprite.filters = null;
                    let spriteInfo = JSON.stringify(this.createSpriteObject(),undefined,2);
                    if (detailsDiv.innerHTML == spriteInfo)
                        detailsDiv.innerHTML = "";
                });
            } else {
                this.sprite.interactive = false;
                this.sprite.buttonMode = false;
                this.sprite.off('pointerover',()=>{}).off('pointerout',()=>{});
            }
        }
    }

    createSpriteObject() {
        let spriteInfo = {
            playerId: this.playerID,
            type: this.constructor.name,
            x: this.sprite.x,
            y: this.sprite.y,
            hp: this.hp,
            state: this.state,
            buildPercent: this.buildPercent
        };
        return spriteInfo;
    }

    static setGameStatus(isPaused) {
        this.gameStatus = isPaused;
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
        stage.addChild(this.sprite);
    }

    removeSprite(stage) {
        stage.removeChild(this.sprite);
    }


    static setSpriteAnchors(anchorData) {
        this.anchor = anchorData;
    }
}
