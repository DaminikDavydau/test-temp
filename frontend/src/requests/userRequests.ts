import axios from 'axios';
import { NextRouter } from 'next/router';
import { Dispatch } from 'redux';
import {
    clearNotification,
    setNotification,
} from '../../src/redux/slices/notificationSlice';
import { setAdmin } from '../redux/slices/gameSlice';
import {
    login,
    logout,
    setToken,
    setUserInfo,
} from '../redux/slices/userSlice';
import { validateEmail } from '../utils/valid';
import {
    ACCESS_TOKEN_ROUTE,
    ACTIVATE_ACCOUNT_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    LOGIN_ROUTE,
    LOGOUT_ROUTE,
    REGISTER_ROUTE,
    RESET_PASSWORD_ROUTE,
    USER_BASE,
} from './apiRoutes';

const loginUser = async (
    e: any,
    email: string,
    password: string,
    accepted: boolean,
    dispatch: any,
    router: NextRouter,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();

    if (loading) {
        return;
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    setLoading(true);

    if (!email || !password) {
        setLoading(false);
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Lūdzu aizpildiet visus lauciņus!',
            })
        );
    }

    if (!validateEmail(email)) {
        setLoading(false);
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Nepareizs epasta formāts!',
            })
        );
    }

    if (password.length < 6) {
        setLoading(false);
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Parolei jābūt vismaz 6 rakstzīmes garai!',
            })
        );
    }

    if (!accepted) {
        setLoading(false);
        return dispatch(
            setNotification({ type: 'error', message: 'Jūs nekur netiekat' })
        );
    }

    const userData = {
        email: email,
        password: password,
    };

    const headers = {
        withCredentials: true,
    };

    await axios
        .post(LOGIN_ROUTE, userData, headers)
        .then((res: any) => {
            window.localStorage.setItem('firstLogin', 'true');
            window.localStorage.setItem('refreshtoken', res.data.refresh_token);
            console.log(res);
            document.cookie = `refreshtoken=${res.data.refresh_token}; path=/; domain='poikaqwesder123-backend.eu-west-1.elasticbeanstalk.com'; secure='false'; samesite='none'; max-age=${3 * 24 * 60 * 60 * 1000}`;
            document.cookie = `refreshtoken=${res.data.refresh_token}; path=/; domain='poikaqwesder123-frontend.eu-west-1.elasticbeanstalk.com'; secure='false'; samesite='none'; max-age=${3 * 24 * 60 * 60 * 1000}`;
            dispatch(clearNotification());
            checkForLogin(dispatch, router);
            setLoading(false);
        })
        .catch((err: any) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            setLoading(false);
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

const registerUser = async (
    e: any,
    name: string,
    email: string,
    password: string,
    accepted: boolean,
    dispatch: any,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    e.preventDefault();

    if (loading) {
        return;
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    setLoading(true);

    if (!email || !password || !name) {
        setLoading(false);
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Lūdzu aizpildiet visus lauciņus!',
            })
        );
    }

    if (!validateEmail(email)) {
        setLoading(false);
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Nepareizs epasta formāts!',
            })
        );
    }

    if (password.length < 6) {
        setLoading(false);
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Parolei jābūt vismaz 6 rakstzīmes garai!',
            })
        );
    }

    if (!accepted) {
        setLoading(false);
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Jums jāpiekrīt mūsu privātuma politikai!',
            })
        );
    }

    const userData = {
        email: email,
        name: name,
        password: password,
    };

    const headers = {
        withCredentials: true,
    };

    await axios
        .post(REGISTER_ROUTE, userData, headers)
        .then((res: any) => {
            const { msg } = res.data;

            setLoading(false);
            dispatch(setNotification({ type: 'success', message: msg }));
        })
        .catch((err: any) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            setLoading(false);
            dispatch(setNotification({ type: 'error', message: message }));
        });
};

const checkForLogin = async (dispatch: Dispatch, router: NextRouter) => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const first_login = window.localStorage.getItem('firstLogin');

    if (!first_login) {
        dispatch(clearNotification());
        return;
    }

    const cookies = document.cookie;
    console.log(cookies)

// Split the cookies into an array based on the semicolon and space ("; ")
const cookieArray = cookies.split('; ');

