import React from 'react';
import { penaltiesAndBonuses } from '../../../data/ruleVariables';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

const LeftTable = () => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="w-60 mr-8">
            <div className="w-full flex justify-center items-center mb-2">
                <p className="text-center">
                    {languageInfo.language['g3-screens'].rules.penalies}
                </p>
            </div>

            <div className="w-full flex justify-between items-center">
                <div className="w-20 h-14 flex items-center justify-center border-2 border-BGdark-lighter border-r-0 border-b-0">
                    <p className="text-center">
                        {languageInfo.language['g3-screens'].rules.speed} (km/h)
                    </p>
                </div>

                <div className="w-24 h-14 flex items-center justify-center border-2 border-BGdark-lighter border-b-0">
                    <p className="text-center">
                        {languageInfo.language['g3-screens'].rules.chance}
                    </p>
                </div>

                <div className="w-16 h-14 flex items-center justify-center border-2 border-BGdark-lighter border-l-0 border-b-0">
                    <p className="text-center">
                        {languageInfo.language['g3-screens'].rules.penalty}
                    </p>
                </div>
            </div>

            {penaltiesAndBonuses.penalties.map((pNb, i) => {
                return (
                    <div
                        className="w-full flex justify-between items-center"
                        key={i}
                    >
                        <div
                            className={`w-20 h-8 flex items-center justify-center border-2 border-BGdark-lighter border-r-0 ${
                                i + 1 === penaltiesAndBonuses.penalties.length
                                    ? ''
                                    : 'border-b-0'
                            }`}
                        >
                            <p>{pNb.speed}</p>
                        </div>

                        <div
                            className={`w-24 h-8 flex items-center justify-center border-2 border-BGdark-lighter ${
                                i + 1 === penaltiesAndBonuses.penalties.length
                                    ? ''
                                    : 'border-b-0'
                            }`}
                        >
                            <p>{pNb.chance}</p>
                        </div>

                        <div
                            className={`w-16 h-8 flex items-center justify-center border-2 border-BGdark-lighter border-l-0 ${
                                i + 1 === penaltiesAndBonuses.penalties.length
                                    ? ''
                                    : 'border-b-0'
                            }`}
                        >
                            <p>{pNb.penalty}€</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const MiddleTable = () => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="w-60 flex flex-col items-center mr-8">
            <div className="w-full flex justify-center items-center mb-2">
                <p className="text-center">
                    {
                        languageInfo.language['g3-screens']['info-screen'][
                            'fine-not-sleeping-title'
                        ]
                    }
                </p>
            </div>

            <div className="w-full flex justify-between items-center">
                <div
                    className={`w-[159px] h-20 flex items-center justify-center border-2 border-BGdark-lighter border-r-0`}
                >
                    <p className="text-center">
                        {
                            languageInfo.language['g3-screens']['info-screen'][
                                penaltiesAndBonuses.bigPenalty.text
                            ]
                        }
                    </p>
                </div>

                <div
                    className={`w-[81px] h-20 flex items-center justify-center border-2 border-BGdark-lighter`}
                >
                    <p className="text-center">
                        {penaltiesAndBonuses.bigPenalty.penalty}€
                    </p>
                </div>
            </div>
        </div>
    );
};

const RightTable = () => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="w-60">
            <div className="w-full flex justify-center items-center mb-2">
                <p className="text-center">
                    {
                        languageInfo.language['g3-screens']['info-screen'][
                            'bonuses'
                        ]
                    }
                </p>
            </div>

            {penaltiesAndBonuses.bonuses.map((bonus, i) => {
                return (
                    <div
                        className="w-full flex justify-between items-center"
                        key={i}
                    >
                        <div
                            className={`w-40 h-20 flex items-center justify-center border-2 border-BGdark-lighter border-r-0 ${
                                penaltiesAndBonuses.bonuses.length - 1 === i
                                    ? ''
                                    : 'border-b-0'
                            }`}
                        >
                            <p className="text-center">
                                {
                                    languageInfo.language['g3-screens'][
                                        'info-screen'
                                    ][bonus.text]
                                }
                            </p>
                        </div>

                        <div
                            className={`w-20 h-20 flex items-center justify-center border-2 border-BGdark-lighter ${
                                penaltiesAndBonuses.bonuses.length - 1 === i
                                    ? ''
                                    : 'border-b-0'
                            }`}
                        >
                            <p className="text-center">+{bonus.bonus}€</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

function GameThreeRules() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-end justify-center mt-6">
                <LeftTable />

                <MiddleTable />

                <RightTable />
            </div>
        </div>
    );
}

export default GameThreeRules;
