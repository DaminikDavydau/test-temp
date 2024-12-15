import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm from '../../src/components/auth/AuthForm';
import Navigation from '../../src/components/navigation/Navigation';
import CokkiePopup from '../../src/components/notifs/CokkiePopup';
import Notification from '../../src/components/notifs/Notification';
import { appName } from '../../src/constants/constants';
import { selectUser, UserInfo } from '../../src/redux/slices/userSlice';

function Legister() {
    const userInfo: UserInfo = useSelector(selectUser);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (userInfo.loggedIn && userInfo.token && userInfo.info) {
            router.push('/');
        }
    }, [userInfo.loggedIn, dispatch, userInfo.token, router, userInfo.info]);

    return (
        <div className="page">
            <Head>
                <title>{appName} | register</title>
            </Head>

            <Navigation />

            <CokkiePopup />

            <Notification />

            <AuthForm />
        </div>
    );
}

export default Legister;
