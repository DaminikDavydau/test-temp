import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GameInfo,
    selectGame,
    setSelectableInvestment,
} from '../../../redux/slices/gameSlice';
import { LanguageInfo, selectLanguage } from '../../../redux/slices/languageSlice';

interface Props {
    val: number | string;
}

const SelectAmountButton: React.FC<Props> = ({ val }) => {
    const dispatch = useDispatch();

    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const gameInfo: GameInfo = useSelector(selectGame);

    const selectAmountFn = () => {
        if (typeof val === 'string') {
            dispatch(setSelectableInvestment({ investment: 0 }));
        } else {
            dispatch(setSelectableInvestment({ investment: val }));
        }
    };

    return (
        <button
            className={`selectAmountButton w-full h-8 ${
                (gameInfo.selectableInvestment === val && gameInfo.investments.iv2 !== 0) ||
                (gameInfo.selectableInvestment === 0 && val === languageInfo.language['g3-screens']['take-a-break'])
                    ? 'bg-BGdark_lightblue-lighter border-2 border-BGdark_lightblue-lighter text-white'
                    : 'bg-BGgray-light text-BGdark_lightblue'
            }`}
            onClick={() => selectAmountFn()}
        >
            {val}
            {gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' &&
            typeof val !== 'string'
                ? 'km/h'
                : ''}
        </button>
    );
};

export default SelectAmountButton;
