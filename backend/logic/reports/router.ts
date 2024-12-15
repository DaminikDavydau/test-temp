import express from 'express';
import { reportCtrl } from './controller';

export const reportRouter = express.Router();

reportRouter.route('/:game_id/:player_id')
    .get(reportCtrl.getPlayerReport);

reportRouter.route('/:game_id')
    .get(reportCtrl.getAllReports);
