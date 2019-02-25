import * as PIXI from 'pixi.js';

export default class HealthBarObject {
    constructor(playerID, maxHP, width, height) {
        this.hp = maxHP;    // Initially actors start with full health
        this.maxHP = maxHP;
        this.width = width;
        this.height = height;
        this.playerID = playerID;
        this.buildHPBars();
    }

    buildHPBars() {
        this.healthBar = new PIXI.Container();
        this.innerBar = new PIXI.Graphics();    // moving bar
        this.outerBar = new PIXI.Graphics();    // fixed bar

        this.outerBar.beginFill(HealthBarObject.hpBarConstants.outerBarColor);
        // consts to allow outerbar to act as border for the container
        this.outerBar.drawRect(-0.1, -0.1, this.width + 0.2, HealthBarObject.hpBarConstants.height + 0.2);
        this.outerBar.endFill();

        this.innerBar.beginFill(HealthBarObject.hpBarConstants.innerBarColors[this.playerID]);
        this.innerBar.drawRect(0, 0, this.width, HealthBarObject.hpBarConstants.height);
        this.innerBar.endFill();

        this.healthBar.addChild(this.outerBar);
        this.healthBar.addChild(this.innerBar);
    }

    updatePosition(x, y) {
        this.healthBar.position.set(x, y);
    }

    changeHp(hp) {
        this.hp = hp;
        this.innerBar.width = (this.hp/this.maxHP)*this.width;
    }

    addHPBar(stage) {
        stage.addChild(this.healthBar);
    }

    removeHPBar(stage) {
        stage.removeChild(this.healthBar);
    }

    static setHPConstants(HP_BAR_CONST) {
        this.hpBarConstants = HP_BAR_CONST;
    }

}
