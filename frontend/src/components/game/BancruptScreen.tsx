import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function BancruptScreen() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="page flex flex-col items-center justify-center">
            <h2>
                {gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
                    ? languageInfo.language['g3-screens'].congrats
                    : `${
                          gameInfo.activeGame?.type === 'Krīzes gads'
                              ? languageInfo.language['g2-screens'][
                                    'bancrupt-4000'
                                ]
                              : languageInfo.language['generic-game-screen']
                                    .bancrupt
                      }`}
            </h2>

            <h3 className="mt-4">
                {gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
                    ? languageInfo.language['g3-screens']['wait-for-others']
                    : languageInfo.language['generic-game-screen'][
                          'wait-game-end'
                      ]}
            </h3>
        </div>
    );
}

export default BancruptScreen;
