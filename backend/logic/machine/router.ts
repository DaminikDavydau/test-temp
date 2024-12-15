import express from 'express';
import { machineCtrl } from '../machine/controller';

export const machineRouter = express.Router();

machineRouter.route("/:game_id")
    .get(machineCtrl.getAll)

machineRouter.route("/:game_id/unowned")
    .get(machineCtrl.getAllUnowned)

machineRouter.route("/validate-bet")
    .post(machineCtrl.validateBet)