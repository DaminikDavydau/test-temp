import Head from 'next/head';
import React from 'react';
import { useSelector } from 'react-redux';
import Footer from '../../src/components/footer/Footer';
import HomeBottomNav from '../../src/components/home/HomeBottomNav';
import Navigation from '../../src/components/navigation/Navigation';
import CokkiePopup from '../../src/components/notifs/CokkiePopup';
import Notification from '../../src/components/notifs/Notification';
import ProfileContainer from '../../src/components/profile/ProfileContainer';
import { appName } from '../../src/constants/constants';
import { selectUser, UserInfo } from '../../src/redux/slices/userSlice';
import {
    LanguageInfo,
    selectLanguage,
} from '../../src/redux/slices/languageSlice';

function Index() {
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    if (!userInfo.info) {
        return (
            <div className="page">
                <Head>
                    <title>{appName}</title>
                </Head>

                <Notification />

                <CokkiePopup />

                <Navigation />
            </div>
        );
    }

    return (
        <div className="page">
            <Head>
                <title>{appName}</title>
            </Head>

            <Notification />

            <Navigation />

            <CokkiePopup />

            <ProfileContainer />

            <HomeBottomNav
                link1={languageInfo.language['profile-screen']['log-out']}
                path1=""
                path2=""
                link2=""
            />

            <Footer />
        </div>
    );
}

export default Index;
