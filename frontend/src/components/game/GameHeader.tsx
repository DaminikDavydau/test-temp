import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import HeaderProgressBar from './progress/HeaderProgressBar';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function GameHeader() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [adminView] = useState(
        userInfo.info &&
            gameInfo.activeGame &&
            userInfo.info._id === gameInfo.activeGame.admin
    );

    if (!gameInfo.activeGame || !gameInfo.admin) {
        return null;
    }

    if (
        !gameInfo.activeGame.started &&
        gameInfo.activeGame.year !== 'yearOne'
    ) {
        return (
            <header className="w-full h-28 mt-12 bg-BGdark_lightblue border-b-2 border-BGlight px-12 flex justify-between items-start pt-1">
                <h4 className="w-80 text-white">
                    {
                        languageInfo.language['game-translations'][
                            gameInfo.activeGame.type
                        ]
                    }
                </h4>

                {!gameInfo.crisisYearResult && !gameInfo.returns ? (
                    <h3 className="text-white text-center">
                        {
                            languageInfo.language['generic-game-screen'][
                                'results-title'
                            ]
                        }
                    </h3>
                ) : (
                    <HeaderProgressBar />
                )}

                <div className="flex flex-col item-end justify-end w-80" />
            </header>
        );
    }

    if (adminView && !gameInfo.activeGame.started) {
        return (
            <header className="w-full h-28 mt-12 bg-white border-b-2 border-BGlight px-12 flex justify-between items-start pt-1">
                <h4 className="w-80">
                    {
                        languageInfo.language['game-translations'][
                            gameInfo.activeGame.type
                        ]
                    }
                </h4>

                <h1 id={'gameCode'} className="game_code">{gameInfo.activeGame.code}</h1>

                <div className="flex flex-col item-end justify-end w-80">
                    <div className="flex w-full items-center justify-end">
                        <p>
                            {gameInfo.admin.name} (
                            {languageInfo.language['generic-game-screen'].you})
                        </p>

                        <img
                            src="/icons/single-player.png"
                            alt="single user"
                            className="h-5 ml-2"
                        />
                    </div>

                    <div className="flex w-full items-center justify-end">
                        <p>
                            {gameInfo.players ? gameInfo.players.length : 0}{' '}
                            {
                                gameInfo.players && gameInfo.players.length === 1
                                    ? languageInfo.language['generic-game-screen'].player
                                    : languageInfo.language['generic-game-screen'].players
                            }
                        </p>

                        <img
                            src="/icons/player-group.png"
                            alt="player group"
                            className="h-5 ml-2"
                        />
                    </div>
                </div>
            </header>
        );
    }

    if (gameInfo.activeGame.started) {
        return (
            <header
                className={`w-full h-28 mt-12 bg-BGdark_lightblue ${
                    !gameInfo.crisisYearResult && 'border-b-2 border-BGlight'
                } px-12 flex justify-between items-start pt-1`}
            >
                <h3 className="w-80 text-white">
                    {
                        languageInfo.language['game-translations'][
                            gameInfo.activeGame.type
                        ]
                    }
                </h3>

                <HeaderProgressBar />

                <div className="flex flex-col item-end justify-end w-80">
                    <div className="flex w-full items-center justify-end">
                        <p className="text-white">
                            {gameInfo.admin.name} (
                            {adminView
                                ? languageInfo.language['generic-game-screen']
                                      .you
                                : languageInfo.language['generic-game-screen'][
                                      'game-owner'
                                  ]}
                            )
                        </p>

                        <img
                            src="/icons/single-player.png"
                            alt="single user"
                            className="h-5 ml-2 invert"
                        />
                    </div>

                    {adminView && gameInfo.players && (
                        <div className="flex w-full items-center justify-end">
                            <p className="text-white">
                                {gameInfo.players.length}
                            </p>

                            <img
                                src="/icons/player-group.png"
                                alt="player group"
                                className="h-5 ml-2 invert"
                            />
                        </div>
                    )}
                </div>
            </header>
        );
    }

    return (
        <header className="w-full h-10 mt-12 bg-white px-12 flex justify-between items-center pt-1">
            <h4 className="w-80">
                {
                    languageInfo.language['game-translations'][
                        gameInfo.activeGame.type
                    ]
                }
            </h4>
        </header>
    );
}

export default GameHeader;
