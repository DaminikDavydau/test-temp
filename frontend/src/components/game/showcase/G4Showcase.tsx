import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import { MachineInterface } from '../../../types/machine';
import { PlayerInterface } from '../../../types/player';
import { getPlayerName } from '../../../utils/getName';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G4Showcase() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!gameInfo.crisisYearResult) {
        return null;
    }

    if (
        !gameInfo.activeGame?.started &&
        gameInfo.activeGame?.year !== 'yearOne'
    ) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h3>{languageInfo.language['g4-screens']['game-end']}</h3>
            </div>
        );
    }

    const PlayerTable: React.FC<{
        player: PlayerInterface;
        index: number;
        admin?: boolean;
    }> = ({ player, index, admin }) => {
        const [playerMachine, setPlayerMachine] =
            useState<MachineInterface | null>(null);

        useEffect(() => {
            if (
                !playerMachine &&
                gameInfo.players &&
                gameInfo.g4Data.machines
            ) {
                const machine = gameInfo.g4Data.machines.find(
                    (m) => m.owner === player._id
                );
                if (machine) {
                    setPlayerMachine(machine);
                }
            }
        }, [playerMachine, gameInfo.players, gameInfo.g4Data.machines]);

        if (index === 0) {
            return (
                <div className="flex flex-col items-center justify-center">
                    <div
                        className={`w-80 flex items-center justify-center h-8`}
                    >
                        <div className="w-1/3 h-full flex justify-center items-center">
                            <p>{languageInfo.language['g4-screens'].player}</p>
                        </div>

                        <div className="w-1/3 h-full flex justify-center items-center">
                            <p>{languageInfo.language['g4-screens'].machine}</p>
                        </div>

                        <div className="w-1/3 h-full flex justify-center items-center">
                            <p>{languageInfo.language['g4-screens'].price}</p>
                        </div>
                    </div>

                    <div
                        className={`w-80 flex items-center justify-center border-2 border-BGdark-lighter h-8 `}
                    >
                        <div className="w-1/3 border-r-2 border-BGdark-lighter h-full flex justify-center items-center text-center">
                            <p className="text-center">
                                {getPlayerName(player.name)}
                            </p>
                        </div>

                        <div className="w-1/3 h-full flex justify-center items-center border-r-2 border-BGdark-lighter text-center">
                            <p className="text-center">
                                {playerMachine
                                    ? playerMachine.number
                                    : admin
                                    ? ''
                                    : 'X'}
                            </p>
                        </div>

                        <div className="w-1/3 h-full flex justify-center items-center text-center">
                            <p className="text-center">
                                {playerMachine &&
                                typeof playerMachine.soldFor === 'number'
                                    ? `${playerMachine.soldFor}€`
                                    : ''}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`w-80 flex items-center justify-center border-2 border-BGdark-lighter h-8 border-t-0`}
            >
                <div className="w-1/3 border-r-2 border-BGdark-lighter h-full flex justify-center items-center text-center">
                    <p className="text-center">{getPlayerName(player.name)}</p>
                </div>

                <div className="w-1/3 h-full flex justify-center items-center border-r-2 border-BGdark-lighter ">
                    <p className="text-center">
                        {playerMachine
                            ? playerMachine.number
                            : admin
                            ? ''
                            : 'X'}
                    </p>
                </div>

                <div className="w-1/3 h-full flex justify-center items-center text-center">
                    <p className="text-center">
                        {playerMachine &&
                        typeof playerMachine.soldFor === 'number'
                            ? `${playerMachine.soldFor}€`
                            : ''}
                    </p>
                </div>
            </div>
        );
    };

    if (
        gameInfo.activeGame.admin === userInfo.info?._id &&
        gameInfo.crisisYearResult.page === 1
    ) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h3 className="mb-4 text-center">
                    {languageInfo.language['g4-screens']['player-machhines']}:
                </h3>

                {gameInfo.players?.map((player, i) => {
                    return (
                        <PlayerTable
                            player={player}
                            index={i}
                            key={i}
                            admin={true}
                        />
                    );
                })}
            </div>
        );
    }

    if (gameInfo.crisisYearResult.page === 1) {
        if (gameInfo.crisisYearResult.playerWon) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <img
                        src="/icons/confetti.png"
                        alt="confetti"
                        className="h-20 mb-2"
                    />

                    <h3 className="my-1">
                        {languageInfo.language['g4-screens']['you-won']}
                    </h3>

                    {gameInfo.g4Data.playerMachine ? (
                        <p>
                            {languageInfo.language['g4-screens'][
                                'now-owned-machine'
                            ].replace(
                                '[]',
                                String(gameInfo.g4Data.playerMachine.number)
                            )}
                        </p>
                    ) : null}
                </div>
            );
        }

        if (
            gameInfo.g4Data.playerMachine &&
            !gameInfo.crisisYearResult.playerWon
        ) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h3 className="my-1">
                        {languageInfo.language['g4-screens']['round-over']}
                    </h3>
                </div>
            );
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h3 className="my-1">
                    {languageInfo.language['g4-screens']['didnt-win']}
                </h3>
                <p>
                    {languageInfo.language['g4-screens']['highest-bid'].replace(
                        '[]',
                        String(gameInfo.crisisYearResult.biggestIv)
                    )}
                </p>
            </div>
        );
    } else if (gameInfo.crisisYearResult.page === 2) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h3 className="mb-4 text-center">
                    {languageInfo.language['g4-screens']['player-machhines']}:
                </h3>

                {gameInfo.players?.map((player, i) => {
                    return <PlayerTable player={player} index={i} key={i} />;
                })}
            </div>
        );
    } else if (gameInfo.crisisYearResult.page === 3) {
        if (gameInfo.activeGame.admin === userInfo.info?._id) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h3 className="mb-4">
                        {languageInfo.language['g4-screens'].teams}
                    </h3>

                    <div className="flex">
                        {gameInfo.g4Data.teams?.map((team, j) => {
                            return (
                                <div
                                    key={j}
                                    className="flex flex-col w-80 mx-4"
                                >
                                    {team.map((teammate, i) => {
                                        if (typeof teammate !== 'string') {
                                            return null;
                                        }

                                        return (
                                            <TeammateInfo
                                                key={i}
                                                id={teammate}
                                                i={i}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (Array.isArray(gameInfo.crisisYearResult.team)) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <h3 className="my-1">
                        {languageInfo.language['g4-screens']['bidding-over']}
                    </h3>
                    <p className="my-1">
                        {languageInfo.language['g4-screens']['your-team']}:
                    </p>

                    <div className="flex flex-col w-80 mt-4">
                        {gameInfo.crisisYearResult.team.map((teammate, i) => {
                            if (typeof teammate !== 'string') {
                                return null;
                            }

                            return <TeammateInfo key={i} id={teammate} i={i} />;
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h3 className="my-1">
                    {languageInfo.language['g4-screens']['didnt-win']}
                </h3>
                <p>
                    {languageInfo.language['g4-screens']['highest-bid'].replace(
                        '[]',
                        String(gameInfo.crisisYearResult.biggestIv)
                    )}
                </p>
            </div>
        );
    }

    return null;
}

export const TeammateInfo: React.FC<{ id: string; i: number }> = ({
    id,
    i,
}) => {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [teammateInfo, setTeammateInfo] = useState<PlayerInterface | null>(
        null
    );
    const [teammateMachine, setTeammateMachine] =
        useState<MachineInterface | null>(null);

    useEffect(() => {
        if (!teammateInfo && gameInfo.players) {
            const activeTeammate = gameInfo.players.find((p) => p._id === id);
            if (activeTeammate) {
                setTeammateInfo(activeTeammate);
            }
        }

        if (gameInfo.g4Data.machines && gameInfo.players && !teammateMachine) {
            const activeMachine = gameInfo.g4Data.machines.find(
                (m) => m.owner === id
            );
            if (activeMachine) {
                setTeammateMachine(activeMachine);
            }
        }
    }, [teammateInfo, gameInfo.players, gameInfo.g4Data.machines]);

    return (
        <div
            className={`w-full h-10 flex justify-between items-center ${
                i < 2 ? 'border-b-2 border-BGlight' : ''
            }`}
        >
            <p>
                {getPlayerName(teammateInfo?.name)}
                {i === 0
                    ? ` [${languageInfo.language['g4-screens'].captain}]`
                    : ''}{' '}
                {gameInfo.playerInfo &&
                teammateInfo?._id === gameInfo.playerInfo._id
                    ? `(${languageInfo.language['generic-game-screen'].you})`
                    : ''}
            </p>

            <p>
                {teammateMachine?.number
                    ? `${teammateMachine.number} ${languageInfo.language[
                          'g4-screens'
                      ].machine.toLowerCase()}`
                    : languageInfo.language['g4-screens']['no-machine']}
            </p>
        </div>
    );
};

export default G4Showcase;
