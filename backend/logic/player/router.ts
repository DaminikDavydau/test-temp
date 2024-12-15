import express from 'express';
import { playerCtrl } from './controller';
import { auth } from '../../middleware/auth';
import { authAdmin } from '../../middleware/authAdmin';
import { authPlayer } from '../../middleware/authPlayer';

export const playerRouter = express.Router();

playerRouter.route('/')
    .get(authPlayer, playerCtrl.getInfo)

playerRouter.route('/:game_id')
    .get(playerCtrl.getGamePlayers)
    .delete(authPlayer, playerCtrl.leave);

playerRouter.route('/join/:code')
    .post(playerCtrl.join);
