import {
    MACHINE_TYPES,
    NEGATIVE_ASSETS,
    POSITIVE_ASSETS,
    POWER_DIFFERENCE,
} from '../constants';
import { Player } from './player';

export interface IMachine {
    type: string;
    number: string;
    owner: string | null;
    timesUsed: number;
    soldFor: number | null;
}

export class Machine {
    type: string;
    number: string;
    owner: string | null;
    timesUsed: number;
    soldFor: number | null;

    uses: number;
    lastTimeUsed: string | undefined;

    constructor(machine: IMachine) {
        this.type = machine.type;
        this.number = machine.number;
        this.owner = machine.owner;
        this.timesUsed = machine.timesUsed;
        this.soldFor = machine.soldFor;

        this.uses = 0;
    }

    public getIncomes(
        yearInvestment: Record<string, any>,
        player: Player,
        playerNumber: string,
        collaborating: boolean,
        year: string
    ) {
        const bankInterest =
            player.assets < 0 ? NEGATIVE_ASSETS : POSITIVE_ASSETS;
        const bankPercentages = Math.round(bankInterest * player.assets);

        let incomeBase = (this.timesUsed - this.uses) * POWER_DIFFERENCE;
        incomeBase = incomeBase < 0 ? 0 : incomeBase;

        const shares = {
            '0': yearInvestment.share,
            '1': collaborating
                ? 1 - yearInvestment.share
                : this.owner == player.playerKey
                ? yearInvestment.share
                : 0,
            '2': collaborating
                ? yearInvestment.share > 1 - yearInvestment.share
                    ? 0.7 * (1 - yearInvestment.share)
                    : 0.7 * yearInvestment.share
                : 0,
        };

        const income = Math.round(
            incomeBase * shares[playerNumber as keyof typeof shares]
        );

        const incomesFromMachine = playerNumber == '2' ? 0 : income;
        const uneployment = playerNumber == '2' ? income : 0;

        const initialAssets = player.assets;
        player.assets += income + bankPercentages;

        const incomes = {
            initialAssets: initialAssets,
            totalAssets: player.assets,
            incomesFromMachine: incomesFromMachine,
            uneployment: uneployment,
            bankPercentages: bankPercentages,
        };

        if ((collaborating && playerNumber == '2') || !collaborating) {
            this.uses += 1;
        }

        return incomes;
    }
}

export const machineTypes = MACHINE_TYPES;
