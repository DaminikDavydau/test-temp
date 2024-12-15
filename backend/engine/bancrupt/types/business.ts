import { BusinessBase } from '../../types/BusinessBase';
import { getRandomTrueFalse } from '../../utils/probability';
import { default as settings } from '../settings.json';

export class Business extends BusinessBase {
    private _settings: any;

    constructor(
        businessKey: string,
        isBancrupt: boolean,
        bancrupcyYear: string
    ) {
        super(isBancrupt, bancrupcyYear);
        this._settings = this._getSettings(businessKey);
    }

    private _getSettings(businessKey: string) {
        return settings.businessSettings[
            businessKey as keyof typeof settings.businessSettings
        ];
    }

    public getInvestmentReturn(investment: number, year: string): number {
        const investmentReturnRate = this.getInvestmentReturnRate(year);
        const investmentLosses = this.isBancrupt
            ? this._getInvestmentLosses(year)
            : 1;

        const investmentReturn = this._calculateInvestmentReturn(
            investment,
            investmentReturnRate,
            investmentLosses
        );

        const investmentReturnRounded = Math.round(investmentReturn);
        return investmentReturnRounded;
    }

    public initiateBancrupcy(year: string): void {
        if (this.isBancrupt) {
            return;
        }
        const eventOccured = this._getEventOccurance(year);

        if (eventOccured) {
            this.isBancrupt = true;
            this.bancrupcyYear = year;
        }
    }

    public canGetInvestmentReturn(year: string): boolean {
        const canGetInvestmentReturn =
            !this.isBancrupt || year == this.bancrupcyYear;
        return canGetInvestmentReturn;
    }

    private _calculateInvestmentReturn(
        investment: number,
        investmentReturnRate: number,
        investmentLosses: number
    ): number {
        let investmentReturn = investment;
        const investmentMultiplier = this.isBancrupt
            ? 1 - investmentLosses
            : 1 + investmentReturnRate;
        investmentReturn *= investmentMultiplier;

        return investmentReturn;
    }

    public getInvestmentReturnRate(year: string): number {
        const investmentReturnRates = this._settings.investmentReturnRate;
        const investmentReturnRate = investmentReturnRates[year];
        return investmentReturnRate;
    }

    private _getEventOccurance(year: string): boolean {
        const eventProbabilities = this._settings.eventProbability;
        const eventProbability = eventProbabilities[year];

        const eventOccurance = getRandomTrueFalse(eventProbability);
        return eventOccurance;
    }

    private _getInvestmentLosses(year: string): number {
        const investmentLosses = this._settings.investmentLosses;
        const investmentLoss = investmentLosses[year];

        return investmentLoss;
    }
}
