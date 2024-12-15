import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import yearToNum from '../../utils/yearToNum';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function AdminPlayerHeader() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [activeYear] = useState<number | null>(
        yearToNum(gameInfo.activeGame?.year)
    );

    if (!gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full pl-52 py-4">
            {activeYear && activeYear > 1 ? (
                <h4>
                    {languageInfo.language['generic-game-screen'][
                        'results-after-year'
                    ].replace('[]', String(activeYear))}
                    :
                </h4>
            ) : (
                <h4>
                    {languageInfo.language['generic-game-screen'][
                        'year-players'
                    ].replace('[]', String(activeYear))}
                    :
                </h4>
            )}
        </div>
    );
}

export default AdminPlayerHeader;
