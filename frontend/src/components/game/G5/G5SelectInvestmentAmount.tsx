import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GameInfo,
    selectGame,
    setSelectableInvestment,
} from '../../../redux/slices/gameSlice';
import LoadingWhite from '../../loading/LoadingWhite';
import { LanguageInfo, selectLanguage } from '../../../redux/slices/languageSlice';

interface SelectBuildingProps {
    text: string;
    fn: any;
    disabled: boolean;
    clicked: boolean;
    owned: boolean;
}

const G5SelectInvestmentValue: React.FC<{ val: number }> = ({ val }) => {
    const gameInfo: GameInfo = useSelector(selectGame);

    const dispatch = useDispatch();

    const selectAmountFn = () => {
        dispatch(setSelectableInvestment({ investment: val }));
    };

    return (
        <button
            className={`selectAmountButton w-10 h-8 flex items-center justify-center m-1 rounded-sm ${
                gameInfo.selectableInvestment === val
                    ? 'bg-BGdark_lightblue-lighter border-2 border-BGdark_lightblue-lighter text-white'
                    : 'bg-BGgray-light text-BGdark_lightblue'
            }`}
            onClick={() => selectAmountFn()}
        >
            {val}
        </button>
    );
};

const SelectBuildingButton: React.FC<SelectBuildingProps> = ({
    text,
    fn,
    disabled,
    clicked,
    owned,
}) => {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (owned) {
        return (
            <div className="relative">
                <button
                    disabled
                    className={`text-white w-full h-9 text-base rounded-sm bg-BGtext-gray cursor-default`}
                >
                    {languageInfo.language['g4-screens']['already-owned']}
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                disabled={disabled}
                className={`buildOptionButton text-white w-full h-9 text-base rounded-sm ${
                    Number(text.replace('€', '')) === gameInfo.investments.iv2
                        ? 'bg-BGdark_lightblue'
                        : 'bg-[#2C556E] opacity-70'
                } ${disabled && 'opacity-70 cursor-default'}`}
                onClick={(e) => fn(e)}
            >
                {!clicked ? (
                    <p className="text-white">{text}</p>
                ) : (
                    <LoadingWhite />
                )}
            </button>
        </div>
    );
};

export default G5SelectInvestmentValue;
export { SelectBuildingButton };
