import { Games } from '../game/model';
import { Players } from './model';

import { createAccessToken } from '../../utils/generateToken';

import { gameClasses } from '../game/gameManager/gameClasses';
import { Investments } from '../investment/model';

export const playerCtrl = {
    join: async (req: any, res: any) => {
        try {
            const { name } = req.body;
            const { code } = req.params;

            const game = await Games.findOne({ code: code });
            if (!game) {
                return res.status(400).json({
                    err: 'game-not-found',
                });
            }

            if (game.started) {
                return res.status(400).json({
                    err: 'game-started',
                });
            }

            const gameClass = gameClasses[game.type];

            const new_player = new Players({
                name: name,
                game_id: game._id,
                assets: gameClass.playerInitialAssets,
            });

            await new_player.save();

            const player_token = createAccessToken({ _id: new_player._id });
            if (!player_token) {
                return res.status(500).json({ err: 'error' });
            }

            res.cookie('playertoken', player_token, {
                path: process.env.NODE_ENV === 'production' ? '/' : undefined,
                domain:
                    process.env.NODE_ENV === 'production'
                        ? process.env.COOKIE_DOMAIN
                        : undefined,
                secure:
                    process.env.NODE_ENV === 'production' ? true : undefined,
                httpOnly: process.env.NODE_ENV === 'production' ? true : false,
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : undefined,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            });

            res.json({
                msg: 'Veiksmīgi pievienojāties spēlei',
                player: new_player,
                adminId: game.admin,
                playertoken: player_token,
            });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    leave: async (req: any, res: any) => {
        try {
            const authPlayer = req.user;

            await authPlayer.deleteOne();

            res.clearCookie('playertoken');

            res.json({ msg: 'Veiksmīgi izgājāt no spēles' });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    getGamePlayers: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const players = await Players.find({ game_id: game_id });

            res.json(players);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    getInfo: async (req: any, res: any) => {
        try {
            const authPlayer = req.user;

            const player_investments = await Investments.find({
                player_id: authPlayer._id,
            });

            res.json({
                playerInfo: authPlayer,
                playerInvestments: player_investments,
            });
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
};
