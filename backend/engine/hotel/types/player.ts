import {
    IClientData as IClientData,
    IConstructionData,
} from '../../types/IPlayerReport';
import { PlayerBase } from '../../types/PlayerBase';
import { IPlayerReport, IYearReport } from '../../types/IPlayerReport';

import { getPlayerReport } from '../../utils/reports';
import {
    ALLOWED_CONSTRUCTIONS,
    CLEAR_SKY_NUMBERS,
    CLEAR_WATER_NUMBERS,
    CLIENT_AMOUNT,
    CLIENT_CHANGE,
    CLIENT_MULTIPLIER,
    NEGATIVE_ASSETS_PERCENTAGES,
    POOL_FINE,
    POSITIVE_ASSETS_PERCENTAGES,
} from '../constants';

export class Player extends PlayerBase {
    public playerKey: string;
    public price: number;
    public averagePrice: number;

    public constructions: IConstructionData;
    public newConstruction: string;
    public clientData: IClientData;

    public year: string;

    public weather: Record<string, boolean>;
    public clients: number;

    constructor(
        playerKey: string,
        assets: number,
        price: number,
        averagePrice: number,
        newConstruction: string,
        weather: Record<string, boolean>,
        yearlyData: IYearReport[],
        year: string
    ) {
        super(assets);

        this.playerKey = playerKey;
        this.price = price;
        this.averagePrice = averagePrice;

        this.constructions = this._getConstructions(
            newConstruction,
            yearlyData
        );
        this.newConstruction = newConstruction;
        this.year = year;

        this.weather = weather;

        this.clientData = {
            clientBase: 0,
            priceDifference: 0,
            restaurant: 0,
            conferenceHall: 0,
            tennisCourt: 0,
            swimmingPool: 0,
        };

        this.clients = this._getClientAmount();
    }

    public isBancrupt(): boolean {
        return false;
    }

    public changeAssets(assetChange: number) {
        this.assets += assetChange;
    }

    public getIncomes() {
        const income = this.price * this.clients;
        const poolFine =
            this.weather.clearWater || this.constructions.swimmingPool
                ? 0
                : POOL_FINE;

        this.assets += poolFine;
        const bankPercentages = Math.round(
            this._getBankPercentages(this.assets)
        );

        const incomes = {
            totalIncome: Math.round(income + poolFine + bankPercentages),
            incomeFromClients: Math.round(income),
            poolFine: Math.round(poolFine),
            bankPercentages: Math.round(bankPercentages),
        };

        this.assets += income + bankPercentages;

        return incomes;
    }

    private _getBankPercentages(assets: number) {
        if (assets > 0) {
            return assets * POSITIVE_ASSETS_PERCENTAGES;
        } else {
            return assets * NEGATIVE_ASSETS_PERCENTAGES;
        }
    }

    private _getClientAmount() {
        const clientBase = this._getClientBase();
        const clientsAdjustedByPrice = this._adjustClientsByPrice(clientBase);
        const clientsFromConstructions = this._getClientsFromConstructions(
            clientsAdjustedByPrice
        );

        const clients = clientsAdjustedByPrice + clientsFromConstructions;
        return clients;
    }

    private _getClientsFromConstructions(clients: number) {
        let clientsFromConstructions = 0;

        for (const [construction, isBuild] of Object.entries(
            this.constructions
        )) {
            if (!isBuild || construction == this.newConstruction) {
                continue;
            }

            let clientMultiply: number;

            if (construction == 'swimmingPool') {
                if (this.weather.clearWater) {
                    clientMultiply = CLIENT_MULTIPLIER.swimmingPoolClear;
                } else {
                    clientMultiply = CLIENT_MULTIPLIER.swimmingPool;
                }
            } else {
                clientMultiply =
                    CLIENT_MULTIPLIER[
                        construction as keyof typeof CLIENT_MULTIPLIER
                    ];
            }

            const additionalClients = clientMultiply * clients;
            this.clientData[construction as keyof typeof this.clientData] =
                additionalClients;

            clientsFromConstructions += additionalClients;
        }

        return Math.round(clientsFromConstructions);
    }

