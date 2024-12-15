import jwt from 'jsonwebtoken';

import { Users } from '../logic/user/model';

export const auth = async (req: any, res: any, next: any) => {
    try {
        const accesstoken = req.query.token //const { accesstoken } = req.cookies;
        if (!accesstoken) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
        if (!access_token_secret) {
            return res.status(500).json({ err: 'error' });
        }

        const decoded: any = jwt.verify(accesstoken, access_token_secret, {
            ignoreExpiration: true,
        });
        if (!decoded) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        const user = await Users.findById({ _id: decoded._id });
        if (!user) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        req.user = user;
        next();
    } catch (err: any) {
        res.status(500).json({ err: err.message });
    }
};

export const checkAuth = async (req: any, res: any) => {
    try {
        const accesstoken = req.query.token //const { accesstoken } = req.cookies;
        if (!accesstoken) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
        if (!access_token_secret) {
            return res.status(500).json({ err: 'error' });
        }

        const decoded: any = jwt.verify(accesstoken, access_token_secret, {
            ignoreExpiration: true,
        });
        if (!decoded) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        const user = await Users.findById({ _id: decoded._id });
        if (!user) {
            return res.status(400).json({ err: 'wrong-auth' });
        }

        return user;
    } catch (err: any) {
        res.status(500).json({ err: err.message });
    }
};
