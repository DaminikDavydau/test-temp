import Excel from 'exceljs';
import { resolve } from 'path';
import { IPlayerReport } from '../../types/IPlayerReport';
import { sortPlayersByLength } from '../../utils/reports';
import { CATCH_PROBABILITY, DEFAULT_SPEED } from '../constants';

const SHEETS_FILENAME = resolve(__dirname, './g3_dataexport.xlsx');
const SHEETS_FILENAME_EN = resolve(__dirname, './g3_dataexport_en.xlsx');

export async function createReportSheets(gameAdmin: string, reports: any[], english: boolean) {
    const book = new Excel.Workbook();

    const sheetsFilename = english ? SHEETS_FILENAME_EN : SHEETS_FILENAME;
    const mainSheet = !english ? 'visparigi dati' : 'general data';
    const playerSheet = !english ? 'speletaja dati' : 'player data';

    const sheets = book.xlsx.readFile(sheetsFilename).then(function () {
        const sheet = book.getWorksheet(mainSheet);
        
        for (const report of reports) {
            const baseSheet = book.getWorksheet(playerSheet);
            createNewSheet(baseSheet, report, english);
        }

        fillMainSheet(sheet, reports, gameAdmin, english);

        book.removeWorksheet(playerSheet);
        return book;
    });

    return await sheets;
}

function createNewSheet(baseSheet: Excel.Worksheet, report: any, english: boolean) {
    const sheet = copyBaseSheet(baseSheet, report.name);
    fillPlayerSheet(sheet, report, english);
}

function copyBaseSheet(baseSheet: Excel.Worksheet, sheetName: string) {
    const newSheet = baseSheet.workbook.addWorksheet('NEW SHEET');

    newSheet.model = Object.assign(baseSheet.model, {
        mergeCells: (baseSheet.model as any).merges,
    });
    newSheet.name = sheetName;

    return newSheet;
}

function fillPlayerSheet(sheet: Excel.Worksheet, report: IPlayerReport, english: boolean) {
    const date = new Date();

    sheet.getCell(1, 3).value = report.name;
    sheet.getCell(3, 3).value = date.toLocaleString();

    for (const yearData of report.yearlyData) {
        const driveData = yearData.driveData;
        const rowIndex = 20 + yearData.yearIndex;

        if (driveData) {
            sheet.getCell(rowIndex, 2).value = driveData.speed;

            const speedAboveLimit = driveData.speed - DEFAULT_SPEED;
            if (speedAboveLimit >= 0) {
                sheet.getCell(rowIndex, 3).value = speedAboveLimit;
            }

            sheet.getCell(rowIndex, 4).value = driveData.distance;

            let hadToSleep = !english ? 'JĀ' : 'YES';
            if (driveData.hasSlept) {
                hadToSleep = !english ? 'NĒ' : 'NO';
            }
            sheet.getCell(rowIndex, 6).value = hadToSleep;

            let hasSlept = !english ? 'NĒ' : 'NO';
            if (driveData.speed == 0) {
                hasSlept = !english ? 'JĀ' : 'NO';
            }
            sheet.getCell(rowIndex, 7).value = hasSlept;

            const speedKey = driveData.speed.toString();
            const catchProbability =
                CATCH_PROBABILITY[speedKey as keyof typeof CATCH_PROBABILITY];

            sheet.getCell(rowIndex, 9).value = catchProbability;

            let isCaught = !english ? 'NĒ' : 'NO';
            if (driveData.isCaught) {
                isCaught = !english ? 'JĀ' : 'YES';
            }
            sheet.getCell(rowIndex, 10).value = isCaught;

            if (driveData.speedingFine < 0) {
                sheet.getCell(rowIndex, 11).value = driveData.speedingFine * -1;
            }

            if (driveData.sleepingFine < 0) {
                sheet.getCell(rowIndex, 12).value = driveData.sleepingFine * -1;
            }

            if (driveData.finishedReward > 0) {
                sheet.getCell(rowIndex, 14).value = driveData.finishedReward;
            }

            if (driveData.finishedReward > 0) {
                sheet.getCell(rowIndex, 15).value = driveData.isEarlyReward;
            }

            if (driveData.finishedFirstReward > 0) {
                sheet.getCell(rowIndex, 16).value =
                    driveData.finishedFirstReward;
            }
        }
    }
}

function fillMainSheet(
    sheet: Excel.Worksheet,
    reports: IPlayerReport[],
    gameAdmin: string,
    english: boolean
) {
    const maxReportLength = Math.max.apply(
        Math,
        reports.map(function (x) {
            return x.yearlyData.length;
        })
    );
    const allYears = reports.find(
        (x) => x.yearlyData.length == maxReportLength
    )?.yearlyData;
    if (!allYears) {
        throw Error('Cannot create report yet.');
    }

    const date = new Date();
    sheet.getCell(2, 3).value = gameAdmin;
    sheet.getCell(3, 3).value = date.toLocaleString();
    sheet.getCell(4, 3).value = reports.length;

    for (const yearData of allYears) {
        const rowIndex = 22 + yearData.yearIndex;

        for (let i = 12; i <= 19; i++) {
            const speedIndex = ((i - 12) * 10 + 60).toString();

            let isCaught = '';
            if (yearData.driveData?.catches[speedIndex].isCaught) {
                isCaught = !english ? 'JĀ' : 'YES';
            }
            sheet.getCell(rowIndex, i).value = isCaught;
        }
    }

    const sortedReports = sortPlayersByLength(reports);
    for (const report of sortedReports) {
        const rowIndex = 22 + sortedReports.indexOf(report);

        const lastYearData = report.yearlyData[report.yearlyData.length - 1];
        if (!lastYearData.driveData) {
            throw 'Cannot retrieve drive data';
        }

        const playerPlace = sortedReports.indexOf(report) + 1;

        sheet.getCell(rowIndex, 1).value = report.name;
        sheet.getCell(rowIndex, 2).value = playerPlace;

        const playerSheet = sheet.workbook.getWorksheet(report.name);
        playerSheet.getCell(37, 3).value = playerPlace;

        sheet.getCell(rowIndex, 3).value = lastYearData.yearIndex + 1;
        sheet.getCell(rowIndex, 4).value = lastYearData.assets;

        const speedingFineSum = report.yearlyData.reduce((accumulator, obj) => {
            if (!obj.driveData) {
                throw Error('Cannot retrieve drive data');
            }
            return accumulator + obj.driveData.speedingFine;
        }, 0);
        sheet.getCell(rowIndex, 5).value = speedingFineSum;

        const sleepingFineSum = report.yearlyData.reduce((accumulator, obj) => {
            if (!obj.driveData) {
                throw Error('Cannot retrieve drive data');
            }
            return accumulator + obj.driveData.sleepingFine;
        }, 0);
        sheet.getCell(rowIndex, 6).value = sleepingFineSum;

        sheet.getCell(rowIndex, 7).value =
            lastYearData.driveData?.finishedReward;
        sheet.getCell(rowIndex, 8).value =
            lastYearData.driveData?.isEarlyReward;
        sheet.getCell(rowIndex, 9).value =
            lastYearData.driveData?.finishedFirstReward;
    }
}