    private _adjustClientsByPrice(clientBase: number) {
        let priceDifference = Math.round(this.price - this.averagePrice);
        if (priceDifference < -5) {
            priceDifference = -5;
        }
        if (priceDifference > 5) {
            priceDifference = 5;
        }

        const priceKey = priceDifference.toString();
        const clientDifference =
            CLIENT_CHANGE[priceKey as keyof typeof CLIENT_CHANGE];
        let clientsAdjustedByPrice = clientBase + clientDifference;

        if (clientsAdjustedByPrice < 0) {
            clientsAdjustedByPrice = 0;
        }

        this.clientData.priceDifference = clientDifference;
        return clientsAdjustedByPrice;
    }

    private _getClientBase() {
        let clientBase = 0;

        if (this.weather.clearSky && this.weather.clearWater) {
            clientBase = CLIENT_AMOUNT.weatherGood;
        } else if (this.weather.clearSky) {
            clientBase = CLIENT_AMOUNT.skyGood;
        } else if (this.weather.clearWater) {
            clientBase = CLIENT_AMOUNT.waterGood;
        } else {
            clientBase = CLIENT_AMOUNT.weatherPoor;
        }

        this.clientData.clientBase = clientBase;
        return clientBase;
    }

    public static getWeather() {
        const eventNumber = Math.floor(Math.random() * (6 - 1)) + 1;

        const weather = {
            clearSky: false,
            clearWater: false,
        };

        if (CLEAR_SKY_NUMBERS.includes(eventNumber)) {
            weather.clearSky = true;
        }

        if (CLEAR_WATER_NUMBERS.includes(eventNumber)) {
            weather.clearWater = true;
        }

        return weather;
    }

    private _getConstructions(
        newConstruction: string,
        yearlyData: IYearReport[]
    ) {
        const lastYear = yearlyData[yearlyData.length - 1];

        if (!lastYear.hotelData) {
            throw Error('Cannot retrieve hotel data');
        }

        const existingConstructions = lastYear.hotelData.constructions;

        if (ALLOWED_CONSTRUCTIONS.includes(newConstruction)) {
            const constructions = { ...existingConstructions };
            constructions[
                newConstruction as keyof typeof existingConstructions
            ] = true;

            return constructions;
        } else if (
            newConstruction == '' ||
            typeof newConstruction == 'undefined'
        ) {
            this.newConstruction = '';
            return existingConstructions;
        }

        throw Error('Invalid construction');
    }

    public static getPlayerYearlyData(
        playerKey: string,
        playerReports: IPlayerReport[]
    ) {
        const playerReport = getPlayerReport(playerKey, playerReports);

        let yearlyData: IYearReport[] = [Player._getYearZeroData(playerKey)];

        if (playerReport) {
            if (playerReport.yearlyData.length != 0) {
                yearlyData = playerReport.yearlyData;
            }
        }

        return yearlyData;
    }

    private static _getYearZeroData(playerKey: string) {
        return {
            playerKey: playerKey,
            yearIndex: 0,
            yearKey: 'yearZero',
            assets: NaN,
            isBancrupt: false,
            investmentData: [],
            pigsData: null,
            driveData: null,
            productionData: null,
            barberData: null,
            hotelData: {
                incomes: {},
                price: 0,
                newConstruction: '',
                weather: {
                    clearSky: false,
                    clearWater: false,
                },
                constructions: {
                    conferenceHall: false,
                    restaurant: false,
                    tennisCourt: false,
                    swimmingPool: false,
                },
                averagePrice: 0,
                clients: 0,
                clientData: {} as IClientData,
            },
            place: NaN,
        } as IYearReport;
    }
}
