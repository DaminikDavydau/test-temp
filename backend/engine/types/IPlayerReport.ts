import { IBarbershop } from '../barber/types/barber';
import { IPlayer } from '../barber/types/player';
import { IIncomeReport } from './IIncomeReport';

export interface IYearReport {
    playerKey: string;
    yearIndex: number;
    yearKey: string;
    pigsData: IPigsData | null;
    investmentData: IInvestmentData[];
    driveData: IDriveData | null;
    hotelData: IHotelData | null;
    productionData: IProductionData | null;
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
    allPlayers: Record<string, string>;
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
    incomes: Record<string, number>;
    price: number;
    newConstruction: string;
    constructions: IConstructionData;
    averagePrice: number;
    weather: Record<string, boolean>;
    clients: number;
    clientData: IClientData;
}

export interface IConstructionData {
    restaurant: boolean;
    conferenceHall: boolean;
    tennisCourt: boolean;
    swimmingPool: boolean;
}

export interface IClientData {
    clientBase: number;
    priceDifference: number;
    restaurant: number;
    conferenceHall: number;
    tennisCourt: number;
    swimmingPool: number;
}

export interface IProductionData {
    incomes: Record<string, Record<string, any>>;
    machineData: Record<string, Record<string, any>>;
    teams: string[][];
}

export interface IBarberData {
    incomes: Record<string, any>;
    player: IPlayer;
    barbershops: IBarbershop[];
}
