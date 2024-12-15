import { Dispatch } from 'redux';
import { joinGameRdx } from '../redux/slices/gameSlice';
import { connect, getSocket } from '../redux/slices/socketSlice';
import { PlayerInterface } from '../types/player';

const joinSocketGame = (
    adminId: string,
    player: PlayerInterface,
    dispatch: Dispatch,
) => {
    console.log("joinSocketGame Start", new Date().toLocaleTimeString(), Date.now())
    dispatch(connect());

    const socket = getSocket();

    if (!socket) {
        return;
    }

    socket.emit('joinGame', { adminId: adminId, player: player });

    dispatch(joinGameRdx());
    console.log("joinSocketGame End", new Date().toLocaleTimeString(), Date.now())
};

export { joinSocketGame };
