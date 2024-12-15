import { useRouter } from 'next/router';
import React, { useState } from 'react';
import gameOptions from '../../constants/gamesOptions';
import { createGame } from '../../requests/gameRequests';
import JoinGameButton from '../home/JoinGameButton';
import GameSelection from './GameSelection';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useDispatch, useSelector } from 'react-redux';

function CreateGameForm() {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const dispatch = useDispatch();
    const router = useRouter();

    const [activeMode, setActiveMode] = useState('');
    const [clicked, setClicked] = useState(false);

    const createNewGame = async (e: any) => {
        e.preventDefault();
        if (clicked) {
            return;
        }

        setClicked(true);

        await createGame(e, activeMode, dispatch, router);

        setClicked(false);
    };

    if (!languageInfo.language) {
        return null;
    }

    return (
        <div className="w-11/12 max-w-[350px] py-4 px-4 flex flex-col items-center justify-center relative">
            <h1 className="mb-28 text-center">
                {languageInfo.language['create-game-screen']['create-game-title']}
            </h1>

            <div className="w-full flex items-center justify-center absolute top-28 left-0 z-10">
                <GameSelection
                    options={gameOptions}
                    activeMode={activeMode}
                    setActiveMode={setActiveMode}
                />
            </div>

            <div className="w-full flex items-center justify-center mt-14">
                <JoinGameButton
                    id="submitButton"
                    clicked={clicked}
                    disabled={false}
                    text={
                        languageInfo.language['create-game-screen'][
                            'create-game-btn'
                        ]
                    }
                    fn={createNewGame}
                />
            </div>
        </div>
    );
}

export default CreateGameForm;
