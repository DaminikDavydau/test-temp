import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import { UserInterface } from '../../types/user';

export interface SocketInfo {
    socket: boolean | null;
    idSent: boolean;
}

let socket: any = null;

export function getSocket() {
    return socket;
}

const initialState: SocketInfo = {
    socket: null,
    idSent: false,
};

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connect: (state) => {
            let socket_url = process.env.NEXT_PUBLIC_SOCKET_URL;
            if(!socket_url){
                socket_url = 'http://localhost:8000'
            }

            socket = io(socket_url);
            state.socket = true;
        },
        sendId: (state, action) => {
            const user: UserInterface = action.payload;

            if (user.role < 1) {
                return;
            }

            socket.emit('addUser', user._id);
            state.idSent = true;
        },
    },
});

export const { connect, sendId } = socketSlice.actions;

export const selectSocket = (state: any) => state.socket;

export default socketSlice.reducer;
