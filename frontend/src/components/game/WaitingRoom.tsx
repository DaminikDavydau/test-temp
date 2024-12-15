import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import { startGame } from '../../requests/gameRequests';
import HomeBottomNav from '../home/HomeBottomNav';
import JoinGameButton from '../home/JoinGameButton';
import WaitingRoomPlayers from './WaitingRoomPlayers';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function WaitingRoom() {
    const router = useRouter();
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [clicked, setClicked] = useState(false);
    const [adminView] = useState(
        userInfo.info?._id === gameInfo.activeGame?.admin
    );

    const checkIfStartable = () => {
        if (!adminView || !gameInfo.activeGame) {
            return false;
        }

        if (!gameInfo.players || gameInfo.players.length === 0) {
            return false;
        }

        if (gameInfo.activeGame.type === 'Ražošana') {
            if (gameInfo.players.length < 9) {
                return false;
            } else if (gameInfo.players.length % 3 !== 0) {
                return false;
            }
        }

        return true;
    };

    const startGameNow = async (e: any) => {
        e.preventDefault();

        if (clicked) {
            return;
        }

        setClicked(true);

        const startable = checkIfStartable();
        if (!startable || !gameInfo.activeGame) {
            return;
        }

        await startGame(gameInfo.activeGame._id, dispatch, router);

        setClicked(false);
    };

    if (adminView) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-start">
                <WaitingRoomPlayers />

                <div className="absolute bottom-32">
                    <JoinGameButton
                        id={'submitButton'}
                        clicked={clicked}
                        disabled={!checkIfStartable()}
                        text={
                            languageInfo.language['generic-game-screen'][
                                'start-game'
                            ]
                        }
                        fn={startGameNow}
                    />
                </div>

                <HomeBottomNav
                    link1=""
                    path1=""
                    link2={
                        languageInfo.language['generic-game-screen']['finish-game']
                    }
                    path2=""
                />
            </div>
        );
    }

    if (!gameInfo.playerInfo) {
        return null;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="pb-40 flex flex-col items-center justify-center">
                <h2>
                    {languageInfo.language['generic-game-screen']['soon-begin']}
                </h2>

                <h3 className="mt-6">
                    {languageInfo.language['generic-game-screen']['please-wait']}
                </h3>
            </div>

            <h4 className="absolute bottom-28">
                {gameInfo.playerInfo.name} (
                {languageInfo.language['generic-game-screen'].you})
            </h4>
        </div>
    );
}

export default WaitingRoom;
