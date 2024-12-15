export interface PlayerInterface{
    _id: string;
    game_id: string;
    name: string;
    assets: number;
    createdAt: string;
    updatedAt: string;
}

export interface SocketPlayer {
    socketId: string;
    _id: string;
    game_id: string;
    adminId: string;
    name: string;
    assets: number;
    createdAt: string;
    updatedAt: string;
}

export interface PlayerJoinGame{
    adminId: string;
    player: PlayerInterface;
}