import { GameBase } from '../types/GameBase';
import { IPlayerReport, IYearReport } from '../types/IPlayerReport';
import { IYearResult } from '../types/IYearResult';
import { IIncomeReport } from '../types/IIncomeReport';

import {
    ALLOWED_INVESTMENRS,
    AUTO_SPEED,
    BUSINESSES_KEYS,
    CATCH_PROBABILITY,
    GOAL_DISTANCE,
    INITIAL_ASSETS,
    YEARS_KEYS,
} from './constants';
import { Player } from './types/player';
import { getPlayerReports } from './export/createReports';

import { getArrayDifference } from '../utils/arrays';
import { getRandomTrueFalse } from '../utils/probability';
import { IMachine } from '../production/types/machine';

export class Game extends GameBase {
    public static requiresHistory = true;
    public static yearKeys = YEARS_KEYS;
    public static businessKeys = BUSINESSES_KEYS;
    public static playerInitialAssets = INITIAL_ASSETS;

    public players: Record<string, Player> = {};

    private _areCaught: Record<string, Record<string, boolean>>;
    private _activePlayers: number;
    private _allPlayers: number;
    private _haveFininished: number;

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

        this._areCaught = this._getCaught();
        this._setPlayers();
        this._setDefaultInvestments();

        this._activePlayers = Object.keys(this.players).length;
        this._allPlayers = this.playerHistory.length;
        this._haveFininished = Object.values(this.players).filter((x) =>
            x.hasFinished()
        ).length;
    }

    public isActive() {
        const allFinished = Object.values(this.players).every(
            (x) => x.distance >= GOAL_DISTANCE
        );

        return !allFinished;
    }

    public static getPlayerYearlyCosts(
        playerAssets: number,
        playerInvestments: Record<string, number>
    ) {
        return 0;
    }

    public static validatePlayerInvestments(
        playerAssets: number,
        playerInvestments: Record<string, number>
    ) {
        for (const investment of Object.values(playerInvestments)) {
            if (!ALLOWED_INVESTMENRS.includes(investment)) {
                return false;
            }
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
            bancrupcies: this._areCaught,
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
        this._updateAssets(player, playerInvestmentReturns.driveData);

        return playerInvestmentReturns;
    }

    private _getPlayerInvestmentReturns(player: Player) {
        const playerInvestmentReturns = {
            driveData: {
                distance: player.distance,
                speedingFine: player.getSpeedingFine(),
                sleepingFine: player.getSleepingFine(),
                isEarlyReward: player.getIsEarlyReward(),
                finishedReward: player.getFinishedReward(),
                finishedFirstReward: player.getFinishedFirstReward(
                    this._activePlayers,
                    this._allPlayers,
                    this._haveFininished
                ),
            },
            playerData: {
                isCaught: player.isCaught,
                hasSlept: player.hasSlept,
            },
        };

        return playerInvestmentReturns;
    }

    private _updateAssets(player: Player, driveData: Record<string, number>) {
        const assetsChange = this._getAssetsChange(driveData);
        player.updateAssets(assetsChange);
    }

    private _getAssetsChange(playerDriveData: Record<string, number>) {
        let assetsChange = 0;

        for (const [key, value] of Object.entries(playerDriveData)) {
            if (key == 'distance') {
                continue;
            }

            assetsChange += value;
        }

        return assetsChange;
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

    private _getCaught() {
        const caught: Record<number, Record<string, boolean>> = {};
        for (const speed of ALLOWED_INVESTMENRS) {
            const speedKey = speed.toString();
            caught[speed] = {
                isCaught: getRandomTrueFalse(
                    CATCH_PROBABILITY[
                        speedKey as keyof typeof CATCH_PROBABILITY
                    ]
                ),
            };
        }

        return caught;
    }
    private _setPlayers() {
        for (const [playerKey, assets] of Object.entries(this.rawPlayers)) {
            let speed = this.investments[playerKey]?.speed;
            if (typeof speed !== 'number') {
                speed = AUTO_SPEED;
            }

            const yearlyData = Player.getPlayerYearlyData(
                playerKey,
                this.playerHistory
            );

            this.players[playerKey] = new Player(
                playerKey,
                assets,
                speed,
                this._areCaught[speed].isCaught,
                yearlyData,
                this.year
            );
        }
    }

    private _setDefaultInvestments() {
        const allPlayers = Object.keys(this.players);
        const investedPlayers = Object.keys(this.investments);
        const missingPlayers = getArrayDifference(allPlayers, investedPlayers);

        for (const playerKey of missingPlayers) {
            this.initialAssets[playerKey] = this.players[playerKey].assets;
            this.investments[playerKey] = { speed: AUTO_SPEED };
        }
    }
}
