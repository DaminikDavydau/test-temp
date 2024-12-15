import React from 'react';
import { pigPriceVariables } from './../../../data/ruleVariables';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

function GameTwoRules() {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="w-full h-full flex flex-col items-center justify-start pt-10">
            <h3 className="mb-12">
                {languageInfo.language['g2-screens'].rules.price}
            </h3>

            <div className="flex flex-col items-center justify-center">
                <p>{languageInfo.language['g2-screens'].rules.count}</p>

                <div className="flex justify-center items-end mt-2">
                    <div className="flex flex-col justify-center items-end mr-2 gap-1">
                        <p>
                            {
                                languageInfo.language['g2-screens'].rules[
                                    'good-year'
                                ]
                            }
                        </p>
                        <p>
                            {
                                languageInfo.language['g2-screens'].rules[
                                    'bad-year'
                                ]
                            }
                        </p>
                    </div>

                    <div className="flex items-center justify-center">
                        {pigPriceVariables.map((pigP, i) => {
                            return (
                                <div
                                    className="w-20 flex flex-col items-center justify-center"
                                    key={i}
                                >
                                    <p>{pigP.pigAmount}</p>

                                    <div className="flex flex-col border-2 border-BGgray-dark w-full">
                                        <div className="flex flex-col items-center justify-center">
                                            <p>{pigP.goodYear}€</p>
                                        </div>

                                        <div className="flex flex-col items-center justify-center border-0 border-t-2 border-BGgray-dark">
                                            <p>{pigP.badYear}€</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameTwoRules;
