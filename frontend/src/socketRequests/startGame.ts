import { Dispatch } from 'redux';
import { connect, getSocket } from '../redux/slices/socketSlice';

const startSocketGame = (
    gameId: string,
    dispatch: Dispatch
) => {
    console.log("startSocketGame Start", new Date().toLocaleTimeString(), Date.now())
    const socket = getSocket();
    if (!socket) {
        dispatch(connect());
    }

    socket.emit('startGame', { gameId: gameId });
    console.log("startSocketGame End", new Date().toLocaleTimeString(), Date.now())
};

export { startSocketGame };
