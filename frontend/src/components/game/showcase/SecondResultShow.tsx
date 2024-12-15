import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { getPricePerPig } from '../../../utils/getPricePerPig';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function SecondResultShow() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.crisisYearResult) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h2>
                {languageInfo.language['g2-screens']['review-screen'].title}
            </h2>

            <div className="w-full flex items-start justify-between mt-12 px-20 h-48">
                <div className="flex flex-col items-center justify-between w-80 h-full">
                    <div className="w-full flex flex-col items-center">
                        <div className="flex w-full justify-between items-center my-2">
                            <h3>
                                {
                                    languageInfo.language['g2-screens'][
                                        'review-screen'
                                    ]['pigs-bought']
                                }
                                :
                            </h3>

                            <h3>{gameInfo.crisisYearResult.pigsExpenses}€</h3>
                        </div>

                        <div className="flex w-full justify-between items-center my-2">
                            <h3>
                                {
                                    languageInfo.language['g2-screens'][
                                        'review-screen'
                                    ]['family-expenses']
                                }
                                :
                            </h3>

                            <h3>{gameInfo.crisisYearResult.familyExpenses}€</h3>
                        </div>

                        <div className="flex w-full justify-between items-center my-2">
                            <h3>
                                {
                                    languageInfo.language['g2-screens'][
                                        'review-screen'
                                    ]['bank-percentages']
                                }
                                :
                            </h3>

                            <h3>{gameInfo.crisisYearResult.bankExpenses}€</h3>
                        </div>
                    </div>

                    <div className="flex w-full justify-between items-center border-t-2 border-b-2 border-BGdark-lighter py-2">
                        <h3>
                            {
                                languageInfo.language['g2-screens'][
                                    'review-screen'
                                ].expenses
                            }
                            :
                        </h3>

                        <h3 className="font-semibold">
                            {Number(gameInfo.crisisYearResult.pigsExpenses) +
                                Number(
                                    gameInfo.crisisYearResult.familyExpenses
                                ) +
                                Number(gameInfo.crisisYearResult.bankExpenses)}
                            €
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between w-80 h-full">
                    <div className="w-full flex flex-col items-center">
                        <div className="flex w-full justify-between items-center my-2">
                            <h3>
                                {
                                    languageInfo.language['g2-screens'][
                                        'review-screen'
                                    ]['pigs-sold']
                                }
                                :
                            </h3>

                            <h3>{gameInfo.crisisYearResult.playerPigs}</h3>
                        </div>

                        <div className="flex w-full justify-between items-center my-2">
                            <h3>
                                {
                                    languageInfo.language['g2-screens'][
                                        'review-screen'
                                    ]['pig-price']
                                }
                                :
                            </h3>

                            <h3>
                                {getPricePerPig(
                                    gameInfo.crisisYearResult.pigsOnMarket,
                                    gameInfo.crisisYearResult.crisisYear
                                )}
                                €
                            </h3>
                        </div>
                    </div>

                    <div className="flex w-full justify-between items-center border-t-2 border-b-2 border-BGdark-lighter py-2">
                        <h3>
                            {
                                languageInfo.language['g2-screens'][
                                    'review-screen'
                                ].incomes
                            }
                            :
                        </h3>

                        <h3 className="font-semibold">
                            {Number(gameInfo.crisisYearResult.pigsIncomes) >
                                0 && '+'}
                            {gameInfo.crisisYearResult.pigsIncomes}€
                        </h3>
                    </div>
                </div>
            </div>

            <div className="w-full flex items-center justify-end px-20 mt-2">
                <div className="w-80">
                    <div className="flex w-full justify-between items-center my-2">
                        <h3>
                            {
                                languageInfo.language['g2-screens'][
                                    'review-screen'
                                ]['money-before']
                            }
                            :
                        </h3>

                        <h3>
                            {Number(gameInfo.changableAssets) -
                                Number(gameInfo.crisisYearResult.totalIncome)}
                            €
                        </h3>
                    </div>

                    <div className="flex w-full justify-between items-center my-2">
                        <h3>
                            {
                                languageInfo.language['g2-screens'][
                                    'review-screen'
                                ].revenue
                            }
                            :
                        </h3>

                        <h3>
                            {Number(gameInfo.crisisYearResult.totalIncome) >
                                0 && '+'}
                            {gameInfo.crisisYearResult.totalIncome}€
                        </h3>
                    </div>

                    <div className="flex w-full justify-between items-center my-2 border-t-2 border-b-2 border-BGdark-lighter py-2">
                        <h3>
                            {
                                languageInfo.language['g2-screens'][
                                    'review-screen'
                                ]['money-after']
                            }
                            :
                        </h3>

                        <h3 className="font-semibold">
                            {gameInfo.changableAssets}€
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecondResultShow;
