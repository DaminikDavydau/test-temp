import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { PlayerInterface } from '../../types/player';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

interface LeaderboardTeam {
    assets: number;
    players: PlayerInterface[];
}

function LeaderboardPlayers() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const LdbPlayer: React.FC<{ player: PlayerInterface; index: number }> = ({
        player,
        index,
    }) => {
        return (
            <div
                className="w-full flex items-center justify-between"
                key={index}
            >
                <div className="flex items-center justify-start">
                    <h3>{index + 1}.</h3>

                    <h3 className="ml-4">{player.name}</h3>
                </div>

                <h3>{player.assets}€</h3>
            </div>
        );
    };

    const LdbTeam: React.FC<{ team: LeaderboardTeam; index: number }> = ({
        team,
        index,
    }) => {
        return (
            <div
                className="w-full flex flex-col items-center justify-between my-4 border-b-2 border-BGdark-lighter"
                key={index}
            >
                <div className="w-full flex  items-center justify-between">
                    <div className="flex items-center justify-start">
                        <h3>
                            {index + 1}.{' '}
                            {languageInfo.language['g4-screens'].place}
                        </h3>

                        <h3 className="ml-4"></h3>
                    </div>

                    <h3>{team.assets}€</h3>
                </div>

                <div className="w-full flex items-center justify-start my-2">
                    {team.players &&
                        team.players.map((player, i) => {
                            return (
                                <p className="mr-2" key={i}>
                                    {player.name}
                                    {i < 2 ? ' -' : ''}
                                </p>
                            );
                        })}
                </div>
            </div>
        );
    };

    const TeamResults = () => {
        const [fullTeams, setFullTeams] = useState<LeaderboardTeam[] | null>(
            null
        );

        useEffect(() => {
            if (!fullTeams && gameInfo.players && gameInfo.g4Data.teams) {
                let newTeams: LeaderboardTeam[] = [];

                gameInfo.g4Data.teams.forEach((team) => {
                    let newTeammates: PlayerInterface[] = [];
                    let total = 0;

                    team.forEach((teammate) => {
                        const playerTeammate = gameInfo.players?.find(
                            (p) => p._id === teammate
                        );
                        if (playerTeammate) {
                            newTeammates = [...newTeammates, playerTeammate];
                            total += playerTeammate.assets;
                        }
                    });

                    const newTeam: LeaderboardTeam = {
                        assets: total,
                        players: newTeammates,
                    };

                    newTeams = [...newTeams, newTeam];
                });

                setFullTeams(newTeams);
            }
        }, [gameInfo.g4Data.teams, gameInfo.players, fullTeams]);

        if (!gameInfo.g4Data.teams || !fullTeams) {
            return null;
        }

        return (
            <div className="w-[500px] pt-16 overflow-y-scroll mb-4">
                <h3 className="text-center">
                    {languageInfo.language.notifications['team-results']}
                </h3>

                {fullTeams &&
                    [...fullTeams]
                        .sort((a, b) => b.assets - a.assets)
                        .map((team, i) => {
                            return <LdbTeam team={team} index={i} key={i} />;
                        })}
            </div>
        );
    };

    if (
        gameInfo.activeGame?.type === 'Ražošana' &&
        gameInfo.g4Data.teamResults
    ) {
        return <TeamResults />;
    }

    return (
        <div className="w-[500px] pt-16 overflow-y-scroll mb-4">
            {gameInfo.activeGame?.type === 'Ražošana' ? (
                <h3 className="text-center">
                    {
                        languageInfo.language['generic-game-screen'][
                            'player-results'
                        ]
                    }
                </h3>
            ) : null}

            {gameInfo.players &&
                [...gameInfo.players]
                    .sort((a, b) => {
                        if (a.assets === 0 && b.assets !== 0) {
                            return 1;
                        } else if (a.assets !== 0 && b.assets === 0) {
                            return -1;
                        } else {
                            return b.assets - a.assets;
                        }
                    })
                    .map((player, i) => {
                        return <LdbPlayer player={player} index={i} key={i} />;
                    })}
        </div>
    );
}

export default LeaderboardPlayers;
