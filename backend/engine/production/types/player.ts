import { PlayerBase } from '../../types/PlayerBase';
import { NEGATIVE_ASSETS, POSITIVE_ASSETS } from '../constants';
import { Machine } from './machine';

export class Player extends PlayerBase {
    public playerKey: string;

    public bet: number;
    public machine: Machine | undefined;

    public time: Date;

    constructor(
        playerKey: string,
        assets: number,
        bet: number,
        machine: Machine | undefined,
        time: Date
    ) {
        super(assets);

        this.playerKey = playerKey;

        this.bet = bet;
        this.machine = machine;

        this.time = time;
    }

    public isBancrupt() {
        return this.ownsMachine();
    }

    public getSupport(lastYearIncome: number) {
        const bankInterest =
            this.assets < 0 ? NEGATIVE_ASSETS : POSITIVE_ASSETS;
        const bankPercentages = Math.round(bankInterest * this.assets);

        const initialAssets = this.assets;
        this.assets += Math.round(lastYearIncome + bankPercentages);

        const incomes = {
            initialAssets: initialAssets,
            totalAssets: this.assets,
            incomesFromMachine: 0,
            uneployment: lastYearIncome,
            bankPercentages: bankPercentages,
        };

        return incomes;
    }

    public ownsMachine() {
        if (typeof this.machine !== 'undefined') {
            return true;
        }

        return false;
    }
}
