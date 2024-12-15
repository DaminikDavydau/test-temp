import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    BBSIncome,
    GameInfo,
    selectGame,
} from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import { GameInterface } from '../../../types/game';
import yearToNum from '../../../utils/yearToNum';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G3Showcase() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [lastSpeed, setLastSpeed] = useState<number | null>(null);
    const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
    const [totalResult, setTotalResult] = useState<number | null>(null);
    const [finishHour, setFinishHour] = useState<GameInterface['year'] | null>(
        null
    );

    useEffect(() => {
        if (!lastSpeed && gameInfo.thirdGameHistory) {
            const lastInvestment =
                gameInfo.thirdGameHistory[gameInfo.thirdGameHistory.length - 1];

            if (!lastInvestment) {
                return;
            }

            const lastSpeedFromIv = lastInvestment.speed;

            setLastSpeed(lastSpeedFromIv);
        }
    }, [lastSpeed, gameInfo.thirdGameHistory]);

    useEffect(() => {
        if (gameInfo.activeGame && !finishHour) {
            setFinishHour(gameInfo.activeGame.year);
        }
    }, [finishHour, gameInfo.activeGame]);

    useEffect(() => {
        if (
            gameInfo.crisisYearResult &&
            Number(gameInfo.crisisYearResult.distance) >= 960 &&
            gameInfo.thirdGameHistory &&
            !totalExpenses
        ) {
            let total = 0;

            gameInfo.thirdGameHistory.forEach((hP) => {
                if (hP.penalty < 0) {
                    total += hP.penalty;
                }
            });

            setTotalExpenses(total);
        }
    }, [gameInfo.crisisYearResult, totalExpenses, gameInfo.thirdGameHistory]);

    useEffect(() => {
        if (!totalResult && typeof totalExpenses === 'number' && gameInfo.crisisYearResult) {
            let result =
                Number(gameInfo.crisisYearResult?.finishedFirstReward) +
                Number(gameInfo.crisisYearResult?.isEarlyReward) +
                Number(gameInfo.crisisYearResult?.finishedReward) +
                totalExpenses;

            setTotalResult(result);
        }
    }, [totalResult, totalExpenses, gameInfo.crisisYearResult]);

    if (!gameInfo.crisisYearResult) {
        return null;
    }

    const AdminResultTablePeace: React.FC<{
        km: string;
        caught:
            | boolean
            | number
            | Record<string, number>
            | string
            | string[]
            | BBSIncome[];
    }> = ({ km, caught }) => {
        if (typeof caught !== 'boolean') {
            return null;
        }

        return (
            <div className="w-20 h-20 flex flex-col items-center justify-center border-2 border-BGdark-lighter">
                <div className="w-full flex items-center justify-center h-3/6 border-b-2 border-BGdark-lighter">
                    <p>{km}</p>
                </div>

                <div className="w-full flex items-center justify-center h-3/6">
                    {caught ? (
                        <img
                            src="/icons/police.png"
                            alt="police man"
                            className="h-4"
                        />
                    ) : (
                        <h3>-</h3>
                    )}
                </div>
            </div>
        );
    };

    const AdminResults: React.FC = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        const { kmH60, kmH70, kmH80, kmH90, kmH100, kmH110, kmH120, kmH130 } =
            gameInfo.crisisYearResult;

        return (
            <div className="w-full flex flex-col items-center justify-center mb-6">
                <div className="w-full flex items-center justify-center mb-8">
                    <h3 className="text-center">
                        {
                            languageInfo.language['g3-screens']['info-screen'][
                                'players-caught-title'
                            ]
                        }
                    </h3>
                </div>

                <p className="mb-2">
                    {languageInfo.language['g3-screens']['info-screen'].speed2}{' '}
                    (km/h)
                </p>

                <div className="flex items-center justify-center">
                    <AdminResultTablePeace km="60" caught={kmH60} />

                    <AdminResultTablePeace km="70" caught={kmH70} />

                    <AdminResultTablePeace km="80" caught={kmH80} />

                    <AdminResultTablePeace km="90" caught={kmH90} />

                    <AdminResultTablePeace km="100" caught={kmH100} />

                    <AdminResultTablePeace km="110" caught={kmH110} />

                    <AdminResultTablePeace km="120" caught={kmH120} />

                    <AdminResultTablePeace km="130" caught={kmH130} />
                </div>
            </div>
        );
    };

    const ActiveScenario: React.FC = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        if (
            gameInfo.crisisYearResult.sleepingFine === 0 &&
            gameInfo.crisisYearResult.speedingFine === 0
        ) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src="/icons/passed.png"
                        alt="check mark"
                        className="h-32"
                    />

                    <h3 className="my-2 text-center">
                        {
                            languageInfo.language['g3-screens']['info-screen'][
                                'not-caught'
                            ]
                        }
                    </h3>
                </div>
            );
        }

        if (
            Number(gameInfo.crisisYearResult.sleepingFine) < 0 &&
            gameInfo.crisisYearResult.speedingFine === 0
        ) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src="/icons/police.png"
                        alt="police"
                        className="h-32"
                    />

                    <h3 className="my-2 text-center">
                        {
                            languageInfo.language['g3-screens']['info-screen']
                                .caught
                        }
                    </h3>

                    <h3 className="my-2 text-center">
                        {languageInfo.language['g3-screens']['info-screen'][
                            'not-slept-alert'
                        ].replace(
                            '[]',
                            String(
                                Math.abs(
                                    Number(
                                        gameInfo.crisisYearResult.sleepingFine
                                    )
                                )
                            )
                        )}
                    </h3>
                </div>
            );
        }

        if (
            gameInfo.crisisYearResult.sleepingFine === 0 &&
            Number(gameInfo.crisisYearResult.speedingFine) < 0
        ) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src="/icons/police.png"
                        alt="police"
                        className="h-32"
                    />

                    <h3 className="my-2 text-center">
                        {
                            languageInfo.language['g3-screens']['info-screen']
                                .caught
                        }
                    </h3>

                    <h3 className="my-2 text-center">
                        {languageInfo.language['g3-screens']['info-screen'][
                            'caught-alert'
                        ]
                            .replace('[]', String(lastSpeed))
                            .replace(
                                '{}',
                                String(
                                    Math.abs(
                                        Number(
                                            gameInfo.crisisYearResult
                                                .speedingFine
                                        )
                                    )
                                )
                            )}
                    </h3>
                </div>
            );
        }

        if (
            Number(gameInfo.crisisYearResult.sleepingFine) < 0 &&
            Number(gameInfo.crisisYearResult.speedingFine) < 0
        ) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <img
                        src="/icons/police.png"
                        alt="police"
                        className="h-32"
                    />

                    <h3 className="my-2 text-center">
                        {
                            languageInfo.language['g3-screens']['info-screen']
                                .caught
                        }
                    </h3>

                    <h3 className="my-2 text-center">
                        {languageInfo.language['g3-screens']['info-screen'][
                            'caught-alert'
                        ]
                            .replace('[]', String(lastSpeed))
                            .replace(
                                '{}',
                                String(
                                    Math.abs(
                                        Number(
                                            gameInfo.crisisYearResult
                                                .speedingFine
                                        )
                                    )
                                )
                            )}
                    </h3>

                    <h3 className="my-2 text-center">
                        {languageInfo.language['g3-screens']['info-screen'][
                            'not-slept-alert'
                        ].replace(
                            '[]',
                            String(
                                Math.abs(
                                    Number(
                                        gameInfo.crisisYearResult.sleepingFine
                                    )
                                )
                            )
                        )}
                    </h3>
                </div>
            );
        }

        return null;
    };

    const Results = () => {
        return (
            <div className="w-full flex flex-col items-center justify-center">
                <div className="w-[600px]">
                    {finishHour ? (
                        <div className="w-full flex items-center justify-center mb-8">
                            <h3 className="text-center">
                                {languageInfo.language['g3-screens'][
                                    'review-screen'
                                ].title.replace(
                                    '[]',
                                    String(yearToNum(finishHour))
                                )}
                            </h3>
                        </div>
                    ) : null}

                    <div className="w-full flex items-center justify-between my-2">
                        <h3>
                            {
                                languageInfo.language['g3-screens'][
                                    'review-screen'
                                ]['fine-expenses']
                            }
                            :
                        </h3>

                        <h3>{totalExpenses}€</h3>
                    </div>

                    <div className="w-full flex items-center justify-between my-2">
                        <h3>
                            {
                                languageInfo.language['g3-screens'][
                                    'review-screen'
                                ]['saved-time-bonus']
                            }
                            :
                        </h3>

                        <h3>
                            {Number(gameInfo.crisisYearResult?.isEarlyReward) >
                            0
                                ? '+'
                                : ''}
                            {Number(gameInfo.crisisYearResult?.isEarlyReward)}€
                        </h3>
                    </div>

                    <div className="w-full flex items-center justify-between my-2">
                        <h3>
                            {
                                languageInfo.language['g3-screens'][
                                    'review-screen'
                                ]['first-bonus']
                            }
                            :
                        </h3>

                        <h3>
                            {Number(
                                gameInfo.crisisYearResult?.finishedFirstReward
                            ) > 0
                                ? '+'
                                : ''}
                            {Number(
                                gameInfo.crisisYearResult?.finishedFirstReward
                            )}
                            €
                        </h3>
                    </div>

                    <div className="w-full flex items-center justify-between my-2">
                        <h3>
                            {
                                languageInfo.language['g3-screens'][
                                    'review-screen'
                                ]['finished-income']
                            }
                            :
                        </h3>

                        <h3>
                            {Number(gameInfo.crisisYearResult?.finishedReward) >
                            0
                                ? '+'
                                : ''}
                            {Number(gameInfo.crisisYearResult?.finishedReward)}€
                        </h3>
                    </div>

                    <div className="w-full flex items-center justify-between mt-4 border-4 border-BGlight border-r-0 border-l-0 py-1">
                        <h3>
                            {
                                languageInfo.language['g3-screens'][
                                    'review-screen'
                                ]['total-income']
                            }
                            :
                        </h3>

                        <h3>
                            {Number(totalResult) > 0 ? '+' : ''}
                            {totalResult}€
                        </h3>
                    </div>
                </div>
            </div>
        );
    };

    if (userInfo.info && gameInfo.activeGame?.admin === userInfo.info._id) {
        return <AdminResults />;
    }

    if (gameInfo.crisisYearResult.page === 1) {
        return (
            <div className="w-full flex items-center justify-center mb-6">
                <ActiveScenario />
            </div>
        );
    } else if (gameInfo.crisisYearResult.page === 2) {
        return (
            <div className="w-full flex items-center justify-center mb-6">
                <Results />
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center mb-6">
            <ActiveScenario />
        </div>
    );
}

export default G3Showcase;
