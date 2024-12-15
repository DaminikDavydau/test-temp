import { PlayerBase } from '../../types/PlayerBase';

import { default as settings } from '../settings.json';

export class Player extends PlayerBase {
    public static bancrupcyMargin = settings.playerSettings.bancrupcyMargin;

    constructor(assets: number) {
        super(assets);
    }

    public isBancrupt() {
        return this.assets <= Player.bancrupcyMargin;
    }

    public addInvestmentReturns(investmentReturns: number) {
        this.assets += investmentReturns;
    }
}
