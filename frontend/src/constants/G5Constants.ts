export interface ObjectInterface {
    name: string;
    icon: string;
    alt: 'restaurant' | 'tennisCourt' | 'conferenceHall' | 'swimmingPool';
    price: number;
}

export const roomPrices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const construcionObjects: ObjectInterface[] = [
    {
        name: 'Restorāns',
        icon: '/icons/restaurant.png',
        alt: 'restaurant',
        price: 100000,
    },
    {
        name: 'Konferenču zāle',
        icon: '/icons/conference.png',
        alt: 'conferenceHall',
        price: 200000,
    },
    {
        name: 'Tenisa korts',
        icon: '/icons/tennis.png',
        alt: 'tennisCourt',
        price: 300000,
    },
    {
        name: 'Baseins',
        icon: '/icons/pool.png',
        alt: 'swimmingPool',
        price: 500000,
    },
];

export const BuildingFromPrice = {
    '100000': 'restaurant',
    '300000': 'tennisCourt',
    '200000': 'conferenceHall',
    '500000': 'swimmingPool',
};

export const PriceFromBuilding = {
    restaurant: 100000,
    tennisCourt: 300000,
    conferenceHall: 200000,
    swimmingPool: 500000,
};

export const BuildingToU = {
    Restorāns: 'Restorāna',
    'Tenisa korts': 'Tenisa korta',
    'Konferenču zāle': 'Konferenču zāles',
    Baseins: 'Baseina',
};
