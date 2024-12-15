import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import getPrevYear from '../../../utils/getPrevYear';
import yearToNum from '../../../utils/yearToNum';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function HeaderProgressBar() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [activeYear, setActiveYear] = useState<null | number>(null);

    useEffect(() => {
        if (!gameInfo.activeGame) {
            return;
        }

        if (!gameInfo.activeGame.started && gameInfo.crisisYearResult) {
            setActiveYear(
                yearToNum(gameInfo.activeGame.year, gameInfo.activeGame.type)
            );
            return;
        }

        if (gameInfo.returns && !gameInfo.playerInfo?.is_bancrupt) {
            setActiveYear(getPrevYear(gameInfo.activeGame.year));
            return;
        }

        if (
            gameInfo.crisisYearResult &&
            !gameInfo.playerInfo?.is_bancrupt &&
            gameInfo.activeGame.started
        ) {
            setActiveYear(getPrevYear(gameInfo.activeGame.year));
            return;
        }

        setActiveYear(
            yearToNum(gameInfo.activeGame.year, gameInfo.activeGame.type)
        );
    }, [
        gameInfo.activeGame,
        gameInfo.returns,
        gameInfo.crisisYearResult,
        gameInfo.playerInfo,
        userInfo.info,
    ]);

    if (gameInfo.showRules) {
        return null;
    }

    if (!gameInfo.activeGame || !gameInfo.admin) {
        return null;
    }

    // if (
    //     !gameInfo.activeGame.started &&
    //     (gameInfo.activeGame.year !== 'yearOne' || !gameInfo.activeGame.year)
    // ) {
    //     return null;
    // }

    if (gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi') {
        if (gameInfo.playerInfo?.is_bancrupt) {
            return (
                <div className="flex justify-center items-center">
                    <h3 className="text-white">
                        {languageInfo.language.notifications.arrived}
                    </h3>
                </div>
            );
        }
        return (
            <div className="flex flex-col justify-center items-start mb-2">
                <div className="mb-2">
                    <h4 className="text-white">
                        {languageInfo.language['g3-screens'][
                            'current-hour'
                        ].replace('[]', String(activeYear))}
                    </h4>
                </div>

                {typeof gameInfo.changableAssets === 'number' ? (
                    <div
                        className={`rounded-full flex items-center justify-start w-[400px] border-2 border-BG_blue-greener h-8`}
                    >
                        <div
                            className={`bg-BG_blue-greener h-full rounded-l-full flex items-center justify-end ${
                                Math.floor(
                                    (gameInfo.changableAssets / 960) * 100
                                ) >= 100
                                    ? 'rounded-r-full px-2'
                                    : Math.floor(
                                          (gameInfo.changableAssets / 960) * 100
                                      ) >= 12
                                    ? 'px-2'
                                    : ''
                            }`}
                            style={{
                                width:
                                    gameInfo.changableAssets > 0
                                        ? `${Math.floor(
                                              (gameInfo.changableAssets / 960) *
                                                  100
                                          )}%`
                                        : '0%',
                            }}
                        >
                            {Math.floor(
                                (gameInfo.changableAssets / 960) * 100
                            ) >= 12 ? (
                                <img
                                    src="/icons/big-car-black.png"
                                    alt="big car outlined"
                                    className="h-full"
                                />
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    } else if (gameInfo.activeGame.type === 'Ražošana') {
        if (gameInfo.g4Data.investmentReturns) {
            return (
                <div className="flex items-center justify-center h-full">
                    <h3 className="text-white">
                        {
                            languageInfo.language['generic-game-screen'][
                                'income-calc'
                            ]
                        }
                    </h3>
                </div>
            );
        }

        return null;
    }

    if (activeYear) {
        return (
            <div className="flex flex-col justify-center items-start mb-4">
                <div className="mb-2">
                    <h4 className="text-white">
                        {languageInfo.language["generic-game-screen"]["current-year"]}: {activeYear}/
                        {gameInfo.activeGame.type === 'Krīzes gads' ||
                        gameInfo.activeGame.type === 'Viesnīca'
                            ? 10
                            : gameInfo.activeGame.type === 'Frizētava'
                            ? 6
                            : 5}
                    </h4>
                </div>

                <div className="rounded-full flex items-center justify-start w-[400px] bg-white h-8 mb-4">
                    {new Array(activeYear).fill(null).map((y, i) => {
                        return (
                            <div
                                key={i}
                                className={`bg-BG_blue-greener h-full ${
                                    gameInfo.activeGame?.type ===
                                        'Krīzes gads' ||
                                    gameInfo.activeGame?.type === 'Viesnīca'
                                        ? 'w-[10%]'
                                        : gameInfo.activeGame?.type ===
                                          'Frizētava'
                                        ? 'w-1/6'
                                        : 'w-1/5'
                                } ${
                                    i === 0
                                        ? 'rounded-l-full'
                                        : (gameInfo.activeGame?.type !==
                                              'Krīzes gads' &&
                                              gameInfo.activeGame?.type !==
                                                  'Viesnīca' &&
                                              gameInfo.activeGame?.type !==
                                                  'Frizētava' &&
                                              i === 4) ||
                                          (gameInfo.activeGame?.type ===
                                              'Krīzes gads' &&
                                              i === 9) ||
                                          (gameInfo.activeGame?.type ===
                                              'Viesnīca' &&
                                              i === 9) ||
                                          (gameInfo.activeGame?.type ===
                                              'Frizētava' &&
                                              i === 5)
                                        ? 'rounded-r-full'
                                        : ''
                                } ${
                                    (gameInfo.activeGame?.type !==
                                        'Krīzes gads' &&
                                        gameInfo.activeGame?.type !==
                                            'Viesnīca' &&
                                        gameInfo.activeGame?.type !==
                                            'Frizētava' &&
                                        i < 4) ||
                                    (gameInfo.activeGame?.type ===
                                        'Krīzes gads' &&
                                        i < 9) ||
                                    (gameInfo.activeGame?.type === 'Viesnīca' &&
                                        i < 9) ||
                                    (gameInfo.activeGame?.type ===
                                        'Frizētava' &&
                                        i < 5)
                                        ? 'border-r-2 border-BGlight'
                                        : ''
                                }`}
                            ></div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
}

export default HeaderProgressBar;
