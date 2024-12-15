import React from 'react';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

function PausedGame() {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="page flex items-center justify-center">
            <div className="pb-40 flex flex-col items-center justify-center">
                <h2>{languageInfo.language.notifications['game-paused']}</h2>

                <h3 className="mt-6">
                    {languageInfo.language.notifications['wait-until-unpaused']}
                </h3>
            </div>
        </div>
    );
}

export default PausedGame;
