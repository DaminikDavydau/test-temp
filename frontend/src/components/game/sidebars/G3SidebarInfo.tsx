import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import yearToNum from '../../../utils/yearToNum';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G3SidebarInfo() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-center mx-2">
                {gameInfo.thirdGameHistory &&
                gameInfo.thirdGameHistory.length > 0
                    ? languageInfo.language['g3-screens']['history-title']
                    : languageInfo.language['g3-screens'][
                          'history-placeholder'
                      ]}
            </h3>

            {gameInfo.thirdGameHistory ? (
                <div className="flex flex-col items-center justify-center mt-4 w-60">
                    <div className="flex items-center justify-between w-full h-10 border-2 border-BGdark-lighter">
                        <div className="h-full w-2/6 flex justify-center items-center border-r-2 border-BGdark-lighter">
                            <p>
                                {
                                    languageInfo.language['g3-screens'][
                                        'info-screen'
                                    ].hour
                                }
                            </p>
                        </div>

                        <div className="h-full w-2/6 flex justify-center items-center border-r-2 border-BGdark-lighter">
                            <p>
                                {' '}
                                {
                                    languageInfo.language['g3-screens'][
                                        'info-screen'
                                    ].speed2
                                }
                            </p>
                        </div>

                        <div className="h-full w-2/6 flex justify-center items-center">
                            <p>
                                {
                                    languageInfo.language['g3-screens'][
                                        'info-screen'
                                    ].fine
                                }
                            </p>
                        </div>
                    </div>

                    {gameInfo.thirdGameHistory.map((hP, i) => {
                        return (
                            <div
                                className="flex items-center justify-between w-full h-10 border-2 border-BGdark-lighter border-t-0"
                                key={i}
                            >
                                <div className="h-full w-2/6 flex justify-center items-center border-r-2 border-BGdark-lighter">
                                    <p>{yearToNum(hP.hour)} h</p>
                                </div>

                                <div className="h-full w-2/6 flex justify-center items-center border-r-2 border-BGdark-lighter">
                                    <p>{hP.speed}km/h</p>
                                </div>

                                <div className="h-full w-2/6 flex justify-center items-center">
                                    <p>
                                        {hP.penalty === 0
                                            ? '-'
                                            : `${hP.penalty}€`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

export default G3SidebarInfo;
