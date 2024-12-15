import { Investments } from './model';

export const investmentCtrl = {
    getGameInvestments: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const investments = await Investments.find({ game_id: game_id });

            res.json(investments);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
};
