import { IIncomeReport } from './IIncomeReport';

export interface IYearResult {
    year: string;
    bancrupcies: Record<string, Record<string, any>>;
    investments: Record<string, Record<string, any>>;
    investmentReturns: Record<string, Record<string, Record<string, any>>>;
    assets: Record<string, number>;
    playerBancrupcies: Record<string, boolean>;
    pigsOnMarket: number;
    crisisYear: boolean;
    pigPrice: number;
    incomes: Record<string, IIncomeReport>;
    teams: string[][]
}
