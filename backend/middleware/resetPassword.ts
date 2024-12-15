import jwt from 'jsonwebtoken';
import { Users } from '../logic/user/model'

export const resetPassword = async (req: any, res: any, next: any) => {
    try {
        const { reset_password_token } = req.params;

        if (!reset_password_token) {
            return res
                .status(400)
                .json({ err: 'wrong-auth' });
        }

        const { RESET_PASSWORD_TOKEN_SECRET } = process.env;
        if (!RESET_PASSWORD_TOKEN_SECRET) {
            return res.status(500).json({ err: 'error' });
        }

        const decoded: any = jwt.verify(
            reset_password_token,
            RESET_PASSWORD_TOKEN_SECRET
        );
        if (!decoded) {
            return res
                .status(400)
                .json({ err: 'wrong-auth' });
        }

        const user = await Users.findById({_id: decoded._id});

        req.user = user;
        next();
    } catch (err: any) {
        res.status(500).json({ err: err.message });
    }
};
