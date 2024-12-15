import { Dispatch } from 'redux';
import { connect, getSocket } from '../redux/slices/socketSlice';
import { IIncomeReport, IYearResult } from '../types/IYearResult';

const switchSocketYear = (
    yearResult: IYearResult,
    gameId: string,
    dispatch: Dispatch
) => {
    console.log("switchSocketYear Start", new Date().toLocaleTimeString(), Date.now())
    let socket = getSocket();
    if (!socket) {
        dispatch(connect());
    }

    const data = {
        gameId: gameId,
        yearResult: yearResult
    }

    socket.emit('switchYear', data);
    console.log("switchSocketYear End", new Date().toLocaleTimeString(), Date.now())
};

export { switchSocketYear };
