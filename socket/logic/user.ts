import { SocketUser } from "../types/user";

let users: SocketUser[] = [];

const addUser = (userId: string, socketId: string) => {
    const joined = users.some((p) => userId === p._id);

    if(!joined){
        const new_socket_user: SocketUser = {
            socketId: socketId,
            _id: userId,
        }
        
        users = [...users, new_socket_user];
    }
};

const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
    const game_user = users.find((user) => user._id === userId);
    return game_user;
};

const getUserFromSocket = (socketId: string) => {
    const game_user = users.find((user) => user.socketId === socketId);
    return game_user;
};

export {
    addUser,
    removeUser,
    getUser,
    users,
    getUserFromSocket
}