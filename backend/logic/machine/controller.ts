import { MAX_BET, MINIMAL_PRICES } from '../../engine/production/constants';
import { Machines } from './model';

export const machineCtrl = {
    getAll: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const machines = await Machines.find({ game_id: game_id });

            res.json(machines);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    getAllUnowned: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const machines = await Machines.find({
                game_id: game_id,
                owner: null,
            });

            res.json(machines);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
    validateBet: async (req: any, res: any) => {
        try {
            const { machineType, rawBet } = req.body;

            const bet = +rawBet;
            const minimalPrice =
                MINIMAL_PRICES[machineType as keyof typeof MINIMAL_PRICES];

            let isValid = false;
            if (bet >= minimalPrice && bet <= MAX_BET) {
                isValid = true;
            }

            const result = {
                isValid: isValid,
                minimalPrice: minimalPrice,
                machineType: machineType,
                bet: bet,
            };

            res.json(result);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
};
