import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G4SidebarInfo() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.g4Data.machines || !gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="mb-4">{languageInfo.language["g4-screens"]["bid-results"]}</h3>
            <div className="w-40 flex items-center justify-between py-1">
                <div className="w-1/2 h-full justify-center flex items-center">
                    <small>{languageInfo.language['g4-screens'].machine}</small>
                </div>
                <div className="w-1/2 h-full justify-center flex items-center">
                    <small>
                        {languageInfo.language['g4-screens']['bid-txt']}
                    </small>
                </div>
            </div>

            {gameInfo.g4Data.machines.map((machine, i) => {
                return (
                    <div
                        key={i}
                        className={`w-40 h-8 flex items-center justify-between border-2 border-BGdark-lighter ${
                            i !== 0 ? 'border-t-0' : ''
                        }`}
                    >
                        <div className="w-1/2 h-full justify-center flex items-center">
                            <p>{machine.number}</p>
                        </div>
                        <div className="w-1/2 h-full justify-center flex items-center border-l-2 border-BGdark-lighter py-1">
                            {machine.soldFor ? (
                                <p>{machine.soldFor}</p>
                            ) : machine._id ===
                              gameInfo.g4Data.machines?.filter(
                                  (m) => m.owner === null
                              )[0]._id ? (
                                <img
                                    src="/icons/clock.png"
                                    alt="clock"
                                    className="h-full"
                                />
                            ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default G4SidebarInfo;
