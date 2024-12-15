import React from 'react';
import { useSelector } from 'react-redux';
import { ruleVariables } from '../../../data/ruleVariables';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import G1SidebarOption from './G1SidebarOption';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G1SidebarInfo() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className='text-center'>{languageInfo.language['g1-screens']['market-situation']}</h3>

            <div className="flex items-center justify-center mt-10">
                <div className="flex flex-col">
                    <div className="flex justify-end items-center w-full">
                        <div className="w-40 flex items-center justify-between mb-2">
                            <small className="w-3/6 text-center">
                                {languageInfo.language['g1-screens'].return}
                            </small>

                            <small className="w-3/6 text-center">
                                {
                                    languageInfo.language['g1-screens'][
                                        'bankrupcy-probability'
                                    ]
                                }
                            </small>
                        </div>
                    </div>

                    <G1SidebarOption
                        icon="/icons/hairdresser-black.png"
                        returnRate={Number(
                            ruleVariables.businessOne[
                                gameInfo.activeGame.year
                            ].percentage.replace('%', '')
                        )}
                        chance={
                            ruleVariables.businessOne[gameInfo.activeGame.year]
                                .chance
                        }
                    />

                    <G1SidebarOption
                        icon="/icons/farm-house-black.png"
                        returnRate={Number(
                            ruleVariables.businessTwo[
                                gameInfo.activeGame.year
                            ].percentage.replace('%', '')
                        )}
                        chance={
                            ruleVariables.businessTwo[gameInfo.activeGame.year]
                                .chance
                        }
                    />

                    <G1SidebarOption
                        icon="/icons/shop-black.png"
                        returnRate={Number(
                            ruleVariables.businessThree[
                                gameInfo.activeGame.year
                            ].percentage.replace('%', '')
                        )}
                        chance={
                            ruleVariables.businessThree[
                                gameInfo.activeGame.year
                            ].chance
                        }
                    />

                    <G1SidebarOption
                        icon="/icons/hospital-black.png"
                        returnRate={Number(
                            ruleVariables.businessFour[
                                gameInfo.activeGame.year
                            ].percentage.replace('%', '')
                        )}
                        chance={
                            ruleVariables.businessFour[gameInfo.activeGame.year]
                                .chance
                        }
                    />

                    <G1SidebarOption
                        icon="/icons/bank-black.png"
                        returnRate={Number(
                            ruleVariables.businessFive[
                                gameInfo.activeGame.year
                            ].percentage.replace('%', '')
                        )}
                        chance={
                            ruleVariables.businessFive[gameInfo.activeGame.year]
                                .chance
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default G1SidebarInfo;
