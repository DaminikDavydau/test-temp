import { Dispatch } from 'redux';
import { connect, getSocket } from '../redux/slices/socketSlice';

const pauseSocketGame = (
    paused: boolean,
    gameId: string,
    dispatch: Dispatch
) => {
    const socket = getSocket();
    if (!socket) {
        dispatch(connect());
    }

    socket.emit('pauseGame', { paused: paused, gameId: gameId });
};

export { pauseSocketGame };
