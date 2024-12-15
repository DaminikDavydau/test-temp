import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export const createAccessToken = (payload: any) => {
    if (process.env.ACCESS_TOKEN_SECRET) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    }
};

export const createRefreshToken = (payload: any) => {
    if (process.env.REFRESH_TOKEN_SECRET) {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    }
};

export const createActivationToken = (payload: any) => {
    if (process.env.ACTIVATION_TOKEN_SECRET) {
        return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET);
    }
    return null;
};

export const createResetPasswordToken = (payload: any) => {
    if (process.env.RESET_PASSWORD_TOKEN_SECRET) {
        return jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET);
    }
    return null;
};
