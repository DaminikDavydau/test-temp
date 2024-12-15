import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../requests/userRequests';
import Footer from '../footer/Footer';
import CodeInput from '../home/CodeInput';
import JoinGameButton from '../home/JoinGameButton';

function ResetPasswordForm() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [clicked, setClicked] = useState(false);

    const changePassword = async (e: any) => {
        e.preventDefault();

        if (clicked) {
            return;
        }

        await resetPassword(password, passwordCheck, dispatch, router);

        setClicked(false);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <form className="w-11/12 max-w-[350px] py-4 px-4 flex flex-col items-center">
                <h1 className="mb-14">Paroles maiņa</h1>

                <div className="flex flex-col w-full mb-3.5">
                    <CodeInput
                        text={password}
                        setText={setPassword}
                        type="password"
                        placeholder="parole"
                    />
                </div>

                <div className="flex flex-col w-full mb-3.5">
                    <CodeInput
                        text={passwordCheck}
                        setText={setPasswordCheck}
                        type="password"
                        placeholder="parole atkārtoti"
                    />
                </div>

                <div className="w-full flex flex-col items-center justify-center mt-6">
                    <JoinGameButton
                        clicked={clicked}
                        disabled={false}
                        text="Mainīt paroli"
                        fn={changePassword}
                    />
                </div>
            </form>

            <Footer />
        </div>
    );
}

export default ResetPasswordForm;
