import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MINIMAL_PRICES } from '../../../constants/G4Constants';
import {
    GameInfo,
    handleRules,
    updateInvestments,
} from '../../../redux/slices/gameSlice';
import { MachineInterface } from '../../../types/machine';
import { selectGame } from './../../../redux/slices/gameSlice';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

const MAX_INVESTMENT = 1000000;

function G4FirstPart() {
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [investment, setInvestment] = useState('0');
    const [investmentValid, setInvestmentValid] = useState(true);
    const [invested, setInvested] = useState(false);
    const [activeMachine, setActiveMachine] = useState<MachineInterface | null>(
        null
    );
    const [minimalPrice, setMinimalPrice] = useState<number>(0);

    useEffect(() => {
        if (activeMachine && !minimalPrice) {
            const machineMinPrice = MINIMAL_PRICES[activeMachine.type];
            console.log(machineMinPrice);
            if (machineMinPrice) {
                setMinimalPrice(machineMinPrice);
                setInvestment(String(machineMinPrice));
            }
        }
    }, [minimalPrice, activeMachine]);

    useEffect(() => {
        if (
            !activeMachine &&
            gameInfo.g4Data.machines &&
            gameInfo.g4Data.machines.filter((m) => m.owner === null).length >= 1
        ) {
            setActiveMachine(
                gameInfo.g4Data.machines.filter((m) => m.owner === null)[0]
            );
        }
    }, [activeMachine, gameInfo.g4Data.machines]);

    useEffect(() => {
        const formatedIv = Number(investment);

        dispatch(updateInvestments({ iv1: formatedIv }));

        if (formatedIv % 5000 === 0) {
            setInvestmentValid(true);
        } else {
            setInvestmentValid(false);
        }
    }, [investment]);

    useEffect(() => {
        if (
            gameInfo.gameInvestments
                ?.filter((iv) => iv.year === gameInfo.activeGame?.year)
                .find((iv) => iv.player_id === gameInfo.playerInfo?._id)
        ) {
            setInvested(true);
        }
    }, [gameInfo.activeGame, gameInfo.playerInfo, gameInfo.gameInvestments]);

    const GetInvestmentInput = () => {
        const add5000 = () => {
            if (invested) {
                return;
            }

            let addIv = 5000;

            if (activeMachine?.type === '1' || activeMachine?.type === '2') {
                addIv = 10000;
            }

            const formatedIv = Number(investment);
            if (formatedIv + addIv >= MAX_INVESTMENT) {
                setInvestment(String(MAX_INVESTMENT));
                return;
            }

            setInvestment(String(formatedIv + addIv));
        };

        const remove5000 = () => {
            if (invested) {
                return;
            }

            let removeIv = 5000;

            if (activeMachine?.type === '1' || activeMachine?.type === '2') {
                removeIv = 10000;
            }

            const formatedIv = Number(investment);
            if (formatedIv - removeIv <= minimalPrice) {
                setInvestment(minimalPrice.toString());
                return;
            }
            setInvestment(String(formatedIv - removeIv));
        };

        return (
            <div className="flex relative items-start justify-center flex-col">
                <p className="mb-1">
                    {languageInfo.language['g4-screens'].bid}
                </p>

                <div className="flex items-center justify-center">
                    <div
                        className={`flex relative items-center justify-center h-10 w-60 border-2 rounded-sm ${
                            investmentValid
                                ? 'border-BGgray-light'
                                : 'bg-red-600'
                        }`}
                    >
                        <input
                            placeholder="Ievadiet likmi"
                            type="number"
                            className="w-full h-full"
                            disabled={true}
                            value={investment}
                        />

                        <div className="flex absolute top-0 right-0 h-full justify-center items-center">
                            <button
                                disabled={invested}
                                onClick={() => remove5000()}
                                className="flex items-center justify-center h-8 w-8 bg-BGgray-light rounded-sm "
                            >
                                <p className="text-white text-2xl font-bold">
                                    -
                                </p>
                            </button>
                            <button
                                disabled={invested}
                                onClick={() => add5000()}
                                className="flex items-center justify-center h-8 w-8 bg-BGgray-light rounded-sm mx-1"
                            >
                                <p className="text-white text-2xl font-bold">
                                    +
                                </p>
                            </button>
                        </div>
                    </div>

                    <img
                        src="/icons/info.png"
                        alt="info"
                        className="ml-2 h-6 cursor-pointer"
                        onClick={() => dispatch(handleRules(true))}
                    />
                </div>

                <small className="mt-1">Max 1 000 000</small>
            </div>
        );
    };

    return (
        <div className="flex w-full h-full justify-center items-center flex-col">
            <h3 className="my-4">
                {activeMachine
                    ? `${languageInfo.language['g4-screens'].machine} ${activeMachine.number}`
                    : null}
            </h3>

            <img
                src="/icons/hammer.png"
                alt="court hammer"
                className="h-20 mb-4"
            />

            {!gameInfo.g4Data.playerMachine ? (
                <GetInvestmentInput />
            ) : (
                <h3>
                    {languageInfo.language['g4-screens']['owned-machine']}{' '}
                    {gameInfo.g4Data.playerMachine.number}
                </h3>
            )}
        </div>
    );
}

export default G4FirstPart;
