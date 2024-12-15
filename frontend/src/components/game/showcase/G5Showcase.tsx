import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    BBSIncome,
    GameInfo,
    selectGame,
} from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G5Showcase() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const FirstPage = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="my-4 flex items-center justify-center flex-col">
                    <h3 className="my-1">
                        {languageInfo.language['g5-screens']['weather-was']}{' '}
                        {gameInfo.crisisYearResult.clearSky
                            ? languageInfo.language['g5-screens'].good
                            : languageInfo.language['g5-screens'].bad}
                    </h3>

                    <h3 className="my-1">
                        {languageInfo.language['g5-screens']['water-was']}{' '}
                        {gameInfo.crisisYearResult.clearWater
                            ? languageInfo.language['g5-screens'].clean
                            : languageInfo.language['g5-screens'].dirty}
                    </h3>
                </div>

                <div className="my-4 flex items-center justify-center flex-col">
                    {typeof gameInfo.crisisYearResult.price === 'number' ? (
                        <h3 className="my-1">
                            {languageInfo.language['g5-screens']['your-price']}{' '}
                            {gameInfo.crisisYearResult.price}€
                        </h3>
                    ) : null}

                    {typeof gameInfo.crisisYearResult.averagePrice ===
                    'number' ? (
                        <h3 className="my-1">
                            {languageInfo.language['g5-screens']['avg-price']}{' '}
                            {gameInfo.crisisYearResult.averagePrice}€
                        </h3>
                    ) : null}

                    {gameInfo.crisisYearResult.clearSky ? (
                        <h3 className="my-1"></h3>
                    ) : null}
                </div>

                <div className="my-4 flex items-center justify-center flex-col">
                    <h3 className="my-1">
                        {languageInfo.language["g5-screens"].water}{' '}
                        {gameInfo.crisisYearResult.clearWater
                            ? `${languageInfo.language['g5-screens'].was} ${languageInfo.language['g5-screens'].clean}`
                            : `${languageInfo.language['g5-screens'].was} ${languageInfo.language['g5-screens'].dirty}`}{' '}
                        {languageInfo.language['g5-screens'][
                            'hotel-has-pool'
                        ].replace(
                            '[]',
                            gameInfo.playerBuildings.swimmingPool
                                ? languageInfo.language['g5-screens'].has
                                : languageInfo.language['g5-screens'][
                                      'doesnt-have'
                                  ]
                        )}
                    </h3>

                    {typeof gameInfo.crisisYearResult.poolFine === 'number' &&
                    gameInfo.crisisYearResult.poolFine !== 0 ? (
                        <h3 className="my-1">
                            {gameInfo.crisisYearResult.poolFine}€
                        </h3>
                    ) : null}
                </div>
            </div>
        );
    };

    const SecondPage = () => {
        const [totalIncome, setTotalIncome] = useState<number | null>(null);
        const [totalClients, setTotalClients] = useState<number | null>(null);

        useEffect(() => {
            if (
                !gameInfo.crisisYearResult ||
                typeof gameInfo.crisisYearResult.clientData === 'number' ||
                typeof gameInfo.crisisYearResult.clientData === 'boolean' ||
                typeof gameInfo.crisisYearResult.clientData === 'string' ||
                Array.isArray(gameInfo.crisisYearResult.clientData)
            ) {
                return;
            }
            const {
                clientBase,
                priceDifference,
                restaurant,
                conferenceHall,
                tennisCourt,
                swimmingPool,
            } = gameInfo.crisisYearResult.clientData;

            if (
                !totalIncome &&
                typeof incomeFromClients === 'number' &&
                typeof poolFine === 'number' &&
                typeof bankPercentages === 'number' &&
                typeof gameInfo.crisisYearResult.buildingCost === 'number'
            ) {
                setTotalIncome(
                    incomeFromClients +
                        poolFine +
                        bankPercentages +
                        gameInfo.crisisYearResult.buildingCost
                );
            }

            if (!totalClients) {
                setTotalClients(
                    clientBase +
                        priceDifference +
                        restaurant +
                        conferenceHall +
                        tennisCourt +
                        swimmingPool
                );
            }
        }, [gameInfo.crisisYearResult, totalIncome, totalClients]);

        if (!gameInfo.crisisYearResult) {
            return null;
        }

        if (
            typeof gameInfo.crisisYearResult.clientData === 'number' ||
            typeof gameInfo.crisisYearResult.clientData === 'boolean' ||
            typeof gameInfo.crisisYearResult.clientData === 'string' ||
            Array.isArray(gameInfo.crisisYearResult.clientData) ||
            typeof gameInfo.crisisYearResult.constructionInvestment ===
                'boolean' ||
            typeof gameInfo.crisisYearResult.constructionInvestment ===
                'string' ||
            typeof gameInfo.crisisYearResult.constructionInvestment === 'number'
        ) {
            return null;
        }

        const {
            clientBase,
            priceDifference,
            restaurant,
            conferenceHall,
            tennisCourt,
            swimmingPool,
        } = gameInfo.crisisYearResult.clientData;

        const { incomeFromClients, poolFine, bankPercentages } =
            gameInfo.crisisYearResult;

        const { buildingCost } = gameInfo.crisisYearResult;

        const ResultRow: React.FC<{
            txt: string;
            amount:
                | number
                | boolean
                | string
                | string[]
                | Record<string, number>
                | BBSIncome[];
            type: string;
        }> = ({ txt, amount, type }) => {
            if (typeof amount !== 'number') {
                return null;
            }

            return (
                <div className={`flex w-full justify-between items-center`}>
                    <h3>{txt}</h3>

                    <div className="flex items-center justify-center">
                        <h3 className="mr-1">
                            {amount > 0 ? '+' : ''}
                            {amount}
                            {type === 'cash' ? '€' : ''}
                        </h3>

                        {type === 'user' ? (
                            <img
                                src="/icons/player-group.png"
                                alt="user"
                                className="h-6"
                            />
                        ) : null}
                    </div>
                </div>
            );
        };

        const ResultSum: React.FC<{
            txt: string;
            amount: number | null;
            type: string;
        }> = ({ txt, amount, type }) => {
            if (!amount) {
                return null;
            }

            return (
                <div className="flex w-full items-center justify-between border-t-2 border-b-2 border-BGdark-lighter py-1">
                    <h3>{txt}</h3>

                    <div className="flex items-center justify-center">
                        <h3 className="mr-1">
                            {amount > 0 ? '+' : ''}
                            {amount}
                            {type === 'cash' ? '€' : ''}
                        </h3>

                        {type === 'user' ? (
                            <img
                                src="/icons/player-group.png"
                                alt="user"
                                className="h-6"
                            />
                        ) : null}
                    </div>
                </div>
            );
        };

        return (
            <div className="flex flex-col justify-center items-center">
                <div className="flex justify-center items-center">
                    <div className="flex items-center justify-start flex-col mx-8 w-80">
                        <h3 className="mb-2">
                            {
                                languageInfo.language['g5-screens'][
                                    'clients-this-year'
                                ]
                            }
                        </h3>

                        <div className="items-center justify-start flex-col w-full h-48">
                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens'][
                                        'clients-base'
                                        ]
                                }
                                amount={clientBase}
                                type="user"
                            />
                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens'][
                                        'bc-of-price'
                                    ]
                                }
                                amount={priceDifference}
                                type="user"
                            />
                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens']
                                        .restaurant
                                }
                                amount={restaurant}
                                type="user"
                            />
                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens'][
                                        'conference-hall'
                                    ]
                                }
                                amount={conferenceHall}
                                type="user"
                            />
                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens'][
                                        'teniss-court'
                                    ]
                                }
                                amount={tennisCourt}
                                type="user"
                            />
                            <ResultRow
                                txt={languageInfo.language['g5-screens'].pool}
                                amount={swimmingPool}
                                type="user"
                            />
                        </div>

                        <ResultSum
                            txt={`${languageInfo.language['g5-screens'].total}:`}
                            amount={totalClients}
                            type="user"
                        />
                    </div>

                    <div className="flex items-center justify-start flex-col mx-8 w-96">
                        <h3 className="mb-2">
                            {languageInfo.language['g5-screens']['year-result']}
                        </h3>

                        <div className="items-center justify-start flex-col w-full h-48">
                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens'][
                                        'penalty-txt'
                                    ]
                                }
                                amount={poolFine}
                                type="cash"
                            />

                            <ResultRow
                                txt={`${languageInfo.language['g5-screens'].build} ${
                                    languageInfo.language['g5-screens'].expenses
                                }`}
                                amount={buildingCost}
                                type="cash"
                            />

                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens'][
                                        'bank-percentage'
                                    ]
                                }
                                amount={bankPercentages}
                                type="cash"
                            />

                            <ResultRow
                                txt={
                                    languageInfo.language['g5-screens'][
                                        'client-income'
                                    ]
                                }
                                amount={incomeFromClients}
                                type="cash"
                            />
                        </div>

                        <ResultSum
                            txt={`${languageInfo.language['g5-screens'].result}:`}
                            amount={totalIncome}
                            type="cash"
                        />
                    </div>
                </div>

                {typeof gameInfo.changableAssets === 'number' ? (
                    <div className="mt-6 flex items-center justify-center">
                        <h3 className="text-center">
                            {
                                languageInfo.language['g5-screens'][
                                    'amount-in-account'
                                ]
                            }{' '}
                            {gameInfo.changableAssets}€
                        </h3>
                    </div>
                ) : null}
            </div>
        );
    };

    const ThirdPage = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }
    };

    const AdminShowcase = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="my-4 flex items-center justify-center flex-col">
                    {gameInfo.crisisYearResult.clearSky ? (
                        <h3 className="my-1">
                            {languageInfo.language['g5-screens']['weather-was']}{' '}
                            {languageInfo.language['g5-screens'].good}
                        </h3>
                    ) : (
                        <h3 className="my-1">
                            {languageInfo.language['g5-screens']['weather-was']}{' '}
                            {languageInfo.language['g5-screens'].bad}
                        </h3>
                    )}

                    {gameInfo.crisisYearResult.clearWater ? (
                        <h3 className="my-1">
                            {languageInfo.language['g5-screens']['water-was']}{' '}
                            {languageInfo.language['g5-screens'].clean}
                        </h3>
                    ) : (
                        <h3 className="my-1">
                            {languageInfo.language['g5-screens']['water-was']}{' '}
                            {languageInfo.language['g5-screens'].dirty}
                        </h3>
                    )}

                    {gameInfo.crisisYearResult.clearSky ? (
                        <h3 className="my-1"></h3>
                    ) : null}
                </div>

                <div className="my-4 flex items-center justify-center flex-col">
                    {gameInfo.crisisYearResult.averagePrice ? (
                        <h3 className="my-1">
                            {languageInfo.language['g5-screens']['avg-price']}{' '}
                            {gameInfo.crisisYearResult.averagePrice}€
                        </h3>
                    ) : null}
                </div>
            </div>
        );
    };

    const ActiveShowcase = () => {
        if (!gameInfo.crisisYearResult) {
            return null;
        }

        if (userInfo.info && userInfo.info._id === gameInfo.activeGame?.admin) {
            return <AdminShowcase />;
        }

        if (gameInfo.crisisYearResult.page === 1) {
            return <FirstPage />;
        } else if (gameInfo.crisisYearResult.page === 2) {
            return <SecondPage />;
        }

        return null;
    };

    return <ActiveShowcase />;
}

export default G5Showcase;
