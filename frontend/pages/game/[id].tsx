import React, { useEffect } from 'react';
import Head from 'next/head';
import { appName } from '../../src/constants/constants';
import GameContainer from '../../src/components/game/GameContainer';
import { useDispatch, useSelector } from 'react-redux';
import { PlayerInterface } from '../../src/types/player';
import {
    connect,
    getSocket,
    selectSocket,
    sendId,
    SocketInfo,
} from '../../src/redux/slices/socketSlice';
import {
    GameInfo,
    handleBankrupcy,
    handlePlayerBancrupcies,
    pauseGameRdx,
    playerJoin,
    playerLeave,
    receiveInvestment,
    resetGameState,
    selectGame,
    setAllExpenses,
    setReturns,
    setTeams,
    setTotalExpenses,
    showLeaderboard,
    startGameRdx,
    switchYearRdx,
    updateOwnAssets,
    updatePlayerAssets,
} from '../../src/redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../src/redux/slices/userSlice';
import { useRouter } from 'next/router';
import { joinSocketGame } from '../../src/socketRequests/joinGame';
import { InvestmentInterface } from '../../src/types/investment';
import {
    getGameById,
    getGameInvestments,
    getGamePlayers,
    getOwnedMachineData,
} from '../../src/requests/gameRequests';
import { getBusinesses } from '../../src/requests/businessRequests';
import { IIncomeReport, IYearResult } from '../../src/types/IYearResult';
import CokkiePopup from '../../src/components/notifs/CokkiePopup';
import { getGameReport } from '../../src/requests/playerRequests';
import { getUserById } from '../../src/requests/userRequests';
import getPrevYear from '../../src/utils/getPrevYear';
import { GameInterface } from '../../src/types/game';
import yearToNum from '../../src/utils/yearToNum';