// Loop through the array to check the individual cookies
for (const cookie of cookieArray) {
  const [name, value] = cookie.split('=');
  
  // You can log or process the name and value of each cookie here
  console.log(`Cookie Name: ${name}, Value: ${value}`);
}


    const headers = {
        withCredentials: true,
    };

    const route = `${ACCESS_TOKEN_ROUTE}?token=${window.localStorage.getItem('refreshtoken')}`

    await axios
        .get(route, headers) //.get(ACCESS_TOKEN_ROUTE, headers)
        .then((res: any) => {
            const { user, access_token, game } = res.data;
            console.log(res.data, game, game == true)
            window.localStorage.setItem('accesstoken', access_token)
            dispatch(setToken(access_token));
            dispatch(setUserInfo(user));
            dispatch(login());
            dispatch(clearNotification());

            if (game) {
                router.push(`/game/${game._id}`);
            }
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            console.log(err.response.data)
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
            window.localStorage.removeItem('firstLogin');
        });
};

const logoutUser = async (dispatch: any) => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const headers = {
        withCredentials: true,
    };

    await axios.post(`${LOGOUT_ROUTE}?token=${window.localStorage.getItem('accesstoken')}`, {}, headers);

    window.localStorage.removeItem('firstLogin');
    window.localStorage.removeItem('refreshtoken');
    window.localStorage.removeItem('accesstoken')
    dispatch(logout());
};

const activateAccount = async (dispatch: Dispatch, router: NextRouter) => {
    const { token } = router.query;

    if (typeof token !== 'string') {
        return router.push('/');
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const headers = {
        withCredentials: true,
        headers: {
            Authorization: token,
        },
    };

    await axios
        .get(ACTIVATE_ACCOUNT_ROUTE, headers)
        .then((res) => {
            const { user, access_token, msg } = res.data;
            console.log(user)

            /*
            window.localStorage.setItem('firstLogin', 'true');
            dispatch(setToken(access_token));
            dispatch(setUserInfo(user));
            router.push('/auth/login');
            dispatch(setNotification({ type: 'success', message: msg }));
            */

            window.localStorage.setItem('accesstoken', access_token)
            window.localStorage.setItem('firstLogin', 'true');
            dispatch(setToken(access_token));
            dispatch(setUserInfo(user));
            dispatch(login());
            router.push('/');
            dispatch(setNotification({ type: 'success', message: msg }));

        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const error: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: error }));
            router.push('/');
        });
};

const getUserById = async (
    id: string,
    dispatch: Dispatch,
    router: NextRouter
) => {
    await axios
        .get(`${USER_BASE}/${id}`)
        .then((res) => {
            dispatch(setAdmin(res.data));
        })
        .catch((err) => {
            if (!err.response) {
                return;
            }
            const error: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: error }));
            router.push('/');
        });
};

const forgotPassword = async (
    email: string,
    dispatch: Dispatch,
    router: NextRouter
) => {
    if (!validateEmail(email)) {
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Nepareizs epasta formāts!',
            })
        );
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    const requestData = {
        email: email,
    };

    await axios
        .post(FORGOT_PASSWORD_ROUTE, requestData)
        .then((res) => {
            const { msg } = res.data;

            dispatch(setNotification({ type: 'success', message: msg }));
            router.push('/');
        })
        .catch((err: any) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
            router.push('/');
        });
};

const resetPassword = async (
    new_password: string,
    password_check: string,
    dispatch: Dispatch,
    router: NextRouter
) => {
    const { token } = router.query;

    if (typeof token !== 'string') {
        return router.push('/');
    }

    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted || cookiesAccepted !== 'true') {
        dispatch(
            setNotification({
                type: 'error',
                message: 'Jūs neesat piekritis sīkdatņu izmantošanai',
            })
        );
    }

    if (!new_password) {
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Nav ievadīta jauna parole!',
            })
        );
    }

    if (!password_check) {
        return dispatch(
            setNotification({
                type: 'error',
                message: 'Nav ievadīts paroles apstiprinājums!',
            })
        );
    }

    if (new_password !== password_check) {
        return dispatch(
            setNotification({ type: 'error', message: 'Paroles nesakrīt!' })
        );
    }

    const resetPasswordUrl = `${RESET_PASSWORD_ROUTE}/${token}`;
    const requestData = {
        password: new_password,
    };
    const headers = {
        withCredentials: true,
    };

    await axios
        .put(resetPasswordUrl, requestData, headers)
        .then((res: any) => {
            const { msg } = res.data;
            dispatch(setNotification({ type: 'success', message: msg }));
            router.push('/auth/login');
        })
        .catch((err: any) => {
            if (!err.response) {
                return;
            }
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
            router.push('/');
        });
};

export {
    activateAccount,
    loginUser,
    logoutUser,
    checkForLogin,
    registerUser,
    getUserById,
    resetPassword,
    forgotPassword,
};
