export interface IIncomeReport {
    totalIncome: number,
    pigsExpenses: number,
    familyExpenses: number,
    bankExpenses: number,
    pigsIncomes: number,
}

export interface IYearResult {
    year: string;
    bancrupcies: Record<string, Record<string, any>>;
    investments: Record<string, Record<string, any>>;
    investmentReturns: Record<string, Record<string, Record<string, any>>>;
    assets: Record<string, number>;
    playerBancrupcies: Record<string, boolean>;
    pigsOnMarket: number;
    crisisYear: boolean;
    incomes: Record<string, IIncomeReport>;
}