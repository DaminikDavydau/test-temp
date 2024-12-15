export interface IBarberData {
    player: IPlayer;
    barbershops: IBarbershop[];
    incomes: Record<string, number>;
}

export interface IPlayer {
    skill: 'base' | 'mid' | 'pro';
    isLearning: boolean;
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

export interface IBarber {
    skill: 'base' | 'mid' | 'pro';
    isLearning: boolean;
}