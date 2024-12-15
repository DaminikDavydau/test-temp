import Excel from 'exceljs';
import { resolve } from 'path';
import { IConstructionData, IPlayerReport } from '../../types/IPlayerReport';
import { sortPlayersByAssets } from '../../utils/reports';
import { CONSTRUCTION_PRICES } from '../constants';

const SHEETS_FILENAME = resolve(__dirname, './g5_dataexport.xlsx');
const SHEETS_FILENAME_EN = resolve(__dirname, './g5_dataexport_en.xlsx');

export async function createReportSheets(gameAdmin: string, reports: any[], english: boolean) {
    const book = new Excel.Workbook();

    const sheetsFilename = english ? SHEETS_FILENAME_EN : SHEETS_FILENAME;
    const mainSheet = !english ? 'visparigi dati' : 'general data';
    const playerSheet = !english ? 'speletaja dati' : 'player data';
    
    const sheets = book.xlsx.readFile(sheetsFilename).then(function () {
        const sheet = book.getWorksheet(mainSheet);
        fillMainSheet(sheet, reports, gameAdmin, english);

        for (const report of reports) {
            const baseSheet = book.getWorksheet(playerSheet);
            createNewSheet(baseSheet, report, english);
        }

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
        const hotelData = yearData.hotelData;

        const rowIndexTableOne = 21 + yearData.yearIndex;
        const rowIndexTableTwo = 35 + yearData.yearIndex;

        if (hotelData) {
            sheet.getCell(rowIndexTableOne, 2).value = hotelData.price;
            sheet.getCell(rowIndexTableOne, 3).value = hotelData.averagePrice;
            sheet.getCell(rowIndexTableOne, 4).value =
                hotelData.clientData.clientBase;

            let weather = !english ? 'slikti' : 'bad';
            if (hotelData.weather.clearSky) {
                weather = !english ? 'labi': 'good';
            }
            sheet.getCell(rowIndexTableOne, 5).value = weather;

            let water = !english ? 'piesarņots': 'dirty';
            if (hotelData.weather.clearWater) {
                water = !english ? 'tīrs': 'clean';
            }

            sheet.getCell(rowIndexTableOne, 6).value = water;
            sheet.getCell(rowIndexTableOne, 7).value =
                hotelData.clientData.priceDifference;
            sheet.getCell(rowIndexTableOne, 8).value =
                hotelData.clientData.restaurant;
            sheet.getCell(rowIndexTableOne, 9).value =
                hotelData.clientData.conferenceHall;
            sheet.getCell(rowIndexTableOne, 10).value =
                hotelData.clientData.tennisCourt;
            sheet.getCell(rowIndexTableOne, 11).value =
                hotelData.clientData.swimmingPool;

            const clientData = hotelData.clientData;
            const additionalClients =
                clientData.restaurant +
                clientData.conferenceHall +
                clientData.tennisCourt +
                clientData.swimmingPool;

            sheet.getCell(rowIndexTableOne, 12).value = additionalClients;
            sheet.getCell(rowIndexTableOne, 13).value = hotelData.clients;

            let initialAssets: number;
            if (yearData.yearIndex == 0) {
                initialAssets = report.initialAssets;
            } else {
                initialAssets =
                    report.yearlyData[yearData.yearIndex - 1].assets;
            }

            sheet.getCell(rowIndexTableTwo, 2).value = initialAssets;

            const buildingPrices = setBuldingPrice(
                hotelData.newConstruction,
                hotelData.constructions
            );

            sheet.getCell(rowIndexTableTwo, 3).value =
                buildingPrices.restaurant;
            sheet.getCell(rowIndexTableTwo, 4).value =
                buildingPrices.conferenceHall;
            sheet.getCell(rowIndexTableTwo, 5).value =
                buildingPrices.tennisCourt;
            sheet.getCell(rowIndexTableTwo, 6).value =
                buildingPrices.swimmingPool;

            sheet.getCell(rowIndexTableTwo, 7).value =
                hotelData.incomes.poolFine;

            console.log(buildingPrices.totalExpenses)

            sheet.getCell(rowIndexTableTwo, 8).value =
                +buildingPrices.totalExpenses + hotelData.incomes.poolFine;

            sheet.getCell(rowIndexTableTwo, 9).value =
                hotelData.incomes.bankPercentages;
            sheet.getCell(rowIndexTableTwo, 10).value =
                hotelData.incomes.incomeFromClients;
            sheet.getCell(rowIndexTableTwo, 11).value = yearData.assets;
            sheet.getCell(rowIndexTableTwo, 12).value = yearData.place;
        }
    }
}

function setBuldingPrice(
    newConstruction: string,
    constructions: IConstructionData
) {
    const prices: Record<string, string> = {};

    let totalConstructionExpenses = 0;

    for (const constructionKey of Object.keys(constructions)) {
        const key = constructionKey as keyof typeof CONSTRUCTION_PRICES;

        let price = '';
        if (constructionKey == newConstruction) {
            price = CONSTRUCTION_PRICES[key].toString();
        } else if (constructions[key]) {
            price = '+';
        }

        if (!isNaN(+price)) {
            totalConstructionExpenses += +price;
        }

        prices[constructionKey] = price;
    }

    prices['totalExpenses'] = totalConstructionExpenses.toString();
    return prices;
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
        const rowIndex = 20 + yearData.yearIndex;

        let weather = !english ? 'slikti' : 'bad';
        if (yearData.hotelData?.weather.clearSky) {
            weather = !english ? 'labi' : 'good';
        }
        sheet.getCell(rowIndex, 10).value = weather;

        let water = !english ? 'piesarņots' : 'dirty';
        if (yearData.hotelData?.weather.clearWater) {
            water = !english ? 'tīrs' : 'clean';
        }
        sheet.getCell(rowIndex, 11).value = water;
    }

    const sortedReports = sortPlayersByAssets(reports);
    for (const report of sortedReports) {
        const rowIndex = 20 + sortedReports.indexOf(report);
        const lastYearData = report.yearlyData[report.yearlyData.length - 1];

        sheet.getCell(rowIndex, 1).value = sortedReports.indexOf(report) + 1;
        sheet.getCell(rowIndex, 2).value = report.name;
        sheet.getCell(rowIndex, 3).value = lastYearData.assets;
    }
}
