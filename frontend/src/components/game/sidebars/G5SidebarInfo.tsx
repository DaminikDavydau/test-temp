import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import yearToNum from '../../../utils/yearToNum';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G5SidebarInfo() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-center">
                {gameInfo.fifthGameHistory &&
                gameInfo.fifthGameHistory.length > 0
                    ? languageInfo.language['g5-screens']['history-title']
                    : languageInfo.language['g5-screens'][
                          'history-placeholder'
                      ]}
            </h3>
            {gameInfo.fifthGameHistory &&
            gameInfo.fifthGameHistory.length > 0 ? (
                <div className="flex flex-col items-center justify-center mt-4 w-60">
                    <div className="flex items-center justify-between w-full h-15 border-2 border-BGdark-lighter">
                        <div className="h-full w-1/4 flex justify-center items-center border-r-2 border-BGdark-lighter">
                            <p className="text-xs text-center">
                                {
                                    languageInfo.language['generic-game-screen']
                                        .year
                                }
                            </p>
                        </div>

                        <div className="h-full w-1/4 flex justify-center items-center border-r-2 border-BGdark-lighter">
                            <p className="text-xs text-center">
                                {
                                    languageInfo.language['g5-screens'][
                                        'avg-price'
                                    ]
                                }
                            </p>
                        </div>

                        <div className="h-full w-1/4 flex justify-center items-center border-r-2 border-BGdark-lighter">
                            <p className="text-xs text-center">
                                {
                                    languageInfo.language['g5-screens'][
                                        'your-price'
                                    ]
                                }
                            </p>
                        </div>

                        <div className="h-full w-1/4 flex justify-center items-center">
                            <p className="text-xs text-center">
                                {
                                    languageInfo.language['g5-screens'][
                                        'client-count'
                                    ]
                                }
                            </p>
                        </div>
                    </div>

                    {gameInfo.fifthGameHistory.map((hP, i) => {
                        return (
                            <div
                                className="flex items-center justify-between w-full h-10 border-2 border-BGdark-lighter border-t-0"
                                key={i}
                            >
                                <div className="h-full w-1/4 flex justify-center items-center border-r-2 border-BGdark-lighter">
                                    <p className="text-xs">
                                        {yearToNum(hP.year)}.{' '}
                                        {languageInfo.language[
                                            'generic-game-screen'
                                        ].year.toLowerCase()}
                                    </p>
                                </div>

                                <div className="h-full w-1/4 flex justify-center items-center border-r-2 border-BGdark-lighter">
                                    <p>{hP.averagePrice}</p>
                                    <img
                                        src="/icons/dollaz.png"
                                        alt="money"
                                        className="ml-1 h-5"
                                    />
                                </div>

                                <div className="h-full w-1/4 flex justify-center items-center border-r-2 border-BGdark-lighter">
                                    <p>{hP.price}</p>
                                    <img
                                        src="/icons/dollaz.png"
                                        alt="money"
                                        className="ml-1 h-5"
                                    />
                                </div>

                                <div className="h-full w-1/4 flex justify-center items-center">
                                    <p>{hP.clients}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

export default G5SidebarInfo;
