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
            driveData: null,
            barberData: null,
            hotelData: null,
            pigsData: null,
            productionData: null,
            investmentData: getInvestmentData(playerKey, yearResult),
            assets: yearResult.assets[playerKey],
            place: getPlayerPlace(playerKey, yearResult.assets),
            isBancrupt: yearResult.playerBancrupcies[playerKey],
        });
    }

    return playerReports;
}

function getInvestmentData(playerKey: string, yearResult: IYearResult) {
    const investmentData: IInvestmentData[] = [];

    for (const businessKey of Object.keys(
        yearResult.investmentReturns[playerKey]
    )) {
        investmentData.push({
            businessKey: businessKey,
            businessIndex: BUSINESSES_KEYS.indexOf(businessKey),
            returnRate: yearResult.bancrupcies[businessKey].returnRate,
            isBancrupt: yearResult.bancrupcies[businessKey].isBancrupt,
            investments: yearResult.investments[playerKey][businessKey],
            returns:
                yearResult.investmentReturns[playerKey][businessKey]
                    .returnedAssets,
            changes:
                yearResult.investmentReturns[playerKey][businessKey]
                    .returnedAssets -
                yearResult.investments[playerKey][businessKey],
        });
    }

    return investmentData;
}
