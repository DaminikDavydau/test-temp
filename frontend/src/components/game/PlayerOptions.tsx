import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeInvestment,
    changeSecondGameInvestment,
    GameInfo,
    handleRules,
    selectGame,
    updateInvestments,
} from '../../redux/slices/gameSlice';
import checkIfAllInvested from '../../utils/checkIfAllInvested';
import SelectAmountButton from './showcase/SelectAmountButton';
import SelectInvestmentAmount from './SelectInvestmentAmount';
import { penaltiesAndBonuses } from '../../data/ruleVariables';
import G5SelectInvestment from './G5/G5SelectInvestment';
import G4ActivePart from './G4/G4ActivePart';
import BarberShopContainer from './G6/BarberShopContainer';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function PlayerOptions() {
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [invested, setInvested] = useState(false);
    const [bussinessOneInvestment, setBussinessOneInvestment] = useState(
        gameInfo.investments['iv1']
    );
    const [bussinessTwoInvestment, setBussinessTwoInvestment] = useState(
        gameInfo.investments['iv2']
    );
    const [bussinessThreeInvestment, setBussinessThreeInvestment] = useState(
        gameInfo.investments['iv3']
    );
    const [bussinessFourInvestment, setBussinessFourInvestment] = useState(
        gameInfo.investments['iv4']
    );
    const [bussinessFiveInvestment, setBussinessFiveInvestment] = useState(
        gameInfo.investments['iv5']
    );

    const [gameTwoInvestment, setGameTwoInvestment] = useState(0);
    const [allInvested] = useState(
        checkIfAllInvested(
            gameInfo.playerInfo,
            bussinessOneInvestment,
            bussinessTwoInvestment,
            bussinessThreeInvestment,
            bussinessFourInvestment,
            bussinessFiveInvestment
        )
    );

    useEffect(() => {
        if (gameInfo.gameInvestments && gameInfo.playerInfo) {
            const playerIv = gameInfo.gameInvestments
                .filter((iv) => iv.year === gameInfo.activeGame?.year)
                .find((iv) => iv.player_id === gameInfo.playerInfo?._id);

            if (!playerIv) {
                dispatch(
                    updateInvestments({
                        iv1: 0,
                        iv2: 0,
                        iv3: 0,
                        iv4: 0,
                        iv5: 0,
                    })
                );

                return;
            }

            const playerInvestmentValue = JSON.parse(playerIv.value);
            const playerInvestments = playerInvestmentValue.investments;

            const {
                businessOne,
                businessTwo,
                businessThree,
                businessFour,
                businessFive,
            } = playerInvestments;

            dispatch(
                updateInvestments({
                    iv1: businessOne,
                    iv2: businessTwo,
                    iv3: businessThree,
                    iv4: businessFour,
                    iv5: businessFive,
                })
            );
        }
    }, [gameInfo.gameInvestments, gameInfo.playerInfo]);

    useEffect(() => {
        if (gameInfo.activeGame?.type === 'Krīzes gads') {
            dispatch(changeSecondGameInvestment(gameTwoInvestment));
        }
    }, [gameTwoInvestment, gameInfo.activeGame, dispatch]);

    useEffect(() => {
        if (gameInfo.activeGame?.year) {
            setBussinessOneInvestment(0);
            setBussinessTwoInvestment(0);
            setBussinessThreeInvestment(0);
            setBussinessFourInvestment(0);
            setBussinessFiveInvestment(0);
        }
    }, [gameInfo.activeGame]);

    useEffect(() => {
        if (gameInfo.gameInvestments && gameInfo.playerInfo) {
            const playerIv = gameInfo.gameInvestments
                .filter((iv) => iv.year === gameInfo.activeGame?.year)
                .find((iv) => iv.player_id === gameInfo.playerInfo?._id);

            if (playerIv) {
                return;
            }
        }

        if (
            bussinessOneInvestment < 0 ||
            bussinessTwoInvestment < 0 ||
            bussinessThreeInvestment < 0 ||
            bussinessFourInvestment < 0 ||
            bussinessFiveInvestment < 0
        ) {
            return;
        }

        dispatch(
            changeInvestment({
                iv1: bussinessOneInvestment,
                iv2: bussinessTwoInvestment,
                iv3: bussinessThreeInvestment,
                iv4: bussinessFourInvestment,
                iv5: bussinessFiveInvestment,
            })
        );
    }, [
        gameInfo.playerInfo,
        gameInfo.gameInvestments,
        bussinessOneInvestment,
        bussinessTwoInvestment,
        bussinessThreeInvestment,
        bussinessFourInvestment,
        bussinessFiveInvestment,
        dispatch,
    ]);

    useEffect(() => {
        if (
            gameInfo.gameInvestments &&
            gameInfo.activeGame &&
            gameInfo.playerInfo &&
            gameInfo.gameInvestments
                ?.filter((iv) => iv.year === gameInfo.activeGame?.year)
                .filter((iv) => iv.player_id === gameInfo.playerInfo?._id)
                .length > 0
        ) {
            setInvested(true);
        }
    }, [gameInfo.activeGame, gameInfo.gameInvestments, gameInfo.playerInfo]);

    if (!gameInfo.activeGame) {
        return null;
    }

    if (gameInfo.activeGame.type === 'Krīzes gads') {
        return (
            <div className="w-full flex justify-start items-center h-full flex-col pt-20">
                <div className="flex w-full justify-center items-center h-24 mb-8">
                    <img
                        src="/icons/farm-house-black.png"
                        alt="pig"
                        className="h-24"
                    />
                </div>

                {!invested ? (
                    <div className="w-full flex items-center justify-center">
                        <div className="w-20 flex flex-col items-center justify-center mx-2">
                            <SelectAmountButton val={0} />
                        </div>

                        <div className="w-20 flex flex-col items-center justify-center mx-2">
                            <SelectAmountButton val={10} />
                        </div>

                        <div className="w-20 flex flex-col items-center justify-center mx-2">
                            <SelectAmountButton val={20} />
                        </div>

                        <div className="w-20 flex flex-col items-center justify-center mx-2">
                            <SelectAmountButton val={40} />
                        </div>

                        <div className="w-20 flex flex-col items-center justify-center mx-2">
                            <SelectAmountButton val={60} />
                        </div>

                        <div className="w-20 flex flex-col items-center justify-center mx-2">
                            <SelectAmountButton val={80} />
                        </div>

                        <div className="w-20 flex flex-col items-center justify-center mx-2">
                            <SelectAmountButton val={100} />
                        </div>

                        <img
                            src="/icons/info.png"
                            alt="bank"
                            className="mx-2 cursor-pointer"
                            onClick={() => dispatch(handleRules(true))}
                        />
                    </div>
                ) : null}

                <div className="flex items-center justify-center mt-4">
                    {typeof gameInfo.totalExpenses === 'number' &&
                    gameInfo.totalExpenses !== 0 ? (
                        <p>
                            {
                                languageInfo.language['g2-screens'][
                                    'pig-expenses'
                                ]
                            }
                            : {gameInfo.totalExpenses}€
                        </p>
                    ) : !invested ? (
                        <p>
                            {
                                languageInfo.language['g2-screens'][
                                    'pig-expenses'
                                ]
                            }
                            : {gameInfo.investments.iv1}€
                        </p>
                    ) : null}
                </div>
            </div>
        );
    } else if (gameInfo.activeGame.type === 'Bankrots') {
        return (
            <div className="w-full flex justify-center items-center my-5">
                <div className="w-full flex items-center justify-center">
                    <div className="w-20 flex flex-col items-center justify-start mx-6">
                        <img
                            src="/icons/hairdresser-black.png"
                            alt="hairdresser"
                            className="w-full mt-4"
                        />

                        <h4 className="mt-2">
                            {languageInfo.language.constants.barbershop}
                        </h4>

                        <div className="w-full mt-4">
                            <SelectInvestmentAmount
                                bId="iv1"
                                placeholder=""
                                type="number"
                                setText={setBussinessOneInvestment}
                                text={bussinessOneInvestment}
                                allInvested={allInvested}
                            />
                        </div>
                    </div>

                    <div className="w-20 flex flex-col items-center justify-start mx-6">
                        <img
                            src="/icons/farm-house-black.png"
                            alt="pig"
                            className="w-full mt-4"
                        />

                        <h4 className="mt-2">
                            {languageInfo.language.constants.farm}
                        </h4>

                        <div className="w-full mt-4">
                            <SelectInvestmentAmount
                                bId="iv2"
                                placeholder=""
                                type="number"
                                setText={setBussinessTwoInvestment}
                                text={bussinessTwoInvestment}
                                allInvested={allInvested}
                            />
                        </div>
                    </div>

                    <div className="w-20 flex flex-col items-center justify-start mx-6">
                        <img
                            src="/icons/shop-black.png"
                            alt="shop"
                            className="w-full mt-4"
                        />

                        <h4 className="mt-2">
                            {languageInfo.language.constants['e-commerce']}
                        </h4>

                        <div className="w-full mt-4">
                            <SelectInvestmentAmount
                                bId="iv3"
                                placeholder=""
                                type="number"
                                setText={setBussinessThreeInvestment}
                                text={bussinessThreeInvestment}
                                allInvested={allInvested}
                            />
                        </div>
                    </div>

                    <div className="w-20 flex flex-col items-center justify-start mx-6">
                        <img
                            src="/icons/hospital-black.png"
                            alt="hospital"
                            className="w-full mt-4"
                        />

                        <h4 className="mt-2">
                            {languageInfo.language.constants.pharmacy}
                        </h4>

                        <div className="w-full mt-4">
                            <SelectInvestmentAmount
                                bId="iv4"
                                placeholder=""
                                type="number"
                                setText={setBussinessFourInvestment}
                                text={bussinessFourInvestment}
                                allInvested={allInvested}
                            />
                        </div>
                    </div>

                    <div className="w-20 flex flex-col items-center justify-start mx-6 relative">
                        <img
                            src="/icons/info.png"
                            alt="bank"
                            className="absolute -top-4 -right-4 cursor-pointer"
                            onClick={() => dispatch(handleRules(true))}
                        />

                        <img
                            src="/icons/bank-black.png"
                            alt="bank"
                            className="w-full mt-4"
                        />

                        <h4 className="mt-2">
                            {languageInfo.language.constants.bank}
                        </h4>

                        <div className="w-full mt-4">
                            <SelectInvestmentAmount
                                bId="iv5"
                                placeholder=""
                                type="number"
                                setText={setBussinessFiveInvestment}
                                text={bussinessFiveInvestment}
                                allInvested={allInvested}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi') {
        return (
            <div className="w-full flex justify-start items-center h-full flex-col pt-20">
                <div className="flex w-full justify-center items-center h-24 mb-8">
                    <img
                        src="/icons/big-car-black.png"
                        alt="big outlined car"
                        className="h-24"
                    />
                </div>

                {!invested ? (
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="w-full flex items-center justify-center">
                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton
                                    val={
                                        languageInfo.language['g3-screens'][
                                            'take-a-break'
                                        ]
                                    }
                                />
                            </div>

                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={60} />
                            </div>

                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={70} />
                            </div>

                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={80} />
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-center mt-4">
                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={90} />
                            </div>

                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={100} />
                            </div>

                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={110} />
                            </div>

                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={120} />
                            </div>

                            <div className="w-20 flex flex-col items-center justify-center mx-2">
                                <SelectAmountButton val={130} />
                            </div>

                            <img
                                src="/icons/info.png"
                                alt="bank"
                                className="mx-2 cursor-pointer"
                                onClick={() => dispatch(handleRules(true))}
                            />
                        </div>
                    </div>
                ) : null}

                <div className="flex items-center justify-center mt-4">
                    {typeof gameInfo.investments.iv1 === 'number' ? (
                        <div className="flex">
                            <img
                                src="/icons/police.png"
                                alt="police"
                                className="h-6"
                            />
                            <p>
                                {
                                    languageInfo.language['g3-screens']
                                        .probability
                                }
                                :{' '}
                                <strong>
                                    {penaltiesAndBonuses.penalties.find(
                                        (x) =>
                                            x.speed == gameInfo.investments.iv2
                                    )?.chance || 0}
                                </strong>
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    } else if (gameInfo.activeGame.type === 'Viesnīca') {
        return <G5SelectInvestment />;
    } else if (gameInfo.activeGame.type === 'Ražošana') {
        return <G4ActivePart />;
    } else if (gameInfo.activeGame.type === 'Frizētava') {
        return <BarberShopContainer />;
    }

    return null;
}

export default PlayerOptions;
