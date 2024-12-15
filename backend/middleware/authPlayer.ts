import jwt from 'jsonwebtoken';
import { Players } from '../logic/player/model';

export const authPlayer = async (req: any, res: any, next: any) => {
    try {
        const playertoken = req.query.token //const { playertoken } = req.cookies;
        if (!playertoken) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
        if (!access_token_secret) {
            return res.status(500).json({ err: 'Radās kļūme!' });
        }

        const decoded: any = jwt.verify(playertoken, access_token_secret, {
            ignoreExpiration: true,
        });
        if (!decoded) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        const user = await Players.findOne({ _id: decoded._id });
        if (!user) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        req.user = user;
        next();
    } catch (err: any) {
        res.status(500).json({ err: err.message });
    }
};
