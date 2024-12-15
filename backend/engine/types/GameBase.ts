import { PlayerBase } from './PlayerBase';
import { BusinessBase } from './BusinessBase';
import { IYearResult } from './IYearResult';
import { IPlayerReport, IYearReport } from './IPlayerReport';
import { IMachine } from '../production/types/machine';

export class GameBase {
    static requiresHistory: boolean = false;
    static requiresMachines: boolean = false;
    static businessKeys: string[];
    static yearKeys: string[];
    static playerInitialAssets: number;

    public rawPlayers: Record<string, number>;
    public rawBusinesses: Record<string, Record<string, any>>;
    public rawMachines: IMachine[];

    public investments: Record<string, Record<string, any>> = {};
    public initialAssets: Record<string, number> = {};
    public submitTimes: Record<string, Date> = {};
    public playerHistory: IPlayerReport[];
    public year: string;
    public players: Record<string, any> = {};
    public businesses: Record<string, any> = {};

    constructor(
        rawPlayers: Record<string, number>,
        rawBusinesses: Record<string, Record<string, any>>,
        rawMachines: IMachine[],
        rawInvestments: Record<string, Record<string, any>>,
        playerReports: IPlayerReport[],
        year: string
    ) {
        this.rawPlayers = rawPlayers;
        this.rawBusinesses = rawBusinesses;
        this.rawMachines = rawMachines;

        this.playerHistory = playerReports;
        this.year = year;

        this._setInvestmentsAndInitialAssets(rawInvestments);
    }

    public isActive(): boolean {
        return true;
    }

    static getPlayerYearlyCosts(
        playerAssets: number,
        playerInvestments: Record<string, number>
    ): number {
        throw Error('Not implemented yet.');
    }

    static validatePlayerInvestments(
        playerAssets: number,
        playerInvestments: Record<string, number>
    ): boolean {
        throw Error('Not implemented yet.');
    }

    public static getPlayersReports(yearResult: IYearResult): IYearReport[] {
        return [];
    }

    public static getInvestmentReturn(investment: Record<string, any>) {
        throw Error('Not implemented yet.');
    }

    public doMove(): IYearResult {
        throw Error('Not implemented yet.');
    }

    public getNextYear(): string {
        throw Error('Not implemented yet.');
    }

    public getPlayerInitialAssets(): number {
        throw Error('Not implemented yet.');
    }

    static getMachines(playerAmount: number): IMachine[] {
        throw Error('Not implemented yet.');
    }

    public getPlayerAssets() {
        let assets: Record<string, number> = {};

        for (let [playerKey, player] of Object.entries(this.players)) {
            assets[playerKey] = player.assets;
        }

        return assets;
    }

    public getPlayerBancrupcies() {
        let bancrupcies: Record<string, boolean> = {};

        for (let [playerKey, player] of Object.entries(this.players)) {
            bancrupcies[playerKey] = player.isBancrupt();
        }

        return bancrupcies;
    }

    private _setInvestmentsAndInitialAssets(
        rawInvestments: Record<string, Record<string, any>>
    ) {
        for (const [playerKey, rawInvesment] of Object.entries(
            rawInvestments
        )) {
            this.initialAssets[playerKey] = rawInvesment.initialAssets;
            this.investments[playerKey] = rawInvesment.investments;
            this.submitTimes[playerKey] = rawInvesment.investmentTime;
        }
    }
}
