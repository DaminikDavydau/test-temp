import {
    IDriveData,
    IHotelData,
    IProductionData,
    IYearReport,
} from '../../types/IPlayerReport';
import { IYearResult } from '../../types/IYearResult';

import { YEARS_KEYS } from '../constants';

export function getPlayerReports(yearResult: IYearResult) {
    const playerReports: IYearReport[] = [];

    let yearIndex: number;
    if (!yearResult.year) {
        yearIndex = YEARS_KEYS.length - 1;
    } else {
        yearIndex = YEARS_KEYS.indexOf(yearResult.year) - 1;
    }

    for (const playerKey of Object.keys(yearResult.investmentReturns)) {
        playerReports.push({
            playerKey: playerKey,
            yearIndex: yearIndex,
            yearKey: YEARS_KEYS[yearIndex],
            barberData: null,
            driveData: null,
            pigsData: null,
            hotelData: null,
            productionData: getProductionData(playerKey, yearResult),
            investmentData: [],
            assets: yearResult.assets[playerKey],
            place: NaN,
            isBancrupt: false,
        });
    }

    return playerReports;
}

export function getProductionData(playerKey: string, yearResult: IYearResult) {
    const productionData = {
        incomes: yearResult.investmentReturns[playerKey],
        machineData: yearResult.bancrupcies,
        teams: yearResult.teams,
    } as IProductionData;

    return productionData;
}
