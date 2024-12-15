import { IMachine } from '../../../engine/production/types/machine';
import {
    IPlayerReport,
    IYearReport,
} from '../../../engine/types/IPlayerReport';
import { PlayerInterface } from '../../player/interfaces';
import { gameClasses } from './gameClasses';

export function createPlayersRecords(
    playersFromDb: any[]
): Record<string, number> {
    const players: Record<string, number> = {};

    for (const playerFromDb of playersFromDb) {
        players[playerFromDb._id] = playerFromDb.assets;
    }

    return players;
}

export function createPlayersNamesRecords(
    playersFromDb: any[]
): Record<string, string> {
    const players: Record<string, string> = {};

    for (const playerFromDb of playersFromDb) {
        players[playerFromDb._id] = playerFromDb.name;
    }

    return players;
}

export function createBusinessesRecords(
    businessesFromDb: any[]
): Record<string, Record<string, any>> {
    const businesses: Record<string, Record<string, any>> = {};

    for (const businessFromDb of businessesFromDb) {
        businesses[businessFromDb.key] = {
            isBancrupt: businessFromDb.is_bancrupt,
            bancrupcyYear: businessFromDb.bancrupcy_year,
        };
    }

    return businesses;
}

export function createInvestmentsRecords(
    investmentsFromDb: any[]
): Record<string, Record<string, any>> {
    const investments: Record<string, Record<string, any>> = {};

    for (const investmentFromDb of investmentsFromDb) {
        const investmentValue = JSON.parse(investmentFromDb.value);
        investments[investmentFromDb.player_id] = investmentValue;
    }

    return investments;
}

export function createMachinesRecords(machinesFromDb: any[]): IMachine[] {
    const machines: IMachine[] = [];

    for (const machineFromDb of machinesFromDb) {
        machines.push({
            type: machineFromDb.type,
            number: machineFromDb.number,
            owner: machineFromDb.owner,
            timesUsed: machineFromDb.timesUsed,
            soldFor: machineFromDb.soldFor,
        });
    }

    return machines;
}

export function createPlayerReport(
    player: PlayerInterface,
    yearReportsFromDb: any[],
    gameType: string,
    allPlayers: Record<string, string>
): IPlayerReport {
    const yearlyData: IYearReport[] = [];

    for (const yearReportFromDb of yearReportsFromDb) {
        const report: IYearReport = JSON.parse(yearReportFromDb.value);
        yearlyData.push(report);
    }

    yearlyData.sort((a, b) => a.yearIndex - b.yearIndex);

    const playerReport: IPlayerReport = {
        playerKey: player._id,
        name: player.name,
        initialAssets: gameClasses[gameType].playerInitialAssets,
        yearlyData: yearlyData,
        allPlayers: allPlayers,
    };

    return playerReport;
}
