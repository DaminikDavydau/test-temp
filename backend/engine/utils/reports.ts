import { PRODUCTION_YEARS, YEARS_KEYS } from '../production/constants';
import { IPlayerReport } from '../types/IPlayerReport';

export function getPlayerReport(
    playerKey: string,
    reports: IPlayerReport[]
): IPlayerReport | undefined {
    const report = reports.find((x) => x.playerKey == playerKey);
    return report;
}

export function getPlayerPlace(
    playerKey: string,
    assetsRecords: Record<string, number>
) {
    const assetsArray = Object.entries(assetsRecords).map((pair) => {
        return {
            playerKey: pair[0],
            assets: pair[1],
        };
    });

    assetsArray.sort((a, b) => b.assets - a.assets);
    const playerPlace =
        assetsArray.findIndex((x) => x.playerKey == playerKey) + 1;

    return playerPlace;
}

export function sortPlayersByAssets(reports: IPlayerReport[]) {
    const sorted = reports.sort((a, b) => {
        const lastYearA = a.yearlyData[a.yearlyData.length - 1];
        const lastYearB = b.yearlyData[b.yearlyData.length - 1];

        const bancrupcyYearA = lastYearA.isBancrupt ? lastYearA.yearKey : null;
        const bancrupcyYearB = lastYearB.isBancrupt ? lastYearA.yearKey : null;

        return (
            lastYearB.assets - lastYearA.assets ||
            sortAccendingNullFirst(bancrupcyYearA, bancrupcyYearB)
        );
    });

    return sorted;
}

export function sortTeamsByAssets(reports: IPlayerReport[]) {
    reports = reports.filter((x) => typeof x.yearlyData[0] !== 'undefined');

    const sorted = reports.sort((a, b) => {
        const incomesA = a.yearlyData[0].productionData?.incomes;
        if (!incomesA) {
            throw Error('No production data');
        }
        const incomesB = b.yearlyData[0].productionData?.incomes;
        if (!incomesB) {
            throw Error('No production data');
        }

        const reportA: Record<string, any> | undefined =
            getLastYearIncomes(incomesA);
        if (!reportA) {
            throw Error('No production data');
        }
        const reportB: Record<string, any> | undefined =
            getLastYearIncomes(incomesB);
        if (!reportB) {
            throw Error('No production data');
        }

        const teamAssetsA = Object.values(reportA).reduce(
            (accumulator, obj) => {
                return accumulator + obj.totalAssets;
            },
            0
        );
        const teamAssetsB = Object.values(reportB).reduce(
            (accumulator, obj) => {
                return accumulator + obj.totalAssets;
            },
            0
        );

        return teamAssetsB - teamAssetsA;
    });

    return sorted;
}

export function getLastYearIncomes(
    incomes: Record<string, Record<string, any>>
) {
    let productionYears = PRODUCTION_YEARS.slice().reverse();

    for (const yearKey of productionYears) {
        const lastYearIncome = incomes[yearKey];

        if (lastYearIncome) {
            return lastYearIncome;
        }
    }
}

export function sortPlayersByLength(reports: IPlayerReport[]) {
    const sorted = reports.sort((a, b) => {
        const aLength = a.yearlyData.length;
        const bLength = b.yearlyData.length;

        return aLength - bLength;
    });

    return sorted;
}

export function sortAccendingNullFirst(a: any, b: any) {
    if (a === b) {
        return 0;
    } else if (a === null) {
        return -1;
    } else if (b === null) {
        return 1;
    } else {
        return a - b;
    }
}
