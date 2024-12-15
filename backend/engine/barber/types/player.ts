import { IPlayerReport, IYearReport } from '../../types/IPlayerReport';
import { PlayerBase } from '../../types/PlayerBase';
import { getPlayerReport } from '../../utils/reports';
import { BANK_INTERESTS } from '../constants';
import { Barbershop, IBarbershop } from './barber';

export class Player extends PlayerBase {
    playerKey: string;

    skill: 'base' | 'mid' | 'pro';
    isLearning: boolean;

    barbershops: Barbershop[];

    constructor(
        playerKey: string,
        assets: number,
        skill: 'base' | 'mid' | 'pro',
        isLearning: boolean,
        barbershops: Barbershop[]
    ) {
        super(assets);

        this.playerKey = playerKey;

        this.skill = skill;
        this.isLearning = isLearning;

        this.barbershops = barbershops;
    }

    public isBancrupt() {
        return false;
    }

    public getIncomes(isLastYear: boolean) {
        const incomes = [];

        let expenses = 0;
        let income = 0;
        for (const barbershop of this.barbershops) {
            const barbershopIncomes = barbershop.getYearIncomes(
                this,
                isLastYear
            );

            incomes.push({
                ...barbershopIncomes,
            });

            expenses += Object.values(barbershopIncomes)
                .filter((a) => a < 0)
                .reduce((partial, a) => partial + a, 0);
            income += Object.values(barbershopIncomes)
                .filter((a) => a > 0)
                .reduce((partial, a) => partial + a, 0);
        }

        const initialAssets = this.assets;
        this.assets += expenses;

        const bankRate =
            this.assets < 0 ? BANK_INTERESTS.negative : BANK_INTERESTS.positive;
        const bankPercentages = Math.round(this.assets * bankRate);

        this.assets += income + bankPercentages;

        const yearIncomes = {
            totalAssets: this.assets,
            initialAssets: initialAssets,
            barbershopIncome: incomes,
            bankPercentages: bankPercentages,
        };

        return yearIncomes;
    }

    public getBarbershopData() {
        const barbershops: IBarbershop[] = [];

        for (const barbershop of this.barbershops) {
            barbershops.push({
                isNew: barbershop.isNew,
                newEquipment: barbershop.newEquipment,
                location: barbershop.location,
                budget: barbershop.budget,
                equipment: barbershop.equipment,
                clients: barbershop.clients,
                barber: {
                    skill: barbershop.barber.skill,
                    isLearning: barbershop.barber.isLearning,
                },
                ownerWorking: barbershop.ownerWorking,
            });
        }

        return barbershops;
    }

    public getPlayerData() {
        return {
            skill: this.skill,
            isLearning: this.isLearning,
        } as IPlayer;
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
            driveData: null,
            barberData: {
                incomes: {},
                player: {
                    skill: 'base',
                    isLearning: false,
                },
                barbershops: [
                    {
                        isNew: true,
                        newEquipment: false,
                        location: 'country',
                        budget: 'mini',
                        equipment: 'base',
                        clients: 0,
                        barber: {
                            skill: 'base',
                            isLearning: false,
                        },
                        ownerWorking: false,
                    },
                ],
            },
            place: NaN,
        } as IYearReport;
    }
}

export interface IPlayer {
    skill: 'base' | 'mid' | 'pro';
    isLearning: boolean;
}
