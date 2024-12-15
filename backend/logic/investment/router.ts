import express from 'express';
import { investmentCtrl } from './controller';
import { authAdmin } from '../../middleware/authAdmin';
import { auth } from '../../middleware/auth';

export const investmentRouter = express.Router();

investmentRouter.route('/:game_id')
    .get(auth, authAdmin, investmentCtrl.getGameInvestments);
