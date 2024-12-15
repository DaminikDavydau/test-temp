import express from 'express';
import { gameCtrl } from './controller';
import { auth } from '../../middleware/auth';
import { authAdmin } from '../../middleware/authAdmin';
import { authPlayer } from '../../middleware/authPlayer';

export const gameRouter = express.Router();

gameRouter.route("/:game_id")
    .get(gameCtrl.getOne)
    .put(auth, authAdmin, gameCtrl.start)
    .delete(auth, authAdmin, gameCtrl.remove)

gameRouter.route("/:game_id/pause")
    .put(auth, authAdmin, gameCtrl.pause)

gameRouter.route('/')
    .post(auth, authAdmin, gameCtrl.create);

gameRouter.route('/:game_id/invest')
    .post(authPlayer, gameCtrl.submitInvestment);

gameRouter.route('/:game_id/end-year')
    .post(auth, authAdmin, gameCtrl.endTurn);

gameRouter.route('/:game_id/get-return')
    .post(authPlayer, gameCtrl.getInvestmentReturn);

gameRouter.route('/:game_id/download-sheets/:language')
    .get(gameCtrl.downloadSheet);
