import { InvestmentInterface } from './investment';
import { IYearResult } from './yearResult';

export interface IIncomeReport {
    totalIncome: number,
    pigsExpenses: number,
    familyExpenses: number,
    bankExpenses: number,
    pigsIncomes: number,
}

export interface GameInterface {
    _id: string;
    code: string;
    admin: string;
    started: boolean;
    paused: boolean;
    type:
        | 'Bankrots'
        | 'Krīzes gads'
        | 'Lēnāk brauksi - tālāk tiksi'
        | 'Viesnīca'
        | 'Ražošana';
    year:
        | 'yearOne'
        | 'yearTwo'
        | 'yearThree'
        | 'yearFour'
        | 'yearFive'
        | 'yearSix'
        | 'yearSeven'
        | 'yearEight'
        | 'yearNine'
        | 'yearTen'
        | 'yearEleven'
        | 'yearTwelve'
        | 'yearThirteen'
        | 'yearFourteen'
        | 'yearFifteen'
        | 'yearSixteen'
        | 'yearSeventeen'
        | 'yearEighteen'
        | 'yearNineteen';
    players: string[];
    createdAt: string;
    updatedAt: string;
}

export interface GameStartProps {
    gameId: string;
}

export interface YearSwitchProps {
    gameId: string;
    yearResult: IYearResult;
}

export interface SendInvestmentProps {
    adminId: string;
    investment: InvestmentInterface;
}
