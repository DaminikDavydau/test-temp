import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import yearToNum from '../../../utils/yearToNum';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';
import { getOrdinal } from '../../../utils/pluralization';

function G2SidebarInfo() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-center">
                {gameInfo.secondGameHistory &&
                gameInfo.secondGameHistory.length > 0
                    ? languageInfo.language['g2-screens']['history-title']
                    : languageInfo.language['g2-screens'][
                          'history-placeholder'
                      ]}
            </h3>

            {gameInfo.secondGameHistory ? (
                <div className="flex flex-col items-center justify-center mt-4 w-48">
                    {gameInfo.secondGameHistory.map((hP, i) => {
                        return (
                            <div
                                className="flex items-center justify-between w-full h-10 border-2 border-BGdark-lighter"
                                key={i}
                            >
                                <div className="h-full w-3/6 flex justify-center items-center border-r-2 border-BGdark-lighter">
                                    <p>
                                        {languageInfo.language['g2-screens'][
                                            'history-year'
                                        ].replace(
                                            '[]',
                                            getOrdinal(yearToNum(hP.year), languageInfo.language['language-code'])
                                        )}
                                    </p>
                                </div>

                                <div className="h-full w-3/6 flex justify-center items-center">
                                    <p>{hP.pigs}</p>

                                    <img
                                        src="/icons/farm-house-black.png"
                                        alt="pig"
                                        className="h-6 ml-1"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

export default G2SidebarInfo;
