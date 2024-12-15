import { IDriveData, IYearReport } from '../../types/IPlayerReport';
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

    for (const playerKey of Object.keys(yearResult.assets)) {
        playerReports.push({
            playerKey: playerKey,
            yearIndex: yearIndex,
            yearKey: YEARS_KEYS[yearIndex],
            barberData: null,
            driveData: getDriveData(playerKey, yearResult),
            pigsData: null,
            hotelData: null,
            productionData: null,
            investmentData: [],
            assets: yearResult.assets[playerKey],
            place: NaN,
            isBancrupt: false,
        });
    }

    return playerReports;
}

export function getDriveData(playerKey: string, yearResult: IYearResult) {
    const driveData = {
        speed: yearResult.investments[playerKey].speed,
        distance: yearResult.investmentReturns[playerKey].driveData.distance,
        isCaught: yearResult.investmentReturns[playerKey].playerData.isCaught,
        hasSlept: yearResult.investmentReturns[playerKey].playerData.hasSlept,
        speedingFine:
            yearResult.investmentReturns[playerKey].driveData.speedingFine,
        sleepingFine:
            yearResult.investmentReturns[playerKey].driveData.sleepingFine,
        isEarlyReward:
            yearResult.investmentReturns[playerKey].driveData.isEarlyReward,
        finishedReward:
            yearResult.investmentReturns[playerKey].driveData.finishedReward,
        finishedFirstReward:
            yearResult.investmentReturns[playerKey].driveData
                .finishedFirstReward,
        catches: yearResult.bancrupcies,
    } as IDriveData;

    return driveData;
}
