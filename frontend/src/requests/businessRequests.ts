import axios from 'axios';
import { NextRouter } from 'next/router';
import { Dispatch } from 'redux';
import { setBusinesses } from '../redux/slices/gameSlice';
import { setNotification } from '../redux/slices/notificationSlice';
import { BUSINESS_BASE } from './apiRoutes';

export const getBusinesses = async (dispatch: Dispatch, router: NextRouter) => {
    console.log("getBusinesses Start", new Date().toLocaleTimeString(), Date.now())
    const { id } = router.query;

    if (!id) {
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

    const headers = {
        withCredentials: true,
    };

    await axios
        .get(`${BUSINESS_BASE}/${id}`, headers)
        .then((res) => {
            dispatch(setBusinesses(res.data));
            console.log("getBusinesses End", new Date().toLocaleTimeString(), Date.now())
        })
        .catch((err: any) => {
            const message: string = err.response.data.err;
            dispatch(setNotification({ type: 'error', message: message }));
        });
};