function GamePage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const socketInfo: SocketInfo = useSelector(selectSocket);
    const userInfo: UserInfo = useSelector(selectUser);
    const gameInfo: GameInfo = useSelector(selectGame);

    useEffect(() => {
        if (gameInfo.reload) {
            window.location.reload();
        }
    }, [gameInfo.reload]);

    useEffect(() => {
        if (
            gameInfo.activeGame &&
            gameInfo.activeGame.type === 'Ražošana' &&
            gameInfo.activeGame.started &&
            !gameInfo.g4Data.machines &&
            (gameInfo.activeGame.admin === userInfo.info?._id ||
                gameInfo.playerInfo)
        ) {
            getOwnedMachineData(dispatch, router);
        }
    }, [
        gameInfo.activeGame,
        gameInfo.g4Data.machines,
        userInfo.info,
        gameInfo.playerInfo,
    ]);

    useEffect(() => {
        if (
            gameInfo.players &&
            gameInfo.activeGame &&
            gameInfo.activeGame.started &&
            gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi'
        ) {
            if (
                gameInfo.players.filter((player) => player.is_bancrupt === true)
                    .length === gameInfo.players.length
            ) {
                dispatch(showLeaderboard());
            }
        }
    }, [gameInfo.activeGame, gameInfo.players]);

    useEffect(() => {
        if (
            ((gameInfo.activeGame?.type === 'Krīzes gads' &&
                !gameInfo.secondGameHistory) ||
                (gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' &&
                    !gameInfo.playerDistances) ||
                (gameInfo.activeGame?.type === 'Frizētava' &&
                    gameInfo.g6Data.barbershops.length === 0 &&
                    gameInfo.activeGame.year !== 'yearOne' && !gameInfo.g6Data.editing) ||
                (gameInfo.activeGame?.type === 'Viesnīca' &&
                    !gameInfo.fifthGameHistory)) &&
            gameInfo.activeGame?.started
        ) {
            getGameReport(gameInfo.playerInfo?._id, router, dispatch);
        }
    }, [
        gameInfo.secondGameHistory,
        gameInfo.playerInfo,
        gameInfo.activeGame,
        gameInfo.playerDistances,
        gameInfo.g6Data?.barbershops,
        gameInfo.g6Data.editing
    ]);

    useEffect(() => {
        if (
            (!gameInfo.g4Data.teams || gameInfo.g4Data.teams.length < 3) &&
            gameInfo.activeGame?.type === 'Ražošana' &&
            gameInfo.players
        ) {
            let nTeams: string[][] | null = null;

            gameInfo.players?.forEach((player) => {
                const pTeam = player.teammates?.split(',');

                if (!pTeam || pTeam.length === 0) {
                    return;
                }

                let pushable = true;

                if (nTeams) {
                    nTeams.forEach((nTeam) => {
                        if (nTeam && nTeam.length >= 3) {
                            if (nTeam[0] === pTeam[0]) {
                                pushable = false;
                            }
                        }
                    });
                }

                if (pushable) {
                    if (!nTeams) {
                        nTeams = [];
                    }

                    nTeams = [...nTeams, pTeam];
                }
            });

            dispatch(setTeams(nTeams));
        }
    }, [gameInfo.activeGame, gameInfo.g4Data.teams, gameInfo.players]);

    useEffect(() => {
        if (!gameInfo.activeGame && router.query.id) {
            getGameById(dispatch, router);
        }
    }, [gameInfo.activeGame, router]);

    useEffect(() => {
        if (
            gameInfo.activeGame &&
            userInfo.info &&
            userInfo.info.role >= 1 &&
            userInfo.info._id === gameInfo.activeGame.admin
        ) {
            if (!socketInfo.socket) {
                dispatch(connect());
            }

            const socket = getSocket();

            if (!socket) {
                return;
            }

            if (socketInfo.socket && !socketInfo.idSent) {
                dispatch(sendId(userInfo.info));
            }

            socket.on('playerJoined', (player: PlayerInterface) => {
                dispatch(playerJoin(player));
            });

            // socket.on('playerLeft', (id: string) => {
            //     dispatch(playerLeave(id));
            // });

            socket.on(
                'receiveInvestment',
                (investment: InvestmentInterface) => {
                    if (
                        !gameInfo.gameInvestments?.find(
                            (iv) => iv._id === investment._id
                        )
                    ) {
                        dispatch(receiveInvestment(investment));
                    }
                }
            );
        }
    }, [
        userInfo.info,
        socketInfo.socket,
        socketInfo.idSent,
        gameInfo.activeGame,
    ]);

    useEffect(() => {
        if (!gameInfo.players && (userInfo.info || gameInfo.playerInfo)) {
            getGamePlayers(dispatch, router);
        }
    }, [gameInfo.players, userInfo.info, gameInfo.playerInfo]);

    useEffect(() => {
        if (!gameInfo.activeGame) {
            return;
        }

        if (userInfo.info) {
            if (
                userInfo.info._id === gameInfo.activeGame.admin &&
                !gameInfo.gameInvestments
            ) {
                getGameInvestments(dispatch, router);
            }
        }

        if (gameInfo.activeGame.type === 'Bankrots' && !gameInfo.businesses) {
            getBusinesses(dispatch, router);
        }
    }, [
        userInfo.info,
        gameInfo.gameInvestments,
        gameInfo.activeGame,
        gameInfo.businesses,
    ]);

    useEffect(() => {
        if (!socketInfo.socket) {
            dispatch(connect());
        }

        if (gameInfo.activeGame && !gameInfo.joined && gameInfo.playerInfo) {
            joinSocketGame(
                gameInfo.activeGame.admin,
                gameInfo.playerInfo,
                dispatch
            );
        }
    }, [
        gameInfo.joined,
        gameInfo.activeGame,
        gameInfo.playerInfo,
        socketInfo.socket,
    ]);

    useEffect(() => {
        if (
            gameInfo.activeGame &&
            userInfo.info?._id !== gameInfo.activeGame.admin
        ) {
            if (!socketInfo.socket) {
                dispatch(connect());
            }

            const socket = getSocket();

            if (!socket) {
                return;
            }

            socket.on('gameStarted', (gameId: string) => {
                if (gameId === gameInfo.activeGame?._id) {
                    dispatch(startGameRdx());
                }
            });

            socket.on('gameDeleted', (gameId: string) => {
                if (gameId === gameInfo.activeGame?._id) {
                    dispatch(resetGameState());
                    router.push('/');
                }
            });

            socket.on('playerJoined', (player: PlayerInterface) => {
                dispatch(playerJoin(player));
            });

            socket.on(
                'gamePaused',
                ({ paused, gameId }: { paused: boolean; gameId: string }) => {
                    if (
                        !gameInfo.activeGame ||
                        gameId !== gameInfo.activeGame._id
                    ) {
                        return;
                    }

                    dispatch(pauseGameRdx(paused));
                }
            );

            socket.on('yearSwitched', (data: IYearResult) => {
                const {
                    year,
                    bancrupcies,
                    investments,
                    investmentReturns,
                    assets,
                    playerBancrupcies,
                    pigsOnMarket,
                    crisisYear,
                    pigPrice,
                    incomes,
                    teams,
                } = data;

                if (!gameInfo.activeGame) {
                    return;
                }

                const ivYear = getPrevYear(year);
                const gameYearNum = yearToNum(gameInfo.activeGame.year);

                if (gameInfo.activeGame.type !== 'Ražošana') {
                    if (
                        ivYear &&
                        gameYearNum &&
                        ivYear === gameYearNum &&
                        (gameInfo.crisisYearResult || gameInfo.returns)
                    ) {
                        return;
                    }
                }

                console.log(data);

                dispatch(
                    setAllExpenses({
                        incomes,
                        pigsOnMarket,
                        crisisYear,
                        investments,
                        year,
                        investmentReturns,
                        teams,
                        bancrupcies,
                    })
                );

                dispatch(setTotalExpenses(null));
                dispatch(
                    setReturns({ bancrupcies, investmentReturns, investments })
                );

                dispatch(handleBankrupcy(bancrupcies));

                dispatch(handlePlayerBancrupcies(playerBancrupcies));

                dispatch(
                    updatePlayerAssets({
                        assets,
                        playerBancrupcies,
                        investmentReturns,
                    })
                );

                dispatch(
                    updateOwnAssets({
                        playerId: gameInfo.playerInfo?._id,
                        assets: assets,
                    })
                );

                if (year) {
                    dispatch(switchYearRdx(year));
                } else {
                    dispatch(switchYearRdx(null));
                }
            });
        }
    }, [
        userInfo.info,
        socketInfo.socket,
        gameInfo.activeGame,
        getSocket(),
        dispatch,
    ]);

    useEffect(() => {
        if (gameInfo.activeGame && !gameInfo.admin) {
            getUserById(gameInfo.activeGame.admin, dispatch, router);
        }
    }, [gameInfo.activeGame, gameInfo.admin]);

    return (
        <div className="page">
            <Head>
                <title>{appName} | play</title>
            </Head>

            <CokkiePopup />

            <GameContainer />
        </div>
    );
}

export default GamePage;
