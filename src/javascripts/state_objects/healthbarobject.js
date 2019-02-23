import * as PIXI from 'pixi.js';

export default class HealthBarObject {
    constructor(maxHP, width, height) {
        this.hp = maxHP;    // Initially actors start with full health
        this.maxHP = maxHP;
        this.width = width;
        this.height = height;
        this.buildHPBars();
    }

    buildHPBars() {
        this.healthBar = new PIXI.Container();
        this.innerBar = new PIXI.Graphics();    // moving bar
        this.outerBar = new PIXI.Graphics();    // fixed bar

        this.outerBar.beginFill(HealthBarObject.hpBarConstants.outerBarColor);
        this.outerBar.drawRect(0, 0, this.width, HealthBarObject.hpBarConstants.height);
        this.outerBar.endFill();

        this.innerBar.beginFill(HealthBarObject.hpBarConstants.innerBarColor);
        this.innerBar.drawRect(0, 0, this.width, HealthBarObject.hpBarConstants.height);
        this.innerBar.endFill();

        this.healthBar.addChild(this.outerBar);
        this.healthBar.addChild(this.innerBar);
    }

    updatePosition(x, y) {
        let offsetY = HealthBarObject.hpBarConstants.offsetY;
        this.healthBar.position.set(x - (this.width/2), y - (this.height/2) - offsetY);
    }

    changeHp(hp) {
        this.hp = hp;
        this.innerBar.width = (this.hp/this.maxHP)*this.width;
    }

    static setHPConstants(HP_BAR_CONST) {
        this.hpBarConstants = HP_BAR_CONST;
    }

}
