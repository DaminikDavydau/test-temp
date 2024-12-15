import express from 'express';
import { businessCtrl } from './controller';

export const businessRouter = express.Router();

businessRouter.route("/:game_id")
    .get(businessCtrl.getAll)
    