import {
    BuildingFromPrice,
    BuildingToU,
    construcionObjects,
    PriceFromBuilding,
} from '../constants/G5Constants';

export const getBuildingFromPrice = (val: number) => {
    let stringifiedVal = String(val);
    let building = '';

    if (
        stringifiedVal === '100000' ||
        stringifiedVal === '200000' ||
        stringifiedVal === '300000' ||
        stringifiedVal === '500000'
    ) {
        building = BuildingFromPrice[stringifiedVal];
    }

    return building;
};

export const getPriceFromBuilding = (val: string) => {
    let price = 0;

    if (
        val === 'restaurant' ||
        val === 'tennisCourt' ||
        val === 'conferenceHall' ||
        val === 'swimmingPool'
    ) {
        price = PriceFromBuilding[val];
    }

    if (price > 0) {
        return -price;
    }

    return price;
};

export const translateBuilding = (val: string) => {
    const translateObject = construcionObjects.find(
        (ob) => ob.alt === val.toLowerCase()
    );
    if (!translateObject) {
        return '';
    }

    return translateObject.name;
};

export const getBuildingToU = (val: string) => {
    let building = '';

    if (
        val === 'Restorāns' ||
        val === 'Tenisa korts' ||
        val === 'Konferenču zāle' ||
        val === 'Baseins'
    ) {
        building = BuildingToU[val];
    }

    return building;
};
