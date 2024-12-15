import { GameInterface } from '../types/game';
import { InvestmentInterface } from '../types/investment';

const getCurrentYearInvestments = (
    investments: InvestmentInterface[] | null,
    year: GameInterface['year'] | undefined
) => {
    if (!investments || !year) {
        return [];
    }

    return investments.filter((investment) => investment.year === year);
};

export default getCurrentYearInvestments;
