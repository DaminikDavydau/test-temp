import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import { loginUser, registerUser } from '../../requests/userRequests';
import Footer from '../footer/Footer';
import CodeInput from '../home/CodeInput';
import HomeAgreementContainer from '../home/HomeAgreementContainer';
import HomeBottomNav from '../home/HomeBottomNav';
import JoinGameButton from '../home/JoinGameButton';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

const AuthForm: React.FC = () => {
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);
   
    const dispatch = useDispatch();
    const router = useRouter();

    const [type] = useState(router.pathname);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [clicked, setClicked] = useState(false);

    const authorize = async (e: any) => {
        e.preventDefault();

        if (clicked) {
            return;
        }

        setClicked(true);

        if (type === '/auth/login') {
            await loginUser(
                e,
                email,
                password,
                accepted,
                dispatch,
                router,
                loading,
                setLoading
            );
        } else if (type === '/auth/register') {
            await registerUser(
                e,
                name,
                email,
                password,
                accepted,
                dispatch,
                loading,
                setLoading
            );
        }

        setClicked(false);
    };

    if (userInfo.loggedIn && userInfo.token && userInfo.info) {
        return null;
    }

    if (!languageInfo.language) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full p-0 h-full md:py-0">
            <form className="w-11/12 max-w-[350px] py-4 px-4 flex flex-col items-center">
                <h1 className="mb-14">
                    {type === '/auth/login' ? 'Pierakstīties' : 'Reģistrēties'}
                </h1>

                {type === '/auth/register' && (
                    <div className="flex flex-col w-full mb-3.5">
                        <CodeInput
                            text={name}
                            setText={setName}
                            type="text"
                            placeholder={
                                languageInfo.language['login-screen'][
                                    'register-screen'
                                ]['full-name']
                            }
                        />
                    </div>
                )}

                <div className="flex flex-col w-full mb-3.5">
                    <CodeInput
                        text={email}
                        setText={setEmail}
                        type="email"
                        placeholder={languageInfo.language['login-screen'].email}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <CodeInput
                        text={password}
                        setText={setPassword}
                        type="password"
                        placeholder={languageInfo.language['login-screen'].password}
                    />
                </div>

                <div className="w-full flex items-center justify-start mt-4">
                    <Link href="/auth/forgot-password">
                        <small className="cursor-pointer">
                            {
                                languageInfo.language['login-screen'][
                                    'forgot-password'
                                ]
                            }
                        </small>
                    </Link>
                </div>

                <div className="w-full flex flex-col items-center justify-center">
                    <HomeAgreementContainer
                        checked={accepted}
                        setChecked={setAccepted}
                        agreement={
                            languageInfo.language['login-screen']['register-screen']
                                .privacy
                        }
                    />

                    <div className="w-full flex flex-col items-center justify-center  mt-6">
                        <JoinGameButton
                            id="loginButton"
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['login-screen']['login-btn']
                            }
                            fn={authorize}
                        />
                    </div>
                </div>
            </form>

            <HomeBottomNav
                link1={languageInfo.language['home-screen']['back-home']}
                path1="/"
                link2={
                    type === '/auth/login'
                        ? languageInfo.language['login-screen']['register']
                        : languageInfo.language['login-screen']['login-btn']
                }
                path2={
                    type === '/auth/login' ? '/auth/register' : '/auth/login'
                }
            />

            <Footer />
        </div>
    );
};

export default AuthForm;
