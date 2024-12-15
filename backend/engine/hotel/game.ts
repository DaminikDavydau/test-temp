import { GameBase } from '../types/GameBase';
import { IIncomeReport } from '../types/IIncomeReport';
import { IPlayerReport } from '../types/IPlayerReport';
import { IYearResult } from '../types/IYearResult';
import { getArrayDifference } from '../utils/arrays';
import {
    ALLOWED_CONSTRUCTIONS,
    ALLOWED_PRICES,
    AUTO_PRICE,
    BUSINESSES_KEYS,
    CONSTRUCTION_PRICES,
    INITIAL_ASSETS,
    YEARS_KEYS,
} from './constants';
import { getPlayerReports } from './export/createReports';
import { IMachine } from '../production/types/machine';

import { Player } from './types/player';

export class Game extends GameBase {
    public static requiresHistory = true;
    public static yearKeys = YEARS_KEYS;
    public static businessKeys = BUSINESSES_KEYS;
    public static playerInitialAssets = INITIAL_ASSETS;

    public players: Record<string, Player> = {};

    constructor(
        rawPlayers: Record<string, number>,
        rawBusinesses: Record<string, Record<string, any>>,
        rawMachines: IMachine[],
        rawInvestments: Record<string, Record<string, any>>,
        playerReports: IPlayerReport[],
        year: string
    ) {
        super(
            rawPlayers,
            rawBusinesses,
            rawMachines,
            rawInvestments,
            playerReports,
            year
        );

        this._setDefaultInvestments();
        this._setPlayers();
    }

    public static getPlayerYearlyCosts(
        playerAssets: number,
        playerInvestments: Record<string, any>
    ) {
        const newConstruction = playerInvestments.constructions;

        if (ALLOWED_CONSTRUCTIONS.includes(newConstruction)) {
            return CONSTRUCTION_PRICES[
                newConstruction as keyof typeof CONSTRUCTION_PRICES
            ];
        }

        return 0;
    }

    public static validatePlayerInvestments(
        playerAssets: number,
        playerInvestments: Record<string, any>
    ) {
        if (
            !ALLOWED_CONSTRUCTIONS.includes(playerInvestments.constructions) &&
            playerInvestments.constructions !== ''
        ) {
            return false;
        }

        if (!ALLOWED_PRICES.includes(playerInvestments.price)) {
            return false;
        }

        return true;
    }

    public static getPlayersReports(yearResult: IYearResult) {
        return getPlayerReports(yearResult);
    }

    public doMove() {
        const investmentReturns = this._getInvestmentReturns();
        const assets = this.getPlayerAssets();
        const playerBancrupcies = this.getPlayerBancrupcies();
        const incomes = this._getIncomeReports();

        const result = {
            year: this.getNextYear(),
            bancrupcies: {},
            investments: this.investments,
            investmentReturns: investmentReturns,
            assets: assets,
            playerBancrupcies: playerBancrupcies,
            pigsOnMarket: NaN,
            pigPrice: NaN,
            crisisYear: false,
            incomes: incomes,
            teams: [],
        } as IYearResult;

        return result;
    }

    public getNextYear() {
        const currentYearIndex = Game.yearKeys.indexOf(this.year);
        const nextYear = Game.yearKeys[currentYearIndex + 1];

        return nextYear;
    }

    private _getInvestmentReturns() {
        const investmentReturns: Record<string, Record<string, any>> = {};

        for (const [playerKey, player] of Object.entries(this.players)) {
            investmentReturns[playerKey] =
                this._getPlayerInvestmentReturnsAndUpdateAssets(player);
        }

        return investmentReturns;
    }

    private _getPlayerInvestmentReturnsAndUpdateAssets(player: Player) {
        const playerInvestmentReturns =
            this._getPlayerInvestmentReturns(player);

        return playerInvestmentReturns;
    }

    private _getPlayerInvestmentReturns(player: Player) {
        const playerInvestmentReturns = {
            hotelData: {
                incomes: player.getIncomes(),
                clients: player.clients,
                price: player.price,
                averagePrice: player.averagePrice,
                constructions: player.constructions,
                weather: player.weather,
            },
            clientData: { ...player.clientData },
        };

        return playerInvestmentReturns;
    }

    private _getIncomeReports() {
        let incomeReports: Record<string, IIncomeReport> = {};

        for (const playerKey of Object.keys(this.investments)) {
            const initialAssets = this.initialAssets[playerKey];
            const currectAssets = this.players[playerKey].assets;

            incomeReports[playerKey] = {
                totalIncome: currectAssets - initialAssets,
                pigsExpenses: NaN,
                familyExpenses: NaN,
                bankExpenses: NaN,
                pigsIncomes: NaN,
            } as IIncomeReport;
        }

        return incomeReports;
    }

    private _setPlayers() {
        const averagePrice = Math.round(
            Object.values(this.investments).reduce(
                (accumulator, obj) => accumulator + obj.price,
                0
            ) / Object.values(this.investments).length
        );

        const weather = Player.getWeather();

        for (const [playerKey, assets] of Object.entries(this.rawPlayers)) {
            let price = this.investments[playerKey]?.price;
            let newConstruction = this.investments[playerKey]?.constructions;

            const yearlyData = Player.getPlayerYearlyData(
                playerKey,
                this.playerHistory
            );

            this.players[playerKey] = new Player(
                playerKey,
                assets,
                price,
                averagePrice,
                newConstruction,
                weather,
                yearlyData,
                this.year
            );
        }
    }

    private _setDefaultInvestments() {
        const allPlayers = Object.keys(this.rawPlayers);
        const investedPlayers = Object.keys(this.investments);
        const missingPlayers = getArrayDifference(allPlayers, investedPlayers);

        for (const playerKey of missingPlayers) {
            this.initialAssets[playerKey] = this.rawPlayers[playerKey];
            this.investments[playerKey] = {
                price: AUTO_PRICE,
                constructions: '',
            };
        }
    }
}
