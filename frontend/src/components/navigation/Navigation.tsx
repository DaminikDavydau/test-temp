import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appName } from '../../constants/constants';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import { checkForLogin } from '../../requests/userRequests';
import Link from 'next/link';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { getPlayerInfo } from '../../requests/playerRequests';
import { getLanguage, getLanguages } from '../../requests/languageRequests';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function Navigation() {
    const userInfo: UserInfo = useSelector(selectUser);
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [selectingLang, setSelectingLang] = useState(false);

    const languageRequested = useRef(false);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!userInfo.loggedIn || !userInfo.token || !userInfo.info) {
            const first_login = localStorage.getItem('firstLogin');

            if (first_login) {
                checkForLogin(dispatch, router);
            }
        }
    }, [
        router.pathname,
        userInfo.loggedIn,
        userInfo.token,
        dispatch,
        userInfo.info,
    ]);

    useEffect(() => {
        if (languageRequested.current && !languageInfo.languages) {
            return;
        }

        languageRequested.current = true;

        const currentLang = localStorage.getItem('language');

        getLanguage({ dispatch, id: currentLang ? currentLang : undefined });
        getLanguages({ dispatch });
    }, []);

    useEffect(() => {
        if (
            (router.pathname === '/auth/login' ||
                router.pathname === '/auth/register') &&
            userInfo.loggedIn &&
            userInfo.token
        ) {
            router.push('/');
        } else if (
            router.asPath === '/profile' &&
            (!userInfo.info || !userInfo.token)
        ) {
            router.push('/');
        }
    }, [
        router.pathname,
        router.asPath,
        userInfo.loggedIn,
        userInfo.token,
        userInfo.info,
        dispatch,
    ]);

    useEffect(() => {
        const joinedGame = localStorage.getItem('joinedGame');
        if (joinedGame !== 'true') {
            return;
        }

        if (gameInfo.playerInfo) {
            return;
        }

        if (userInfo.info && userInfo.info._id === gameInfo.activeGame?.admin) {
            return;
        }

        getPlayerInfo(dispatch, router);
    }, [gameInfo.playerInfo, gameInfo.activeGame, userInfo.info]);

    const LanguageSelector: React.FC<{ color?: string }> = ({
        color = 'text-black',
    }) => {
        return (
            <div className="flex items-center justify-center w-16 h-10 relative">
                <p
                    className={`text-lg cursor-pointer ${color}`}
                    onClick={() => setSelectingLang(true)}
                >
                    {languageInfo.activeLanguage.toUpperCase()}
                </p>

                {selectingLang && (
                    <div className="flex flex-col absolute top-0 left-0 bg-white border-2 rounded-lg overflow-hidden w-full max-h-[200px] overflow-y-auto">
                        {languageInfo.languages?.map((lang, i) => (
                            <button
                                key={i}
                                className={`w-full flex items-center justify-center py-2 hover:bg-BG_blue ${
                                    lang.language_id ===
                                    languageInfo.activeLanguage
                                        ? 'text-BGdark_lightblue-lighter'
                                        : 'text-black'
                                }`}
                                onClick={() => {
                                    getLanguage({
                                        dispatch,
                                        id: lang.language_id,
                                    });
                                    setSelectingLang(false);
                                }}
                            >
                                {lang.language_id.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (!languageInfo.language) {
        return null;
    }

    if (
        router.pathname === '/game/[id]' ||
        router.pathname === '/join/[code]'
    ) {
        return (
            <nav
                className={`w-full py-4 px-12 z-40 flex items-center justify-between absolute top-0 left-0 ${
                    router.pathname === '/game/[id]' &&
                    gameInfo.activeGame &&
                    (gameInfo.activeGame.started ||
                        gameInfo.activeGame.year !== 'yearOne')
                        ? 'bg-BGdark_lightblue'
                        : 'bg-white'
                }`}
            >
                <img
                    src="/logo.svg"
                    alt={`${appName} logo`}
                    className={`h-9 cursor-pointer ${
                        router.pathname === '/game/[id]' &&
                        gameInfo.activeGame &&
                        (gameInfo.activeGame.started ||
                            gameInfo.activeGame.year !== 'yearOne')
                            ? 'invert'
                            : ''
                    }`}
                />

                <LanguageSelector
                    color={
                        router.pathname === '/game/[id]' &&
                        gameInfo.activeGame &&
                        (gameInfo.activeGame.started ||
                            gameInfo.activeGame.year !== 'yearOne')
                            ? 'text-white'
                            : 'text-black'
                    }
                />
            </nav>
        );
    }

    if (userInfo.info && userInfo.info.role >= 1) {
        return (
            <nav className="w-full h-20 px-12 z-40 flex items-center justify-between absolute top-0 left-0">
                <Link href="/">
                    <img
                        src="/logo.svg"
                        alt={`${appName} logo`}
                        className="h-9 cursor-pointer"
                    />
                </Link>

                <div className="flex items-center justify-between">
                    <Link href="/">
                        <p className="mr-8 cursor-pointer">
                            {languageInfo.language['home-screen'].home}
                        </p>
                    </Link>

                    <Link href="/game/new">
                        <p id={'createGameLink'} className="mr-8 cursor-pointer">
                            {
                                languageInfo.language['home-screen'][
                                    'create-game'
                                ]
                            }
                        </p>
                    </Link>

                    {userInfo.info.role > 1 && (
                        <Link href="/admin">
                            <p className="mr-8 cursor-pointer">
                                {languageInfo.language['admin-screen'].panel}
                            </p>
                        </Link>
                    )}

                    <Link href="/profile">
                        <img
                            src="/svg/user.svg"
                            alt={`${appName} user profile`}
                            className="h-9 cursor-pointer"
                        />
                    </Link>

                    <LanguageSelector />
                </div>
            </nav>
        );
    }

    return (
        <nav className="w-full py-4 px-12 z-40 flex items-center justify-between absolute top-0 left-0 bg-white">
            <Link href="/">
                <img
                    src="/logo.svg"
                    alt={`${appName} logo`}
                    className="h-9 cursor-pointer"
                />
            </Link>

            <LanguageSelector />
        </nav>
    );
}

export default Navigation;
