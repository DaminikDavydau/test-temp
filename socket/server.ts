import { addUser, getUser } from './logic/user';
import { users } from './logic/user';
import { removeUser } from './logic/user';
import * as dotenv from 'dotenv';
import { PlayerJoinGame } from './types/player';
import {
    addPlayer,
    getGamePlayers,
    getPlayer,
    getPlayerFromSocket,
    removePlayer,
} from './logic/player';
import {
    GameStartProps,
    SendInvestmentProps,
    YearSwitchProps,
} from './types/game';
import { Server } from 'socket.io';

dotenv.config();

const server = new Server(Number(process.env.PORT), {
    cors: {
        origin: process.env.CLIENT_URL,
    },
});

server.on('connection', (socket) => {
    console.log('a user connected.');

    socket.on('addUser', (userId: string) => {
        addUser(userId, socket.id);
        server.emit('getUsers', users);
    });

    //join game and notify admin
    socket.on('joinGame', ({ adminId, player }: PlayerJoinGame) => {
        addPlayer(adminId, player, socket.id);

        const admin = getUser(adminId);
        if (admin) {
            server.to(admin.socketId).emit('playerJoined', player);
        }

        const gameId = player.game_id;

        const game_players = getGamePlayers(gameId);

        game_players.forEach((game_player) => {
            if (game_player._id !== player._id) {
                server.to(game_player.socketId).emit('playerJoined', player);
            }
        });
    });

    socket.on(
        'sendInvestment',
        ({ adminId, investment }: SendInvestmentProps) => {
            const playerAdmin = getUser(adminId);
            if (!playerAdmin) {
                return;
            }

            server
                .to(playerAdmin.socketId)
                .emit('receiveInvestment', investment);
        }
    );

    socket.on('switchYear', (data: YearSwitchProps) => {
        const { gameId, yearResult } = data;

        const gamePlayers = getGamePlayers(gameId);

        for (const investmentReturn of Object.values(yearResult.investmentReturns)) {
            if (investmentReturn.driveData) {
                if (investmentReturn.driveData.distance < 960) {
                    break;
                }
                yearResult.year = null;
            }
        }

        gamePlayers.forEach((player) => {
            server.to(player.socketId).emit('yearSwitched', yearResult);
        });
    });

    socket.on('startGame', ({ gameId }: GameStartProps) => {
        const adminPlayers = getGamePlayers(gameId);

        adminPlayers.forEach((player) => {
            server.to(player.socketId).emit('gameStarted', gameId);
        });
    });

    socket.on(
        'pauseGame',
        ({ gameId, paused }: { gameId: string; paused: boolean }) => {
            const gamePlayers = getGamePlayers(gameId);

            const data = {
                gameId: gameId,
                paused: paused,
            };

            gamePlayers.forEach((player) => {
                server.to(player.socketId).emit('gamePaused', data);
            });
        }
    );

    socket.on('deleteGame', ({ gameId }: GameStartProps) => {
        const gamePlayers = getGamePlayers(gameId);

        gamePlayers.forEach((player) => {
            server.to(player.socketId).emit('gameDeleted', gameId);
        });

        gamePlayers.forEach((player) => {
            removePlayer(player.socketId);
        });
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected!');

        const socketPlayer = getPlayerFromSocket(socket.id);
        if (socketPlayer) {
            const playerAdmin = getUser(socketPlayer.adminId);
            if (playerAdmin) {
                server
                    .to(playerAdmin.socketId)
                    .emit('playerLeft', socketPlayer._id);
            }
            removePlayer(socket.id);
        } else {
            removeUser(socket.id);
            server.emit('getUsers', users);
        }
    });
});
