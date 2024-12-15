import { Business } from './types/business';
import { Player } from './types/player';
import { GameBase } from '../types/GameBase';

import { BUSINESSES_KEYS, YEARS_KEYS } from './constants';
import { getPlayerReports } from './export/createReports';
import { IYearResult } from '../types/IYearResult';
import { IIncomeReport } from '../types/IIncomeReport';
import { getArrayDifference, getRecordValuesSum } from '../utils/arrays';

import { default as settings } from './settings.json';
import { IPlayerReport } from '../types/IPlayerReport';
import { IMachine } from '../production/types/machine';

export class Game extends GameBase {
    public static businessKeys = BUSINESSES_KEYS;
    public static yearKeys = YEARS_KEYS;
    public static playerInitialAssets = settings.playerSettings.initialAssets;

    public players: Record<string, Player> = {};
    public businesses: Record<string, Business> = {};

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

        this._setPlayers();
        this._setBusinesses();
        this._setDefaultInvestments();
    }

    public static validatePlayerInvestments(
        playerAssets: number,
        playerInvestments: Record<string, number>
    ): boolean {
        let investmentSum: number = 0;

        for (const investment of Object.values(playerInvestments)) {
            if (!Number.isInteger(investment) || investment < 0) {
                return false;
            }
            investmentSum += investment;
        }

        if (investmentSum < playerAssets || playerAssets < investmentSum) {
            return false;
        }

        return true;
    }

    public static getPlayersReports(yearResult: IYearResult) {
        const playersReports = getPlayerReports(yearResult);
        return playersReports;
    }

    public static getPlayerYearlyCosts(
        playerAssets: number,
        playerInvestments: Record<string, number>
    ) {
        const totalInvestments = getRecordValuesSum(playerInvestments) * -1;
        return totalInvestments;
    }

    public doMove() {
        const bancrupcies = this._getBusinessBancrupcies();
        const investmentReturns = this._getInvestmentReturns();
        const assets = this.getPlayerAssets();
        const playerBancrupcies = this.getPlayerBancrupcies();
        const incomes = this._getIncomeReports();

        const result = {
            year: this.getNextYear(),
            bancrupcies: bancrupcies,
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

    private _getBusinessBancrupcies() {
        let bancrupcies: Record<string, Record<string, any>> = {};

        for (let [businessKey, business] of Object.entries(this.businesses)) {
            business.initiateBancrupcy(this.year);
            bancrupcies[businessKey] = {
                isBancrupt: business.isBancrupt,
                bancrupcyYear: business.bancrupcyYear,
                returnRate: business.getInvestmentReturnRate(this.year),
            };
        }

        return bancrupcies;
    }

    private _getInvestmentReturns() {
        let investmentReturns: Record<
            string,
            Record<string, Record<string, any>>
        > = {};

        for (let playerKey in this.investments) {
            investmentReturns[playerKey] = this._getPlayerInvestmentReturns(
                this.players[playerKey],
                this.investments[playerKey]
            );
        }

        return investmentReturns;
    }

    private _getIncomeReports() {
        let incomeReports: Record<string, IIncomeReport> = {};

        for (const [playerKey, investment] of Object.entries(
            this.investments
        )) {
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

    private _getPlayerInvestmentReturns(
        player: Player,
        playerInvestments: Record<string, number>
    ) {
        let playerInvestmentReturns: Record<string, Record<string, any>> = {};

        for (let businessKey in playerInvestments) {
            const business = this.businesses[businessKey];
            const investment = playerInvestments[businessKey];

            if (business.canGetInvestmentReturn(this.year)) {
                const businessInvestmentReturns = this._invest(
                    player,
                    business,
                    investment
                );
                playerInvestmentReturns[businessKey] =
                    businessInvestmentReturns;
            }
        }

        return playerInvestmentReturns;
    }

    private _invest(player: Player, business: Business, investment: number) {
        const businessReturnedAssets = business.getInvestmentReturn(
            investment,
            this.year
        );
        player.addInvestmentReturns(businessReturnedAssets);

        return {
            returnedAssets: businessReturnedAssets,
        };
    }

    private _setPlayers() {
        for (const [playerKey, assets] of Object.entries(this.rawPlayers)) {
            this.players[playerKey] = new Player(assets);
        }
    }

    private _setBusinesses() {
        for (const [businessKey, business] of Object.entries(
            this.rawBusinesses
        )) {
            this.businesses[businessKey] = new Business(
                businessKey,
                business.isBancrupt,
                business.bancrupcyYear
            );
        }
    }

    private _setDefaultInvestments() {
        const allPlayers = Object.keys(this.players);
        const investedPlayers = Object.keys(this.investments);

        const missingPlayers = getArrayDifference(allPlayers, investedPlayers);

        const businessKeys = Object.keys(this.businesses).filter(
            (x) => !this.businesses[x].isBancrupt
        );

        for (const playerKey of missingPlayers) {
            const playerInvestments: Record<string, number> = {};
            const investment = Math.floor(
                this.players[playerKey].assets / businessKeys.length
            );

            for (const businessKey of businessKeys) {
                playerInvestments[businessKey] = investment;
            }

            this.initialAssets[playerKey] = this.players[playerKey].assets;
            this.investments[playerKey] = playerInvestments;
            this.players[playerKey].assets = 0;
        }
    }
}
