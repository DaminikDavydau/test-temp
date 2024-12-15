const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_BASE = `${BASE}/api`;

const USER_BASE = `${API_BASE}/user`; //:id
const UPLOAD_BASE = `${API_BASE}/upload`;
const GAME_BASE = `${API_BASE}/game`; //:id
const INVESTMENT_BASE = `${API_BASE}/investment`; //:id
const PLAYER_BASE = `${API_BASE}/player`; //:id
const BUSINESS_BASE = `${API_BASE}/business`; //:game_id
const REPORT_BASE = `${API_BASE}/report`; //:game_id :player_id
const MACHINE_BASE = `${API_BASE}/machine`; //:game_id  ,,,  //* unowned
export const LANGUAGE_BASE = `${API_BASE}/language`; //:game_id  ,,,  //* unowned

const FORGOT_PASSWORD_ROUTE = `${USER_BASE}/forgot-password`;
const ACTIVATE_ACCOUNT_ROUTE = `${USER_BASE}/auth/activate_account`;
const REGISTER_ROUTE = `${USER_BASE}/auth/register`;
const LOGIN_ROUTE = `${USER_BASE}/auth/login`;
const LOGOUT_ROUTE = `${USER_BASE}/auth/logout`;
const ACCESS_TOKEN_ROUTE = `${USER_BASE}/access_token`;
const USER_INFO_ROUTE = `${USER_BASE}/info`;
const DELETE_ACCOUNT_ROUTE = `${USER_BASE}/deleteAccount`;
const DELETE_USER_ROUTE = `${USER_BASE}/admin`; //:id
const RESET_PASSWORD_ROUTE = `${USER_BASE}/auth/reset-password`; //:reset_password_token
const GET_ADMINS_ROUTE = `${USER_BASE}/getAdmins`;

const UPLOAD_AVATAR_ROUTE = `${UPLOAD_BASE}/avatar`;

const JOIN_GAME_ROUTE = `${PLAYER_BASE}/join`;

export const UPLOAD_LANGUAGE_ROUTE = `${LANGUAGE_BASE}/upload`;

export {
    REGISTER_ROUTE,
    LOGIN_ROUTE,
    ACCESS_TOKEN_ROUTE,
    LOGOUT_ROUTE,
    USER_INFO_ROUTE,
    ACTIVATE_ACCOUNT_ROUTE,
    UPLOAD_BASE,
    UPLOAD_AVATAR_ROUTE,
    DELETE_ACCOUNT_ROUTE,
    DELETE_USER_ROUTE,
    RESET_PASSWORD_ROUTE,
    GAME_BASE,
    USER_BASE,
    PLAYER_BASE,
    GET_ADMINS_ROUTE,
    INVESTMENT_BASE,
    JOIN_GAME_ROUTE,
    BUSINESS_BASE,
    FORGOT_PASSWORD_ROUTE,
    REPORT_BASE,
    MACHINE_BASE,
};
