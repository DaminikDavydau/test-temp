import { PlayerBase } from '../../types/PlayerBase';
import { IPlayerReport, IYearReport } from '../../types/IPlayerReport';

import { getPlayerReport } from '../../utils/reports';

import {
    SLEEPING_INTERVAL,
    DEFAULT_SPEED,
    SLEEPING_FINE,
    SPEEDING_FINE_RATE,
    GOAL_DISTANCE,
    YEARS_KEYS,
    REWARD_MARGIN_YEAR,
    FINISHED_FIRST_REWARD,
    IS_EARLY_REWARD,
    FINISHED_REWARD,
    CATCH_PROBABILITY,
} from '../constants';
import { getRandomTrueFalse } from '../../utils/probability';

export class Player extends PlayerBase {
    playerKey: string;
    speed: number;
    isCaught: boolean;

    hasSlept: boolean;
    distance: number;

    year: string;

    constructor(
        playerKey: string,
        assets: number,
        speed: number,
        isCaught: boolean,
        yearlyData: IYearReport[],
        year: string
    ) {
        super(assets);

        this.playerKey = playerKey;
        this.speed = speed;
        this.isCaught = isCaught;

        this.hasSlept = this._getHasSlept(yearlyData);
        this.distance = this._getDistance(yearlyData);
        this.year = year;
    }

    public isBancrupt(): boolean {
        return this.hasFinished();
    }

    public hasFinished(): boolean {
        return this.distance >= GOAL_DISTANCE;
    }

    public updateAssets(assetsChange: number) {
        this.assets += assetsChange;
    }

    public getFinishedFirstReward(
        activePlayers: number,
        allPlayers: number,
        finishers: number
    ) {
        let reward = 0;
        if (this._hasFinishedFirst(activePlayers, allPlayers)) {
            reward = Math.round(FINISHED_FIRST_REWARD / finishers);
        }

        return this._getReward(reward);
    }

    public getIsEarlyReward() {
        const yearIndex = YEARS_KEYS.indexOf(this.year);
        const marginYearIndex = YEARS_KEYS.indexOf(REWARD_MARGIN_YEAR);
        const yearDifference = marginYearIndex - yearIndex;

        return this._getReward(yearDifference * IS_EARLY_REWARD);
    }

    public getFinishedReward() {
        return this._getReward(FINISHED_REWARD);
    }

    public getSpeedingFine() {
        return this._getFine(
            ((this.speed - DEFAULT_SPEED) / 10) * SPEEDING_FINE_RATE
        );
    }

    public getSleepingFine() {
        let fine = 0;
        if (!this.hasSlept) {
            fine = SLEEPING_FINE;
        }

        return this._getFine(fine);
    }

    private _getReward(rewardIfFinished: number) {
        let reward = 0;

        if (this.hasFinished()) {
            const yearIndex = YEARS_KEYS.indexOf(this.year);
            const marginYearIndex = YEARS_KEYS.indexOf(REWARD_MARGIN_YEAR);

            if (typeof yearIndex !== 'number') {
                throw Error('Incorred year key');
            }

            if (yearIndex <= marginYearIndex) {
                reward = rewardIfFinished;
            }
        }

        return reward;
    }

    private _getFine(fineIfCaught: number) {
        let fine = 0;

        if (this.isCaught) {
            fine = fineIfCaught;
        }

        return fine;
    }

    private _hasFinishedFirst(activePlayers: number, allPlayers: number) {
        let isFirst = false;
        if (activePlayers == allPlayers && this.hasFinished()) {
            isFirst = true;
        }

        return isFirst;
    }

    private _getDistance(yearlyData: IYearReport[]) {
        const lastIndex = yearlyData.length - 1;
        const lastYearData = yearlyData[lastIndex];

        if (!lastYearData.driveData) {
            throw Error('Could not find drive data');
        }
        const newDistance = lastYearData.driveData?.distance + this.speed;

        return newDistance;
    }

    private _getHasSlept(yearlyData: IYearReport[]) {
        const hasSleptInInterval = yearlyData
            .slice(Math.max(yearlyData.length - SLEEPING_INTERVAL, 0))
            .find((x) => x.driveData?.speed == 0);

        let hasSlept = false;
        if (yearlyData.length <= SLEEPING_INTERVAL - 1 || hasSleptInInterval) {
            hasSlept = true;
        }

        return hasSlept;
    }

    private _getIsCaught() {
        const speedKey =
            this.speed.toString() as keyof typeof CATCH_PROBABILITY;
        const catchProbability = CATCH_PROBABILITY[speedKey];
        const isCaught = getRandomTrueFalse(catchProbability);

        return isCaught;
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
            productionData: null,
            hotelData: null,
            barberData: null,
            driveData: {
                speed: 0,
                distance: 0,
                speedingFine: 0,
                sleepingFine: 0,
                isCaught: false,
                hasSlept: true,
                isEarlyReward: 0,
                finishedReward: 0,
                finishedFirstReward: 0,
                catches: {},
            },
            place: NaN,
        } as IYearReport;
    }
}
