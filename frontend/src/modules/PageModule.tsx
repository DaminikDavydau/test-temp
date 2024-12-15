import Head from 'next/dist/shared/lib/head';
import React, { useEffect } from 'react';
import Navigation from '../components/navigation/Navigation';
import Notification from '../components/notifs/Notification';
import CokkiePopup from '../components/notifs/CokkiePopup';
import Footer from '../components/footer/Footer';
import { UserInfo, selectUser } from '../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { checkForLogin } from '../requests/userRequests';
import { useRouter } from 'next/router';

const PageModule: React.FC<{
    title: string;
    children?: React.ReactNode;
    hasFooter?: boolean;
}> = ({ title, children, hasFooter = false }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const userInfo: UserInfo = useSelector(selectUser);

    useEffect(() => {
        if (!userInfo.loggedIn || !userInfo.token || !userInfo.info) {
            const first_login = localStorage.getItem('firstLogin');
            if (first_login) {
                checkForLogin(dispatch, router);
            }
        }
    }, []);

    return (
        <main className="page">
            <Head>
                <title>{title}</title>
            </Head>

            <Navigation />

            <Notification />

            <CokkiePopup />

            <div className="pt-20 h-full w-full">
                <div className="border-t-2 w-full h-full">{children}</div>
            </div>

            {hasFooter && <Footer />}
        </main>
    );
};

export default PageModule;
