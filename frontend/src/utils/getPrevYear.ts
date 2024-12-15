import { GameInterface } from '../types/game';
import yearToNum from './yearToNum';

const getPrevYear = (yearStr: GameInterface['year'] | undefined) => {
    if (!yearStr) {
        return null;
    }

    const currentYearToNum = yearToNum(yearStr);
    if (!currentYearToNum) {
        return null;
    }

    return currentYearToNum - 1;
};

export default getPrevYear;
