import { BBSIncome } from '../redux/slices/gameSlice';

const getPricePerPig = (
    totalPigs:
        | number
        | boolean
        | Record<string, number>
        | BBSIncome[]
        | string
        | string[],
    crisisYear:
        | boolean
        | number
        | string
        | string[]
        | Record<string, number>
        | BBSIncome[]
) => {
    if (typeof totalPigs !== 'number' || typeof crisisYear !== 'boolean') {
        return null;
    }

    if (crisisYear) {
        if (totalPigs <= 40) {
            return 80;
        } else if (totalPigs <= 60) {
            return 60;
        } else if (totalPigs <= 80) {
            return 40;
        } else if (totalPigs <= 100) {
            return 20;
        } else if (totalPigs <= 200) {
            return 10;
        } else if (totalPigs <= 400) {
            return 5;
        } else {
            return 3;
        }
    } else {
        if (totalPigs <= 40) {
            return 100;
        } else if (totalPigs <= 60) {
            return 80;
        } else if (totalPigs <= 80) {
            return 60;
        } else if (totalPigs <= 100) {
            return 40;
        } else if (totalPigs <= 200) {
            return 20;
        } else if (totalPigs <= 400) {
            return 10;
        } else {
            return 5;
        }
    }
};

export { getPricePerPig };
