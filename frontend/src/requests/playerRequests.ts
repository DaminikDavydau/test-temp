import axios from 'axios';
import { NextRouter } from 'next/router';
import { Dispatch } from 'redux';
import {
    handleHistoryData,
    handleReload,
    joinGameRdx,
    playerJoin,
    setInvestments,
    setPlayerBuildings,
    setPlayerDistances,
    setPlayerInfo,
} from '../redux/slices/gameSlice';
import { setNotification } from '../redux/slices/notificationSlice';
import { joinSocketGame } from '../socketRequests/joinGame';
import { GameInterface } from '../types/game';
import { InvestmentInterface } from '../types/investment';
import { PlayerInterface } from '../types/player';
import { JOIN_GAME_ROUTE, PLAYER_BASE, REPORT_BASE } from './apiRoutes';

interface JoinResponse {
    msg: string;
    adminId: string;
    player: PlayerInterface;
    playertoken: string;
}

const joinGame = async (
    code: string | string[] | undefined,
    name: string,
    surname: string,
    checked: boolean,
    router: NextRouter,
    dispatch: Dispatch
) => {
    console.log("joinGame Start", new Date().toLocaleTimeString(), Date.now())
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    if (typeof code !== 'string' || !code) {
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Lūdzu ievadiet spēles kodu',
            })
        );
    }

    if (!checked) {
        return dispatch(
            setNotification({
                type: 'error',
                message:
                    'Lai pievienotos spēlei, jums jāpiekrīt mūsu privātuma politikas noteikumiem',
            })
        );
    }

    if (!name || !surname) {
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Lūdzu ievadiet savu vārdu un uzvārdu',
            })
        );
    }

    const playerName = `${name} ${surname}`;

    const headers = {
        withCredentials: true,
    };

    const data = {
        name: playerName,
    };

    await axios
        .post(`${JOIN_GAME_ROUTE}/${code}`, data, headers)
        .then((res) => {
            const { msg, player, adminId, playertoken }: JoinResponse = res.data;

            window.localStorage.setItem('playertoken', playertoken);
            joinSocketGame(adminId, player, dispatch);

            dispatch(setPlayerInfo(player));

            router.push(`/game/${player.game_id}`);

            localStorage.setItem('joinedGame', 'true');
            console.log("joinGame End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            const message: string = err.response.data.err;
            dispatch(
                setNotification({
                    type: 'error',
                    message: message,
                })
            );

            router.push('/');
        });
};

const getPlayerInfo = async (dispatch: Dispatch, router: NextRouter) => {
    console.log("getPlayerInfo Start", new Date().toLocaleTimeString(), Date.now())
    const headers = {
        withCredentials: true,
    };

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    await axios
        .get(`${PLAYER_BASE}?token=${window.localStorage.getItem('playertoken')}`, headers)
        .then((res) => {
            const {
                playerInfo,
                playerInvestments,
            }: {
                playerInfo: PlayerInterface;
                playerInvestments: InvestmentInterface[];
            } = res.data;

            dispatch(
                setPlayerInfo({
                    player: playerInfo,
                    playerInvestments: playerInvestments,
                })
            );

            if (router.pathname !== '/game/[id]') {
                // dispatch(handleReload(true));
                router.push(`/game/${playerInfo.game_id}`);
            }
            console.log("getPlayerInfo End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            if (err.response) {
                return console.log(err);
            }
            const message: string = err.response.data.err;
            dispatch(
                setNotification({
                    type: 'error',
                    message: message,
                })
            );
        });
};

const getGameReport = async (
    userId: string | undefined,
    router: NextRouter,
    dispatch: Dispatch
) => {
    console.log("getGameReport Start", new Date().toLocaleTimeString(), Date.now())
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const { id } = router.query;
    if (!id || typeof id !== 'string') {
        return;
    }

    let reqBase = `${REPORT_BASE}/${id}/${userId}`;

    if (!userId) {
        reqBase = `${REPORT_BASE}/${id}`;
    }

    const headers = {
        withCredentials: true,
    };

    await axios
        .get(reqBase, headers)
        .then((res) => {
            console.log(res.data)

            if(typeof(res.data.length) !== "number"){
                dispatch(setPlayerBuildings(res.data))
            }

            dispatch(setPlayerDistances({yearResult: null, playerReport: res.data}));

            if(userId){
                dispatch(handleHistoryData(res.data));
            }
            console.log("getGameReport End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            if (!err.response) {
                return console.log(err);
            }
            const message: string = err.response.data.err;
            dispatch(
                setNotification({
                    type: 'error',
                    message: message,
                })
            );
        });
};

export { 
    joinGame, 
    getPlayerInfo, 
    getGameReport
};
