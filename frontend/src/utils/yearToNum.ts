import { gameYears } from '../constants/gameYears';
import { GameInterface } from '../types/game';

const values = {
    yearOne: 1,
    yearTwo: 2,
    yearThree: 3,
    yearFour: 4,
    yearFive: 5,
    yearSix: 6,
    yearSeven: 7,
    yearEight: 8,
    yearNine: 9,
    yearTen: 10,
    yearEleven: 11,
    yearTwelve: 12,
    yearThirteen: 13,
    yearFourteen: 14,
    yearFifteen: 15,
    yearSixteen: 16,
    yearSeventeen: 17,
    yearEighteen: 18,
    yearNineteen: 19,
};

const yearToNum = (
    yearStr: GameInterface['year'] | undefined | null,
    type?: GameInterface['type']
) => {
    if (!yearStr) {
        if (!type) {
            return null;
        }
        const activeYear = gameYears[type];
        if (!activeYear) {
            return null;
        }

        const yearVal = values[activeYear];
        if (!yearVal) {
            return null;
        }

        return yearVal;
    }

    const yearVal = values[yearStr];
    if (!yearVal) {
        return null;
    }

    return yearVal;
};

export default yearToNum;
