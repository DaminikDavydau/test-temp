import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import { PlayerBarberShops } from '../G6/BarberShopContainer';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G6Showcase() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.crisisYearResult) {
        return null;
    }

    const AdminShowcase = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h3>
                    {languageInfo.language['g6-screens']['tourist-amount']}:{' '}
                    <strong>
                        {
                            languageInfo.language['g6-screens'][
                                String(gameInfo.crisisYearResult?.touristAmount)
                            ]
                        }
                    </strong>
                </h3>
            </div>
        );
    };

    const PlayerShowcaseFirst = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h3>
                    {languageInfo.language['g6-screens']['tourist-amount']}:{' '}
                    <strong>
                        {
                            languageInfo.language['g6-screens'][
                                String(gameInfo.crisisYearResult?.touristAmount)
                            ]
                        }
                    </strong>
                </h3>

                <h3 className="mb-4">
                    {languageInfo.language['g6-screens']['client-amount']}:{' '}
                    {gameInfo.crisisYearResult.totalClients}
                </h3>

                <div className="w-full flex items-center justify-center">
                    <PlayerBarberShops showcase={true} />
                </div>
            </div>
        );
    };

    const PlayerShowcaseSecond = () => {
        const [total, setTotal] = useState(null);

        if (!gameInfo.crisisYearResult) {
            return null;
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-96 flex flex-col items-center justify-center">
                    {typeof gameInfo.crisisYearResult.totalSalonCosts ===
                    'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {
                                    languageInfo.language['g6-screens'][
                                        'buy-barbershop'
                                    ]
                                }
                                :
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult.totalSalonCosts > 0
                                    ? '+'
                                    : gameInfo.crisisYearResult
                                          .totalSalonCosts === 0
                                    ? '-'
                                    : ''}
                                {gameInfo.crisisYearResult.totalSalonCosts}€
                            </h3>
                        </div>
                    ) : null}

                    {typeof gameInfo.crisisYearResult.totalEquipmentCosts ===
                    'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {gameInfo.crisisYearResult.totalEquipmentCosts >
                                -2000
                                    ? languageInfo.language['g6-screens'][
                                          'machine-maintenance'
                                      ]
                                    : languageInfo.language['g6-screens'][
                                          'machine-purchase'
                                      ]}
                                :
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult.totalEquipmentCosts >
                                0
                                    ? '+'
                                    : ''}
                                {gameInfo.crisisYearResult.totalEquipmentCosts}€
                            </h3>
                        </div>
                    ) : null}

                    {typeof gameInfo.crisisYearResult.totalMarketingCosts ===
                    'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {languageInfo.language['g6-screens']['ad-exp']}:
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult.totalMarketingCosts >
                                0
                                    ? '+'
                                    : ''}
                                {gameInfo.crisisYearResult.totalMarketingCosts}€
                            </h3>
                        </div>
                    ) : null}

                    {typeof gameInfo.crisisYearResult.totalLabourCosts ===
                    'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {languageInfo.language['g6-screens'].salaries}:
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult.totalLabourCosts > 0
                                    ? '+'
                                    : ''}
                                {gameInfo.crisisYearResult.totalLabourCosts}€
                            </h3>
                        </div>
                    ) : null}

                    {typeof gameInfo.crisisYearResult.totalLearningCosts ===
                    'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {
                                    languageInfo.language['g6-screens'][
                                        'hairdresser-skill'
                                    ]
                                }
                                :
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult.totalLearningCosts >
                                0
                                    ? '+'
                                    : ''}
                                {gameInfo.crisisYearResult.totalLearningCosts}€
                            </h3>
                        </div>
                    ) : null}

                    {typeof gameInfo.crisisYearResult.bankPercentages ===
                    'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {
                                    languageInfo.language['g5-screens'][
                                        'bank-percentage'
                                    ]
                                }
                                :
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult.bankPercentages > 0
                                    ? '+'
                                    : gameInfo.crisisYearResult
                                          .bankPercentages === 0
                                    ? '-'
                                    : ''}
                                {gameInfo.crisisYearResult.bankPercentages}€
                            </h3>
                        </div>
                    ) : null}

                    {typeof gameInfo.crisisYearResult
                        .totalIncomesFromClients === 'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {languageInfo.language['g6-screens'].income}:
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult
                                    .totalIncomesFromClients > 0
                                    ? '+'
                                    : ''}
                                {
                                    gameInfo.crisisYearResult
                                        .totalIncomesFromClients
                                }
                                €
                            </h3>
                        </div>
                    ) : null}

                    {gameInfo.crisisYearResult.totalSellCosts ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {
                                    languageInfo.language['g6-screens'][
                                        'barbershop-sell'
                                    ]
                                }
                                :
                            </h3>

                            <h3>
                                +{gameInfo.crisisYearResult.totalSellCosts}€
                            </h3>
                        </div>
                    ) : null}

                    {typeof gameInfo.crisisYearResult.totalIncomes ===
                    'number' ? (
                        <div className="w-full flex items-center justify-between">
                            <h3>
                                {
                                    languageInfo.language['g6-screens'][
                                        'year-total'
                                    ]
                                }
                                :
                            </h3>

                            <h3>
                                {gameInfo.crisisYearResult.totalIncomes > 0
                                    ? '+'
                                    : ''}
                                {gameInfo.crisisYearResult.totalIncomes}€
                            </h3>
                        </div>
                    ) : null}
                </div>

                <div className="w-full border-t-4 border-b-4 py-4 flex items-center justify-center mt-4">
                    <h3>
                        {
                            languageInfo.language['g5-screens'][
                                'amount-in-account'
                            ]
                        }{' '}
                        {gameInfo.changableAssets}€
                    </h3>
                </div>
            </div>
        );
    };

    const PlayerShowcase = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                {gameInfo.crisisYearResult.page === 1 ? (
                    <PlayerShowcaseFirst />
                ) : (
                    <PlayerShowcaseSecond />
                )}
            </div>
        );
    };

    if (userInfo.info && userInfo.info._id === gameInfo.activeGame?.admin) {
        return <AdminShowcase />;
    } else {
        return <PlayerShowcase />;
    }
}

export default G6Showcase;
