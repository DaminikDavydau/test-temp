import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/slices/notificationSlice';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import { joinGame } from '../../requests/playerRequests';
import CodeInput from './CodeInput';
import HomeAgreementContainer from './HomeAgreementContainer';
import JoinGameButton from './JoinGameButton';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function JoinGameForm() {
    const router = useRouter();
    const dispatch = useDispatch();

    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [code, setCode] = useState('');
    const [checked, setChecked] = useState(false);
    const [clicked, setClicked] = useState(false);

    const playerJoin = async (e: any) => {
        e.preventDefault();

        if (clicked) {
            return;
        }

        setClicked(true);

        if (userInfo.info) {
            const fullName = userInfo.info.name;
            const splitName = fullName?.split(' ');

            if (splitName) {
                const playerName = splitName[0];
                const playerSurname = splitName[splitName.length - 1];

                if (playerName && playerSurname) {
                    await joinGame(
                        code,
                        playerName,
                        playerSurname,
                        checked,
                        router,
                        dispatch
                    );
                }
            }

            setClicked(false);
        } else {
            if (!code || code.length < 6) {
                setClicked(false);

                return dispatch(
                    setNotification({
                        type: 'error',
                        message:
                            languageInfo.language.notifications[
                                'incorrect-game-code'
                            ],
                    })
                );
            }

            setClicked(false);
            router.push(`/join/${code}`);
        }

        setClicked(false);
    };

    return (
        <div className="w-full flex items-center justify-center mt-6">
            <form className="flex justify-between items-start">
                <div className="w-[360px]">
                    <CodeInput
                        text={code}
                        setText={setCode}
                        type="number"
                        placeholder={
                            languageInfo.language['home-screen']['enter-code']
                        }
                    />

                    {userInfo.info && userInfo.info.name && (
                        <HomeAgreementContainer
                            checked={checked}
                            setChecked={setChecked}
                            agreement={
                                languageInfo.language['home-screen'].privacy
                            }
                        />
                    )}
                </div>

                <div className="ml-6">
                    <JoinGameButton
                        disabled={false}
                        clicked={clicked}
                        text={languageInfo.language['home-screen']['join-game']}
                        fn={playerJoin}
                    />
                </div>
            </form>
        </div>
    );
}

export default JoinGameForm;
