import internal from 'stream';
import { IInvestmentData, IYearReport } from '../../types/IPlayerReport';
import { IYearResult } from '../../types/IYearResult';
import { getPlayerPlace } from '../../utils/reports';
import { BUSINESSES_KEYS, YEARS_KEYS } from '../constants';

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
            hotelData: null,
            driveData: null,
            barberData: null,
            productionData: null,
            pigsData: getPigsData(playerKey, yearResult),
            investmentData: [],
            assets: yearResult.assets[playerKey],
            place: getPlayerPlace(playerKey, yearResult.assets),
            isBancrupt: yearResult.playerBancrupcies[playerKey],
        });
    }

    return playerReports;
}

function getPigsData(playerKey: string, yearResult: IYearResult) {
    const pigsData = {
        incomes: yearResult.incomes[playerKey],
        pigsAmount: yearResult.investments[playerKey]['pigs'],
        pigsOnMarket: yearResult.pigsOnMarket,
        pigPrice: yearResult.pigPrice,
        crisisYear: yearResult.crisisYear,
    };
    return pigsData;
}
