import { createSlice } from '@reduxjs/toolkit';
import { UserInterface } from '../../types/user';

export interface UserInfo {
    loggedIn: boolean;
    token: string;
    info: null | UserInterface;
    admins: any[] | null;
}

const initialState: UserInfo = {
    loggedIn: false,
    token: '',
    info: null,
    admins: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state) => {
            state.loggedIn = true;
        },
        setUserInfo: (state, action) => {
            state.info = action.payload;
        },
        setAdmins: (state, action) => {
            return {
                ...state,
                admins: action.payload,
            };
        },
        deleteAdminRdx: (state, action) => {
            return {
                ...state,
                admins: state.admins
                    ? state.admins.filter((adm) => adm._id !== action.payload)
                    : null,
            };
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: () => initialState,
    },
});

export const {
    login,
    setUserInfo,
    setToken,
    logout,
    setAdmins,
    deleteAdminRdx,
} = userSlice.actions;

export const selectUser = (state: any) => state.user;

export default userSlice.reducer;
