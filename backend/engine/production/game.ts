import { Player } from './types/player';
import { GameBase } from '../types/GameBase';
import { IPlayerReport, IYearReport } from '../types/IPlayerReport';
import { IMachine, Machine, machineTypes } from './types/machine';
import {
    BUSINESS_KEYS,
    INITIAL_ASSETS,
    POWER_DIFFERENCE,
    TIMES_USED_BASE,
    YEARS_KEYS,
} from './constants';
import { IYearResult } from '../types/IYearResult';
import { truncate } from 'fs';
import e from 'cors';
import { getArrayDifference } from '../utils/arrays';
import { isNullishCoalesce } from 'typescript';
import { getPlayerReports } from './export/createReports';
import { xssFilter } from 'helmet';
import { getLastYearIncomes } from '../utils/reports';

export class Game extends GameBase {
    public static requiresMachines = true;
    public static yearKeys = YEARS_KEYS;
    public static businessKeys = BUSINESS_KEYS;
    public static playerInitialAssets = INITIAL_ASSETS;

    public players: Record<string, Player> = {};
    public machines: Machine[] = [];

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

        this._setMachines();
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
        if (
            playerInvestments.bet % 5000 == 0 ||
            typeof playerInvestments.bet === 'undefined'
        ) {
            return true;
        }

