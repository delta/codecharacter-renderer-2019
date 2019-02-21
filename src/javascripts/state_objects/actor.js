import HealthBarObject from "./healthbarobject";
import StateObject from "./stateobject";
import * as filters from "pixi-filters";

export default class Actor extends StateObject {
    constructor(x, y, width, height, textures, maxHP, isAnimated = false, animationSpeed = 0) {
        let healthBarObject = new HealthBarObject(maxHP, width);
        super(x, y, width, height, textures, isAnimated, animationSpeed, healthBarObject);
        this.updateBarPosition();   // setting initial bar posiiton
    }

    static setGameStatus(isPaused) {
        this.gameStatus = isPaused;
    }

    updateBarHP() {
        this.healthBarObject.changeHp(this.hp);
    }

    updateBarPosition() {
        let offsetY = 1.5;
        this.healthBarObject.updatePosition(this.sprite.x - 5, this.sprite.y - 5 - offsetY);
    }

    createSpriteInfo() {
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

    pointerEventBinder() {
        let detailsDiv = document.getElementById("details-div");
        let outlineFilterRed = new filters.GlowFilter(15, 2, 1, 0x1700FF, 0.5);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('pointerover', () => {
            detailsDiv.innerHTML = JSON.stringify(this.createSpriteInfo(),null,2);
            this.sprite.filters = [outlineFilterRed];
        }).on("pointerout", () => {
            this.sprite.filters = null;
            let spriteInfo = JSON.stringify(this.createSpriteInfo(),null,2);
            if (detailsDiv.innerHTML == spriteInfo)
                detailsDiv.innerHTML = "";
        });
    }

    pointerEventUnBinder() {
        this.sprite.interactive = false;
        this.sprite.buttonMode = false;
        this.sprite.filters = null;
        this.sprite.off('pointerover',() => {}).off('pointerout',() => {});
    }
}