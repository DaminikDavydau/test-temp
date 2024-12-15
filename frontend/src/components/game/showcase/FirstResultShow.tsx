import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import { getPricePerPig } from '../../../utils/getPricePerPig';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function FirstResultShow() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.crisisYearResult || !gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full h-full pb-40 flex flex-col items-center justify-start">
            <div className="flex flex-col items-center justify-center mt-14">
                <h3>{languageInfo.language['g2-screens']['pig-amount']}:</h3>

                <div className="flex items-center justify-center mt-6">
                    <h1 className="mr-2 font-normal">
                        {gameInfo.crisisYearResult.pigsOnMarket}
                    </h1>

                    <img
                        src="/icons/farm-house-black.png"
                        alt="pig"
                        className="h-12"
                    />
                </div>
            </div>

            {userInfo.info &&
            userInfo.info._id === gameInfo.activeGame.admin ? null : (
                <h3 className="mt-6">
                    {languageInfo.language['g2-screens'][
                        'amount-owned'
                    ].replace(
                        '[]',
                        String(gameInfo.crisisYearResult.playerPigs)
                    )}
                </h3>
            )}

            <div className="flex flex-col items-center justify-center mt-6">
                <h3>
                    {languageInfo.language['g2-screens']['year-was']}{' '}
                    <span className="font-semibold text-BGdark_lightblue-lighter">
                        {gameInfo.crisisYearResult.crisisYear
                            ? languageInfo.language['g2-screens'].bad
                            : languageInfo.language['g2-screens'].good}
                    </span>
                </h3>

                <h3 className="mt-2">
                    {languageInfo.language['g2-screens']['pig-value']}{' '}
                    <span className="font-semibold">
                        {getPricePerPig(
                            gameInfo.crisisYearResult.pigsOnMarket,
                            gameInfo.crisisYearResult.crisisYear
                        )}
                        €
                    </span>
                </h3>
            </div>
        </div>
    );
}

export default FirstResultShow;
