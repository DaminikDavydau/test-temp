import {
    createPlayerReport,
    createPlayersNamesRecords,
} from '../game/gameManager/createRecords';
import { IPlayerReport } from '../../engine/types/IPlayerReport';

import { Games } from '../game/model';
import { Players } from '../player/model';
import { Reports } from './model';

import { PlayerInterface } from '../player/interfaces';

export const reportCtrl = {
    getPlayerReport: async (req: any, res: any) => {
        try {
            const { game_id, player_id } = req.params;

            const playerNames = createPlayersNamesRecords(
                await Players.find({ game_id: game_id })
            );
            const player = (await Players.findOne({
                _id: player_id,
            })) as PlayerInterface;
            const gameType = (await Games.findOne({ _id: game_id })).type;

            const report = createPlayerReport(
                player,
                await Reports.find({
                    game_id: game_id,
                    player_id: player_id,
                }),
                gameType,
                playerNames
            );

            res.json(report);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    getAllReports: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const allReports: IPlayerReport[] = [];
            const game = await Games.findOne({ _id: game_id });
            const players = await Players.find({ game_id: game_id });
            const gameType = game.type;
            const playerNames = createPlayersNamesRecords(players);

            for (const player of players) {
                const yearReportFromDb = await Reports.find({
                    game_id: game_id,
                    player_id: player._id,
                });

                allReports.push(
                    createPlayerReport(
                        player,
                        yearReportFromDb,
                        gameType,
                        playerNames
                    )
                );
            }

            res.json(allReports);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
};
