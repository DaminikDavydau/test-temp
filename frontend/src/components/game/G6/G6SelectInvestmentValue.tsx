import React from 'react';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';
import { useDispatch, useSelector } from 'react-redux';

const G6SelectInvestmentValue: React.FC<{
    val: number | string;
    check: string | number | boolean;
    stars: boolean;
    cost: string;
    placeholder?: string;
    full?: boolean;
    disabled?: boolean;
    prevS?: boolean;
    setVal: React.Dispatch<React.SetStateAction<string | number | boolean>>;
    disableShow?: boolean;
}> = ({
    val,
    check,
    setVal,
    stars,
    cost,
    placeholder,
    full,
    disabled,
    prevS,
    disableShow,
}) => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const selectAmountFn = () => {
        if (val === languageInfo.language['g6-screens']['self-employment']) {
            setVal(true);
            return;
        } else if (
            val === languageInfo.language['g6-screens']['employ-someone']
        ) {
            setVal(false);
            return;
        }
        setVal(val);
    };

    return (
        <div
            className={`flex flex-col items-center justify-center mx-2 ${
                full ? 'w-full' : 'w-24'
            }`}
        >
            <button
                disabled={disabled}
                className={`hairSalonOptionsButton w-full h-10 flex items-center justify-center m-1 rounded-sm ${
                    (check === val ||
                        (val ===
                            languageInfo.language['g6-screens'][
                                'self-employment'
                            ] &&
                            check === true) ||
                        (val ===
                            languageInfo.language['g6-screens'][
                                'employ-someone'
                            ] &&
                            check === false)) &&
                    !disabled
                        ? 'bg-BGdark_lightblue-lighter border-2 border-BGdark_lightblue-lighter text-white'
                        : prevS
                        ? 'bg-BG_blue'
                        : 'bg-BGgray-light text-BGdark_lightblue'
                } ${disabled ? 'opacity-60' : ''}`}
                onClick={() => selectAmountFn()}
            >
                {stars ? (
                    <div className="flex">
                        {new Array(val).fill('').map((y, i) => {
                            return (
                                <img
                                    key={i}
                                    src="/icons/star.png"
                                    alt="star"
                                    className={`h-4 mx-1 ${
                                        (check === val ||
                                            (val ===
                                                languageInfo.language[
                                                    'g6-screens'
                                                ]['self-employment'] &&
                                                check === true) ||
                                            (val ===
                                                languageInfo.language[
                                                    'g6-screens'
                                                ]['employ-someone'] &&
                                                check === false)) &&
                                        !disabled
                                            ? 'invert'
                                            : ''
                                    }`}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <p
                        className={`${
                            (check === val ||
                                (val ===
                                    languageInfo.language['g6-screens'][
                                        'self-employment'
                                    ] &&
                                    check === true) ||
                                (val ===
                                    languageInfo.language['g6-screens'][
                                        'employ-someone'
                                    ] &&
                                    check === false)) &&
                            !disabled
                                ? ' text-white'
                                : 'text-BGdark_lightblue'
                        }`}
                    >
                        {val === 'centrs' || val === 'perifērija'
                            ? languageInfo.language['g6-screens'][val]
                            : val}
                    </p>
                )}
            </button>

            {!disableShow ? (
                <p className="mt-1 text-BGdark-lighter">{cost}</p>
            ) : null}
        </div>
    );
};

export default G6SelectInvestmentValue;
