import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import { joinGame } from '../../requests/playerRequests';
import Footer from '../footer/Footer';
import CodeInput from '../home/CodeInput';
import HomeAgreementContainer from '../home/HomeAgreementContainer';
import HomeBottomNav from '../home/HomeBottomNav';
import JoinGameButton from '../home/JoinGameButton';
import Navigation from '../navigation/Navigation';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function JoinGameContainer() {
    const router = useRouter();
    const dispatch = useDispatch();

    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const { code } = router.query;

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [checked, setChecked] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (userInfo.info) {
            const fullName = userInfo.info.name;
            const splitName = fullName?.split(' ');
            if (splitName) {
                const playerName = splitName[0];
                const playerSurname = splitName[splitName.length - 1];

                if (playerName && playerSurname) {
                    setName(playerName);
                    setSurname(playerSurname);
                }
            }
        }
    }, [userInfo.info]);

    const playerJoin = async (e: any) => {
        e.preventDefault();
        if (clicked) {
            return;
        }

        setClicked(true);

        await joinGame(code, name, surname, checked, router, dispatch);

        setClicked(false);
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Navigation />

            <form className="flex flex-col justify-center items-center">
                <div className="w-80 mb-4">
                    <CodeInput
                        text={name}
                        setText={setName}
                        type="text"
                        placeholder={languageInfo.language['join-game-screen'].name}
                    />
                </div>

                <div className="w-80">
                    <CodeInput
                        text={surname}
                        setText={setSurname}
                        type="text"
                        placeholder={
                            languageInfo.language['join-game-screen'].surname
                        }
                    />
                </div>

                <div className="w-80">
                    <HomeAgreementContainer
                        agreement={languageInfo.language['home-screen'].privacy}
                        checked={checked}
                        setChecked={setChecked}
                    />
                </div>

                <div className="mt-10">
                    <JoinGameButton
                        clicked={clicked}
                        disabled={false}
                        text={languageInfo.language['home-screen']['join-game']}
                        fn={playerJoin}
                    />
                </div>
            </form>

            <HomeBottomNav
                link1={languageInfo.language['home-screen']['login']}
                path1="/auth/login"
                link2={languageInfo.language['home-screen']['data-protection']}
                path2="/auth/login"
            />

            <Footer />
        </div>
    );
}

export default JoinGameContainer;
