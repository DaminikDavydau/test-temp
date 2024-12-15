import { IDriveData, IHotelData, IYearReport } from '../../types/IPlayerReport';
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
            barberData: null,
            driveData: null,
            pigsData: null,
            productionData: null,
            hotelData: getHotelData(playerKey, yearResult),
            investmentData: [],
            assets: yearResult.assets[playerKey],
            place: getPlayerPlace(playerKey, yearResult.assets),
            isBancrupt: false,
        });
    }

    return playerReports;
}

export function getHotelData(playerKey: string, yearResult: IYearResult) {
    const hotelData = {
        incomes: yearResult.investmentReturns[playerKey].hotelData.incomes,
        weather: yearResult.investmentReturns[playerKey].hotelData.weather,
        price: yearResult.investments[playerKey].price,
        newConstruction: yearResult.investments[playerKey].constructions,
        constructions:
            yearResult.investmentReturns[playerKey].hotelData.constructions,
        averagePrice:
            yearResult.investmentReturns[playerKey].hotelData.averagePrice,
        clients: yearResult.investmentReturns[playerKey].hotelData.clients,
        clientData: yearResult.investmentReturns[playerKey].clientData,
    } as IHotelData;

    return hotelData;
}
