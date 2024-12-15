import { PlayerInterface } from '../types/player';
import getInvestmentSum from './getInvestmentSum';

const checkIfAllInvested = (
    playerInfo: null | PlayerInterface,
    b1iv: number,
    b2iv: number,
    b3iv: number,
    b4iv: number,
    b5iv: number
) => {
    if (!playerInfo) {
        return false;
    }

    const ivSum = getInvestmentSum(b1iv, b2iv, b3iv, b4iv, b5iv);

    if (ivSum < playerInfo.assets) {
        return false;
    }

    return true;
};

export default checkIfAllInvested;
