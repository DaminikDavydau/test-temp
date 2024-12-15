import axios from 'axios';
import { NextRouter } from 'next/router';
import { Dispatch } from 'redux';
import { BuildingFromPrice } from '../constants/G5Constants';
import {
    handleBankrupcy,
    InvestmentsInterface,
    pauseGameRdx,
    receiveInvestment,
    resetGameState,
    setActiveGame,
    setAllExpenses,
    setInvestments,
    setPlayers,
    setReturns,
    setTotalExpenses,
    setPlayerDistances,
    startGameRdx,
    switchYearRdx,
    updatePlayerAssets,
    setSelectableInvestment,
    setActiveMachines,
    calculateG4InvestmentReturns,
} from '../redux/slices/gameSlice';
import { setNotification } from '../redux/slices/notificationSlice';
import { deleteSocketGame } from '../socketRequests/deleteGame';
import { pauseSocketGame } from '../socketRequests/pauseGame';
import { sendInvestment } from '../socketRequests/sendInvestment';
import { startSocketGame } from '../socketRequests/startGame';
import { switchSocketYear } from '../socketRequests/switchYear';
import { GameInterface } from '../types/game';
import { IYearResult } from '../types/IYearResult';
import {
    GAME_BASE,
    INVESTMENT_BASE,
    MACHINE_BASE,
    PLAYER_BASE,
} from './apiRoutes';
import { getBuildingFromPrice } from './../utils/getBuildingFromPrice';
import { verifyG4Investment } from '../utils/verifyG4Investment';

