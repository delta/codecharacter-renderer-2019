import HealthBarObject from "./healthbarobject";
import StateObject from "./stateobject";
import * as filters from "pixi-filters";

export default class Actor extends StateObject {
    constructor(x, y, id, playerID, hp, state, width, height, textures, maxHP, isAnimated = false, animationSpeed = 0) {
        super(x, y, width, height, textures, isAnimated, animationSpeed);
        this.id = id;
        this.playerID = playerID;
        this.hp = hp;
        this.state = state;

        this.healthBarObject = new HealthBarObject(maxHP, width, height);
        this.healthBarObject.buildHPBars(); // creates hpbar => outer+innerbar
        this.updateBarPosition();   // setting initial bar posiiton
    }

    updateHP(hp) {
        this.hp = hp;
        this.updateBarHP();    // change HPBar hp
    }

    updateBarHP() {
        this.healthBarObject.changeHp(this.hp);
    }

    updateBarPosition() {
        this.healthBarObject.updatePosition(this.sprite.x, this.sprite.y);
    }

    createSpriteInfo() {
        let spriteInfo = {
            ID: this.id,
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

    bindEventListeners() {
        let detailsDiv = document.getElementById("details-div");
        let filterConst = Actor.glowFilters;
        let outlineFilter = new filters.GlowFilter(filterConst.distance, filterConst.outerStrength, filterConst.innerStrength, filterConst.color[this.playerID], filterConst.quality);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('pointerover', () => {
            detailsDiv.innerHTML = JSON.stringify(this.createSpriteInfo(), null, 2);
            this.sprite.filters = [outlineFilter];
            this.healthBarObject.healthBar.filters = [outlineFilter];
        }).on('pointerout', () => {
            this.sprite.filters = null;
            this.healthBarObject.healthBar.filters = null;
            let spriteInfo = JSON.stringify(this.createSpriteInfo(), null, 2);
            if (detailsDiv.innerHTML == spriteInfo)
                detailsDiv.innerHTML = "";
        });
    }

    unbindEventListeners() {
        this.sprite.interactive = false;
        this.sprite.buttonMode = false;
        this.sprite.filters = null;
        this.healthBarObject.healthBar.filters = null;
        this.sprite.off('pointerover', () => {}).off('pointerout', () => {});
    }

    addHPBar(stage) {
        if (this.healthBarObject != null) {
            stage.addChild(this.healthBarObject.healthBar);
        }
    }

    removeHPBar(stage) {
        if (this.healthBarObject != null) {
            stage.removeChild(this.healthBarObject.healthBar);
        }
    }

    static setFilterConstant(FILTER_CONST) {
        this.glowFilters = FILTER_CONST;
    }
}
