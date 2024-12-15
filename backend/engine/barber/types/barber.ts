import {
    BASE_CLIENT_AMOUNT,
    BUY_PRICE,
    CLIENT_AMOUNT,
    CLIENT_MULTIPLIERS,
    LABOUR_PRICE,
    LEARN_PRICE,
    MAINTAIN_PRICE,
    MARKETING_PRICE,
    PRICES,
    SALON_PRICE,
    SELL_PRICE,
} from '../constants';
import { Player } from './player';

export class Barbershop {
    isNew: boolean;

    location: 'city' | 'country';
    equipment: 'base' | 'mid' | 'pro';
    budget: 'mini' | 'mid' | 'large';
    newEquipment: boolean;

    barber: Barber;
    ownerWorking: boolean;

    clientKey: string;
    barbershopAmount: number;

    clients: number;
    price: number;

    constructor(
        isNew: boolean,
        newEquiptment: boolean,
        location: 'city' | 'country',
        equipment: 'base' | 'mid' | 'pro',
        budget: 'mini' | 'mid' | 'large',
        barber: Barber,
        clientKey: string,
        barbershopAmount: number,
        ownerWorking: boolean
    ) {
        this.isNew = isNew;
        this.newEquipment = newEquiptment;

        this.location = location;
        this.equipment = equipment;
        this.budget = budget;

        this.barber = barber;
        this.ownerWorking = ownerWorking;

        this.clientKey = clientKey;
        this.barbershopAmount = barbershopAmount;

        this.clients = this._getClientAmount();
        this.price = this._getPrice();
    }

    public getYearIncomes(owner: Player, isLastYear: boolean) {
        const worker = this.ownerWorking ? owner : this.barber;

        const incomes = {
            salonCosts: this.isNew ? SALON_PRICE[this.location] : 0,
            sellCosts: isLastYear ? SELL_PRICE[this.location] : 0,
            incomesFromClients: this.price * this.clients,
            equipmentCosts: this._getEquipmentCosts(),
            labourCosts: this._getLabourCosts(worker),
            learningCosts: this._getLearningExpenses(worker),
            marketingCosts: this._getMarketingConsts(),
        };

        this.isNew = false;

        return incomes;
    }

    private _getEquipmentCosts() {
        if (this.newEquipment) {
            this.newEquipment = false;
            return BUY_PRICE[this.equipment];
        }

        return MAINTAIN_PRICE[this.equipment];
    }

    private _getMarketingConsts() {
        return MARKETING_PRICE[this.budget];
    }

    private _getLabourCosts(worker: Player | Barber) {
        if (!this.ownerWorking) {
            return LABOUR_PRICE[worker.skill];
        }

        return 0;
    }

    private _getClientAmount() {
        const clientBase = BASE_CLIENT_AMOUNT[this.location];

        const clientAmounts =
            CLIENT_AMOUNT[this.budget as keyof typeof CLIENT_AMOUNT][
                this.location
            ];
        const tourists =
            clientAmounts[this.clientKey as keyof typeof clientAmounts];

        const clients =
            (clientBase + tourists) * CLIENT_MULTIPLIERS[this.barbershopAmount - 1];

        return clients;
    }

    private _getPrice() {
        const prices = PRICES[this.equipment];
        const price = prices[this.barber.skill];

        return price;
    }

    private _getLearningExpenses(worker: Player | Barber) {
        if (worker.isLearning) {
            worker.isLearning = false;

            if (worker.skill == 'base') {
                worker.skill = 'mid';
                return LEARN_PRICE.baseToMid;
            } else if (worker.skill == 'mid') {
                worker.skill = 'pro';
                return LEARN_PRICE.midToPro;
            }
        }

        return 0;
    }
}

export interface IBarbershop {
    isNew: boolean;
    newEquipment: boolean;
    location: 'city' | 'country';
    equipment: 'base' | 'mid' | 'pro';
    budget: 'mini' | 'mid' | 'large';
    barber: IBarber;
    clients: number;
    ownerWorking: boolean;
}

export class Barber {
    skill: 'base' | 'mid' | 'pro';
    isLearning: boolean;

    constructor(skill: 'base' | 'mid' | 'pro', isLearning: boolean) {
        this.skill = skill;
        this.isLearning = isLearning;
    }
}

export interface IBarber {
    skill: 'base' | 'mid' | 'pro';
    isLearning: boolean;
}
