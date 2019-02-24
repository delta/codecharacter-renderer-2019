import HealthBarObject from "./healthbarobject";
import StateObject from "./stateobject";
import * as filters from "pixi-filters";
import CONSTANTS from '../constants/constants.js';

export default class Actor extends StateObject {
    constructor(x, y, id, playerID, hp, state, width, height, textures, maxHP, isAnimated = false, animationSpeed = 0) {
        super(x, y, width, height, textures, isAnimated, animationSpeed);
        this.id = id;
        this.playerID = playerID;
        this.hp = hp;
        this.state = state;

        this.healthBarObject = new HealthBarObject(maxHP, width, height);
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

    attachDetails() {
        let topLeftContainer = document.getElementById("top-left-container"),
            actorType = document.getElementById("actor-type"),
            actorID = document.getElementById("actor-id"),
            actorPosition = document.getElementById("actor-position"),
            actorHp = document.getElementById("actor-hp"),
            actorState = document.getElementById("actor-state");
        actorType.innerHTML = this.constructor.name;
        actorID.innerHTML = "ID : " + this.id;
        actorPosition.innerHTML = "Position : ( " + this.sprite.x + " , " + this.sprite.y + " )";
        actorHp.innerHTML = "HP : " + this.hp;
        actorState.innerHTML = "State : " + Actor.actorStates[this.constructor.name][this.state];

        topLeftContainer.style.zIndex = 2;
        topLeftContainer.style.opacity = 0.8;
    }

    removeDetails() {
        let topLeftContainer = document.getElementById("top-left-container"),
            actorID = document.getElementById("actor-id");

        if (actorID.innerHTML == "ID : " + this.id) {
            topLeftContainer.style.opacity = 0;
            topLeftContainer.style.display = -1;
        }
    }

    bindEventListeners() {
        let filterConst = Actor.glowFilters;
        let outlineFilter = new filters.GlowFilter(filterConst.distance, filterConst.outerStrength, filterConst.innerStrength, filterConst.color[this.playerID], filterConst.quality);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('pointerover', () => {
            this.attachDetails();
            this.sprite.filters = [outlineFilter];
            this.healthBarObject.healthBar.filters = [outlineFilter];
        }).on('pointerout', () => {
            this.sprite.filters = null;
            this.healthBarObject.healthBar.filters = null;
            this.removeDetails();
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
        stage.addChild(this.healthBarObject.healthBar);
    }

    removeHPBar(stage) {
        stage.removeChild(this.healthBarObject.healthBar);
    }

    static setFilterConstant(FILTER_CONST) {
        this.glowFilters = FILTER_CONST;
    }

    static setActorStatesConstant(STATE_CONST) {
        this.actorStates = STATE_CONST;
    }
}
