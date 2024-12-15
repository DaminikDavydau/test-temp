import { GameInterface } from "../types/game";

const values = {
    yearOne: 'yearTwo',
    yearTwo: 'yearThree',
    yearThree: 'yearFour',
    yearFour: 'yearFive',
    yearFive: 'yearSix',
    yearSix: 'yearSeven',
    yearSeven: 'yearEight',
    yearEight: 'yearNine',
    yearNine: 'yearTen',
    yearTen: 'yearEleven',
    yearEleven: "yearTwelve",
    yearTwelve: "yearThirteen",
    yearThirteen: "yearFourteen",
    yearFourteen: "yearFifteen",
    yearFifteen: "yearSixteen",
    yearSixteen: "yearSeventeen",
    yearSeventeen: "yearEighteen",
    yearEighteen: "yearNineteen",
    yearNineteen: "yearNineteen"
};

const nextGameYear = (year: GameInterface['year']) => {
    return values[year];
} 

export default nextGameYear;