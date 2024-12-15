import axios from 'axios';
import { LANGUAGE_BASE } from './apiRoutes';
import { Dispatch } from 'redux';
import { setNotification } from '../redux/slices/notificationSlice';
import {
    deleteLanguageRdx,
    setActiveLanguage,
    setLanguage,
    setLanguages,
} from '../redux/slices/languageSlice';

export const getLanguage = async ({
    dispatch,
    id = 'lv',
}: {
    id?: string;
    dispatch: Dispatch;
}) => {
    await axios
        .get(`${LANGUAGE_BASE}/${id}`, { withCredentials: true })
        .then((res) => {
            dispatch(setLanguage(res.data));
            dispatch(setActiveLanguage(id));

            localStorage.setItem('language', id);
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

export const getLanguages = async ({ dispatch }: { dispatch: Dispatch }) => {
    await axios
        .get(LANGUAGE_BASE, { withCredentials: true })
        .then((res) => {
            dispatch(setLanguages(res.data));
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

export const deleteLanguage = async ({
    dispatch,
    id,
}: {
    id: string;
    dispatch: Dispatch;
}) => {
    await axios
        .delete(`${LANGUAGE_BASE}/${id}`, { withCredentials: true })
        .then((res) => {
            dispatch(deleteLanguageRdx(id));
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};
