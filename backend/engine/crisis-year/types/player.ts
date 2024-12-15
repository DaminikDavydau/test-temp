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

    public addIncomes(incomes: number) {
        this.assets += incomes;
    }

    public calculateYearlyExpenses(pigsAmount: number) {
        const expenses = Player.calculateYearlyExpenses(
            pigsAmount,
            this.assets
        );
        return expenses;
    }

    public static calculateYearlyExpenses(
        pigsAmount: number,
        playerAssets: number
    ) {
        const pigsExpenses = Player.getTotalPigsExpenses(pigsAmount);
        const familyExpenses = Player.getFamilyExpenses();
        const bankExpenses = Player.getBankExpenses(
            playerAssets,
            pigsExpenses,
            familyExpenses
        );

        const expenses = pigsExpenses + familyExpenses + bankExpenses;
        return expenses;
    }

    public static calculateYearlyIncome(
        pigsAmount: number,
        pigsOnMarket: number,
        crisisYear: boolean
    ) {
        const pigPrice = Player.getPigPrice(pigsOnMarket, crisisYear);
        const incomes = pigsAmount * pigPrice;

        return incomes;
    }

    public static getTotalPigsExpenses(pigsAmount: number) {
        return Player.getPigExpenses() * pigsAmount;
    }

    public static getBankExpenses(
        playerAssets: number,
        pigsExpenses: number,
        familyExpenses: number
    ) {
        const assetsAndExpenses = playerAssets + pigsExpenses + familyExpenses;
        const bankPercentages = Player.getBankPercentages(assetsAndExpenses);
        const bankExpenses = assetsAndExpenses * bankPercentages;

        return Math.round(bankExpenses);
    }

    public static getFamilyExpenses() {
        const familyExpenses = settings.financesSettings.familyExpenses;
        return familyExpenses;
    }

    public static getPigPrice(pigsOnMarket: number, crisisYear: boolean) {
        let pigIncome: any;

        if (0 <= pigsOnMarket && pigsOnMarket <= 40) {
            pigIncome = settings.financesSettings.pigIncomes['0-40'];
        } else if (41 <= pigsOnMarket && pigsOnMarket <= 60) {
            pigIncome = settings.financesSettings.pigIncomes['41-60'];
        } else if (61 <= pigsOnMarket && pigsOnMarket <= 80) {
            pigIncome = settings.financesSettings.pigIncomes['61-80'];
        } else if (81 <= pigsOnMarket && pigsOnMarket <= 100) {
            pigIncome = settings.financesSettings.pigIncomes['81-100'];
        } else if (101 <= pigsOnMarket && pigsOnMarket <= 200) {
            pigIncome = settings.financesSettings.pigIncomes['101-200'];
        } else if (201 <= pigsOnMarket && pigsOnMarket <= 400) {
            pigIncome = settings.financesSettings.pigIncomes['201-400'];
        } else if (401 <= pigsOnMarket) {
            pigIncome = settings.financesSettings.pigIncomes['401-'];
        }

        const pigPrice = crisisYear ? pigIncome.badYear : pigIncome.goodYear;
        return pigPrice;
    }

    public static getBankPercentages(assetsAfterExpenses: number) {
        if (assetsAfterExpenses < 0) {
            return settings.financesSettings.bankPercentages.negativeAssets;
        } else {
            return settings.financesSettings.bankPercentages.positiveAssets;
        }
    }

    public static getPigExpenses() {
        const pigsExpenses = settings.financesSettings.pigExpenses;
        return pigsExpenses;
    }
}
