import { IIncomeReport } from './IIncomeReport';
import { GameInterface } from './game';
import { IBarberData } from './barber';

export interface IYearReport {
    playerKey: string;
    yearIndex: number;
    yearKey: GameInterface['year'];
    pigsData: IPigsData | null;
    investmentData: IInvestmentData[];
    driveData: IDriveData | null;
    hotelData: IHotelData | null;
    barberData: IBarberData | null;
    assets: number;
    place: number;
    isBancrupt: boolean;
}

export interface IPlayerReport {
    playerKey: string;
    name: string;
    initialAssets: number;
    yearlyData: IYearReport[];
}

export interface IInvestmentData {
    businessIndex: number;
    businessKey: string;
    returnRate: number;
    isBancrupt: boolean;
    investments: number;
    returns: number;
    changes: number;
}

export interface IPigsData {
    incomes: IIncomeReport;
    pigsOnMarket: number;
    pigsAmount: number;
    pigPrice: number;
    crisisYear: boolean;
}

export interface IDriveData {
    speed: number;
    distance: number;
    speedingFine: number;
    sleepingFine: number;
    isCaught: boolean;
    hasSlept: boolean;
    isEarlyReward: number;
    finishedReward: number;
    finishedFirstReward: number;
    catches: Record<string, Record<string, any>>;
}

export interface IHotelData {
    price: number;
    constructions: IConstructionData;
    averagePrice: number;
    clients: number;
}

export interface IConstructionData {
    restaurant: boolean;
    conferenceHall: boolean;
    tennisCourt: boolean;
    swimmingPool: boolean;
}
