interface ServerToClientEvents {
    sendTurnResults: (gameId: string, turnResults: any) => void;
}

interface ClientToServerEvents {
    startGame: (gameId: string, gameType: string, playerIds: string[]) => void;
    submitPlayerInput: (
        gameId: string,
        playerId: string,
        inputData: any
    ) => void;
    endGameTurn: (gameId: string) => void;
}

interface InterServerEvents {}

interface SocketData {}

export {
    ServerToClientEvents,
    ClientToServerEvents,
    InterServerEvents,
    SocketData,
};
