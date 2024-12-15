import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { forgotPassword } from '../../requests/userRequests';
import Footer from '../footer/Footer';
import CodeInput from '../home/CodeInput';
import JoinGameButton from '../home/JoinGameButton';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useDispatch, useSelector } from 'react-redux';

function ForgotPasswordForm() {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [clicked, setClicked] = useState(false);

    const forgotPasswordFN = async (e: any) => {
        e.preventDefault();

        if (clicked) {
            return;
        }

        await forgotPassword(email, dispatch, router);

        setClicked(false);
    };

    if (!languageInfo.language) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <form className="w-11/12 max-w-[350px] py-4 px-4 flex flex-col items-center">
                <h1 className="mb-14">
                    {languageInfo.language['login-screen']['forgot-password']}
                </h1>

                <div className="flex flex-col w-full mb-3.5">
                    <CodeInput
                        text={email}
                        setText={setEmail}
                        type="email"
                        placeholder={
                            languageInfo.language['login-screen']['reset-screen']
                                .prompt
                        }
                    />
                </div>

                <div className="w-full flex flex-col items-center justify-center mt-6">
                    <JoinGameButton
                        clicked={clicked}
                        disabled={false}
                        text={
                            languageInfo.language['login-screen']['reset-screen']
                                .submit
                        }
                        fn={forgotPasswordFN}
                    />
                </div>
            </form>

            <Footer />
        </div>
    );
}

export default ForgotPasswordForm;
