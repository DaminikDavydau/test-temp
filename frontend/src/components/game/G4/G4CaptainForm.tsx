import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { POWER_DIFFERENCE } from '../../../constants/G4Constants';
import {
    GameInfo,
    selectGame,
    setG4Investment,
    setG4InvestmentTest,
    setPlayerTeam,
    setTeamMachinesRdx,
    setTeammateResult,
} from '../../../redux/slices/gameSlice';
import { MachineInterface } from '../../../types/machine';
import { PlayerInterface } from '../../../types/player';
import prevGameYearString from '../../../utils/getPrevYearString';
import G4CalculatedReturns from './G4CalculatedReturns';
import { getPlayerName } from '../../../utils/getName';
import { setNotification } from '../../../redux/slices/notificationSlice';
import nextGameYear from '../../../utils/getNextGameYear';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

interface YF {
    year:
        | 'yearOne'
        | 'yearTwo'
        | 'yearThree'
        | 'yearFour'
        | 'yearFive'
        | 'yearSix'
        | 'yearSeven'
        | 'yearEight'
        | 'yearNine';
}

export const yearFormat: YF['year'][] = [
    'yearOne',
    'yearTwo',
    'yearThree',
    'yearFour',
    'yearFive',
    'yearSix',
    'yearSeven',
    'yearEight',
    'yearNine',
];

const DEFAULT_SHARE = 90;

