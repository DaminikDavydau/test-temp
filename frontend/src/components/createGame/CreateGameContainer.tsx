import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import Footer from '../footer/Footer';
import Navigation from '../navigation/Navigation';
import CreateGameForm from './CreateGameForm';

function CreateGameContainer() {
    const userInfo: UserInfo = useSelector(selectUser);

    const router = useRouter();

    useEffect(() => {
        if (
            !userInfo.info ||
            userInfo.info.role <= 0 ||
            !userInfo.loggedIn ||
            !userInfo.token
        ) {
            router.push('/');
        }
    }, [userInfo.info, userInfo.token, userInfo.loggedIn]);

    if (
        !userInfo.info ||
        userInfo.info.role <= 0 ||
        !userInfo.loggedIn ||
        !userInfo.token
    ) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full p-0 h-full md:py-0">
            <Navigation />

            <CreateGameForm />

            <Footer />
        </div>
    );
}

export default CreateGameContainer;
