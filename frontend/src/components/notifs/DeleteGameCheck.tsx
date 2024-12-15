import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GameInfo,
    selectGame,
    setInvestments,
} from '../../redux/slices/gameSlice';
import { deleteGame, investReq, switchYear } from '../../requests/gameRequests';
import LoadingWhite from '../loading/LoadingWhite';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

interface Props {
    text: string;
    text2: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
    setText2: React.Dispatch<React.SetStateAction<string>>;
}

const DeleteGameCheck: React.FC<Props> = ({
    text,
    text2,
    setText,
    setText2,
}) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [clicked, setClicked] = useState(false);

    const investAssets = async () => {
        if (clicked) {
            return;
        }

        setClicked(true);

        if (
            gameInfo.activeGame?.type === 'Viesnīca' &&
            !gameInfo.investments.iv1
        ) {
            dispatch(
                setInvestments({
                    ...gameInfo.investments,
                    iv1: gameInfo.selectableInvestment,
                })
            );

            setClicked(false);
            return;
        } else if (
            gameInfo.activeGame?.type === 'Frizētava' &&
            (!gameInfo.g4Data.g4Investment ||
                gameInfo.g6Data.barbershops.length === 0)
        ) {
            setClicked(false);
            return;
        }

        await investReq(
            gameInfo.activeGame?.admin,
            gameInfo.activeGame?.type,
            gameInfo.investments,
            gameInfo.g4Data.g4Investment,
            dispatch,
            router
        );

        setClicked(false);
    };

    const close = () => {
        setText('');
        setText2('');
    };

    const handleYes = async () => {
        if (clicked) {
            return;
        }

        setClicked(true);

        switch (text) {
            case languageInfo.language['generic-game-screen'][
                'finish-game-dialogue'
            ].title:
                await deleteGame(dispatch, router);
                setClicked(false);
                break;
            case languageInfo.language.notifications['year-switch-check']:
                await switchYear(dispatch, router);
                setClicked(false);
                break;
            case languageInfo.language.notifications['skip-round-check']:
                await investAssets();
                break;
            case languageInfo.language.notifications['investment-submit-check']:
                await investAssets();
                break;
            default:
                close();
        }

        close();
    };

    if (!text) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-tpBg z-50">
            <div className="w-[430px] h-60 flex flex-col items-center justify-between p-6 pt-10 bg-BGlight-white rounded-md">
                <h3 className="text-center">{text}</h3>

                {text2 ? <p className="text-center mb-2">{text2}</p> : null}

                <div className="flex items-center justify-center w-full">
                    <button
                        className="bg-BGdark_lightblue text-white w-28 h-10 text-base rounded-sm mx-2"
                        onClick={close}
                    >
                        {
                            languageInfo.language['generic-game-screen'][
                                'finish-game-dialogue'
                            ].no
                        }
                    </button>

                    <button
                        className="bg-BGdark_lightblue-lighter text-white w-28 h-10 text-base rounded-sm mx-2"
                        onClick={handleYes}
                    >
                        {!clicked ? (
                            <p className="text-white">
                                {
                                    languageInfo.language[
                                        'generic-game-screen'
                                    ]['finish-game-dialogue'].yes
                                }
                            </p>
                        ) : (
                            <LoadingWhite />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteGameCheck;
