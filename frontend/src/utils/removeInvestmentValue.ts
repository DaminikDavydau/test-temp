import { Dispatch } from 'redux';
import { removeAssets } from '../redux/slices/gameSlice';
import { PlayerInterface } from '../types/player';
import getInvestmentSum from './getInvestmentSum';

const removeInvestmentValue = (
    playerInfo: null | PlayerInterface,
    b1iv: number,
    b2iv: number,
    b3iv: number,
    b4iv: number,
    b5iv: number,
    dispatch: Dispatch
) => {
    if (!playerInfo) {
        return null;
    }

    const ivSum = getInvestmentSum(b1iv, b2iv, b3iv, b4iv, b5iv);

    if (ivSum > playerInfo.assets) {
        return;
    }

    dispatch(removeAssets(ivSum));
};

export default removeInvestmentValue;
