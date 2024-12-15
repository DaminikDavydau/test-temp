import Excel from 'exceljs';
import { resolve } from 'path';
import { IPlayerReport } from '../../types/IPlayerReport';
import {
    getLastYearIncomes,
    sortTeamsByAssets,
} from '../../utils/reports';

const SHEETS_FILENAME = resolve(__dirname, './g4_dataexport.xlsx');
const SHEETS_FILENAME_EN = resolve(__dirname, './g4_dataexport_en.xlsx');

export async function createReportSheets(gameAdmin: string, reports: any[], english: boolean) {
    const book = new Excel.Workbook();

    const sheetsFilename = english ? SHEETS_FILENAME_EN : SHEETS_FILENAME;
    const mainSheet = !english ? 'visparigi dati' : 'general data';
    const playerSheet = !english ? 'komandas dati' : 'player data';

    const sheets = book.xlsx.readFile(sheetsFilename).then(function () {
        const sheet = book.getWorksheet(mainSheet);

        reports = reports.filter((x) => typeof x.yearlyData[0] !== 'undefined');

        fillMainSheet(sheet, reports, gameAdmin);

        for (const report of reports) {
            const baseSheet = book.getWorksheet(playerSheet);
            createNewSheet(baseSheet, report);
        }

        book.removeWorksheet(playerSheet);
        return book;
    });

    return await sheets;
}

function createNewSheet(baseSheet: Excel.Worksheet, report: any) {
    const sheet = copyBaseSheet(baseSheet, `${report.name} komanda`);
    fillPlayerSheet(sheet, report);
}

function copyBaseSheet(baseSheet: Excel.Worksheet, sheetName: string) {
    const newSheet = baseSheet.workbook.addWorksheet('NEW SHEET');

    newSheet.model = Object.assign(baseSheet.model, {
        mergeCells: (baseSheet.model as any).merges,
    });
    newSheet.name = sheetName;

    return newSheet;
}

function fillPlayerSheet(sheet: Excel.Worksheet, report: IPlayerReport) {
    const date = new Date();

    sheet.getCell(1, 3).value = `${report.name} komanda`;
    sheet.getCell(3, 3).value = date.toLocaleString();

    for (const data of report.yearlyData) {
        const productionData = data.productionData;

        if (productionData) {
            const team = productionData.teams.find((x) =>
                x.includes(data.playerKey)
            );
            if (!team) {
                throw Error('Team is not found');
            }
            for (const [index, player] of Object.entries(team)) {
                const column: number = +index * 8 + 2;

                sheet.getCell(22, column).value = report.allPlayers[player];

                const machine = Object.values(productionData.machineData).find(
                    (x) => x.owner == player
                );
                if (machine) {
                    sheet.getCell(23, column).value = machine.number;
                    sheet.getCell(24, column).value = machine.soldFor;
                }
            }

            let yearIndex = 0;
            for (const [yearKey, yearData] of Object.entries(
                productionData.incomes
            )) {
                const rowIndex = 27 + yearIndex;

                for (const [index, player] of Object.entries(team)) {
                    const playerData = yearData[player];
                    const initialColumn = +index * 7 + 2;

                    sheet.getCell(rowIndex, initialColumn + 0).value =
                        playerData.initialAssets;

                    let percentages = '10%';
                    if (playerData.initialAssets < 0) {
                        percentages = '-20%';
                    }
                    sheet.getCell(rowIndex, initialColumn + 1).value =
                        percentages;

                    sheet.getCell(rowIndex, initialColumn + 2).value =
                        playerData.bankPercentages;

                    sheet.getCell(rowIndex, initialColumn + 3).value =
                        playerData.incomesFromMachine;

                    sheet.getCell(rowIndex, initialColumn + 4).value =
                        playerData.uneployment;

                    sheet.getCell(rowIndex, initialColumn + 5).value =
                        playerData.totalAssets;
                }

                yearIndex += 1;
            }
        } else {
            throw Error('No production report found');
        }

        break;
    }
}

function fillMainSheet(
    sheet: Excel.Worksheet,
    reports: IPlayerReport[],
    gameAdmin: string
) {
    const date = new Date();
    sheet.getCell(1, 3).value = gameAdmin;
    sheet.getCell(3, 3).value = date.toLocaleString();
    sheet.getCell(4, 3).value = reports.length * 3;

    const players = [];

    const sortedReports = sortTeamsByAssets(reports);
    for (const report of sortedReports) {
        const rowIndex = 24 + sortedReports.indexOf(report);

        const productionData = report.yearlyData[0].productionData;
        if (!productionData) {
            throw Error('No production data.');
        }

        const team = productionData.teams.find((x) =>
            x.includes(report.playerKey.toString())
        );
        if (!team) {
            throw Error('No team.');
        }

        sheet.getCell(rowIndex, 2).value = `${report.name} komanda`;

        const lastYearIncomes = getLastYearIncomes(productionData.incomes);

        if (!lastYearIncomes) {
            throw Error('No production data.');
        }
        const teamAssets = Object.values(lastYearIncomes).reduce(
            (accumulator, obj) => {
                return accumulator + obj.totalAssets;
            },
            0
        );
        sheet.getCell(rowIndex, 3).value = teamAssets;

        sheet.getCell(rowIndex, 4).value = report.allPlayers[team[0]];
        sheet.getCell(rowIndex, 5).value = report.allPlayers[team[1]];
        sheet.getCell(rowIndex, 6).value = report.allPlayers[team[2]];

        for (const player of team) {
            players.push({
                playerKey: player,
                name: report.allPlayers[player],
                assets: lastYearIncomes[player].totalAssets,
                team: `${report.name} komanda`,
            });
        }
    }

    const sortedPlayers = players.sort((a, b) => {
        return b.assets - a.assets;
    });

    for (const player of sortedPlayers) {
        const rowIndex = 40 + sortedPlayers.indexOf(player);

        sheet.getCell(rowIndex, 2).value = player.name;
        sheet.getCell(rowIndex, 3).value = player.assets;
        sheet.getCell(rowIndex, 4).value = player.team;
    }
}
