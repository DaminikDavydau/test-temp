import axios from 'axios';
import {
    DELETE_USER_ROUTE,
    GET_ADMINS_ROUTE,
    REGISTER_ROUTE,
    UPLOAD_LANGUAGE_ROUTE,
} from './apiRoutes';
import { Dispatch } from 'redux';
import { setNotification } from '../redux/slices/notificationSlice';
import { addLanguage } from '../redux/slices/languageSlice';
import { deleteAdminRdx, setAdmins } from '../redux/slices/userSlice';

export const createUser = async ({
    name,
    email,
    role,
    dispatch,
}: {
    name: string;
    email: string;
    role: number;
    dispatch: Dispatch;
}) => {
    await axios
        .post(`${REGISTER_ROUTE}?token=${window.localStorage.getItem('accesstoken')}`, { name, email, role }, { withCredentials: true })
        .then((res) => {
            dispatch(
                setNotification({
                    type: 'success',
                    message: 'admin-show-later',
                })
            );
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

export const uploadLanguage = async ({
    languageJson,
    dispatch,
}: {
    languageJson: File;
    dispatch: Dispatch;
}) => {
    const formData = new FormData();

    formData.append('language_file', languageJson);

    let success = false;

    await axios
        .post(UPLOAD_LANGUAGE_ROUTE, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((res) => {
            dispatch(addLanguage(res.data));
            success = true;
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });

    return success;
};

export const getAdmins = async ({ dispatch }: { dispatch: Dispatch }) => {
    await axios
        .get(`${GET_ADMINS_ROUTE}?token=${window.localStorage.getItem('accesstoken')}`, { withCredentials: true })
        .then((res) => {
            dispatch(setAdmins(res.data));
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

export const deleteAdmin = async ({
    dispatch,
    id,
}: {
    dispatch: Dispatch;
    id: string;
}) => {
    await axios
        .delete(`${DELETE_USER_ROUTE}/${id}?token=${window.localStorage.getItem('accesstoken')}`, { withCredentials: true })
        .then((res) => {
            dispatch(deleteAdminRdx(id));
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};
