import jwt from 'jsonwebtoken';

export const activate = async (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(400).json({err: "wrong-auth"})
        }

        const { ACTIVATION_TOKEN_SECRET } = process.env;
        if(!ACTIVATION_TOKEN_SECRET){
            return res.status(500).json({err: "Radās kļūme"});
        }

        const decoded: any = jwt.verify(token, ACTIVATION_TOKEN_SECRET);
        if(!decoded){
            return res.status(400).json({err: "wrong-auth"});
        }

        req.user = decoded;
        next();
    } catch (err: any) {
        res.status(500).json({ err: err.message });
    }
};
