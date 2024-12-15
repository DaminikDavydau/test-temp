import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { PlayerInterface } from '../../../types/player';
import { CommingYears, yearFormat } from './G4CaptainForm';
import { LanguageInfo, selectLanguage } from '../../../redux/slices/languageSlice';

function G4CalculatedReturns() {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);
    const gameInfo: GameInfo = useSelector(selectGame);

    const [teamPlayers, setTeamPlayers] = useState<PlayerInterface[] | null>(
        null
    );
    const [totalResult, setTotalResult] = useState(0);
    const [totalYears, setTotalYears] = useState<number | null>(null);

    useEffect(() => {
        if (!totalYears) {
            let yearCounter = 0;

            for (const _retrnKey in gameInfo.g4Data.investmentReturns) {
                yearCounter++;
            }

            setTotalYears(yearCounter);
        }
    }, [gameInfo.g4Data.investmentReturns, totalYears]);

    useEffect(() => {
        if (!teamPlayers && gameInfo.players && gameInfo.g4Data.team) {
            let players: PlayerInterface[] = [];

            gameInfo.g4Data.team.forEach((teammate) => {
                const teammateInfo = gameInfo.players?.find(
                    (p) => p._id === teammate
                );
                if (teammateInfo) {
                    players = [...players, teammateInfo];
                }
            });

            setTeamPlayers(players);
        }
    }, [teamPlayers, gameInfo.players, gameInfo.g4Data.team]);

    useEffect(() => {
        let machineExpenses = 0;
        let unemploymentIncome = 0;
        let machineIncomes = 0;
        let bankPercentages = 0;

        if (
            gameInfo.g4Data.teamMachines &&
            gameInfo.g4Data.teammateResult &&
            gameInfo.g4Data.investmentReturns &&
            gameInfo.g4Data.team &&
            totalYears
        ) {
            let isTeammateResult = false;

            if (gameInfo.g4Data.teammateResult !== 'team') {
                gameInfo.g4Data.team &&
                    gameInfo.g4Data.team.forEach((teammate) => {
                        if (teammate === gameInfo.g4Data.teammateResult) {
                            isTeammateResult = true;
                        }
                    });
            }

            if (isTeammateResult) {
                const teammateMachine = gameInfo.g4Data.teamMachines.find(
                    (m) => m.owner === gameInfo.g4Data.teammateResult
                );

                if (teammateMachine) {
                    machineExpenses = -Number(teammateMachine.soldFor);
                }

                yearFormat.forEach((year, i) => {
                    if (totalYears && i >= totalYears) {
                        return;
                    }

                    if (
                        gameInfo.g4Data?.investmentReturns &&
                        gameInfo.g4Data.teammateResult
                    ) {
                        unemploymentIncome += Math.floor(
                            gameInfo.g4Data?.investmentReturns[year][
                                gameInfo.g4Data.teammateResult
                            ].uneployment
                        );

                        machineIncomes += Math.floor(
                            gameInfo.g4Data?.investmentReturns[year][
                                gameInfo.g4Data.teammateResult
                            ].incomesFromMachine
                        );

                        bankPercentages += Math.floor(
                            gameInfo.g4Data?.investmentReturns[year][
                                gameInfo.g4Data.teammateResult
                            ].bankPercentages
                        );
                    }
                });

                const totalTotal =
                    machineExpenses +
                    unemploymentIncome +
                    machineIncomes +
                    bankPercentages;

                setTotalResult(totalTotal);
            } else {
                gameInfo.g4Data.team?.forEach((teammate) => {
                    if (!gameInfo.g4Data.teamMachines) {
                        return;
                    }

                    const teammateMachine = gameInfo.g4Data.teamMachines.find(
                        (m) => m.owner === teammate
                    );

                    if (teammateMachine) {
                        machineExpenses -= Number(teammateMachine.soldFor);
                    }

                    yearFormat.forEach((year, i) => {
                        if (totalYears && i >= totalYears) {
                            return;
                        }

                        if (gameInfo.g4Data?.investmentReturns && teammate) {
                            unemploymentIncome += Math.floor(
                                gameInfo.g4Data?.investmentReturns[year][
                                    teammate
                                ].uneployment
                            );

                            machineIncomes += Math.floor(
                                gameInfo.g4Data?.investmentReturns[year][
                                    teammate
                                ].incomesFromMachine
                            );

                            bankPercentages += Math.floor(
                                gameInfo.g4Data?.investmentReturns[year][
                                    teammate
                                ].bankPercentages
                            );
                        }
                    });

                    const totalTotal =
                        machineExpenses +
                        unemploymentIncome +
                        machineIncomes +
                        bankPercentages;

                    setTotalResult(totalTotal);
                });
            }
        }
    }, [
        gameInfo.g4Data.teamMachines,
        gameInfo.g4Data.teammateResult,
        gameInfo.g4Data.investmentReturns,
        gameInfo.g4Data.team,
        totalYears,
    ]);

    if (!gameInfo.g4Data.teammateResult || !gameInfo.g4Data.investmentReturns) {
        return null;
    }

    const DataDisplay: React.FC<{
        dataType:
            | 'MachineExpenses'
            | 'UnemploymentIncomes'
            | 'MachineIncomes'
            | 'BankPercentages'
            | 'YearTotal';
        year: string;
        cash: boolean;
    }> = ({ dataType, year, cash }) => {
        const [data, setData] = useState<number | null>(null);

        useEffect(() => {
            if (typeof data !== 'number' && totalYears) {
                let result: number | null = null;
                let isTeammateResult = false;
                let yearTotal = 0;

                if (!gameInfo.g4Data.team) {
                    return;
                }

                if (gameInfo.g4Data.teammateResult !== 'team') {
                    gameInfo.g4Data.team &&
                        gameInfo.g4Data.team.forEach((teammate) => {
                            if (teammate === gameInfo.g4Data.teammateResult) {
                                isTeammateResult = true;
                            }
                        });
                }

                if (isTeammateResult) {
                    if (
                        dataType === 'MachineExpenses' &&
                        gameInfo.g4Data.teamMachines &&
                        gameInfo.g4Data.teammateResult
                    ) {
                        const teammateMachine =
                            gameInfo.g4Data.teamMachines.find(
                                (m) =>
                                    m.owner === gameInfo.g4Data.teammateResult
                            );

                        if (teammateMachine) {
                            result = -Number(teammateMachine.soldFor);
                        } else {
                            result = 0;
                        }
                    } else if (
                        dataType === 'UnemploymentIncomes' &&
                        gameInfo.g4Data.investmentReturns &&
                        gameInfo.g4Data.teammateResult
                    ) {
                        result = Math.floor(
                            gameInfo.g4Data?.investmentReturns[year][
                                gameInfo.g4Data.teammateResult
                            ].uneployment
                        );
                    } else if (
                        dataType === 'MachineIncomes' &&
                        gameInfo.g4Data.investmentReturns &&
                        gameInfo.g4Data.teammateResult
                    ) {
                        result = Math.floor(
                            gameInfo.g4Data?.investmentReturns[year][
                                gameInfo.g4Data.teammateResult
                            ].incomesFromMachine
                        );
                    } else if (
                        dataType === 'BankPercentages' &&
                        gameInfo.g4Data.investmentReturns &&
                        gameInfo.g4Data.teammateResult
                    ) {
                        result = Math.floor(
                            gameInfo.g4Data?.investmentReturns[year][
                                gameInfo.g4Data.teammateResult
                            ].bankPercentages
                        );
                    } else if (dataType === 'YearTotal') {
                        if (
                            gameInfo.g4Data.teamMachines &&
                            gameInfo.g4Data.teammateResult &&
                            year === 'yearOne'
                        ) {
                            const teammateMachine =
                                gameInfo.g4Data.teamMachines.find(
                                    (m) =>
                                        m.owner ===
                                        gameInfo.g4Data.teammateResult
                                );

                            if (teammateMachine) {
                                yearTotal -= Number(teammateMachine.soldFor);
                            } else {
                                yearTotal += 0;
                            }
                        }
                        if (
                            gameInfo.g4Data.investmentReturns &&
                            gameInfo.g4Data.teammateResult
                        ) {
                            yearTotal += Math.floor(
                                gameInfo.g4Data?.investmentReturns[year][
                                    gameInfo.g4Data.teammateResult
                                ].uneployment
                            );
                        }
                        if (
                            gameInfo.g4Data.investmentReturns &&
                            gameInfo.g4Data.teammateResult
                        ) {
                            yearTotal += Math.floor(
                                gameInfo.g4Data?.investmentReturns[year][
                                    gameInfo.g4Data.teammateResult
                                ].incomesFromMachine
                            );
                        }
                        if (
                            gameInfo.g4Data.investmentReturns &&
                            gameInfo.g4Data.teammateResult
                        ) {
                            yearTotal += Math.floor(
                                gameInfo.g4Data?.investmentReturns[year][
                                    gameInfo.g4Data.teammateResult
                                ].bankPercentages
                            );
                        }
                    }
                } else {
                    gameInfo.g4Data.team?.forEach((teammate) => {
                        if (
                            dataType === 'MachineExpenses' &&
                            gameInfo.g4Data.teamMachines &&
                            teammate
                        ) {
                            const teammateMachine =
                                gameInfo.g4Data.teamMachines.find(
                                    (m) => m.owner === teammate
                                );

                            if (teammateMachine) {
                                result =
                                    Number(result) -
                                    Number(teammateMachine.soldFor);
                            } else {
                                result = Number(result);
                            }
                        } else if (
                            dataType === 'UnemploymentIncomes' &&
                            gameInfo.g4Data.investmentReturns &&
                            teammate
                        ) {
                            result =
                                Number(result) +
                                Math.floor(
                                    gameInfo.g4Data?.investmentReturns[year][
                                        teammate
                                    ].uneployment
                                );
                        } else if (
                            dataType === 'MachineIncomes' &&
                            gameInfo.g4Data.investmentReturns &&
                            teammate
                        ) {
                            result =
                                Number(result) +
                                Math.floor(
                                    gameInfo.g4Data?.investmentReturns[year][
                                        teammate
                                    ].incomesFromMachine
                                );
                        } else if (
                            dataType === 'BankPercentages' &&
                            gameInfo.g4Data.investmentReturns &&
                            teammate
                        ) {
                            result =
                                Number(result) +
                                Math.floor(
                                    gameInfo.g4Data?.investmentReturns[year][
                                        teammate
                                    ].bankPercentages
                                );
                        } else if (dataType === 'YearTotal') {
                            if (
                                gameInfo.g4Data.teamMachines &&
                                teammate &&
                                year === 'yearOne'
                            ) {
                                const teammateMachine =
                                    gameInfo.g4Data.teamMachines.find(
                                        (m) => m.owner === teammate
                                    );

                                if (teammateMachine) {
                                    yearTotal -= Number(
                                        teammateMachine.soldFor
                                    );
                                }
                            }
                            if (gameInfo.g4Data.investmentReturns && teammate) {
                                yearTotal += Math.floor(
                                    gameInfo.g4Data?.investmentReturns[year][
                                        teammate
                                    ].uneployment
                                );
                            }
                            if (gameInfo.g4Data.investmentReturns && teammate) {
                                yearTotal += Math.floor(
                                    gameInfo.g4Data?.investmentReturns[year][
                                        teammate
                                    ].incomesFromMachine
                                );
                            }
                            if (gameInfo.g4Data.investmentReturns && teammate) {
                                yearTotal += Math.floor(
                                    gameInfo.g4Data?.investmentReturns[year][
                                        teammate
                                    ].bankPercentages
                                );
                            }
                        }
                    });
                }

                if (dataType === 'YearTotal') {
                    setData(yearTotal);
                }

                if (typeof result === 'number') {
                    setData(result);
                }
            }
        }, [
            data,
            totalYears,
            totalResult,
            gameInfo.g4Data.team,
            gameInfo.g4Data.teamMachines,
            gameInfo.g4Data.teammateResult,
        ]);

        if (typeof data !== 'number') {
            return null;
        }

        return (
            <p className="text-center">
                {data > 0 ? '+' : ''}
                {data}
                {cash ? '€' : ''}
            </p>
        );
    };

    const MachineExpenses = () => {
        return (
            <div className="flex flex-col h-full items-center justify-center mx-2 w-28">
                <div className="h-16 flex items-center justify-center">
                    <p className="text-center">
                        {languageInfo.language['g4-screens']['machine-expenses']}
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {totalYears &&
                        yearFormat.map((year: string, i) => {
                            if (totalYears && i >= totalYears) {
                                return null;
                            }

                            return (
                                <div
                                    className="h-8 w-16 flex items-center justify-center"
                                    key={i}
                                >
                                    {i === 0 ? (
                                        <DataDisplay
                                            dataType="MachineExpenses"
                                            year={year}
                                            cash={true}
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    const UnemploymentIncomes = () => {
        return (
            <div className="flex flex-col h-full items-center justify-center mx-2 w-28">
                <div className="h-16 flex items-center justify-center">
                    <p className="text-center">
                        {languageInfo.language['g4-screens']['unemployment-income']}
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {totalYears &&
                        yearFormat.map((year: string, i) => {
                            if (totalYears && i >= totalYears) {
                                return null;
                            }

                            return (
                                <div
                                    className="h-8 w-16 flex items-center justify-center"
                                    key={i}
                                >
                                    <DataDisplay
                                        dataType="UnemploymentIncomes"
                                        year={year}
                                        cash={true}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    const MachineIncomes = () => {
        return (
            <div className="flex flex-col h-full items-center justify-center mx-2 w-28">
                <div className="h-16 flex items-center justify-center">
                    <p className="text-center">
                        {languageInfo.language['g4-screens']['production-income']}
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {totalYears &&
                        yearFormat.map((year: string, i) => {
                            if (totalYears && i >= totalYears) {
                                return null;
                            }

                            return (
                                <div
                                    className="h-8 w-16 flex items-center justify-center"
                                    key={i}
                                >
                                    <DataDisplay
                                        dataType="MachineIncomes"
                                        year={year}
                                        cash={true}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    const BankPercentages = () => {
        return (
            <div className="flex flex-col h-full items-center justify-center mx-2 w-28">
                <div className="h-16 flex items-center justify-center">
                    <p className="text-center">
                        {languageInfo.language['g4-screens']['bank-percent']}
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {totalYears &&
                        yearFormat.map((year: string, i) => {
                            if (totalYears && i >= totalYears) {
                                return null;
                            }

                            return (
                                <div
                                    className="h-8 w-16 flex items-center justify-center"
                                    key={i}
                                >
                                    <DataDisplay
                                        dataType="BankPercentages"
                                        year={year}
                                        cash={true}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    const YearTotal = () => {
        return (
            <div className="flex flex-col h-full items-center justify-center mx-2 w-28">
                <div className="h-16 flex items-center justify-center">
                    <p className="text-center">
                        {languageInfo.language['g4-screens']['year-total']}
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    {totalYears &&
                        yearFormat.map((year: string, i) => {
                            if (totalYears && i >= totalYears) {
                                return null;
                            }
                            return (
                                <div
                                    className="h-8 w-16 flex items-center justify-center"
                                    key={i}
                                >
                                    <DataDisplay
                                        dataType="YearTotal"
                                        year={year}
                                        cash={true}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };

    const TotalResults = () => {
        return (
            <div className="flex justify-end items-center border-t-2 border-BGdark-lighter mt-4 w-[600px] py-4">
                <div className="w-80 flex items-center justify-between">
                    <h3>{languageInfo.language['g4-screens']['end-result']}</h3>

                    <h3>{totalResult}€</h3>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="flex h-full justify-between items-center w-[700px]">
                <CommingYears maxYear={totalYears} />

                <MachineExpenses />

                <BankPercentages />

                <MachineIncomes />

                <UnemploymentIncomes />

                <YearTotal />
            </div>

            <TotalResults />
        </div>
    );
}

export default G4CalculatedReturns;
