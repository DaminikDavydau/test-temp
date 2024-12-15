import Excel from 'exceljs';
import { resolve } from 'path';
import { IPlayerReport } from '../../types/IPlayerReport';
import { sortPlayersByAssets } from '../../utils/reports';

const SHEETS_FILENAME = resolve(__dirname, './g6_dataexport.xlsx');
const SHEETS_FILENAME_EN = resolve(__dirname, './g6_dataexport_en.xlsx');

export async function createReportSheets(gameAdmin: string, reports: any[], english: boolean) {
    const book = new Excel.Workbook();

    const sheetsFilename = english ? SHEETS_FILENAME_EN : SHEETS_FILENAME;
    const mainSheet = !english ? 'visparigi dati' : 'general data';
    const playerSheet = !english ? 'speletaja dati' : 'player data';

    const sheets = book.xlsx.readFile(sheetsFilename).then(function () {
        const sheet = book.getWorksheet(mainSheet);
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
    const sheet = copyBaseSheet(baseSheet, report.name);
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

    sheet.getCell(1, 4).value = report.name;
    sheet.getCell(3, 4).value = date.toLocaleString();

    for (const yearData of report.yearlyData) {
        const barberData = yearData.barberData;

        const row = 10 + yearData.yearIndex;

        if (barberData) {
            sheet.getCell(row, 2).value = barberData.incomes.initialAssets;
            sheet.getCell(row, 3).value = barberData.barbershops.length;

            sheet.getCell(row, 4).value = getSum(
                barberData.incomes.barbershopIncome,
                'salonCosts'
            );
            sheet.getCell(row, 5).value = getSum(
                barberData.incomes.barbershopIncome,
                'equipmentCosts'
            );
            sheet.getCell(row, 6).value = getSum(
                barberData.incomes.barbershopIncome,
                'marketingCosts'
            );
            sheet.getCell(row, 7).value = getSum(
                barberData.incomes.barbershopIncome,
                'learningCosts'
            );

            sheet.getCell(row, 8).value = getSum(
                barberData.incomes.barbershopIncome,
                'labourCosts'
            );

            sheet.getCell(row, 9).value = barberData.incomes.bankPercentages;

            sheet.getCell(row, 10).value = getSum(
                barberData.incomes.barbershopIncome,
                'incomesFromClients'
            );

            sheet.getCell(row, 11).value = barberData.incomes.totalAssets;
            sheet.getCell(row, 12).value = yearData.place;
        }
    }
}

function getSum(incomes: Record<string, number>[], property: string) {
    return incomes.reduce((accumulator, obj) => {
        return accumulator + obj[property];
    }, 0);
}

function fillMainSheet(
    sheet: Excel.Worksheet,
    reports: IPlayerReport[],
    gameAdmin: string
) {
    const date = new Date();

    sheet.getCell(1, 3).value = gameAdmin;
    sheet.getCell(3, 3).value = date.toLocaleString();
    sheet.getCell(4, 3).value = reports.length;

    const sortedReports = sortPlayersByAssets(reports);
    for (const report of sortedReports) {
        const rowIndex = 9 + sortedReports.indexOf(report);
        const lastYearData = report.yearlyData[report.yearlyData.length - 1];

        if (lastYearData.barberData) {
            sheet.getCell(rowIndex, 2).value = report.name;
            sheet.getCell(rowIndex, 3).value = lastYearData.assets;
            sheet.getCell(rowIndex, 4).value = getSum(
                lastYearData.barberData.incomes.barbershopIncome,
                'salonCosts'
            );
        }
    }
}
