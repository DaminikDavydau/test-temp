import { GameInterface } from '../types/game';

const values = {
    yearOne: 'yearOne',
    yearTwo: 'yearOne',
    yearThree: 'yearTwo',
    yearFour: 'yearThree',
    yearFive: 'yearFour',
    yearSix: 'yearFive',
    yearSeven: 'yearSix',
    yearEight: 'yearSeven',
    yearNine: 'yearEight',
    yearTen: 'yearNine',
    yearEleven: "yearTen",
    yearTwelve: "yearEleven",
    yearThirteen: "yearTwelve",
    yearFourteen: "yearThirteen",
    yearFifteen: "yearFourteen",
    yearSixteen: "yearFifteen",
    yearSeventeen: "yearSixteen",
    yearEighteen: "yearSeventeen",
    yearNineteen: "yearEighteen"
};

const prevGameYearString = (year: GameInterface['year'] | undefined) => {
    if (!year) {
        return null;
    }

    return values[year];
};

export default prevGameYearString;
