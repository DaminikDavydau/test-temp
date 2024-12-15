import { GameBase } from '../types/GameBase';
import { Player } from './types/player';

import { BUSINESSES_KEYS, YEARS_KEYS } from './constants';
import { IYearResult } from '../types/IYearResult';
import { IPlayerReport } from '../types/IPlayerReport';
import { IIncomeReport } from '../types/IIncomeReport';
import { getArrayDifference, getMedianElement } from '../utils/arrays';

import { getRandomTrueFalse } from '../utils/probability';
import { getPlayerReports } from './export/createReports';
import { default as settings } from './settings.json';
import { IMachine } from '../production/types/machine';

export class Game extends GameBase {
    public static businessKeys = BUSINESSES_KEYS;
    public static yearKeys = YEARS_KEYS;
    public static playerInitialAssets = settings.playerSettings.initialAssets;

    public players: Record<string, Player> = {};

    public pigsOnMarket: number;
    public crisisYear: boolean;

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
        this._setDefaultInvestments();

        this.pigsOnMarket = this._getPigsOnMarket();
        this.crisisYear = getRandomTrueFalse(
            settings.financesSettings.goodYearProbability
        );
    }

    public static validatePlayerInvestments(
        playerAssets: number,
        playerInvestments: Record<string, number>
    ): boolean {
        for (const investment of Object.values(playerInvestments)) {
            if (
                !settings.playerSettings.allowedInvestments.includes(investment)
            ) {
                return false;
            }
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
        for (const pigsAmount of Object.values(playerInvestments)) {
            return Player.calculateYearlyExpenses(pigsAmount, playerAssets);
        }

        throw Error('No investments provided.');
    }

    public doMove(): IYearResult {
        const assets = this.getPlayerAssets();
        const playerBancrupcies = this.getPlayerBancrupcies();

        const result = {
            year: this.getNextYear(),
            bancrupcies: {},
            investments: this.investments,
            investmentReturns: {},
            assets: assets,
            playerBancrupcies: playerBancrupcies,
            pigsOnMarket: this.pigsOnMarket,
            pigPrice: Player.getPigPrice(this.pigsOnMarket, this.crisisYear),
            crisisYear: this.crisisYear,
            incomes: this._getIncomeReports(),
            teams: [],
        } as IYearResult;

        return result;
    }

    public getNextYear() {
        const currentYearIndex = Game.yearKeys.indexOf(this.year);
        const nextYear = Game.yearKeys[currentYearIndex + 1];

        return nextYear;
    }

    public getPlayerAssets() {
        const assets: Record<string, number> = {};

        for (const [playerKey, player] of Object.entries(this.players)) {
            const playerAssets = this._updateAndGetPlayerAssets(
                player,
                this.investments[playerKey]
            );
            assets[playerKey] = playerAssets;
        }

        return assets;
    }

    private _getIncomeReports() {
        let incomeReports: Record<string, IIncomeReport> = {};

        for (const playerKey of Object.keys(this.investments)) {
            incomeReports[playerKey] = this._getPlayerIncomeReport(playerKey);
        }

        return incomeReports;
    }

    private _updateAndGetPlayerAssets(
        player: Player,
        playerInvestments: Record<string, number>
    ) {
        for (let pigsAmount of Object.values(playerInvestments)) {
            const assets = this._buyPigs(player, pigsAmount);
            return assets;
        }

        throw Error('Player has no investments.');
    }

    private _buyPigs(player: Player, pigsAmount: number) {
        const incomes = Player.calculateYearlyIncome(
            pigsAmount,
            this.pigsOnMarket,
            this.crisisYear
        );
        player.addIncomes(incomes);

        return player.assets;
    }

    private _getPlayerIncomeReport(playerKey: string) {
        const player = this.players[playerKey];

        const initialAssets = this.initialAssets[playerKey];
        const pigsAmount = this.investments[playerKey].pigs;

        const pigsExpenses = Player.getTotalPigsExpenses(pigsAmount);
        const familyExpenses = Player.getFamilyExpenses();
        const bankExpenses = Player.getBankExpenses(
            initialAssets,
            pigsExpenses,
            familyExpenses
        );
        const pigsIncomes = Player.calculateYearlyIncome(
            pigsAmount,
            this.pigsOnMarket,
            this.crisisYear
        );

        return {
            totalIncome: player.assets - initialAssets,
            pigsExpenses: pigsExpenses,
            familyExpenses: familyExpenses,
            bankExpenses: bankExpenses,
            pigsIncomes: pigsIncomes,
        } as IIncomeReport;
    }

    private _getPigsOnMarket() {
        let pigsOnMarket = 0;

        for (const record of Object.values(this.investments)) {
            for (const pigsAmount of Object.values(record)) {
                pigsOnMarket += pigsAmount;
            }
        }

        return pigsOnMarket;
    }

    private _setPlayers() {
        for (const [playerKey, assets] of Object.entries(this.rawPlayers)) {
            this.players[playerKey] = new Player(assets);
        }
    }

    private _setDefaultInvestments() {
        const allPlayers = Object.keys(this.players);
        const investedPlayers = Object.keys(this.investments);

        const missingPlayers = getArrayDifference(allPlayers, investedPlayers);

        for (const playerKey of missingPlayers) {
            const player = this.players[playerKey];

            const pigsAmount = 0;
            this.investments[playerKey] = { pigs: pigsAmount };

            this.initialAssets[playerKey] = player.assets;
            player.assets += player.calculateYearlyExpenses(pigsAmount);
        }
    }
}
