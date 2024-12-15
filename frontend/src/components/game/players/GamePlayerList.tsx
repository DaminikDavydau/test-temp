import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import GamePlayerContainer from './GamePlayerContainer';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function GamePlayerList() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="h-[300px] w-full flex flex-col items-center justify-start overflow-y-scroll mt-10">
            {gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' ? (
                <div className="w-[500px] flex items-center justify-between my-4">
                    <div className="w-[200px] flex items-center justify-start">
                        <p className="text-start">
                            {languageInfo.language['generic-game-screen'].name}
                        </p>
                    </div>

                    <div className="w-[150px] flex items-center justify-start">
                        <p className="text-center">
                            {
                                languageInfo.language['g3-screens'][
                                    'distance-made'
                                ]
                            }
                        </p>
                    </div>

                    <div className="w-[150px] flex items-center justify-end">
                        <p className="text-end">
                            {
                                languageInfo.language['g3-screens'][
                                    'distance-left'
                                ]
                            }
                        </p>
                    </div>
                </div>
            ) : gameInfo.activeGame?.type === 'Frizētava' ? (
                <div className="w-[500px] flex items-center justify-between my-4">
                    <div className="w-[200px] flex items-center justify-start">
                        <p className="text-start">
                            {languageInfo.language['generic-game-screen'].name}
                        </p>
                    </div>

                    <div className="w-[150px] flex items-center justify-start">
                        <p className="text-start">
                            {
                                languageInfo.language['g6-screens'][
                                    'barbershop-count'
                                ]
                            }
                        </p>
                    </div>

                    <div className="w-[150px] flex items-center justify-end">
                        <p className="text-end">
                            {
                                languageInfo.language['generic-game-screen'][
                                    'money-in-account'
                                ]
                            }
                        </p>
                    </div>
                </div>
            ) : gameInfo.activeGame?.type === 'Ražošana' ? (
                <div className="w-[500px] flex items-center justify-between my-4">
                    <div className="w-[200px] flex items-center justify-start">
                        <p className="text-start">
                            {languageInfo.language['generic-game-screen'].name}
                        </p>
                    </div>

                    <div className="w-[150px] flex items-center justify-center">
                        {Number(
                            gameInfo.g4Data.machines?.filter(
                                (m) => m.owner === null
                            )?.length
                        ) >= 1 ? (
                            <p className="text-start">
                                {
                                    languageInfo.language['generic-game-screen']
                                        .bid
                                }
                            </p>
                        ) : null}
                    </div>

                    <div className="w-[150px] flex items-center justify-end">
                        <p className="text-end">
                            {
                                languageInfo.language['generic-game-screen'][
                                    'money-in-account'
                                ]
                            }
                        </p>
                    </div>
                </div>
            ) : null}

            {gameInfo.players &&
                gameInfo.gameInvestments &&
                gameInfo.activeGame &&
                [...gameInfo.players]
                    .sort((a, b) => {
                        if (a.assets === 0 && b.assets !== 0) {
                            return 1;
                        } else if (a.assets !== 0 && b.assets === 0) {
                            return -1;
                        } else {
                            return b.assets - a.assets;
                        }
                    })
                    .map((player, i) => {
                        return <GamePlayerContainer key={i} player={player} />;
                    })}
        </div>
    );
}

export default GamePlayerList;
