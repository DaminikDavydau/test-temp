import { SocketPlayer, PlayerInterface } from "../types/player";

let players: SocketPlayer[] = [];

const addPlayer = (adminId: string, player: PlayerInterface, socketId: string) => {
    const joined = players.some((p) => player._id === p._id);

    if(!joined){
        const new_socket_player: SocketPlayer = {
            socketId: socketId,
            _id: player._id,
            game_id: player.game_id,
            adminId: adminId,
            name: player.name,
            assets: player.assets,
            createdAt: player.createdAt,
            updatedAt: player.updatedAt,
        }
        
        players = [...players, new_socket_player];
    }
};

const removePlayer = (socketId: string) => {
    players = players.filter((player) => player.socketId !== socketId);
};

const getPlayer = (playerId: string) => {
    return players.find((player) => player._id === playerId);
};

const getPlayerFromSocket = (socketId: string) => {
    return players.find((player) => player.socketId === socketId);
};

const getAdminPlayers = (adminId: string) => {
    const adminPlayers = players.filter((player) => player.adminId === adminId);
    return adminPlayers;
};

const getGamePlayers = (gameId: string) => {
    const adminPlayers = players.filter((player) => player.game_id === gameId);
    return adminPlayers;
};


export {
    addPlayer,
    removePlayer,
    getPlayer,
    players,
    getAdminPlayers,
    getPlayerFromSocket,
    getGamePlayers
}