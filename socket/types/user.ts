export interface UserInterface {
    _id: string;
    name: string | null;
    username: string;
    email: string;
    password: string;
    profile_picture: string | null;
    role: number;
    createdAt: string;
    updatedAt: string;
}

export interface SocketUser {
    _id: string;
    socketId: string;
}