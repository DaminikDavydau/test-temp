import { Dispatch } from 'redux';
import { connect, getSocket } from '../redux/slices/socketSlice';

const deleteSocketGame = (
    gameId: string | string[],
    dispatch: Dispatch
) => {
    const socket = getSocket();
    if (!socket) {
        dispatch(connect());
    }

    socket.emit('deleteGame', { gameId: gameId });
};
export { deleteSocketGame };
