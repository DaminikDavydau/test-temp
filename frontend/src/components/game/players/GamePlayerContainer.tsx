import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { IBarbershop } from '../../../types/barber';
import { MachineInterface } from '../../../types/machine';
import { PlayerInterface } from '../../../types/player';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

interface Props {
    player: PlayerInterface;
}

const GamePlayerContainer: React.FC<Props> = ({ player }) => {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [newDistance, setNewDistance] = useState(null);
    const [newBBsAmount, setNewBBsAmount] = useState(null);
    const [newBid, setNewBid] = useState(null);
    const [totalDistance, setTotalDistance] = useState(960);
    const [playerBarbershops, setPlayerBarbershops] = useState<
        null | IBarbershop[]
    >(null);
    const [isLeader, setIsLeader] = useState<null | boolean>(null);
    const [playerMachine, setPlayerMachine] = useState<MachineInterface | null>(
        null
    );

    useEffect(() => {
        if (
            gameInfo.activeGame?.type === 'Frizētava' &&
            gameInfo.g6Data.playerBarbershops
        ) {
            for (const pBsKey in gameInfo.g6Data.playerBarbershops) {
                if (pBsKey === player._id) {
                    setPlayerBarbershops(
                        gameInfo.g6Data.playerBarbershops[pBsKey]
                    );
                }
            }
        }
    }, [gameInfo.activeGame, gameInfo.g6Data.playerBarbershops]);

    useEffect(() => {
        if (
            gameInfo.activeGame?.type === 'Ražošana' &&
            gameInfo.g4Data.machines &&
            gameInfo.g4Data.machines.filter((m) => m.owner === null).length >= 1
        ) {
            const PM = gameInfo.g4Data.machines?.find(
                (m) => m.owner === player._id
            );
            if (PM) {
                setPlayerMachine(PM);
            }
        }
    }, [gameInfo.activeGame, gameInfo.g4Data.machines]);

    useEffect(() => {
        if (gameInfo.gameInvestments) {
            const ivValue = gameInfo.gameInvestments
                .filter((iv) => iv.year === gameInfo.activeGame?.year)
                .find((iv) => iv.player_id === player._id)?.value;

            if (!ivValue) {
                setNewBBsAmount(null);
                return;
            }

            if (gameInfo.activeGame?.type === 'Frizētava') {
                setNewBBsAmount(
                    JSON.parse(String(ivValue)).investments.barbershops.length
                );
            } else if (gameInfo.activeGame?.type === 'Ražošana') {
                setNewBid(JSON.parse(String(ivValue)).investments.bet);
            } else if (
                gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
            ) {
                setNewDistance(JSON.parse(String(ivValue)).investments.speed);
            }
        }
    }, [gameInfo.gameInvestments, gameInfo.activeGame]);

    useEffect(() => {
        if (
            gameInfo.g4Data.teams &&
            gameInfo.activeGame?.type === 'Ražošana' &&
            isLeader === null &&
            gameInfo.g4Data.machines?.filter((m) => m.owner === null).length ===
                0
        ) {
            let leader = false;

            gameInfo.g4Data.teams.forEach((team) => {
                if (team[0] === player._id) {
                    leader = true;
                }
            });

            setIsLeader(leader);
        }
    }, [
        gameInfo.g4Data.teams,
        gameInfo.activeGame,
        isLeader,
        gameInfo.g4Data.machines,
    ]);

    useEffect(() => {
        if (
            gameInfo.playerDistances &&
            gameInfo.activeGame &&
            gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi' &&
            gameInfo.players
        ) {
            const playerInfo = gameInfo.players.find(
                (p) => p._id === player._id
            );
            if (playerInfo && playerInfo.is_bancrupt) {
                setTotalDistance(0);
                return;
            }

            const playerDistance = gameInfo.playerDistances[player._id];
            if (!playerDistance) {
                return;
            }

            if (960 - playerDistance < 0) {
                setTotalDistance(0);
            } else {
                setTotalDistance(960 - playerDistance);
            }
        }
    }, [gameInfo.playerDistances, gameInfo.activeGame, gameInfo.players]);

    return (
        <div
            className={`w-[500px] flex items-center justify-between my-4 relative ${
                isLeader === false ? 'opacity-50' : ''
            }`}
        >
            {gameInfo.gameInvestments &&
            gameInfo.activeGame &&
            gameInfo.gameInvestments
                .filter((i) => i.year === gameInfo.activeGame?.year)
                .find((i) => i.player_id === player._id) ? (
                <img
                    src="/svg/black-checkmark.svg"
                    alt="black checkmark"
                    className="checkmarkImg absolute -left-10"
                />
            ) : (gameInfo.activeGame?.type === 'Bankrots' &&
                  player.assets === 0) ||
              (gameInfo.activeGame?.type === 'Krīzes gads' &&
                  player.assets <= -4000) ||
              player.is_bancrupt ? (
                <img
                    src={
                        gameInfo.activeGame?.type ===
                        'Lēnāk brauksi - tālāk tiksi'
                            ? '/icons/flag.png'
                            : '/svg/black-cross.svg'
                    }
                    alt="black cross"
                    className="absolute -left-7 h-6"
                />
            ) : playerMachine ? (
                <div className="flex absolute -left-14 justify-center items-center">
                    <p>{playerMachine.number}</p>

                    <img
                        src="/icons/machine.png"
                        alt="machine"
                        className="ml-2 h-6"
                    />
                </div>
            ) : isLeader ? (
                <img
                    src="/icons/crown.png"
                    alt="crown"
                    className="absolute -left-8 h-6"
                />
            ) : null}

            <h4 className="w-[200px]">{player.name}</h4>

            {gameInfo.activeGame?.type === 'Frizētava' && newBBsAmount ? (
                <div className="flex items-center justify-start w-[150px]">
                    <img
                        src="/icons/barbershop.png"
                        alt="barbershop"
                        className="mr-2 h-6"
                    />
                    <p>{newBBsAmount}</p>
                </div>
            ) : gameInfo.activeGame?.type === 'Frizētava' &&
              playerBarbershops ? (
                <div className="flex items-center justify-start w-[150px]">
                    <img
                        src="/icons/barbershop.png"
                        alt="barbershop"
                        className="mr-2 h-6"
                    />
                    <p>{playerBarbershops.length}</p>
                </div>
            ) : gameInfo.activeGame?.type === 'Frizētava' ? (
                <div className="flex items-center justify-start w-[150px]">
                    <img
                        src="/icons/barbershop.png"
                        alt="barbershop"
                        className="mr-2 h-6"
                    />
                    <p>0</p>
                </div>
            ) : typeof newBid === 'number' &&
              gameInfo.activeGame?.type === 'Ražošana' &&
              Number(
                  gameInfo.g4Data.machines?.filter((m) => m.owner === null)
                      ?.length
              ) >= 1 ? (
                <div className="flex items-center justify-start w-[150px]">
                    <p>{newBid === 0 ? 'izlaiž' : `${newBid}€`}</p>
                </div>
            ) : null}

            {gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' ? (
                <div className="flex items-center justify-center w-[150px]">
                    {typeof newDistance === 'number' ? (
                        newDistance === 0 ? (
                            <p>{languageInfo.language['g3-screens'].rests}</p>
                        ) : (
                            <p>+{newDistance}km</p>
                        )
                    ) : null}
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <img
                        src="/icons/dollaz.png"
                        alt="dollars"
                        className="mr-2"
                    />

                    <p>{player.assets}€</p>
                </div>
            )}

            {gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' ? (
                <div className="flex items-center justify-center w-[150px]">
                    {typeof totalDistance === 'number' ? (
                        <p>{totalDistance}km</p>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default GamePlayerContainer;