function G4CaptainForm() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const dispatch = useDispatch();

    const [allUsed, setAllUsed] = useState(false);

    const [investmentFinished, setInvestmentFinished] = useState(false);

    const [teamwork, setTeamwork] = useState<{
        yearOne: null | boolean;
        yearTwo: null | boolean;
        yearThree: null | boolean;
        yearFour: null | boolean;
        yearFive: null | boolean;
        yearSix: null | boolean;
        yearSeven: null | boolean;
        yearEight: null | boolean;
        yearNine: null | boolean;
    }>({
        yearOne: null,
        yearTwo: null,
        yearThree: null,
        yearFour: null,
        yearFive: null,
        yearSix: null,
        yearSeven: null,
        yearEight: null,
        yearNine: null,
    });

    const [noWork, setNoWork] = useState<{
        yearOne: false;
        yearTwo: null | boolean;
        yearThree: null | boolean;
        yearFour: null | boolean;
        yearFive: null | boolean;
        yearSix: null | boolean;
        yearSeven: null | boolean;
        yearEight: null | boolean;
        yearNine: null | boolean;
    }>({
        yearOne: false,
        yearTwo: null,
        yearThree: null,
        yearFour: null,
        yearFive: null,
        yearSix: null,
        yearSeven: null,
        yearEight: null,
        yearNine: null,
    });

    const [noWorkTaken, setNoWorkTaken] = useState(false);

    const [machinesUsedData, setMachinesUsedData] = useState({
        yearOne: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearTwo: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearThree: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearFour: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearFive: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearSix: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearSeven: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearEight: {
            firstMachine: 0,
            secondMachine: 0,
        },
        yearNine: {
            firstMachine: 0,
            secondMachine: 0,
        },
    });

    const [machineWork, setMachineWork] = useState({
        yearOne: {
            firstMachine: false,
            secondMachine: false,
        },
        yearTwo: {
            firstMachine: false,
            secondMachine: false,
        },
        yearThree: {
            firstMachine: false,
            secondMachine: false,
        },
        yearFour: {
            firstMachine: false,
            secondMachine: false,
        },
        yearFive: {
            firstMachine: false,
            secondMachine: false,
        },
        yearSix: {
            firstMachine: false,
            secondMachine: false,
        },
        yearSeven: {
            firstMachine: false,
            secondMachine: false,
        },
        yearEight: {
            firstMachine: false,
            secondMachine: false,
        },
        yearNine: {
            firstMachine: false,
            secondMachine: false,
        },
    });

    const [playerShares, setPlayerShares] = useState({
        yearOne: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearTwo: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearThree: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearFour: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearFive: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearSix: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearSeven: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearEight: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
        yearNine: {
            firstPlayer: DEFAULT_SHARE,
            secondPlayer: 100 - DEFAULT_SHARE,
        },
    });

    const [notifSent, setNotifSent] = useState<Record<string, boolean>>({});

    const [teamMachines, setTeamMachines] = useState<MachineInterface[] | null>(
        null
    );

    const [teamPlayers, setTeamPlayers] = useState<PlayerInterface[] | null>(
        null
    );

    const [invested, setInvested] = useState(false);

    const resetState = () => {
        setAllUsed(false);
        setInvestmentFinished(false);

        setNoWorkTaken(false);

        setTeamwork({
            yearOne: null,
            yearTwo: null,
            yearThree: null,
            yearFour: null,
            yearFive: null,
            yearSix: null,
            yearSeven: null,
            yearEight: null,
            yearNine: null,
        });

        setNoWork({
            yearOne: false,
            yearTwo: null,
            yearThree: null,
            yearFour: null,
            yearFive: null,
            yearSix: null,
            yearSeven: null,
            yearEight: null,
            yearNine: null,
        });

        setMachinesUsedData({
            yearOne: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearTwo: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearThree: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearFour: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearFive: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearSix: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearSeven: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearEight: {
                firstMachine: 0,
                secondMachine: 0,
            },
            yearNine: {
                firstMachine: 0,
                secondMachine: 0,
            },
        });

        setMachineWork({
            yearOne: {
                firstMachine: false,
                secondMachine: false,
            },
            yearTwo: {
                firstMachine: false,
                secondMachine: false,
            },
            yearThree: {
                firstMachine: false,
                secondMachine: false,
            },
            yearFour: {
                firstMachine: false,
                secondMachine: false,
            },
            yearFive: {
                firstMachine: false,
                secondMachine: false,
            },
            yearSix: {
                firstMachine: false,
                secondMachine: false,
            },
            yearSeven: {
                firstMachine: false,
                secondMachine: false,
            },
            yearEight: {
                firstMachine: false,
                secondMachine: false,
            },
            yearNine: {
                firstMachine: false,
                secondMachine: false,
            },
        });

        setPlayerShares({
            yearOne: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearTwo: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearThree: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearFour: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearFive: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearSix: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearSeven: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearEight: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
            yearNine: {
                firstPlayer: DEFAULT_SHARE,
                secondPlayer: 100 - DEFAULT_SHARE,
            },
        });

        setNotifSent({});
    };

    useEffect(() => {
        const playerIv = gameInfo.gameInvestments
            ?.filter((iv) => iv.year === gameInfo.activeGame?.year)
            .find((iv) => iv.player_id === gameInfo.playerInfo?._id);

        if (playerIv) {
            setInvested(true);
        }
    }, [gameInfo.gameInvestments, gameInfo.activeGame, gameInfo.playerInfo]);

    useEffect(() => {
        let sentCounter = 0;

        for (const sentKey in notifSent) {
            if (notifSent[sentKey]) {
                sentCounter++;
            }
        }

        if (sentCounter >= 2) {
            setAllUsed(true);
        }
    }, [notifSent]);

    useEffect(() => {
        if (allUsed) {
            yearFormat.forEach((year) => {
                if (noWork[year]) {
                    setNoWorkTaken(true);
                }
            });
        }
    }, [noWork, allUsed]);

    useEffect(() => {
        if (
            (!teamPlayers || !gameInfo.g4Data.playerTeam) &&
            gameInfo.players &&
            gameInfo.g4Data.team
        ) {
            let players: PlayerInterface[] = [];

            gameInfo.g4Data.team.forEach((teammate) => {
                const teammateInfo = gameInfo.players?.find(
                    (p) => p._id === teammate
                );
                if (teammateInfo) {
                    players = [...players, teammateInfo];
                }
            });

            if (!teamPlayers) {
                setTeamPlayers(players);
            }

            if (!gameInfo.g4Data.playerTeam && gameInfo.playerInfo) {
                dispatch(setPlayerTeam(players));
                dispatch(setTeammateResult(gameInfo.playerInfo._id));
            }
        }
    }, [
        teamPlayers,
        gameInfo.players,
        gameInfo.g4Data.team,
        gameInfo.g4Data.playerTeam,
        gameInfo.playerInfo,
    ]);

    useEffect(() => {
        let workAmount = {
            firstMachine: 0,
            secondMachine: 0,
        };

        const newMachineUsedData = { ...machinesUsedData };

        yearFormat.forEach((year) => {
            const yearData = machineWork[year];

            if (yearData.firstMachine) {
                workAmount = {
                    ...workAmount,
                    firstMachine: workAmount.firstMachine + 1,
                };
            }

            if (yearData.secondMachine) {
                workAmount = {
                    ...workAmount,
                    secondMachine: workAmount.secondMachine + 1,
                };
            }

            if (yearData.firstMachine || yearData.secondMachine) {
                newMachineUsedData[year] = workAmount;
            }
        });

        setMachinesUsedData({ ...newMachineUsedData });
    }, [machineWork]);

    useEffect(() => {
        if (!teamMachines && gameInfo.g4Data.machines && gameInfo.g4Data.team) {
            let teamOwnedMachines: MachineInterface[] = [];
            gameInfo.g4Data.machines.forEach((machine) => {
                gameInfo.g4Data.team?.forEach((teammate) => {
                    if (machine.owner === teammate) {
                        teamOwnedMachines = [...teamOwnedMachines, machine];
                    }
                });
            });

            setTeamMachines(teamOwnedMachines);
            dispatch(setTeamMachinesRdx(teamOwnedMachines));
        }
    }, [teamMachines, gameInfo.g4Data.machines, gameInfo.g4Data.team]);

    useEffect(() => {
        yearFormat.forEach((year) => {
            if (teamwork[year] === false) {
                const newMachineWork = machineWork;

                newMachineWork[year] = {
                    firstMachine: true,
                    secondMachine: true,
                };

                setMachineWork(newMachineWork);
            }
        });

        if (teamMachines && teamMachines.length >= 2) {
            const firstMachine = teamMachines[0];
            const secondMachine = teamMachines[1];

            let timesSelectedF = 0;
            let timesSelectedS = 0;

            for (const workKey in machineWork) {
                if (
                    workKey !== 'yearOne' &&
                    workKey !== 'yearTwo' &&
                    workKey !== 'yearThree' &&
                    workKey !== 'yearFour' &&
                    workKey !== 'yearFive' &&
                    workKey !== 'yearSix' &&
                    workKey !== 'yearSeven' &&
                    workKey !== 'yearEight' &&
                    workKey !== 'yearNine'
                ) {
                    return;
                }

                let machineWorkData = machineWork[workKey];
                let machineActiveF = machineWorkData.firstMachine;
                let machineActiveS = machineWorkData.secondMachine;

                if (machineActiveF) {
                    timesSelectedF += 1;
                }

                if (machineActiveS) {
                    timesSelectedS += 1;
                }
            }
            const newSent = { ...notifSent };

            if (timesSelectedF >= firstMachine.timesUsed) {
                newSent['0'] = true;

                let message = '';
                let bothUsed = 0;

                for (const sentKey in newSent) {
                    if (newSent[sentKey]) {
                        bothUsed += 1;
                    }
                }

                if (bothUsed === 2) {
                    message =
                        languageInfo.language['g4-screens'].notification[
                            'unemployment-only'
                        ];
                } else if (!notifSent['0']) {
                    message = languageInfo.language['g4-screens'].notification[
                        'not-usable'
                    ].replace('[]', String(secondMachine.number));
                }

                setNotifSent(newSent);

                if (message) {
                    dispatch(
                        setNotification({ type: 'success', message: message })
                    );
                }
            }

            if (timesSelectedS >= secondMachine.timesUsed) {
                newSent['1'] = true;

                let message = '';
                let bothUsed = 0;

                for (const sentKey in newSent) {
                    if (newSent[sentKey]) {
                        bothUsed += 1;
                    }
                }

                if (bothUsed === 2) {
                    message =
                        languageInfo.language['g4-screens'].notification[
                            'unemployment-only'
                        ];
                } else if (!notifSent['1']) {
                    message = languageInfo.language['g4-screens'].notification[
                        'not-usable'
                    ].replace('[]', String(secondMachine.number));
                }

                dispatch(
                    setNotification({ type: 'success', message: message })
                );

                setNotifSent(newSent);
            }
        }
    }, [teamwork, machineWork, teamMachines]);

    const getPowerIncomeBase = (year: YF['year']) => {
        if (teamMachines) {
            const currentYearUse = machinesUsedData[year];
            const currentYearWork = machineWork[year];

            let incomeBase: number | string | null = null;
            let bothWork: number | null = null;

            if (currentYearWork.firstMachine && currentYearWork.secondMachine) {
                incomeBase = languageInfo.language['g4-screens'].own;
                bothWork =
                    (teamMachines[0].timesUsed +
                        1 -
                        currentYearUse.firstMachine) *
                    POWER_DIFFERENCE;
            } else if (currentYearWork.firstMachine) {
                incomeBase =
                    (teamMachines[0].timesUsed +
                        1 -
                        currentYearUse.firstMachine) *
                    POWER_DIFFERENCE;
            } else if (currentYearWork.secondMachine) {
                incomeBase =
                    (teamMachines[1].timesUsed +
                        1 -
                        currentYearUse.secondMachine) *
                    POWER_DIFFERENCE;
            }

            return { incomeBase, bothWork };
        }

        return { incomeBase: null, bothWork: null };
    };

    const changeInput = (
        e: React.ChangeEvent<HTMLInputElement>,
        year: YF['year']
    ) => {
        const value = e.target.value;

        const nval = Number(value);

        if (nval > 90 || nval < 0) {
            return;
        }

        const newShares = { ...playerShares };

        newShares[year] = {
            firstPlayer: nval,
            secondPlayer: 100 - nval,
        };

        setPlayerShares(newShares);
    };

    const getInvestment = () => {
        if (
            !gameInfo.g4Data.team ||
            !gameInfo.players ||
            !teamMachines ||
            investmentFinished
        ) {
            return;
        }

        const team = gameInfo.g4Data.team;
        let initialAssets: Record<string, number> = {};
        let machineData: {
            type: string;
            number: string;
            owner: string | null;
            timesUsed: number;
        }[] = [];
        let investments: Record<
            string,
            {
                share: number;
                firstMachine: {
                    owner: string | null;
                    using: boolean;
                };
                secondMachine: {
                    owner: string | null;
                    using: boolean;
                };
            }
        > = {};
        let totalMachineUse = 0;
        let endedYear: YF['year'] | null = null;
        let takenNoWork = false;

        const firstMachineOwner = teamMachines[0].owner;
        const secondMachineOwner = teamMachines[1].owner;

        team.forEach((teammate) => {
            if (!gameInfo.players) {
                return;
            }

            const teammateInfo = gameInfo.players?.find(
                (p) => p._id === teammate
            );
            if (!teammateInfo) {
                return;
            }

            initialAssets[teammate] = teammateInfo.assets;
        });

        teamMachines.forEach((machine) => {
            const machineObject = {
                type: machine.type,
                number: machine.number,
                owner: machine.owner,
                timesUsed: machine.timesUsed,
            };

            machineData = [...machineData, machineObject];
        });

        for (let i = 0; i < yearFormat.length; i++) {
            const year = yearFormat[i];

            if (endedYear) {
                continue;
            }

            let yearFinished = false;

            const nextYear = nextGameYear(year);
            if (
                nextYear !== 'yearTwo' &&
                nextYear !== 'yearThree' &&
                nextYear !== 'yearFour' &&
                nextYear !== 'yearFive' &&
                nextYear !== 'yearSix' &&
                nextYear !== 'yearSeven' &&
                nextYear !== 'yearEight' &&
                nextYear !== 'yearNine' &&
                nextYear !== 'yearTen'
            ) {
                continue;
            }

            const yearTeamWork = teamwork[year];
            const yearNoWork = noWork[year];
            const playerShare = playerShares[year].firstPlayer;
            const share = playerShare / 100;
            const usingMachines = machineWork[year];

            if (yearTeamWork && yearNoWork === false) {
                if (
                    (usingMachines.firstMachine &&
                        !usingMachines.secondMachine) ||
                    (!usingMachines.firstMachine && usingMachines.secondMachine)
                ) {
                    yearFinished = true;
                }
            } else if (yearTeamWork === false && yearNoWork === false) {
                if (usingMachines.firstMachine && usingMachines.secondMachine) {
                    yearFinished = true;
                }
            }

            if (yearNoWork && yearTeamWork !== null) {
                yearFinished = true;
                takenNoWork = true;
                setNoWorkTaken(true);
            }

            if (!yearFinished) {
                endedYear = year;
            }

            if (usingMachines.firstMachine && usingMachines.secondMachine) {
                totalMachineUse += 2;
            } else if (
                usingMachines.firstMachine ||
                usingMachines.secondMachine
            ) {
                totalMachineUse++;
            }

            const newInvestment = {
                share: share,
                firstMachine: {
                    owner: firstMachineOwner,
                    using: usingMachines.firstMachine,
                },
                secondMachine: {
                    owner: secondMachineOwner,
                    using: usingMachines.secondMachine,
                },
            };

            investments[year] = newInvestment;

            if (totalMachineUse >= 8) {
                if (!noWorkTaken && nextYear !== 'yearTen' && !takenNoWork) {
                    const newNoWork = { ...noWork };
                    const newTeamWork = { ...teamwork };

                    newNoWork[nextYear] = true;
                    newTeamWork[nextYear] = true;

                    setNoWork(newNoWork);
                    setTeamwork(newTeamWork);
                    setNoWorkTaken(true);

                    takenNoWork = true;

                    const newAutoInvestment = {
                        share: DEFAULT_SHARE / 100,
                        firstMachine: {
                            owner: firstMachineOwner,
                            using: false,
                        },
                        secondMachine: {
                            owner: secondMachineOwner,
                            using: false,
                        },
                    };

                    investments[nextYear] = { ...newAutoInvestment };

                    setInvestmentFinished(true);
                }

                endedYear = year;

                const g4Investment = {
                    investment: {
                        team: team,
                        initialAssets: initialAssets,
                        machineData: machineData,
                        investments: investments,
                    },
                };

                const stringifiedIv = JSON.stringify(g4Investment);

                dispatch(setG4Investment(stringifiedIv));

                dispatch(setG4InvestmentTest(stringifiedIv));
            }
        }

        if (totalMachineUse < 8) {
            const g4Investment = {
                investment: {
                    team: team,
                    initialAssets: initialAssets,
                    machineData: machineData,
                    investments: investments,
                },
            };

            const stringifiedIv = JSON.stringify(g4Investment);

            dispatch(setG4InvestmentTest(stringifiedIv));
        }
    };

    useEffect(() => {
        getInvestment();
    }, [
        gameInfo.players,
        teamMachines,
        playerShares,
        machineWork,
        teamwork,
        noWork,
    ]);

    const prevMachinesCheck = (
        year:
            | 'yearOne'
            | 'yearTwo'
            | 'yearThree'
            | 'yearFour'
            | 'yearFive'
            | 'yearSix'
            | 'yearSeven'
            | 'yearEight'
            | 'yearNine'
    ) => {
        const prevYear = prevGameYearString(year);
        if (
            prevYear !== 'yearOne' &&
            prevYear !== 'yearTwo' &&
            prevYear !== 'yearThree' &&
            prevYear !== 'yearFour' &&
            prevYear !== 'yearFive' &&
            prevYear !== 'yearSix' &&
            prevYear !== 'yearSeven' &&
            prevYear !== 'yearEight' &&
            prevYear !== 'yearNine'
        ) {
            return false;
        }

        const prevWorkData = machineWork[prevYear];
        const usedData = machinesUsedData[prevYear];
        const prevTeamWork = teamwork[prevYear];
        const prevNoWork = noWork[prevYear];

        if (!teamMachines) {
            return false;
        }

        if (prevNoWork) {
            return true;
        }

        if (year === 'yearOne') {
        } else {
            if (prevTeamWork === false) {
                if (!prevWorkData.firstMachine && !prevWorkData.secondMachine) {
                    return false;
                }
            } else {
                if (!prevWorkData.firstMachine && !prevWorkData.secondMachine) {
                    return false;
                }
            }
        }

        if (
            usedData.firstMachine >= teamMachines[0].timesUsed &&
            usedData.secondMachine >= teamMachines[1].timesUsed
        ) {
            return false;
        }

        return true;
    };

    const cantBeTeamwork = (
        year:
            | 'yearOne'
            | 'yearTwo'
            | 'yearThree'
            | 'yearFour'
            | 'yearFive'
            | 'yearSix'
            | 'yearSeven'
            | 'yearEight'
            | 'yearNine'
    ) => {
        const prevYear = prevGameYearString(year);
        if (
            prevYear !== 'yearOne' &&
            prevYear !== 'yearTwo' &&
            prevYear !== 'yearThree' &&
            prevYear !== 'yearFour' &&
            prevYear !== 'yearFive' &&
            prevYear !== 'yearSix' &&
            prevYear !== 'yearSeven' &&
            prevYear !== 'yearEight' &&
            prevYear !== 'yearNine'
        ) {
            return false;
        }

        const usedData = machinesUsedData[prevYear];

        if (!teamMachines) {
            return false;
        }

        if (
            usedData.firstMachine >= teamMachines[0].timesUsed ||
            usedData.secondMachine >= teamMachines[1].timesUsed
        ) {
            return false;
        }

        if (notifSent['0'] || notifSent['1']) {
            return false;
        }

        return true;
    };

    const checkMachines = (
        year:
            | 'yearOne'
            | 'yearTwo'
            | 'yearThree'
            | 'yearFour'
            | 'yearFive'
            | 'yearSix'
            | 'yearSeven'
            | 'yearEight'
            | 'yearNine'
    ) => {
        const nowTeamwork = teamwork[year];
        const nowNoWork = noWork[year];

        if (
            nowTeamwork === null ||
            nowNoWork === null ||
            nowTeamwork === false ||
            nowNoWork === true
        ) {
            return false;
        }

        return true;
    };

    const validPress = (
        year:
            | 'yearOne'
            | 'yearTwo'
            | 'yearThree'
            | 'yearFour'
            | 'yearFive'
            | 'yearSix'
            | 'yearSeven'
            | 'yearEight'
            | 'yearNine'
    ) => {
        const prevYear = prevGameYearString(year);

        let prevYearTeamwork = null;
        let prevYearNoWork = null;
        let prevYearShare = 0;

        if (prevYear) {
            if (year === 'yearOne') {
                prevYearTeamwork = true;
                prevYearNoWork = true;
                prevYearShare = DEFAULT_SHARE;
            } else if (
                prevYear !== 'yearOne' &&
                prevYear !== 'yearTwo' &&
                prevYear !== 'yearThree' &&
                prevYear !== 'yearFour' &&
                prevYear !== 'yearFive' &&
                prevYear !== 'yearSix' &&
                prevYear !== 'yearSeven' &&
                prevYear !== 'yearEight' &&
                prevYear !== 'yearNine'
            ) {
                return false;
            } else {
                prevYearShare = playerShares[prevYear].firstPlayer;
                prevYearTeamwork = teamwork[prevYear];
                prevYearNoWork = noWork[prevYear];
            }
        }

        if (prevYearShare <= 0 && !prevYearNoWork) {
            dispatch(
                setNotification({
                    type: 'error',
                    message: languageInfo.language['g4-screens']['non-zero'],
                })
            );

            return false;
        }

        if (prevYearNoWork === null || prevYearTeamwork === null) {
            return false;
        }

        const prevMachinesSelected = prevMachinesCheck(year);
        if (!prevMachinesSelected) {
            return false;
        }

        return true;
    };

    const TeamworkButton: React.FC<{
        isTeamwork: boolean;
        txt: string;
        year: YF['year'];
    }> = ({ txt, year, isTeamwork }) => {
        const [selected, setSelected] = useState(false);

        useEffect(() => {
            if (isTeamwork) {
                if (
                    teamwork[year] === true &&
                    txt ===
                        languageInfo.language['generic-game-screen'][
                            'finish-game-dialogue'
                        ].yes
                ) {
                    setSelected(true);
                } else if (
                    teamwork[year] === false &&
                    txt ===
                        languageInfo.language['generic-game-screen'][
                            'finish-game-dialogue'
                        ].no
                ) {
                    setSelected(true);
                } else {
                    setSelected(false);
                }
            } else {
                if (
                    noWork[year] === true &&
                    txt ===
                        languageInfo.language['generic-game-screen'][
                            'finish-game-dialogue'
                        ].yes
                ) {
                    setSelected(true);
                } else if (
                    noWork[year] === false &&
                    txt ===
                        languageInfo.language['generic-game-screen'][
                            'finish-game-dialogue'
                        ].no
                ) {
                    setSelected(true);
                } else {
                    setSelected(false);
                }
            }
        }, [isTeamwork, noWork, teamwork, year, txt]);

        const selectBtn = () => {
            if (isTeamwork) {
                const valid = validPress(year);
                if (!valid) {
                    return;
                }

                if (
                    txt ===
                    languageInfo.language['generic-game-screen'][
                        'finish-game-dialogue'
                    ].no
                ) {
                    const cantBTmw = cantBeTeamwork(year);

                    if (!cantBTmw) {
                        return;
                    }

                    let newMachineUse = { ...machineWork };
                    newMachineUse[year] = {
                        firstMachine: true,
                        secondMachine: true,
                    };
                    setMachineWork(newMachineUse);

                    let newNowork = { ...noWork };
                    newNowork[year] = false;

                    setNoWork(newNowork);
                } else {
                    const newPlayerShares = { ...playerShares };

                    newPlayerShares[year] = {
                        firstPlayer: DEFAULT_SHARE,
                        secondPlayer: 100 - DEFAULT_SHARE,
                    };

                    if (
                        machineWork[year].firstMachine &&
                        machineWork[year].secondMachine
                    ) {
                        setNotifSent({});
                    }

                    let newMachineUse = { ...machineWork };
                    newMachineUse[year] = {
                        firstMachine: false,
                        secondMachine: false,
                    };
                    setMachineWork(newMachineUse);

                    setPlayerShares(newPlayerShares);
                }

                const newTeamwork = { ...teamwork };
                newTeamwork[year] =
                    txt ===
                    languageInfo.language['generic-game-screen'][
                        'finish-game-dialogue'
                    ].yes;

                setTeamwork(newTeamwork);
            } else {
                if (year === 'yearOne') {
                    return;
                }

                const valid = validPress(year);
                if (!valid) {
                    return;
                }

                const newNoWork = { ...noWork };
                const newTeamWork = { ...teamwork };

                if (
                    txt ===
                    languageInfo.language['generic-game-screen'][
                        'finish-game-dialogue'
                    ].yes
                ) {
                    let aviable = true;

                    for (const newNoWorkKey in newNoWork) {
                        if (
                            newNoWorkKey !== 'yearOne' &&
                            newNoWorkKey !== 'yearTwo' &&
                            newNoWorkKey !== 'yearThree' &&
                            newNoWorkKey !== 'yearFour' &&
                            newNoWorkKey !== 'yearFive' &&
                            newNoWorkKey !== 'yearSix' &&
                            newNoWorkKey !== 'yearSeven' &&
                            newNoWorkKey !== 'yearEight' &&
                            newNoWorkKey !== 'yearNine'
                        ) {
                            continue;
                        }

                        if (newNoWork[newNoWorkKey] === true) {
                            aviable = false;
                        }
                    }

                    if (!aviable) {
                        return;
                    }

                    if (teamwork[year] === null) {
                        newTeamWork[year] = true;
                    }

                    newNoWork[year] = true;
                } else {
                    newNoWork[year] = false;
                }

                setNoWork({
                    ...newNoWork,
                });
                setTeamwork({ ...newTeamWork });
            }

            const newMachineWork = { ...machineWork };
            newMachineWork[year] = {
                firstMachine: false,
                secondMachine: false,
            };

            setMachineWork(newMachineWork);
        };

        return (
            <button
                disabled={allUsed}
                className={`rounded-sm ${
                    selected
                        ? 'bg-BGdark_lightblue-lighter text-white'
                        : 'bg-BGlight text-black'
                } ${allUsed ? 'cursor-default opacity-75' : ''} mx-2 h-7 w-20`}
                onClick={() => selectBtn()}
            >
                {txt}
            </button>
        );
    };

    const MachineButton: React.FC<{
        machine: MachineInterface;
        yearIndex: number;
        machineIndex: number;
        yearKey: YF['year'];
    }> = ({ machine, yearIndex, machineIndex, yearKey }) => {
        const [selected, setSelected] = useState(false);
        const [disabled, setDisabled] = useState(false);

        useEffect(() => {
            let machineType: 'firstMachine' | 'secondMachine' = 'firstMachine';
            if (machineIndex === 1) {
                machineType = 'secondMachine';
            }

            let timesSelected = 0;

            for (const workKey in machineWork) {
                if (
                    workKey !== 'yearOne' &&
                    workKey !== 'yearTwo' &&
                    workKey !== 'yearThree' &&
                    workKey !== 'yearFour' &&
                    workKey !== 'yearFive' &&
                    workKey !== 'yearSix' &&
                    workKey !== 'yearSeven' &&
                    workKey !== 'yearEight' &&
                    workKey !== 'yearNine'
                ) {
                    continue;
                }

                let machineWorkData = machineWork[workKey];
                let machineActive = machineWorkData[machineType];

                if (machineActive) {
                    timesSelected += 1;
                }
            }

            if (timesSelected >= machine.timesUsed) {
                setDisabled(true);
            }
        }, [machineWork, machineIndex]);

        useEffect(() => {
            let machineType: 'firstMachine' | 'secondMachine' = 'firstMachine';
            if (machineIndex === 1) {
                machineType = 'secondMachine';
            }

            if (
                machineWork[yearKey].firstMachine &&
                machineType === 'firstMachine'
            ) {
                setSelected(true);
            } else if (
                machineWork[yearKey].secondMachine &&
                machineType === 'secondMachine'
            ) {
                setSelected(true);
            } else if (machineWork[yearKey][machineType] === true) {
                setSelected(true);
            }
        }, [machineWork]);

        const selectMachine = () => {
            const aviable = checkMachines(yearKey);
            if (!aviable) {
                return;
            }

            let machineType: 'firstMachine' | 'secondMachine' = 'firstMachine';
            let otherMachineType: 'firstMachine' | 'secondMachine' =
                'secondMachine';
            if (machineIndex === 1) {
                otherMachineType = 'firstMachine';
                machineType = 'secondMachine';
            }

            const newWorkData = { ...machineWork };

            const otherSelected = newWorkData[yearKey][otherMachineType];

            if (selected) {
                newWorkData[yearKey][machineType] = false;
            } else if (!disabled) {
                if (teamwork[yearKey] && otherSelected) {
                    return;
                }

                newWorkData[yearKey][machineType] = true;
            }

            setMachineWork({ ...newWorkData });

            let timesSelected = 0;

            for (const workKey in machineWork) {
                if (
                    workKey !== 'yearOne' &&
                    workKey !== 'yearTwo' &&
                    workKey !== 'yearThree' &&
                    workKey !== 'yearFour' &&
                    workKey !== 'yearFive' &&
                    workKey !== 'yearSix' &&
                    workKey !== 'yearSeven' &&
                    workKey !== 'yearEight' &&
                    workKey !== 'yearNine'
                ) {
                    return;
                }

                let machineWorkData = machineWork[workKey];
                let machineActive = machineWorkData[machineType];

                if (machineActive) {
                    timesSelected += 1;
                }
            }

            if (timesSelected >= machine.timesUsed) {
                const newSent = { ...notifSent };
                newSent[machineIndex] = true;

                setNotifSent(newSent);

                let message = '';
                let bothUsed = 0;

                for (const sentKey in newSent) {
                    if (newSent[sentKey]) {
                        bothUsed += 1;
                    }
                }

                if (bothUsed === 2) {
                    message =
                        languageInfo.language['g4-screens'].notification[
                            'unemployment-only'
                        ];
                } else {
                    message = languageInfo.language['g4-screens'].notification[
                        'not-usable'
                    ].replace('[]', machine.number);
                }

                dispatch(
                    setNotification({ type: 'success', message: message })
                );
                setDisabled(true);
            }
        };

        if (noWork[yearKey]) {
            return null;
        }

        return (
            <button
                onClick={() => selectMachine()}
                disabled={allUsed}
                className={`rounded-sm ${
                    selected
                        ? 'bg-BGdark_lightblue-lighter text-white'
                        : 'bg-BGlight text-black'
                } ${allUsed ? 'cursor-default opacity-75' : ''} mx-2 h-7 w-10`}
            >
                {machine.number}
            </button>
        );
    };

    const PowerCalculator: React.FC<{
        yearKey: YF['year'];
    }> = ({ yearKey }) => {
        const [power, setPower] = useState<string | number | null>(null);

        useEffect(() => {
            const { incomeBase, bothWork } = getPowerIncomeBase(yearKey);

            setPower(incomeBase);
        }, [machineWork, machinesUsedData, teamMachines]);

        if (!power && power !== 0) {
            return null;
        }

        return <p className="">{power}</p>;
    };

    const PlayerShareInput: React.FC<{
        teammate: PlayerInterface;
        index: number;
        year: YF['year'];
    }> = ({ teammate, index, year }) => {
        const [disabled, setDisabled] = useState(false);
        const [lastPlayerShare, setLastPlayerShare] = useState(70);
        const [shown, setShown] = useState(true);

        useEffect(() => {
            if (teamwork[year] === false) {
                const newPlayerShares = playerShares;

                newPlayerShares[year] = {
                    firstPlayer: 40,
                    secondPlayer: 40,
                };
                setLastPlayerShare(0);
                setDisabled(true);
            }

            if (noWork[year]) {
                const newPlayerShares = playerShares;

                newPlayerShares[year] = {
                    firstPlayer: 0,
                    secondPlayer: 0,
                };
                setLastPlayerShare(0);
                setDisabled(true);
                setShown(false);
            }
        }, [teamwork, noWork]);

        const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            const nval = Number(value);

            if (nval > 90 || nval < 0) {
                return;
            }

            const newShares = { ...playerShares };

            newShares[year] = {
                firstPlayer: nval,
                secondPlayer: 100 - nval,
            };

            setPlayerShares(newShares);
        };

        if (!shown) {
            return null;
        } else if (index === 0) {
            return (
                <div className="h-8">
                    <input
                        type="number"
                        className={`border-2 border-BGdark-lighter w-20 ${
                            allUsed ? 'cursor-default opacity-75' : ''
                        }`}
                        value={playerShares[year].firstPlayer}
                        onChange={(e) => changeInput(e)}
                        disabled={disabled}
                    />
                </div>
            );
        } else if (index === 1) {
            return (
                <div className="h-8">
                    <p>{playerShares[year].secondPlayer}%</p>
                </div>
            );
        } else if (index === 2) {
            return (
                <div className="flex items-center justify-center h-8">
                    <img
                        src="/icons/arrow-left.png"
                        alt="arrow left"
                        className="h-3 mr-2"
                    />

                    <p>{lastPlayerShare}%</p>
                </div>
            );
        }

        return null;
    };

    const PecentageToEur: React.FC<{ year: YF['year'] }> = ({ year }) => {
        const [percentageVal, setPercentageVal] = useState<number | null>(null);

        useEffect(() => {
            const { incomeBase, bothWork } = getPowerIncomeBase(year);
            const yearPlayerShares = playerShares[year];

            if (typeof incomeBase === 'number') {
                const playerReceive =
                    (incomeBase * yearPlayerShares.firstPlayer) / 100;

                setPercentageVal(playerReceive);
            } else if (
                incomeBase === languageInfo.language['g4-screens'].own &&
                typeof bothWork === 'number'
            ) {
                const playerReceive =
                    (bothWork * yearPlayerShares.firstPlayer) / 100;

                setPercentageVal(playerReceive);
            }
        }, [machineWork, machinesUsedData, teamMachines]);

        if (typeof percentageVal !== 'number') {
            return null;
        }

        return <p className="ml-1">({percentageVal}€)</p>;
    };

    if (gameInfo.g4Data.investmentReturns) {
        return <G4CalculatedReturns />;
    }

    return (
        <div
            className={`flex w-full h-full justify-center items-center flex-col ${
                gameInfo.gameInvestments
                    ?.filter((iv) => iv.year === gameInfo.activeGame?.year)
                    .find((iv) => iv.player_id === gameInfo.playerInfo?._id)
                    ? 'pointer-events-none'
                    : ''
            }`}
        >
            {yearFormat.map((year, i) => {
                if (i === 0) {
                    return (
                        <div
                            key={i}
                            className="flex w-full justify-center items-center flex-col"
                        >
                            <div className="flex justify-center items-center">
                                <div className="h-8 w-16 flex items-center justify-center" />

                                <div className="h-8 w-40 flex items-center justify-center">
                                    <h3>
                                        {
                                            languageInfo.language['g4-screens']
                                                .teamwork
                                        }
                                    </h3>
                                </div>

                                <div className="h-8 w-40 flex items-center justify-center">
                                    <h3>
                                        {
                                            languageInfo.language['g4-screens']
                                                .unemployed
                                        }
                                    </h3>
                                </div>

                                <div className="h-8 flex items-center justify-center w-28">
                                    <h3>
                                        {
                                            languageInfo.language['g4-screens']
                                                .machines
                                        }
                                    </h3>
                                </div>

                                <div className="h-8 flex items-center justify-center w-32">
                                    <h3>
                                        {
                                            languageInfo.language['g4-screens']
                                                .power
                                        }
                                    </h3>
                                </div>

                                <div className="flex h-full items-center justify-center mx-2 w-60">
                                    {teamPlayers?.map((teammate, j) => {
                                        return (
                                            <div
                                                key={j}
                                                className="flex h-full items-center justify-center mx-2"
                                            >
                                                <div
                                                    className={`h-16 flex items-center justify-center ${
                                                        j === 0
                                                            ? 'w-36'
                                                            : 'w-16'
                                                    }`}
                                                >
                                                    <p>
                                                        {getPlayerName(
                                                            teammate.name
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-center items-center">
                                <div className="h-8 w-16 flex items-center justify-center">
                                    <p>
                                        {languageInfo.language['g2-screens'][
                                            'history-year'
                                        ].replace('[]', String(i + 1))}
                                    </p>
                                </div>

                                <div className="h-8 w-40 flex items-center justify-center">
                                    <TeamworkButton
                                        isTeamwork={true}
                                        year={year}
                                        txt={
                                            languageInfo.language[
                                                'generic-game-screen'
                                            ]['finish-game-dialogue'].yes
                                        }
                                    />
                                    <TeamworkButton
                                        isTeamwork={true}
                                        year={year}
                                        txt={
                                            languageInfo.language[
                                                'generic-game-screen'
                                            ]['finish-game-dialogue'].no
                                        }
                                    />
                                </div>

                                <div className="h-8 w-40 flex items-center justify-center">
                                    <TeamworkButton
                                        isTeamwork={false}
                                        year={year}
                                        txt={
                                            languageInfo.language[
                                                'generic-game-screen'
                                            ]['finish-game-dialogue'].yes
                                        }
                                    />
                                    <TeamworkButton
                                        isTeamwork={false}
                                        year={year}
                                        txt={
                                            languageInfo.language[
                                                'generic-game-screen'
                                            ]['finish-game-dialogue'].no
                                        }
                                    />
                                </div>

                                <div className="h-8 flex items-center justify-center w-28">
                                    {teamMachines?.map((machine, j) => {
                                        return (
                                            <MachineButton
                                                key={j}
                                                machine={machine}
                                                yearIndex={i}
                                                machineIndex={j}
                                                yearKey={year}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="h-8 flex items-center justify-center w-32">
                                    <PowerCalculator yearKey={year} />
                                </div>

                                <div className="flex h-full items-center justify-center mx-2 w-60">
                                    {teamPlayers?.map((teammate, j) => {
                                        return (
                                            <div
                                                key={j}
                                                className="flex h-full items-center justify-center mx-2"
                                            >
                                                <div
                                                    className={`h-8 flex items-center ${
                                                        j === 0
                                                            ? 'w-36 pl-4 justify-start'
                                                            : 'w-16 justify-center'
                                                    }`}
                                                >
                                                    {j === 0 ? (
                                                        <div className="flex items-center justify-center">
                                                            <input
                                                                type="number"
                                                                className={`border-2 border-BGdark-lighter w-10 px-1 text-center ${
                                                                    allUsed
                                                                        ? 'cursor-default opacity-75'
                                                                        : ''
                                                                }`}
                                                                value={
                                                                    playerShares[
                                                                        year
                                                                    ]
                                                                        .firstPlayer
                                                                }
                                                                onChange={(e) =>
                                                                    changeInput(
                                                                        e,
                                                                        year
                                                                    )
                                                                }
                                                                disabled={
                                                                    allUsed
                                                                        ? true
                                                                        : teamwork[
                                                                              year
                                                                          ] ===
                                                                              false ||
                                                                          noWork[
                                                                              year
                                                                          ] ===
                                                                              true
                                                                        ? true
                                                                        : false
                                                                }
                                                            />

                                                            <p className="ml-1">
                                                                %
                                                            </p>

                                                            <PecentageToEur
                                                                year={year}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <PlayerShareInput
                                                            teammate={teammate}
                                                            index={j}
                                                            year={year}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="flex justify-center items-center" key={i}>
                        <div className="h-8 w-16 flex items-center justify-center">
                            <p>
                                {' '}
                                {languageInfo.language['g2-screens'][
                                    'history-year'
                                ].replace('[]', String(i + 1))}
                            </p>
                        </div>

                        <div className="h-8 w-40 flex items-center justify-center">
                            <TeamworkButton
                                isTeamwork={true}
                                year={year}
                                txt={
                                    languageInfo.language[
                                        'generic-game-screen'
                                    ]['finish-game-dialogue'].yes
                                }
                            />
                            <TeamworkButton
                                isTeamwork={true}
                                year={year}
                                txt={
                                    languageInfo.language[
                                        'generic-game-screen'
                                    ]['finish-game-dialogue'].no
                                }
                            />
                        </div>

                        <div className="h-8 w-40 flex items-center justify-center">
                            <TeamworkButton
                                isTeamwork={false}
                                year={year}
                                txt={
                                    languageInfo.language[
                                        'generic-game-screen'
                                    ]['finish-game-dialogue'].yes
                                }
                            />
                            <TeamworkButton
                                isTeamwork={false}
                                year={year}
                                txt={
                                    languageInfo.language[
                                        'generic-game-screen'
                                    ]['finish-game-dialogue'].no
                                }
                            />
                        </div>

                        <div className="h-8 flex items-center justify-center w-28">
                            {teamMachines?.map((machine, j) => {
                                return (
                                    <MachineButton
                                        key={j}
                                        machine={machine}
                                        yearIndex={i}
                                        machineIndex={j}
                                        yearKey={year}
                                    />
                                );
                            })}
                        </div>

                        <div className="h-8 flex items-center justify-center w-32">
                            <PowerCalculator yearKey={year} />
                        </div>

                        <div className="flex h-full items-center justify-center mx-2 w-60">
                            {teamPlayers?.map((teammate, j) => {
                                return (
                                    <div
                                        key={j}
                                        className="flex h-full items-center justify-center mx-2"
                                    >
                                        <div
                                            className={`h-8 flex items-center  ${
                                                j === 0
                                                    ? 'w-36 pl-4 justify-start'
                                                    : 'w-16 justify-center'
                                            }`}
                                        >
                                            {j === 0 ? (
                                                <div className="flex items-center justify-center">
                                                    <input
                                                        type="number"
                                                        className={`border-2 border-BGdark-lighter w-10 px-1 text-center ${
                                                            allUsed
                                                                ? 'cursor-default opacity-75'
                                                                : ''
                                                        }`}
                                                        value={
                                                            playerShares[year]
                                                                .firstPlayer
                                                        }
                                                        onChange={(e) =>
                                                            changeInput(e, year)
                                                        }
                                                        disabled={
                                                            allUsed
                                                                ? true
                                                                : teamwork[
                                                                      year
                                                                  ] === false ||
                                                                  noWork[
                                                                      year
                                                                  ] === true
                                                                ? true
                                                                : false
                                                        }
                                                    />

                                                    <p className="ml-1">%</p>

                                                    <PecentageToEur
                                                        year={year}
                                                    />
                                                </div>
                                            ) : (
                                                <PlayerShareInput
                                                    teammate={teammate}
                                                    index={j}
                                                    year={year}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {allUsed && !invested ? (
                <button
                    className="mt-4 flex items-center justify-center"
                    disabled={invested}
                    onClick={resetState}
                >
                    <img
                        src="/icons/circular-arrow.png"
                        alt="reset icon"
                        className="h-3"
                    />
                    <p className="ml-1 text-xs">
                        {languageInfo.language['generic-game-screen'].reset}
                    </p>
                </button>
            ) : (
                false
            )}
        </div>
    );
}

export const CommingYears: React.FC<{ maxYear?: number | null }> = ({
    maxYear,
}) => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="flex flex-col h-full items-center justify-center mx-2">
            <div className="h-16 flex items-center justify-center"></div>

            <div className="flex flex-col items-center justify-center">
                {yearFormat.map((_year: string, i) => {
                    if (maxYear && i >= maxYear) {
                        return null;
                    }

                    return (
                        <div
                            className="h-8 w-16 flex items-center justify-center"
                            key={i}
                        >
                            <p>
                                {languageInfo.language['g2-screens'][
                                    'history-year'
                                ].replace('[]', String(i + 1))}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default G4CaptainForm;