const createGame = async (
    e: any,
    type: string,
    dispatch: Dispatch,
    router: NextRouter
) => {
    console.log("createGame Start", new Date().toLocaleTimeString(), Date.now())
    e.preventDefault();

    if (!type) {
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Lūdzu norādiet spēles tipu',
            })
        );
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const data = {
        type: type,
    };

    const headers = {
        withCredentials: true,
    };

    await axios
        .post(`${GAME_BASE}?token=${window.localStorage.getItem('accesstoken')}`, data, headers)
        .then((res: any) => {
            const { msg, game } = res.data;

            dispatch(setActiveGame(game));

            router.push(`/game/${game._id}`);
            console.log("createGame End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

const getGameById = async (dispatch: Dispatch, router: NextRouter) => {
    const headers = {
        withCredentials: true,
    };
    console.log("getGameById Start", new Date().toLocaleTimeString(), Date.now())

    const { id } = router.query;

    if (!id) {
        return;
    }

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
        .get(`${GAME_BASE}/${id}`, headers)
        .then((res: any) => {
            if (!res.data) {
                router.push('/');
            }

            dispatch(setActiveGame(res.data));
            console.log("getGameById End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
            router.push('/');
        });
};

const startGame = async (
    gameId: string,
    dispatch: Dispatch,
    router: NextRouter
) => {
    console.log("startGame Start", new Date().toLocaleTimeString(), Date.now())
    const headers = {
        withCredentials: true,
    };

    const { id } = router.query;

    if (!id) {
        return;
    }

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
        .put(`${GAME_BASE}/${id}?token=${window.localStorage.getItem('accesstoken')}`, {}, headers)
        .then((res: any) => {
            startSocketGame(gameId, dispatch);

            dispatch(startGameRdx());
            console.log("startGame End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

const pauseGame = async (dispatch: Dispatch, router: NextRouter) => {

    console.log("pauseGame Start", new Date().toLocaleTimeString(), Date.now())

    const headers = {
        withCredentials: true,
    };

    const { id } = router.query;
    if (!id || typeof id !== 'string') {
        return;
    }

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
        .put(`${GAME_BASE}/${id}/pause?token=${window.localStorage.getItem('accesstoken')}`, {}, headers)
        .then((res: any) => {
            const { msg, paused } = res.data;

            dispatch(pauseGameRdx(paused));

            pauseSocketGame(paused, id, dispatch);
            console.log("pauseGame End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

const deleteGame = async (dispatch: Dispatch, router: NextRouter) => {
    console.log("deleteGame Start", new Date().toLocaleTimeString(), Date.now())
    const headers = {
        withCredentials: true,
    };

    const { id } = router.query;

    if (!id) {
        return;
    }

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
        .delete(`${GAME_BASE}/${id}?token=${window.localStorage.getItem('accesstoken')}`, headers)
        .then((res: any) => {
            deleteSocketGame(id, dispatch);
            dispatch(resetGameState());
            router.push('/');
            console.log("deleteGame End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            console.log(err.response.data)
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

const getGamePlayers = async (dispatch: Dispatch, router: NextRouter) => {
    console.log("getGamePlayers Start", new Date().toLocaleTimeString(), Date.now())
    const headers = {
        withCredentials: true,
    };

    const { id } = router.query;

    if (!id) {
        return;
    }

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
        .get(`${PLAYER_BASE}/${id}?token=${window.localStorage.getItem('playertoken')}`, headers)
        .then((res: any) => {
            dispatch(setPlayers(res.data));
            console.log("getGamePlayers End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
            router.push('/');
        });
};

const investReq = async (
    adminId: string | undefined,
    type: GameInterface['type'] | undefined,
    investments: InvestmentsInterface,
    jsonInvestment: string | null,
    dispatch: Dispatch,
    router: NextRouter,
    setInvested?: React.Dispatch<React.SetStateAction<boolean>>
) => {

    console.log("investReq Start", new Date().toLocaleTimeString(), Date.now())
    const { iv1, iv2, iv3, iv4, iv5 } = investments;
    const { id } = router.query;

    if (!id) {
        return router.push('/');
    }

    if (!adminId) {
        return;
    }

    if (type === 'Viesnīca' && !iv1) {
        return;
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    let stringedInvestmentValue = '';

    if (type === 'Krīzes gads') {
        const secondGameInvestmentValue = {
            pigs: iv2,
        };

        stringedInvestmentValue = JSON.stringify(secondGameInvestmentValue);
    } else if (type === 'Bankrots') {
        const investmentValue = {
            businessOne: Number(iv1),
            businessTwo: Number(iv2),
            businessThree: Number(iv3),
            businessFour: Number(iv4),
            businessFive: Number(iv5),
        };

        stringedInvestmentValue = JSON.stringify(investmentValue);
    } else if (type === 'Lēnāk brauksi - tālāk tiksi') {
        const thirdGameInvestmentValue = {
            speed: iv2,
        };

        stringedInvestmentValue = JSON.stringify(thirdGameInvestmentValue);
    } else if (type === 'Viesnīca') {
        const G5Building = getBuildingFromPrice(iv2);

        const G5InvestmentValue = {
            price: iv1,
            constructions: G5Building,
        };

        stringedInvestmentValue = JSON.stringify(G5InvestmentValue);
    } else if (type === 'Ražošana') {
        let G4InvestmentValue = null;

        if (jsonInvestment) {
            G4InvestmentValue = jsonInvestment;
        } else {
            G4InvestmentValue = {
                bet: iv1,
            };
        }

        stringedInvestmentValue = JSON.stringify(G4InvestmentValue);
    } else if (type === 'Frizētava') {
        if (!jsonInvestment) {
            return;
        }
        stringedInvestmentValue = jsonInvestment;
    }

    if (!stringedInvestmentValue) {
        return;
    }

    const headers = {
        withCredentials: true,
    };

    const data = {
        investment: stringedInvestmentValue,
    };

    await axios
        .post(`${GAME_BASE}/${id}/invest?token=${window.localStorage.getItem('playertoken')}`, data, headers)
        .then((res: any) => {
            const { investment, msg, totalExpenses } = res.data;

            console.log(res.data);

            sendInvestment(investment, adminId, dispatch);

            dispatch(receiveInvestment(investment));

            dispatch(setSelectableInvestment({ investment: null }));

            setInvested && setInvested(true);
            console.log("investReq End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            console.log(err);
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

const switchYear = async (dispatch: Dispatch, router: NextRouter) => {
    console.log("switchYear Start", new Date().toLocaleTimeString(), Date.now())
    const { id } = router.query;

    if (typeof id !== 'string') {
        return;
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const headers = {
        withCredentials: true,
    };

    await axios
        .post(`${GAME_BASE}/${id}/end-year?token=${window.localStorage.getItem('accesstoken')}`, {}, headers)
        .then((res: any) => {
            const {
                year,
                bancrupcies,
                investments,
                investmentReturns,
                assets,
                playerBancrupcies,
                crisisYear,
                pigsOnMarket,
                incomes,
                teams,
            }: IYearResult = res.data;

            console.log(res.data);

            switchSocketYear(res.data, id, dispatch);

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

            dispatch(updatePlayerAssets({ assets, playerBancrupcies }));

            dispatch(
                setReturns({
                    bancrupcies: bancrupcies,
                    investmentReturns: investmentReturns,
                    investments: investments,
                })
            );

            dispatch(
                setPlayerDistances({ yearResult: res.data, playerReport: null })
            );

            dispatch(handleBankrupcy(bancrupcies));

            dispatch(switchYearRdx(year));
            console.log("switchYear End", new Date().toLocaleTimeString(), Date.now())
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

const getGameInvestments = async (dispatch: Dispatch, router: NextRouter) => {
    console.log("getGameInvestments Start", new Date().toLocaleTimeString(), Date.now())
    const { id } = router.query;
    if (!id) {
        return;
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const headers = {
        withCredentials: true,
    };

    await axios
        .get(`${INVESTMENT_BASE}/${id}?token=${window.localStorage.getItem('accesstoken')}`, headers)
        .then((res: any) => {
            dispatch(setInvestments(res.data));
            console.log("getGameInvestments End", new Date().toLocaleTimeString(), Date.now())
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

const getInvestmentReturns = async (
    dispatch: Dispatch,
    router: NextRouter,
    investment: string | null
) => {
    console.log("getInvestmentReturns Start", new Date().toLocaleTimeString(), Date.now())
    const { id } = router.query;
    if (!id || !investment) {
        return;
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const headers = {
        withCredentials: true,
    };

    const body = {
        investment: investment,
    };

    await axios
        .post(`${GAME_BASE}/${id}/get-return?token=${window.localStorage.getItem('playertoken')}`, body, headers)
        .then((res: any) => {
            console.log('calculated machine data: ', res.data);
            dispatch(calculateG4InvestmentReturns(res.data));
            console.log("getInvestmentReturns End", new Date().toLocaleTimeString(), Date.now())
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

const getOwnedMachineData = async (dispatch: Dispatch, router: NextRouter) => {
    console.log("getOwnedMachineData Start", new Date().toLocaleTimeString(), Date.now())
    const { id } = router.query;
    if (!id) {
        return;
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const headers = {
        withCredentials: true,
    };

    await axios
        .get(`${MACHINE_BASE}/${id}`, headers)
        .then((res: any) => {
            console.log('machines: ', res.data);
            dispatch(setActiveMachines(res.data));
            console.log("getOwnedMachineData End", new Date().toLocaleTimeString(), Date.now())
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
    createGame,
    getGameById,
    startGame,
    deleteGame,
    getGamePlayers,
    investReq,
    switchYear,
    pauseGame,
    getGameInvestments,
    getOwnedMachineData,
    getInvestmentReturns,
};
