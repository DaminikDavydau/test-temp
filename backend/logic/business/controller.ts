import { Businesses } from './model';

export const businessCtrl = {
    getAll: async (req: any, res: any) => {
        try {
            const { game_id } = req.params;

            const businesses = await Businesses.find({ game_id: game_id });

            res.json(businesses);
        } catch (err: any) {
            return res.status(500).json({ err: err.message });
        }
    },
};
