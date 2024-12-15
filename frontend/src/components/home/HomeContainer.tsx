import React from 'react';
import Footer from '../footer/Footer';
import Navigation from '../navigation/Navigation';
import HomeBottomNav from './HomeBottomNav';
import HomeLogo from './HomeLogo';
import JoinGameForm from './JoinGameForm';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

function HomeContainer() {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="w-full h-full flex flex-col items-center justify-start">
            <Navigation />

            <div className="w-full h-full flex items-center justify-center flex-col">
                <HomeLogo />

                <JoinGameForm />
            </div>

            <HomeBottomNav
                link1={languageInfo.language['home-screen'].login}
                path1="/auth/login"
                link2={languageInfo.language['home-screen']['data-protection']}
                path2="/auth/login"
            />

            <Footer />
        </div>
    );
}

export default HomeContainer;
