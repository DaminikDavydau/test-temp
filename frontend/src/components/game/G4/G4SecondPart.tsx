import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GameInfo,
    handleRules,
    selectGame,
} from '../../../redux/slices/gameSlice';
import { PlayerInterface } from '../../../types/player';
import G4CaptainForm from './G4CaptainForm';
import { LanguageInfo, selectLanguage } from '../../../redux/slices/languageSlice';

function G4SecondPart() {
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [isCaptain, setIsCaptain] = useState<null | boolean>(null);
    const [teamCaptain, setTeamCaptain] = useState<PlayerInterface | null>(
        null
    );

    useEffect(() => {
        if (gameInfo.g4Data.team) {
            if (isCaptain === null) {
                if (
                    gameInfo.g4Data.team.length >= 1 &&
                    gameInfo.g4Data.team[0] === gameInfo.playerInfo?._id
                ) {
                    setIsCaptain(true);
                } else {
                    setIsCaptain(false);
                }
            }

            if (!teamCaptain && gameInfo.g4Data.team.length >= 1) {
                if (isCaptain) {
                    setTeamCaptain(gameInfo.playerInfo);
                }

                const captainId = gameInfo.g4Data.team[0];
                const captainInfo = gameInfo.players?.find(
                    (p) => p._id === captainId
                );

                if (captainInfo) {
                    setTeamCaptain(captainInfo);
                }
            }
        }
    }, [isCaptain, gameInfo.g4Data, gameInfo.playerInfo, teamCaptain]);

    if (isCaptain) {
        return (
            <div className="w-full h-full">
                <G4CaptainForm />
            </div>
        );
    }

    return (
        <div className="flex w-full h-full justify-center items-center flex-col">
            <h3 className="text-center">
                {languageInfo.language['g4-screens'].notification['wait-captain']}
            </h3>

            <img
                src="/icons/info.png"
                alt="info"
                className="cursor-pointer mt-2"
                onClick={() => dispatch(handleRules(true))}
            />
        </div>
    );
}

export default G4SecondPart;
