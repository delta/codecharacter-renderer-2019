import HealthBarObject from "./healthbarobject";
import StateObject from "./stateobject";
import * as filters from "pixi-filters";

export default class Actor extends StateObject {
    constructor(x, y, id, playerID, hp, state, width, height, textures, maxHP, actorType, isAnimated = false, animationSpeed = 0) {
        super(x, y, width, height, textures, isAnimated, animationSpeed);
        this.id = id;
        this.playerID = playerID;
        this.hp = hp;
        this.maxHP = maxHP;
        this.actorType = actorType;
        this.state = state;

        this.healthBarObject = new HealthBarObject(playerID, maxHP, width, height);
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
        let offsetY = 1.5;
        let healthBarPosition = {
            x: this.sprite.x - (this.sprite.width/2),
            y: this.sprite.y - (this.sprite.height/2) - offsetY
        };
        this.healthBarObject.updatePosition(healthBarPosition.x, healthBarPosition.y);
    }

    enableFilters() {
        let filterConst = Actor.glowFilters;
        let outlineFilter = new filters.GlowFilter(filterConst.distance, filterConst.outerStrength, filterConst.innerStrength, filterConst.color[this.playerID], filterConst.quality);
        this.sprite.filters = [outlineFilter];
        this.healthBarObject.healthBar.filters = [outlineFilter];
    }

    disableFilters() {
        this.sprite.filters = null;
        this.healthBarObject.healthBar.filters = null;
    }

    bindEventListeners(activeSprite) {
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('click', (e) => {
            e.data.originalEvent.stopPropagation();
            if (activeSprite.state == "inactive") {
                this.enableFilters();
            } else {
                activeSprite.obj.disableFilters();
                this.enableFilters();
            }
            activeSprite.obj = this;
            activeSprite.state = "click";
        });
    }

    addToStage(stage) {
        this.addSprite(stage);
        this.healthBarObject.addHPBar(stage);
    }

    removeFromStage(stage) {
        this.disableFilters();
        this.removeSprite(stage);
        this.healthBarObject.removeHPBar(stage);
    }

    static setFilterConstant(FILTER_CONST) {
        this.glowFilters = FILTER_CONST;
    }
}
