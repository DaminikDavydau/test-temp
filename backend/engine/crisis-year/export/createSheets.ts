import Excel from 'exceljs';
import { resolve } from 'path';
import { IPlayerReport } from '../../types/IPlayerReport';
import { sortPlayersByAssets } from '../../utils/reports';
import { YEARS_KEYS } from '../constants';

const SHEETS_FILENAME = resolve(__dirname, './g2_dataexport.xlsx');
const SHEETS_FILENAME_EN = resolve(__dirname, './g2_dataexport_en.xlsx');

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
    sheet.getCell(1, 3).value = report.name;
    sheet.getCell(15, 12).value = report.initialAssets;

    for (const yearData of report.yearlyData) {
        const pigsData = yearData.pigsData;
        const rowIndex = 7 + yearData.yearIndex;

        if (pigsData) {
            const yearIntialAssets =
                yearData.assets - pigsData.incomes.totalIncome;
            const totalExpenses =
                pigsData.incomes.familyExpenses + pigsData.incomes.pigsExpenses;

            sheet.getCell(rowIndex, 2).value = yearIntialAssets;
            sheet.getCell(rowIndex, 3).value = pigsData.pigsAmount;
            sheet.getCell(rowIndex, 4).value = totalExpenses;

            const percentagesCell = sheet.getCell(rowIndex, 5);
            if (yearIntialAssets + totalExpenses < 0) {
                percentagesCell.value = '25%';
            } else {
                percentagesCell.value = '7%';
            }

            sheet.getCell(rowIndex, 6).value = pigsData.incomes.bankExpenses;
            sheet.getCell(rowIndex, 7).value =
                yearData.assets - pigsData.incomes.pigsIncomes;
            sheet.getCell(rowIndex, 8).value = pigsData.pigsOnMarket;

            const crisisYearCell = sheet.getCell(rowIndex, 9);
            if (pigsData.crisisYear) {
                crisisYearCell.value = 'slikts';
            } else {
                crisisYearCell.value = 'labs';
            }

            sheet.getCell(rowIndex, 10).value = pigsData.pigPrice;
            sheet.getCell(rowIndex, 11).value = pigsData.incomes.pigsIncomes;
            sheet.getCell(rowIndex, 12).value = yearData.assets;
            sheet.getCell(rowIndex, 13).value = yearData.place;
        }
    }
}

function fillMainSheet(
    sheet: Excel.Worksheet,
    reports: IPlayerReport[],
    gameAdmin: string
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
        const rowIndex = 19 + yearData.yearIndex;

        sheet.getCell(rowIndex, 7).value = yearData.pigsData?.pigsOnMarket;
        sheet.getCell(rowIndex, 8).value = yearData.pigsData?.pigPrice;
    }

    const remainingYears = YEARS_KEYS.slice(
        (YEARS_KEYS.length - allYears.length) * -1
    );

    if (remainingYears.length != YEARS_KEYS.length) {
        for (const yearKey of remainingYears) {
            const rowIndex = 19 + YEARS_KEYS.indexOf(yearKey);

            sheet.getCell(rowIndex, 7).value = 0;
            sheet.getCell(rowIndex, 8).value = '-';
        }
    }

    const sortedReports = sortPlayersByAssets(reports);

    for (const report of sortedReports) {
        const rowIndex = 19 + sortedReports.indexOf(report);
        const lastYearData = report.yearlyData[report.yearlyData.length - 1];

        sheet.getCell(rowIndex, 1).value = report.name;
        sheet.getCell(rowIndex, 2).value = lastYearData.assets;
        sheet.getCell(rowIndex, 3).value = lastYearData.isBancrupt
            ? lastYearData.yearIndex + 1
            : '';
    }
}
