import Excel from 'exceljs';
import { resolve } from 'path';
import { IPlayerReport } from '../../types/IPlayerReport';
import { sortPlayersByAssets } from '../../utils/reports';

const SHEETS_FILENAME = resolve(__dirname, './g1_dataexport.xlsx');
const SHEETS_FILENAME_EN = resolve(__dirname, './g1_dataexport_en.xlsx');

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

function fillPlayerSheet(sheet: Excel.Worksheet, report: any) {
    sheet.getCell(2, 2).value = report.name;
    sheet.getCell(15, 12).value = report.initialAssets;

    for (const yearData of report.yearlyData) {
        const rowIndex = yearData.yearIndex;

        const investRow = 16 + 3 * rowIndex;
        const changeRow = 17 + 3 * rowIndex;
        const returnRow = 18 + 3 * rowIndex;

        const assetsCell = sheet.getCell(investRow, 12);
        const placeCell = sheet.getCell(investRow, 13);

        if (yearData.isBancrupt) {
            assetsCell.value = 'bankrotējis';
        } else {
            assetsCell.value = yearData.assets;
            placeCell.value = yearData.place;
        }

        for (const businessData of yearData.investmentData) {
            const columnIndex = businessData.businessIndex;
            const column = 3 + 2 * columnIndex;

            sheet.getCell(investRow, column).value = businessData.investments;
            sheet.getCell(changeRow, column).value = businessData.changes;

            const returnsCell = sheet.getCell(returnRow, column);
            if (businessData.isBancrupt) {
                returnsCell.value = 'bankrots';
            } else {
                returnsCell.value = businessData.returns;
            }
        }
    }
}

function fillMainSheet(
    sheet: Excel.Worksheet,
    reports: IPlayerReport[],
    gameAdmin: string
) {
    const date = new Date();

    sheet.getCell(3, 3).value = gameAdmin;
    sheet.getCell(4, 3).value = date.toLocaleString();
    sheet.getCell(5, 3).value = reports.length;

    const sortedReports = sortPlayersByAssets(reports);

    for (const report of sortedReports) {
        const placeIndex = sortedReports.indexOf(report);
        const rowIndex = 24 + placeIndex;
        const lastYearData = report.yearlyData[report.yearlyData.length - 1];

        sheet.getCell(rowIndex, 1).value = placeIndex + 1;
        sheet.getCell(rowIndex, 2).value = report.name;
        sheet.getCell(rowIndex, 3).value = lastYearData.assets;
        sheet.getCell(rowIndex, 4).value = lastYearData.isBancrupt
            ? lastYearData.yearIndex + 1
            : '';
    }

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

    for (const year of allYears) {
        const rowIndex = year.yearIndex + 15;

        for (const businessData of year.investmentData) {
            const columnIndex = 3 + businessData.businessIndex * 2;

            const businessCell = sheet.getCell(rowIndex, columnIndex);
            if (businessData.isBancrupt) {
                businessCell.value = 'bankrots';
            } else {
                businessCell.value = 'strādā';
            }
        }
    }
}