        return false;
    }

    public static getPlayersReports(yearResult: IYearResult): IYearReport[] {
        if (Object.keys(yearResult.investmentReturns).length > 0) {
            return getPlayerReports(yearResult);
        }

        return [];
    }

    public doMove() {
        if (!this.isLastYear()) {
            this._setNewMachineOwner();
        }
        if (this.isPreLastYear()) {
            this._setRemainingMachineOwners();
        }

        let teams: string[][] = [];
        if (this.isLastYear() || this.isPreLastYear()) {
            teams = this._setTeams();
        }

        const machineData = this._getMachineData();
        const investmentReturns = this.isLastYear()
            ? this._getInvestmentReturns()
            : {};
        const assets = this.isLastYear()
            ? this._setAssets(investmentReturns)
            : this.getPlayerAssets();
        const playerBancrupcies = {};
        const incomes = {};

        const result = {
            year: this.getNextYear(),
            bancrupcies: machineData,
            investments: this.investments,
            investmentReturns: investmentReturns,
            assets: assets,
            playerBancrupcies: playerBancrupcies,
            pigsOnMarket: NaN,
            pigPrice: NaN,
            crisisYear: false,
            incomes: incomes,
            teams: teams,
        } as IYearResult;

        return result;
    }

    private _setAssets(investmentReturns: Record<string, Record<string, any>>) {
        const assets: Record<string, number> = {};

        for (const playerReturns of Object.values(investmentReturns)) {
            const lastYearData = getLastYearIncomes(playerReturns);

            if (!lastYearData) {
                throw Error('Cannot get last year data');
            }

            for (const [playerKey, returns] of Object.entries(lastYearData)) {
                assets[playerKey] = returns.totalAssets;
            }
        }

        return assets;
    }

    public isLastYear() {
        const years = Game.yearKeys.slice(0, this.machines.length + 1);
        const lastYear = years[years.length - 1];

        if (this.year === lastYear) {
            return true;
        }

        return false;
    }

    public isPreLastYear() {
        const years = Game.yearKeys.slice(0, this.machines.length + 1);
        const preLastYear = years[years.length - 2];

        if (this.year === preLastYear) {
            return true;
        }

        return false;
    }

    public getNextYear() {
        const currentYearIndex = Game.yearKeys.indexOf(this.year);
        const years = Game.yearKeys.slice(0, this.machines.length + 1);
        const nextYear = years[currentYearIndex + 1];

        return nextYear;
    }

    public isActive() {
        return !this.isLastYear();
    }

    private _getInvestmentReturns() {
        const investmentReturns: Record<
            string,
            Record<string, Record<string, Record<string, number>>>
        > = {};

        for (const [playerKey, investment] of Object.entries(
            this.investments
        )) {
            let parsedInvestment;
            try {
                parsedInvestment = JSON.parse(String(investment));
            } catch (err) {
                continue;
            }

            if (parsedInvestment.investment) {
                investmentReturns[playerKey] =
                    Game.getInvestmentReturn(parsedInvestment);

                const lastYearIncome = getLastYearIncomes(
                    investmentReturns[playerKey]
                );

                if (!lastYearIncome) {
                    throw Error('No investment returns');
                }

                for (const [key, returns] of Object.entries(lastYearIncome)) {
                    this.players[key].assets = returns.totalAssets;
                }
            }
        }

        return investmentReturns;
    }

    public static getInvestmentReturn(investment: Record<string, any>) {
        const machines = this._getPlayerMachines(
            investment.investment.machineData
        );
        const players = this._getTeammates(
            investment.investment.initialAssets,
            machines
        );
        const investmentReturns = this._getInvestmentIncomes(
            investment,
            players,
            machines
        );

        return investmentReturns;
    }

    private static _getInvestmentIncomes(
        investment: Record<string, any>,
        players: Player[],
        machines: Machine[]
    ) {
        const yearInvestments: Record<
            string,
            Record<string, any>
        > = investment.investment;
        const investmentReturns: Record<
            string,
            Record<string, Record<string, number>>
        > = {};

        let lastYearIncome = 0;

        for (const [yearKey, yearInvestment] of Object.entries(
            yearInvestments.investments
        )) {
            investmentReturns[yearKey] = {};

            let usingMachine: string = '';
            let collaboration = true;
            if (
                yearInvestment.firstMachine.using &&
                yearInvestment.secondMachine.using
            ) {
                collaboration = false;
            } else if (yearInvestment.firstMachine.using) {
                usingMachine = 'firstMachine';
            } else if (yearInvestment.secondMachine.using) {
                usingMachine = 'secondMachine';
            }

            let machine: Machine | undefined = undefined;

            for (const i in players) {
                const player = players[i];

                if (collaboration && usingMachine !== '') {
                    machine = machines.find(
                        (x) => x.owner == yearInvestment[usingMachine].owner
                    );
                } else if (!collaboration) {
                    machine = machines.find((x) => x.owner == player.playerKey);
                }

                const playerReturn = machine
                    ? machine.getIncomes(
                          yearInvestment,
                          player,
                          i.toString(),
                          collaboration,
                          yearKey
                      )
                    : player.getSupport(lastYearIncome);

                investmentReturns[yearKey][player.playerKey] = playerReturn;
            }

            lastYearIncome =
                investmentReturns[yearKey][players[2].playerKey].uneployment;
        }

        return investmentReturns;
    }

    private _setRemainingMachineOwners() {
        const unownedMachines = this.machines.filter((x) => x.owner === null);
        const playersNoMachine = Object.values(this.players).filter(
            (x) => typeof x.machine === 'undefined'
        );

        for (const machine of unownedMachines) {
            const newOwer = playersNoMachine.pop();

            if (!newOwer) {
                throw Error('No players without machines');
            }

            machine.owner = newOwer.playerKey;
            machine.soldFor = newOwer.bet;
            newOwer.machine = machine;
        }
    }

    private _setTeams() {
        const teams: string[][] = [];

        const teammateTypes = {
            '1': '6',
            '2': '5',
            '3': '4',
        };
        const firstKeys = Object.keys(teammateTypes);
        const secondKeys = Object.values(teammateTypes);

        const playersWMachinesFirst = Object.values(this.players).filter((x) =>
            firstKeys.includes(x.machine?.type || '')
        );
        let playersWMachinesSecond = Object.values(this.players).filter((x) =>
            secondKeys.includes(x.machine?.type || '')
        );
        const playersWoMachine = Object.values(this.players).filter(
            (x) => typeof x.machine === 'undefined'
        );

        for (const player of playersWMachinesFirst) {
            const team = [player.playerKey];
            const machineType = player.machine
                ?.type as keyof typeof teammateTypes;
            const temmateType = teammateTypes[machineType];

            const teammateOne = playersWMachinesSecond.find(
                (x) => x.machine?.type == temmateType
            );

            if (!teammateOne) {
                throw Error('Could not find teammate(s)');
            }

            playersWMachinesSecond = playersWMachinesSecond.filter(
                (x) => x.playerKey !== teammateOne.playerKey
            );

            const teammateTwo = playersWoMachine.pop();
            if (!teammateTwo) {
                throw Error('Could not find teammate(s)');
            }

            team.push(teammateOne.playerKey, teammateTwo.playerKey);
            teams.push(team);
        }

        return teams;
    }

    private _setNewMachineOwner() {
        const maxBet = Object.values(this.players).reduce((a, b) =>
            a.bet > b.bet ? a : b
        ).bet;
        const maxBetters = Object.values(this.players).filter(
            (x) => x.bet == maxBet
        );

        const minTime = maxBetters
            .map(function (x) {
                return x.time;
            })
            .sort()[0];

        const newOwner = maxBetters.find(
            (x) => x.bet == maxBet && x.time == minTime
        );

        if (!newOwner) {
            return;
        }

        newOwner.assets -= newOwner.bet;

        const unownedMachines = this.machines.filter((x) => x.owner === null);
        unownedMachines[0].owner = newOwner.playerKey;
        unownedMachines[0].soldFor = newOwner.bet;
        this.players[newOwner.playerKey].machine = unownedMachines[0];
    }

    private _getMachineData() {
        const machineAmounts: Record<string, IMachine> = {};

        for (const machine of this.machines) {
            machineAmounts[machine.number] = {
                type: machine.type,
                number: machine.number,
                owner: machine.owner,
                timesUsed: machine.timesUsed,
                soldFor: machine.soldFor,
            } as IMachine;
        }

        return machineAmounts;
    }

    public static getMachines(playerAmount: number) {
        const machines: IMachine[] = [];

        const machineAmounts: Record<string, number> =
            Game._getMachineAmounts(playerAmount);

        for (const type of machineTypes) {
            const timesBase = ['1', '2', '3'].includes(type)
                ? TIMES_USED_BASE
                : TIMES_USED_BASE - 1;
            const timesUsed = timesBase - +type;

            for (let i = 1; i <= machineAmounts[type]; i++) {
                machines.push({
                    type: type,
                    number: `${type}-${i}`,
                    owner: null,
                    timesUsed: timesUsed,
                    soldFor: null,
                } as IMachine);
            }
        }

        return machines;
    }

    private _setMachines() {
        for (const rawMachine of this.rawMachines) {
            this.machines.push(new Machine(rawMachine));
        }
    }

    private _setPlayers() {
        for (const [playerKey, assets] of Object.entries(this.rawPlayers)) {
            const machine = this.machines.find((x) => x.owner == playerKey);
            const bet = this.investments[playerKey].bet;

            if (!this.submitTimes[playerKey]) {
                this.submitTimes[playerKey] = new Date();
            }
            let time = this.submitTimes[playerKey];

            this.players[playerKey] = new Player(
                playerKey,
                assets,
                bet,
                machine,
                time
            );
        }
    }

    private static _getPlayerMachines(machineData: IMachine[]) {
        const machines: Machine[] = [];

        for (const machine of machineData) {
            machines.push(new Machine(machine));
        }

        return machines;
    }

    private static _getTeammates(
        teammateAssets: Record<string, number>,
        machines: Machine[]
    ) {
        const players: Player[] = [];

        for (const [playerKey, assets] of Object.entries(teammateAssets)) {
            const machine = machines.find((x) => x.owner == playerKey);
            const bet = 0;
            const time = new Date();

            players.push(new Player(playerKey, assets, bet, machine, time));
        }

        return players;
    }

    private static _getMachineAmounts(playerAmount: number) {
        const machineAmounts: Record<string, number> = {};
        const baseAmount = (playerAmount * 2) / 18;

        for (const type of machineTypes) {
            machineAmounts[type] = baseAmount;

            if (
                (playerAmount % 9 == 3 || playerAmount % 9 == 6) &&
                (type == '1' || type == '6')
            ) {
                machineAmounts[type] += 1;
            }

            if (playerAmount % 9 == 6 && (type == '2' || type == '5')) {
                machineAmounts[type] += 1;
            }
        }

        return machineAmounts;
    }

    private _setDefaultInvestments() {
        const allPlayers = Object.keys(this.rawPlayers);
        const investedPlayers = Object.keys(this.investments);

        const missingPlayers = getArrayDifference(allPlayers, investedPlayers);

        for (const playerKey of missingPlayers) {
            this.initialAssets[playerKey] = this.rawPlayers[playerKey];
            this.investments[playerKey] = {
                bet: 0,
            };
        }
    }
}
