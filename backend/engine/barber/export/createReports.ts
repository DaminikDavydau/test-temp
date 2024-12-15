import { IBarberData, IYearReport } from '../../types/IPlayerReport';
import { IYearResult } from '../../types/IYearResult';
import { getPlayerPlace } from '../../utils/reports';

import { YEARS_KEYS } from '../constants';

export function getPlayerReports(yearResult: IYearResult) {
    const playerReports: IYearReport[] = [];

    let yearIndex: number;
    if (!yearResult.year) {
        yearIndex = YEARS_KEYS.length - 1;
    } else {
        yearIndex = YEARS_KEYS.indexOf(yearResult.year) - 1;
    }

    for (const playerKey of Object.keys(yearResult.assets)) {
        playerReports.push({
            playerKey: playerKey,
            yearIndex: yearIndex,
            yearKey: YEARS_KEYS[yearIndex],
            barberData: getBarberData(playerKey, yearResult),
            driveData: null,
            pigsData: null,
            productionData: null,
            hotelData: null,
            investmentData: [],
            assets: yearResult.assets[playerKey],
            place: getPlayerPlace(playerKey, yearResult.assets),
            isBancrupt: false,
        });
    }

    return playerReports;
}

export function getBarberData(playerKey: string, yearResult: IYearResult) {
    const barberData = {
        incomes: yearResult.investmentReturns[playerKey].incomes,
        player: yearResult.investmentReturns[playerKey].player,
        barbershops:
            yearResult.investmentReturns[playerKey].barbershops,
    } as IBarberData;

    return barberData;
}
