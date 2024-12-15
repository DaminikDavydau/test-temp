import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import JoinGameButton from '../home/JoinGameButton';
import ProfileInput from './ProfileInput';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function ProfileContainer() {
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [name, setName] = useState(userInfo.info?.name);
    const [email, setEmail] = useState(userInfo.info?.email);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (userInfo.info) {
            setName(userInfo.info.name);
            setEmail(userInfo.info.email);
        }
    }, [userInfo.info]);

    if (
        !userInfo.info ||
        typeof name !== 'string' ||
        typeof email !== 'string'
    ) {
        return null;
    }

    const updateProfileInfo = (e: any) => {
        e.preventDefault();

        if (clicked) {
            return;
        }

        setClicked(true);
    };

    return (
        <div className="w-full flex items-center justify-start flex-col pt-28">
            <h1>{languageInfo.language['profile-screen'].title}</h1>

            <div className="flex flex-col items-start justify-center w-80 mt-8">
                <div className="flex flex-col items-start justify-center w-full my-2">
                    <label htmlFor="" className="my-2">
                        {languageInfo.language['profile-screen'].name}
                    </label>

                    <ProfileInput
                        text={name}
                        setText={setName}
                        type="text"
                        placeholder={
                            languageInfo.language['profile-screen'].name
                        }
                    />
                </div>

                <div className="flex flex-col items-start justify-center w-full my-2">
                    <label htmlFor="" className="my-2">
                        {languageInfo.language['profile-screen'].email}
                    </label>

                    <ProfileInput
                        text={email}
                        setText={setEmail}
                        type="email"
                        placeholder={
                            languageInfo.language['profile-screen'].email
                        }
                    />
                </div>

                {/* <div className="flex flex-col items-start justify-center w-full my-2">
                    <label htmlFor="" className="my-2">
                        Atjaunojiet paroli
                    </label>

                    <ProfileInput
                        text={password}
                        setText={setPassword}
                        type="password"
                        placeholder="Parole"
                    />
                </div> */}
            </div>

            {/* <div className="mt-8">
                <JoinGameButton
                    clicked={clicked}
                    text={languageInfo.language['profile-screen'].save}
                    fn={updateProfileInfo}
                    disabled={false}
                />
            </div> */}
        </div>
    );
}

export default ProfileContainer;
