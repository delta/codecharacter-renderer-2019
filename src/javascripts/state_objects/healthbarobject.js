import BarObject from './barobject';

export default class HealthBarObject extends BarObject {
    constructor(playerID, hp, maxHP, width, height) {
        super(playerID, width, height, HealthBarObject.hpBarConstants);
        this.maxHP = maxHP;
        this.updateHp(hp);  // for init hp
    }

    updateHp(hp) {
        let percent =  hp / this.maxHP;
        this.updatePercent(percent);
    }

    static setHPConstants(HP_BAR_CONST) {
        this.hpBarConstants = HP_BAR_CONST;
    }

}
