import { GameInterface } from '../types/game';

export const gameYears: Record<
    GameInterface['type'],
    GameInterface['year'] | null
> = {
    Bankrots: 'yearFive',
    'Krīzes gads': 'yearNine',
    'Lēnāk brauksi - tālāk tiksi': null,
    Viesnīca: 'yearTen',
    Frizētava: 'yearSix',
    Ražošana: null,
};
