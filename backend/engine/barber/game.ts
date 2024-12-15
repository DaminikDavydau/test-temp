import { GameBase } from '../types/GameBase';
import { IIncomeReport } from '../types/IIncomeReport';
import { IPlayerReport } from '../types/IPlayerReport';
import { IYearResult } from '../types/IYearResult';
import { getArrayDifference } from '../utils/arrays';
import { YEARS_KEYS, BUSINESSES_KEYS, INITIAL_ASSETS } from './constants';
import { getPlayerReports } from './export/createReports';
import { IMachine } from '../production/types/machine';

import { Player } from './types/player';
import { Barber, Barbershop, IBarbershop } from './types/barber';

export class Game extends GameBase {
    public static requiresHistory = true;
    public static yearKeys = YEARS_KEYS;
    public static businessKeys = BUSINESSES_KEYS;
    public static playerInitialAssets = INITIAL_ASSETS;

    public players: Record<string, Player> = {};
    public eventNumber: string = '';

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
        return 0;
    }

    public static validatePlayerInvestments(
        playerAssets: number,
        playerInvestments: Record<string, any>
    ) {
        return true;
    }

    public static getPlayersReports(yearResult: IYearResult) {
        return getPlayerReports(yearResult);
    }

    public doMove() {
        const playerBancrupcies = this.getPlayerBancrupcies();
        const investmentReturns = this._getInvestmentReturns();
        const incomes = this._getIncomeReports();
        const assets = this.getPlayerAssets();

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

    public isLastYear() {
        const lastYear = Game.yearKeys[Game.yearKeys.length - 1];

        if (this.year === lastYear) {
            return true;
        }

        return false;
    }

    public getNextYear() {
        const currentYearIndex = Game.yearKeys.indexOf(this.year);
        const nextYear = Game.yearKeys[currentYearIndex + 1];

        return nextYear;
    }

    private _getInvestmentReturns() {
        const investmentReturns: Record<string, Record<string, any>> = {};

        for (const player of Object.values(this.players)) {
            investmentReturns[player.playerKey] = {
                incomes: player.getIncomes(this.isLastYear()),
                player: player.getPlayerData(),
                barbershops: player.getBarbershopData(),
                touristAmount: this.eventNumber,
            };
        }

        return investmentReturns;
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

    private _getBarbershops(playerKey: string, clientKey: string) {
        const rawBarbershops: IBarbershop[] =
            this.investments[playerKey].barbershops;
        const barbershops: Barbershop[] = [];

        for (const barbershop of rawBarbershops) {
            const barber = new Barber(
                barbershop.barber.skill,
                barbershop.barber.isLearning
            );

            barbershops.push(
                new Barbershop(
                    barbershop.isNew,
                    barbershop.newEquipment,
                    barbershop.location,
                    barbershop.equipment,
                    barbershop.budget,
                    barber,
                    clientKey,
                    rawBarbershops.length,
                    barbershop.ownerWorking
                )
            );
        }

        return barbershops;
    }

    private _getClientKey() {
        const events = Math.floor(Math.random() * 10);
        let eventNumber = 1

        if (events < 2) {
            eventNumber = 0
        }
        else if (events < 7) {
            eventNumber = 1
        }
        else {
            eventNumber = 2
        }


        const clientKeys = ['min', 'mid', 'large'];

        this.eventNumber = clientKeys[eventNumber];

        return clientKeys[eventNumber];
    }

    private _setPlayers() {
        const clientKey = this._getClientKey();

        for (const [playerKey, assets] of Object.entries(this.rawPlayers)) {
            const barbershops = this._getBarbershops(playerKey, clientKey);
            const skill = this.investments[playerKey].player.skill;
            const isLearning = this.investments[playerKey].player.isLearning;

            this.players[playerKey] = new Player(
                playerKey,
                assets,
                skill,
                isLearning,
                barbershops
            );
        }
    }

    private _setDefaultInvestments() {
        const allPlayers = Object.keys(this.rawPlayers);
        const investedPlayers = Object.keys(this.investments);
        const missingPlayers = getArrayDifference(allPlayers, investedPlayers);

        for (const playerKey of missingPlayers) {
            const yearlyData = Player.getPlayerYearlyData(
                playerKey,
                this.playerHistory
            );

            const barberData = yearlyData[yearlyData.length - 1].barberData;

            if (!barberData) {
                throw Error('Cannot get player history.');
            }

            this.initialAssets[playerKey] = this.rawPlayers[playerKey];
            this.investments[playerKey] = {
                player: { ...barberData.player },
                barbershops: barberData.barbershops,
            };
        }
    }
}
