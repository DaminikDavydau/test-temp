import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function AviableFunds() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.playerInfo || !gameInfo.activeGame) {
        return null;
    }

    if (gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi') {
        if (typeof gameInfo.changableAssets !== 'number') {
            return null;
        }

        return (
            <div className="w-full flex items-center justify-center flex-col mt-6">
                <div className="w-full flex items-center justify-center">
                    <h3>{gameInfo.changableAssets}km / 960km</h3>
                </div>
            </div>
        );
    } else if (gameInfo.activeGame.type === 'Ražošana') {
        return null;
    } else if (gameInfo.activeGame.type === 'Frizētava') {
        return (
            <div className="w-full flex items-center justify-center flex-col mt-6">
                <div className="w-full flex items-center justify-center">
                    <h3>
                        {
                            languageInfo.language['generic-game-screen'][
                                'money-in-account'
                            ]
                        }
                        : {gameInfo.changableAssets}€
                    </h3>
                </div>

                <h3 className="mt-2">
                    {!gameInfo.g6Data.choosingBarberShop
                        ? `${languageInfo.language['g6-screens']['your-barbershops']}:`
                        : languageInfo.language['g6-screens']['buy-barbershop']}
                </h3>

                {gameInfo.crisisYearResult?.totalIncome &&
                gameInfo.crisisYearResult.totalIncome !== 0 ? ( //Type error: This JSX tag's 'children' prop expects a single child of type 'ReactNode', but multiple children were provided.
                    <p>
                        {Number(gameInfo.crisisYearResult.totalIncome) > 0 ?
                            `+${gameInfo.crisisYearResult.totalIncome}€` :
                            `${gameInfo.crisisYearResult.totalIncome}€`
                        }
                    </p>
                ) : null}
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center flex-col mt-6">
            <div className="w-full flex items-center justify-center">
                <img src="/icons/dollaz.png" alt="dollars" className="mr-2" />

                <h3>{gameInfo.changableAssets}€</h3>
            </div>

            {gameInfo.crisisYearResult?.totalIncome &&
            gameInfo.crisisYearResult.totalIncome !== 0 ? ( //Type error: This JSX tag's 'children' prop expects a single child of type 'ReactNode', but multiple children were provided.
                <p>
                    {Number(gameInfo.crisisYearResult.totalIncome) > 0 ?
                            `+${gameInfo.crisisYearResult.totalIncome}€` :
                            `${gameInfo.crisisYearResult.totalIncome}€`
                        }
                </p>
            ) : null}
        </div>
    );
}

export default AviableFunds;
