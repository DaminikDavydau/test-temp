import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function PlayerBuildings() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.playerBuildings) {
        return null;
    }

    const BuildingContainer: React.FC<{
        icon: string;
        name: string;
        real: 'restaurant' | 'conferenceHall' | 'tennisCourt' | 'swimmingPool';
    }> = ({ icon, name, real }) => {
        const [owned, setOwned] = useState(false);

        useEffect(() => {
            if (gameInfo.playerBuildings) {
                const playerOwns = gameInfo.playerBuildings[real];

                setOwned(playerOwns);
            }
        }, [gameInfo.playerBuildings]);

        return (
            <div
                className={`flex flex-col items-center justify-center mx-1 ${
                    owned ? '' : 'opacity-50'
                }`}
            >
                {owned ? (
                    <img src={icon} alt={name} className="h-8 mb-1" />
                ) : (
                    <div className="flex items-center justify-center h-8 mb-1">
                        <img
                            src="/svg/black-cross.svg"
                            alt={name}
                            className="h-6"
                        />
                    </div>
                )}

                <small className="text-center">
                    {
                        languageInfo.language['g5-screens']['building-names'][
                            name
                        ]
                    }
                </small>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-start justify-center mt-4">
            <p className="mb-2">{languageInfo.language['g4-screens'].owned}:</p>

            <div className="flex justify-center items-center">
                <BuildingContainer
                    icon="/icons/restaurant.png"
                    name="Restorāns"
                    real="restaurant"
                />

                <BuildingContainer
                    icon="/icons/conference.png"
                    name="Konferenču zāle"
                    real="conferenceHall"
                />

                <BuildingContainer
                    icon="/icons/tennis.png"
                    name="Tenisa korts"
                    real="tennisCourt"
                />

                <BuildingContainer
                    icon="/icons/pool.png"
                    name="Baseins"
                    real="swimmingPool"
                />
            </div>
        </div>
    );
}

export default PlayerBuildings;
