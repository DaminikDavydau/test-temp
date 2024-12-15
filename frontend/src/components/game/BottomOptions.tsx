import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAX_BARBERSHOPS } from '../../constants/G6Constants';
import {
    calculateG4InvestmentReturns,
    GameInfo,
    handleBarbershopChoice,
    handleG6InvestmentPage,
    handleRules,
    InvestmentsInterface,
    selectGame,
    setInvestments,
    setReturns,
    setTeammateResult,
    switchActiveResults,
    switchCrisisShowcasePage,
} from '../../redux/slices/gameSlice';
import { setNotification } from '../../redux/slices/notificationSlice';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import {
    getInvestmentReturns,
    investReq,
    pauseGame,
    switchYear,
} from '../../requests/gameRequests';
import getCurrentYearInvestments from '../../utils/getCurrentYearInvestments';
import { getPlayerName } from '../../utils/getName';
import JoinGameButton from '../home/JoinGameButton';
import DeleteGameCheck from '../notifs/DeleteGameCheck';
import ChangeYearButton from './ChangeYearButton';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

function AdminBottomOptions() {
    const router = useRouter();
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [invested, setInvested] = useState(false);
    const [sureYearSwitchText, setSureYearSwitchText] = useState('');
    const [sureYearSwitchText2, setSureYearSwitchText2] = useState('');
    const [clicked, setClicked] = useState(false);
    const [adminView, setAdminView] = useState(false);

    const { id } = router.query;

    useEffect(() => {
        if (userInfo.info && userInfo.info._id === gameInfo.activeGame?.admin) {
            setAdminView(true);
        }
    }, [userInfo.info, gameInfo.activeGame]);

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

    const endGame = (e: any) => {
        e.preventDefault();
        setSureYearSwitchText(
            languageInfo.language['generic-game-screen']['finish-game-dialogue']
                .title
        );
        setSureYearSwitchText2(
            languageInfo.language['generic-game-screen']['finish-game-dialogue']
                .text
        );
    };

    const saveResults = (e: any) => {
        e.preventDefault();
        if (clicked) {
            return;
        }

        setClicked(true);

        const { NEXT_PUBLIC_BACKEND_URL } = process.env;

        if (
            typeof id !== 'string' ||
            typeof NEXT_PUBLIC_BACKEND_URL !== 'string'
        ) {
            return;
        }

        window.open(
            `${NEXT_PUBLIC_BACKEND_URL}/api/game/${id}/download-sheets/${languageInfo.activeLanguage}`
        );

        setClicked(false);
    };

    const switchYearFn = async () => {
        if (clicked || !gameInfo.activeGame || !gameInfo.gameInvestments) {
            return;
        }

        setClicked(true);

        const currentInvestments = getCurrentYearInvestments(
            gameInfo.gameInvestments,
            gameInfo.activeGame.year
        );

        if (!gameInfo.players) {
            setSureYearSwitchText(
                languageInfo.language['notifications']['year-switch-check']
            );
            setSureYearSwitchText2(
                languageInfo.language.notifications['investments-not-yet-ready']
            );
            setClicked(false);
            return;
        }

        if (gameInfo.activeGame?.type === 'Bankrots') {
            if (
                currentInvestments.length <
                gameInfo.players.filter((p) => p.assets > 0).length
            ) {
                setSureYearSwitchText(
                    languageInfo.language['notifications']['year-switch-check']
                );
                setSureYearSwitchText2(
                    languageInfo.language.notifications[
                        'investments-not-yet-ready'
                    ]
                );
                setClicked(false);
                return;
            }
        } else if (gameInfo.activeGame?.type === 'Krīzes gads') {
            if (
                currentInvestments.length <
                gameInfo.players.filter((p) => p.assets > -4000).length
            ) {
                setSureYearSwitchText(
                    languageInfo.language['notifications']['year-switch-check']
                );
                setSureYearSwitchText2(
                    languageInfo.language.notifications[
                        'investments-not-yet-ready'
                    ]
                );
                setClicked(false);
                return;
            }
        } else if (
            gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi'
        ) {
            if (
                currentInvestments.length <
                gameInfo.players.filter((p) => p.is_bancrupt === false).length
            ) {
                setSureYearSwitchText(
                    languageInfo.language['notifications']['year-switch-check']
                );
                setSureYearSwitchText2(
                    languageInfo.language.notifications[
                        'investments-not-yet-ready'
                    ]
                );
                setClicked(false);
                return;
            }
        } else if (gameInfo.activeGame?.type === 'Ražošana') {
            let aviablePlayers = gameInfo.players;

            gameInfo.g4Data.machines?.forEach((machine) => {
                if (machine.owner) {
                    aviablePlayers = aviablePlayers.filter(
                        (p) => p._id !== machine.owner
                    );
                }
            });

            if (currentInvestments.length < aviablePlayers.length) {
                if (
                    gameInfo.g4Data.machines &&
                    gameInfo.g4Data.machines.filter((m) => m.owner === null)
                        .length === 0
                ) {
                    if (currentInvestments.length < 3) {
                        dispatch(
                            setNotification({
                                type: 'error',
                                message:
                                    languageInfo.language.notifications[
                                        'captains-submit'
                                    ],
                            })
                        );
                        setClicked(false);
                        return;
                    }
                } else {
                    if (currentInvestments.length === 0) {
                        dispatch(
                            setNotification({
                                type: 'error',
                                message:
                                    languageInfo.language.notifications[
                                        'wait-for-player'
                                    ],
                            })
                        );
                        setClicked(false);
                        return;
                    }
                    setSureYearSwitchText(
                        languageInfo.language['notifications'][
                            'year-switch-check'
                        ]
                    );
                    setSureYearSwitchText2(
                        languageInfo.language.notifications[
                            'investments-not-yet-ready'
                        ]
                    );
                }

                setClicked(false);
                return;
            }
        } else if (gameInfo.activeGame.type === 'Frizētava') {
            if (
                currentInvestments.length < gameInfo.players.length &&
                gameInfo.activeGame.year === 'yearOne'
            ) {
                dispatch(
                    setNotification({
                        type: 'error',
                        message:
                            languageInfo.language.notifications[
                                'wait-for-barbershops'
                            ],
                    })
                );
                setClicked(false);
                return;
            }

            if (currentInvestments.length < gameInfo.players.length) {
                setSureYearSwitchText(
                    languageInfo.language['notifications']['year-switch-check']
                );
                setSureYearSwitchText2(
                    languageInfo.language.notifications[
                        'investments-not-yet-ready'
                    ]
                );
                setClicked(false);
                return;
            }
        } else if (gameInfo.activeGame.type === 'Viesnīca') {
            if (currentInvestments.length < gameInfo.players.length) {
                setSureYearSwitchText(
                    languageInfo.language['notifications']['year-switch-check']
                );
                setSureYearSwitchText2(
                    languageInfo.language.notifications[
                        'investments-not-yet-ready'
                    ]
                );

                setClicked(false);
                return;
            }
        }

        await switchYear(dispatch, router);

        setClicked(false);
    };

    const G42InvestAssets = async () => {
        if (clicked) {
            return;
        }

        if (!gameInfo.g4Data.team) {
            return;
        }

        if (gameInfo.g4Data.team.length < 3) {
            return;
        }

        if (gameInfo.g4Data.team[0] !== gameInfo.playerInfo?._id) {
            return;
        }

        if (!gameInfo.g4Data.g4Investment) {
            return;
        }

        setClicked(true);

        await investReq(
            gameInfo.activeGame?.admin,
            gameInfo.activeGame?.type,
            gameInfo.investments,
            gameInfo.g4Data.g4Investment,
            dispatch,
            router,
            setInvested
        );

        setClicked(false);
    };

    const removeSecondInvestment = () => {
        dispatch(setInvestments({ ...gameInfo.investments, iv2: 0 }));
    };

    const investAssets = async () => {
        if (clicked) {
            return;
        }

        setClicked(true);

        if (
            gameInfo.activeGame?.type === 'Viesnīca' &&
            !gameInfo.investments.iv1
        ) {
            if (
                gameInfo.playerBuildings.conferenceHall &&
                gameInfo.playerBuildings.restaurant &&
                gameInfo.playerBuildings.swimmingPool &&
                gameInfo.playerBuildings.tennisCourt
            ) {
                dispatch(
                    setInvestments({
                        ...gameInfo.investments,
                        iv1: gameInfo.selectableInvestment,
                        iv2: 0,
                    })
                );

                if (gameInfo.selectableInvestment) {
                    const newInvestments: InvestmentsInterface = {
                        ...gameInfo.investments,
                        iv1: gameInfo.selectableInvestment,
                        iv2: 0,
                    };

                    await investReq(
                        gameInfo.activeGame?.admin,
                        gameInfo.activeGame?.type,
                        newInvestments,
                        gameInfo.g4Data.g4Investment,
                        dispatch,
                        router,
                        setInvested
                    );
                } else {
                    dispatch(
                        setInvestments({
                            ...gameInfo.investments,
                            iv1: gameInfo.selectableInvestment,
                        })
                    );
                }

                setClicked(false);
                return;
            } else {
                dispatch(
                    setInvestments({
                        ...gameInfo.investments,
                        iv1: gameInfo.selectableInvestment,
                    })
                );
                setClicked(false);
                return;
            }
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
            router,
            setInvested
        );

        setClicked(false);
    };

    const pauseGameNow = async () => {
        if (clicked) {
            return;
        }

        setClicked(true);

        await pauseGame(dispatch, router);

        setClicked(false);
    };

    const leaveGame = () => {
        router.push('/');
    };

    const closeShowcaseScreen = () => {
        dispatch(
            setReturns({ bancrupcies: null, assets: null, investments: null })
        );
    };

    const closeCrisisShowcase = () => {
        if (
            !gameInfo.crisisYearResult ||
            typeof gameInfo.crisisYearResult.page !== 'number'
        ) {
            if (gameInfo.activeGame?.type === 'Ražošana') {
                dispatch(switchCrisisShowcasePage(4));
            } else {
                dispatch(switchCrisisShowcasePage(3));
            }

            dispatch(
                setReturns({
                    bancrupcies: null,
                    assets: null,
                    investments: null,
                })
            );

            return;
        }

        if (
            gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' &&
            !gameInfo.crisisYearResult?.finishedReward
        ) {
            dispatch(switchCrisisShowcasePage(3));
            dispatch(
                setReturns({
                    bancrupcies: null,
                    assets: null,
                    investments: null,
                })
            );
            return;
        } else if (
            gameInfo.activeGame?.type === 'Ražošana' &&
            gameInfo.g4Data.machines
        ) {
            if (
                !gameInfo.activeGame?.started &&
                gameInfo.activeGame?.year !== 'yearOne'
            ) {
                dispatch(switchCrisisShowcasePage(4));
                dispatch(
                    setReturns({
                        bancrupcies: null,
                        assets: null,
                        investments: null,
                    })
                );
            }

            if (
                gameInfo.g4Data.machines.filter((m) => m.owner === null)
                    .length >= 1
            ) {
                dispatch(switchCrisisShowcasePage(4));
                dispatch(
                    setReturns({
                        bancrupcies: null,
                        assets: null,
                        investments: null,
                    })
                );
            } else {
                dispatch(
                    switchCrisisShowcasePage(gameInfo.crisisYearResult.page + 1)
                );
            }
            return;
        }

        if (
            gameInfo.activeGame &&
            userInfo.info &&
            gameInfo.activeGame.admin === userInfo.info._id
        ) {
            dispatch(switchCrisisShowcasePage(3));
            dispatch(
                setReturns({
                    bancrupcies: null,
                    assets: null,
                    investments: null,
                })
            );
            return;
        }

        dispatch(switchCrisisShowcasePage(gameInfo.crisisYearResult.page + 1));
    };

    const closeRules = () => {
        dispatch(handleRules(false));
    };

    const calculateG4 = async () => {
        setClicked(true);

        await getInvestmentReturns(
            dispatch,
            router,
            gameInfo.g4Data.g4InvestmentTest
        );

        setClicked(false);
    };

    const checkPlayerReturn = (teammateId: string) => {
        dispatch(setTeammateResult(teammateId));
    };

    const closeG4Results = () => {
        dispatch(calculateG4InvestmentReturns(null));
    };

    const switchTeamResults = () => {
        dispatch(switchActiveResults(!gameInfo.g4Data.teamResults));
    };

    const buyBarbershop = () => {
        if (gameInfo.g6Data.barbershops.length === 6) {
            return;
        }
        dispatch(handleBarbershopChoice(true));
    };

    const switchG6InvestmentPage = (page?: null) => {
        if (page === null) {
            dispatch(handleG6InvestmentPage(null));
            return;
        }

        dispatch(handleG6InvestmentPage('ok'));
    };

    const AdminOptions = () => {
        return (
            <div className="w-full flex justify-between items-center px-4 mt-4">
                <DeleteGameCheck
                    text={sureYearSwitchText}
                    text2={sureYearSwitchText2}
                    setText2={setSureYearSwitchText2}
                    setText={setSureYearSwitchText}
                />

                <div className="flex items-center">
                    <div className="mx-3 opacity-75">
                        <JoinGameButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'][
                                    'stop-game'
                                ]
                            }
                            fn={endGame}
                        />
                    </div>
                    {/* 
                    <div className="mx-3 opacity-75">
                        <JoinGameButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                gameInfo.activeGame &&
                                gameInfo.activeGame.paused
                                    ? 'Atsākt spēli'
                                    : 'Pauzēt spēli'
                            }
                            fn={pauseGameNow}
                        />
                    </div> */}
                </div>

                {gameInfo.activeGame && !gameInfo.activeGame.paused && (
                    <div className="flex items-center justify-center">
                        <img
                            src="/icons/info.png"
                            alt="info"
                            className="cursor-pointer"
                            onClick={() => dispatch(handleRules(true))}
                        />

                        <div className="w-80 mx-4 relative">
                            <ChangeYearButton
                                id={'endTurnButton'}
                                clicked={clicked}
                                disabled={false}
                                text={
                                    languageInfo.language[
                                        'generic-game-screen'
                                    ]['end-turn']
                                }
                                fn={switchYearFn}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (gameInfo.activeGame?.type === 'Ražošana') {
        if (gameInfo.crisisYearResult || gameInfo.returns) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <div className="w-48 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'].ok
                            }
                            fn={closeCrisisShowcase}
                        />
                    </div>
                </div>
            );
        }

        if (gameInfo.showRules) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <div className="w-56 mx-4">
                        <ChangeYearButton
                            id={'submitButton'}
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'].ok
                            }
                            fn={closeRules}
                        />
                    </div>
                </div>
            );
        }

        if (
            gameInfo.playerInfo &&
            gameInfo.g4Data.playerMachine &&
            (!gameInfo.g4Data.team || gameInfo.g4Data.team.length === 0)
        ) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <h3 className="text-center">
                        {
                            languageInfo.language.notifications[
                                'wait-for-auction'
                            ]
                        }
                    </h3>
                </div>
            );
        }

        if (
            !adminView &&
            gameInfo.activeGame &&
            !gameInfo.activeGame.started &&
            gameInfo.activeGame.year !== 'yearOne'
        ) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <div className="w-56 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'][
                                    'exit-game'
                                ]
                            }
                            fn={leaveGame}
                        />
                    </div>
                    <div className="w-56 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                gameInfo.g4Data.teamResults
                                    ? languageInfo.language.notifications[
                                          'individual-results'
                                      ]
                                    : languageInfo.language.notifications[
                                          'team-results'
                                      ]
                            }
                            fn={switchTeamResults}
                        />
                    </div>
                </div>
            );
        }

        if (
            adminView &&
            gameInfo.activeGame &&
            !gameInfo.activeGame.started &&
            gameInfo.activeGame.year !== 'yearOne'
        ) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <DeleteGameCheck
                        text={sureYearSwitchText}
                        text2={sureYearSwitchText2}
                        setText2={setSureYearSwitchText2}
                        setText={setSureYearSwitchText}
                    />

                    <div className="w-60 mx-4">
                        <ChangeYearButton
                            id={'finishGameButton'}
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'][
                                    'finish-game'
                                ]
                            }
                            fn={endGame}
                        />
                    </div>

                    <div className="w-60 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'][
                                    'save-results'
                                ]
                            }
                            fn={saveResults}
                        />
                    </div>

                    <div className="w-60 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                gameInfo.g4Data.teamResults
                                    ? languageInfo.language.notifications[
                                          'individual-results'
                                      ]
                                    : languageInfo.language.notifications[
                                          'team-results'
                                      ]
                            }
                            fn={switchTeamResults}
                        />
                    </div>
                </div>
            );
        }

        if (adminView) {
            return <AdminOptions />;
        }

        if (invested) {
            return (
                <div className="w-full flex justify-center items-center mt-4">
                    <h3 className="text-center">
                        {gameInfo.g4Data.machines?.find((m) => m.owner === null)
                            ? languageInfo.language.notifications[
                                  'wait-for-auction'
                              ]
                            : languageInfo.language.notifications[
                                  'wait-for-production'
                              ]}
                    </h3>
                </div>
            );
        }

        if (
            gameInfo.g4Data.investmentReturns &&
            gameInfo.g4Data.team &&
            gameInfo.g4Data.team.length >= 3
        ) {
            return (
                <div className="w-full flex justify-between items-center px-4 mt-4">
                    <div className="flex items-center">
                        <div className="mx-3 opacity-75">
                            <JoinGameButton
                                clicked={clicked}
                                disabled={false}
                                text={
                                    languageInfo.language.notifications['back']
                                }
                                fn={closeG4Results}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div
                            className={`mx-3 w-40 ${
                                'team' !== gameInfo.g4Data.teammateResult
                                    ? 'opacity-75'
                                    : ''
                            }`}
                        >
                            <ChangeYearButton
                                clicked={clicked}
                                disabled={false}
                                text={
                                    languageInfo.language.notifications['team']
                                }
                                fn={() => checkPlayerReturn('team')}
                            />
                        </div>

                        {gameInfo.g4Data.playerTeam &&
                            gameInfo.g4Data.playerTeam.map((teammate, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={`mx-3 w-40 ${
                                            teammate._id !==
                                            gameInfo.g4Data.teammateResult
                                                ? 'opacity-75'
                                                : ''
                                        }`}
                                    >
                                        <ChangeYearButton
                                            clicked={clicked}
                                            disabled={false}
                                            text={getPlayerName(teammate.name)}
                                            fn={() =>
                                                checkPlayerReturn(teammate._id)
                                            }
                                        />
                                    </div>
                                );
                            })}
                    </div>
                </div>
            );
        }

        if (gameInfo.g4Data.team && gameInfo.g4Data.team.length > 0) {
            if (gameInfo.g4Data.team[0] === gameInfo.playerInfo?._id) {
                return (
                    <div className="w-full flex justify-center items-center mt-4">
                        <div className="w-56 mx-4">
                            <ChangeYearButton
                                clicked={clicked}
                                disabled={false}
                                text={
                                    languageInfo.language.notifications[
                                        'calculate'
                                    ]
                                }
                                fn={() => calculateG4()}
                            />
                        </div>

                        <div className="w-56 mx-4">
                            <ChangeYearButton
                                clicked={clicked}
                                disabled={false}
                                text={
                                    languageInfo.language[
                                        'generic-game-screen'
                                    ]['submit-turn']
                                }
                                fn={G42InvestAssets}
                            />
                        </div>

                        <img
                            src="/icons/info.png"
                            alt="info"
                            className="cursor-pointer"
                            onClick={() => dispatch(handleRules(true))}
                        />
                    </div>
                );
            }

            return null;
        }

        return (
            <div className="w-full flex justify-center items-center mt-4">
                <DeleteGameCheck
                    text={sureYearSwitchText}
                    text2={sureYearSwitchText2}
                    setText2={setSureYearSwitchText2}
                    setText={setSureYearSwitchText}
                />

                <div className="w-56 mx-4">
                    <ChangeYearButton
                        clicked={clicked}
                        disabled={false}
                        text={languageInfo.language.notifications['skip-round']}
                        fn={() => {
                            dispatch(
                                setInvestments({
                                    ...gameInfo.investments,
                                    iv1: 0,
                                })
                            );
                            setSureYearSwitchText(
                                languageInfo.language.notifications[
                                    'skip-round-check'
                                ]
                            );
                            setSureYearSwitchText2(
                                languageInfo.language.notifications[
                                    'no-more-investing'
                                ]
                            );
                        }}
                    />
                </div>

                <div className="w-56 mx-4">
                    <ChangeYearButton
                        clicked={clicked}
                        disabled={false}
                        text={
                            languageInfo.language['generic-game-screen'][
                                'submit-turn'
                            ]
                        }
                        fn={() => {
                            setSureYearSwitchText(
                                languageInfo.language.notifications[
                                    'investment-submit-check'
                                ]
                            );
                            setSureYearSwitchText2(
                                languageInfo.language.notifications[
                                    'investment-not-changable'
                                ]
                            );
                        }}
                    />
                </div>
            </div>
        );
    } else if (gameInfo.activeGame?.type === 'Frizētava') {
        if (gameInfo.showRules) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <div className="w-56 mx-4">
                        <ChangeYearButton
                            id={'closeRulesButton'}
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'].ok
                            }
                            fn={closeRules}
                        />
                    </div>
                </div>
            );
        }

        if (gameInfo.crisisYearResult || gameInfo.returns) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <div className="w-48 mx-4">
                        <ChangeYearButton
                            id={'closeCrisisShowcaseButton'}
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'].ok
                            }
                            fn={closeCrisisShowcase}
                        />
                    </div>
                </div>
            );
        }

        if (
            !adminView &&
            !gameInfo.activeGame.started &&
            gameInfo.activeGame.year !== 'yearOne'
        ) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <div className="w-56 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'][
                                    'exit-game'
                                ]
                            }
                            fn={leaveGame}
                        />
                    </div>
                </div>
            );
        }

        if (invested) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <h3 className="text-center">
                        {
                            languageInfo.language['generic-game-screen'][
                                'please-wait-end-year'
                            ]
                        }
                    </h3>
                </div>
            );
        }

        if (
            adminView &&
            gameInfo.activeGame &&
            !gameInfo.activeGame.started &&
            gameInfo.activeGame.year !== 'yearOne'
        ) {
            return (
                <div className="w-full flex justify-center items-center px-4 mt-4">
                    <DeleteGameCheck
                        text={sureYearSwitchText}
                        text2={sureYearSwitchText2}
                        setText2={setSureYearSwitchText2}
                        setText={setSureYearSwitchText}
                    />

                    <div className="w-60 mx-4">
                        <ChangeYearButton
                            id={'finishGameButton'}
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'][
                                    'finish-game'
                                ]
                            }
                            fn={endGame}
                        />
                    </div>

                    <div className="w-60 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen'][
                                    'save-results'
                                ]
                            }
                            fn={saveResults}
                        />
                    </div>
                </div>
            );
        }

        if (adminView) {
            return <AdminOptions />;
        }

        if (gameInfo.g6Data.choosingBarberShop) {
            return (
                <div className="w-full flex justify-center items-center mt-4">
                    {!gameInfo.g6Data.editing ? (
                        <div className="w-56 mx-4">
                            <ChangeYearButton
                                clicked={clicked}
                                disabled={false}
                                text={
                                    languageInfo.language.notifications.cancel
                                }
                                fn={() => switchG6InvestmentPage(null)}
                            />
                        </div>
                    ) : null}

                    <div className="w-56 mx-4">
                        <ChangeYearButton
                            id={'nextButton'}
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen']
                                    .continue
                            }
                            fn={() => switchG6InvestmentPage()}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full flex justify-center items-center mt-4">
                <div className="w-56 mx-4">
                    <ChangeYearButton
                        id={'buyHairSalonButton'}
                        clicked={clicked}
                        disabled={
                            gameInfo.g6Data.barbershops.length ===
                                MAX_BARBERSHOPS ||
                            (Number(gameInfo.changableAssets) < 30000 &&
                                gameInfo.activeGame.year !== 'yearOne') ||
                            (gameInfo.activeGame.year === 'yearOne' &&
                                gameInfo.g6Data.barbershops.length >= 1)
                        }
                        text={
                            languageInfo.language['notifications'][
                                'buy-barbershop'
                            ]
                        }
                        fn={() => buyBarbershop()}
                    />
                </div>

                <div className="w-56 mx-4">
                    <ChangeYearButton
                        id={'submitButton'}
                        clicked={clicked}
                        disabled={gameInfo.g6Data.barbershops.length === 0}
                        text={
                            languageInfo.language['generic-game-screen'][
                                'submit-turn'
                            ]
                        }
                        fn={investAssets}
                    />
                </div>

                <img
                    src="/icons/info.png"
                    alt="info"
                    className="absolute top-10 left-10 cursor-pointer"
                    onClick={() => dispatch(handleRules(true))}
                />
            </div>
        );
    }

    if (gameInfo.showRules) {
        return (
            <div className="w-full flex justify-center items-center px-4 mt-4">
                <div className="w-56 mx-4">
                    <ChangeYearButton
                        id={'submitButton'}
                        clicked={clicked}
                        disabled={false}
                        text={languageInfo.language['generic-game-screen'].ok}
                        fn={closeRules}
                    />
                </div>
            </div>
        );
    }

    if (!gameInfo.playerInfo?.is_bancrupt && gameInfo.crisisYearResult) {
        return (
            <div className="w-full flex justify-center items-center px-4 mt-4">
                <div className="w-48 mx-4">
                    <ChangeYearButton
                        id={'submitButton'}
                        clicked={clicked}
                        disabled={false}
                        text={
                            !gameInfo.activeGame?.started &&
                            gameInfo.activeGame?.year !== 'yearOne'
                                ? languageInfo.language['generic-game-screen'][
                                      'get-results'
                                  ]
                                : gameInfo.crisisYearResult.page === 1 &&
                                  !adminView
                                ? languageInfo.language['generic-game-screen']
                                      .continue
                                : gameInfo.activeGame?.type ===
                                  'Lēnāk brauksi - tālāk tiksi'
                                ? languageInfo.language['generic-game-screen'][
                                      'next-hour'
                                  ]
                                : languageInfo.language['generic-game-screen'][
                                      'next-year'
                                  ]
                        }
                        fn={closeCrisisShowcase}
                    />
                </div>
            </div>
        );
    }

    if (
        !gameInfo.playerInfo?.is_bancrupt &&
        gameInfo.returns &&
        !(
            gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' &&
            adminView
        ) &&
        gameInfo.activeGame?.type !== 'Viesnīca'
    ) {
        return (
            <div className="w-full flex justify-center items-center px-4 mt-4">
                <div className="w-60 mx-4">
                    <ChangeYearButton
                        clicked={clicked}
                        disabled={false}
                        text={
                            !gameInfo.activeGame?.started &&
                            gameInfo.activeGame?.year !== 'yearOne'
                                ? languageInfo.language['generic-game-screen'][
                                      'get-results'
                                  ]
                                : gameInfo.activeGame?.type ===
                                  'Lēnāk brauksi - tālāk tiksi'
                                ? languageInfo.language['generic-game-screen'][
                                      'next-hour'
                                  ]
                                : languageInfo.language['generic-game-screen'][
                                      'next-year'
                                  ]
                        }
                        fn={closeShowcaseScreen}
                    />
                </div>
            </div>
        );
    }

    if (
        gameInfo.playerInfo?.is_bancrupt &&
        gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' &&
        gameInfo.crisisYearResult
    ) {
        if (gameInfo.crisisYearResult.page === 1) {
            return (
                <div className="w-full flex justify-center items-center">
                    <div className="w-60 mx-4">
                        <ChangeYearButton
                            clicked={clicked}
                            disabled={false}
                            text={
                                languageInfo.language['generic-game-screen']
                                    .summary
                            }
                            fn={closeCrisisShowcase}
                        />
                    </div>
                </div>
            );
        }
        return (
            <div className="w-full flex justify-center items-center">
                <div className="w-60 mx-4">
                    <ChangeYearButton
                        clicked={clicked}
                        disabled={false}
                        text={
                            languageInfo.language['generic-game-screen'][
                                'get-results'
                            ]
                        }
                        fn={closeCrisisShowcase}
                    />
                </div>
            </div>
        );
    }

    if (
        !adminView &&
        gameInfo.activeGame &&
        !gameInfo.activeGame.started &&
        gameInfo.activeGame.year !== 'yearOne'
    ) {
        return (
            <div className="w-full flex justify-center items-center px-4 mt-4">
                <div className="w-56 mx-4">
                    <ChangeYearButton
                        clicked={clicked}
                        disabled={false}
                        text={
                            languageInfo.language['generic-game-screen'][
                                'exit-game'
                            ]
                        }
                        fn={leaveGame}
                    />
                </div>
            </div>
        );
    }

    if (
        adminView &&
        gameInfo.activeGame &&
        !gameInfo.activeGame.started &&
        gameInfo.activeGame.year !== 'yearOne'
    ) {
        return (
            <div className="w-full flex justify-center items-center px-4 mt-4">
                <DeleteGameCheck
                    text={sureYearSwitchText}
                    text2={sureYearSwitchText2}
                    setText2={setSureYearSwitchText2}
                    setText={setSureYearSwitchText}
                />

                <div className="w-60 mx-4">
                    <ChangeYearButton
                        id={'finishGameButton'}
                        clicked={clicked}
                        disabled={false}
                        text={
                            languageInfo.language['generic-game-screen'][
                                'finish-game'
                            ]
                        }
                        fn={endGame}
                    />
                </div>

                <div className="w-60 mx-4">
                    <ChangeYearButton
                        clicked={clicked}
                        disabled={false}
                        text={
                            languageInfo.language['generic-game-screen'][
                                'save-results'
                            ]
                        }
                        fn={saveResults}
                    />
                </div>
            </div>
        );
    }

    if (
        gameInfo.playerInfo?.is_bancrupt &&
        gameInfo.activeGame?.type !== 'Lēnāk brauksi - tālāk tiksi'
    ) {
        return (
            <div className="w-full flex justify-center items-center mt-4">
                <h3>{languageInfo.language['g3-screens'].congrats}</h3>

                <h3>
                    {languageInfo.language['g3-screens']['wait-for-others']}
                </h3>
            </div>
        );
    }

    if (adminView) {
        return <AdminOptions />;
    }

    if (invested) {
        return (
            <div className="w-full flex justify-center items-center mt-4">
                {(gameInfo.activeGame?.type === 'Krīzes gads' &&
                    gameInfo.activeGame?.year === 'yearTen') ||
                (gameInfo.activeGame?.type !== 'Krīzes gads' &&
                    gameInfo.activeGame?.year === 'yearFive') ? (
                    <h3 className="text-center">
                        {
                            languageInfo.language['generic-game-screen'][
                                'wait-for-game-end'
                            ]
                        }
                    </h3>
                ) : gameInfo.activeGame?.type ===
                  'Lēnāk brauksi - tālāk tiksi' ? (
                    <h3 className="text-center">
                        {
                            languageInfo.language['generic-game-screen'][
                                'wait-for-hour-end'
                            ]
                        }
                    </h3>
                ) : (
                    <h3 className="text-center">
                        {
                            languageInfo.language['generic-game-screen'][
                                'please-wait-end-year'
                            ]
                        }
                    </h3>
                )}
            </div>
        );
    }

    if (gameInfo.activeGame?.type === 'Viesnīca' && !gameInfo.investments.iv1) {
        return (
            <div className="w-full flex justify-center items-center mt-4">
                <JoinGameButton
                    id={'submitButton'}
                    clicked={clicked}
                    disabled={typeof gameInfo.selectableInvestment !== 'number'}
                    text={
                        languageInfo.language['generic-game-screen'][
                            'submit-turn'
                        ]
                    }
                    fn={investAssets}
                />
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center items-center mt-4">
            {gameInfo.activeGame?.type === 'Viesnīca' &&
            gameInfo.investments.iv1 > 0 ? (
                <div className="w-60 mx-4">
                    <ChangeYearButton
                        clicked={clicked}
                        disabled={!gameInfo.investments.iv2}
                        text={languageInfo.language.notifications['not-build']}
                        fn={removeSecondInvestment}
                    />
                </div>
            ) : null}

            <div className="w-60 mx-4">
                <ChangeYearButton
                    id={'submitButton'}
                    clicked={clicked}
                    disabled={
                        gameInfo.activeGame?.type === 'Bankrots'
                            ? gameInfo.changableAssets !== 0
                            : gameInfo.activeGame?.type === 'Krīzes gads' &&
                              typeof gameInfo.selectableInvestment !== 'number'
                            ? true
                            : gameInfo.activeGame?.type ===
                                  'Lēnāk brauksi - tālāk tiksi' &&
                              typeof gameInfo.selectableInvestment !== 'number'
                            ? true
                            : false
                    }
                    text={
                        languageInfo.language['generic-game-screen'][
                            'submit-turn'
                        ]
                    }
                    fn={investAssets}
                />
            </div>
        </div>
    );
}

export default AdminBottomOptions;
