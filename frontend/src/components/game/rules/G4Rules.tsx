import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import { TeammateInfo } from '../showcase/G4Showcase';
import { machineData } from './../../../data/ruleVariables';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

const yearData = [
    {
        amount: 1,
        type: 'year',
    },
    {
        amount: 2,
        type: 'year',
    },
    {
        amount: 3,
        type: 'year',
    },
    {
        amount: 4,
        type: 'year',
    },
    {
        amount: 5,
        type: 'year',
    },
    {
        amount: 6,
        type: 'year',
    },
    {
        amount: 7,
        type: 'year',
    },
];

const G4TeamRules = () => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const RuleContainer: React.FC<{ icon: string; txt: string }> = ({
        icon,
        txt,
    }) => {
        return (
            <div className="flex items-start justify-center my-2">
                <div className="w-20 h-10 flex items-center justify-start">
                    {icon ? (
                        <img src={icon} alt="rules" className="h-full" />
                    ) : null}
                </div>

                <div className="w-[500px]">
                    <p>{txt}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col w-full items-center justify-center">
            <h3 className="my-4">
                {languageInfo.language['g4-screens'].rules.title}
            </h3>

            <RuleContainer
                icon="/icons/deal.png"
                txt={languageInfo.language['g4-screens'].rules['1']}
            />

            <RuleContainer
                icon="/icons/brawl.png"
                txt={languageInfo.language['g4-screens'].rules['2']}
            />

            <RuleContainer
                icon="/icons/confused.png"
                txt={languageInfo.language['g4-screens'].rules['3']}
            />

            <RuleContainer
                icon="/icons/resort.png"
                txt={languageInfo.language['g4-screens'].rules['4']}
            />

            <RuleContainer
                icon=""
                txt={languageInfo.language['g4-screens'].rules['5']}
            />
        </div>
    );
};

function G4Rules() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const Table = () => {
        const TableColumn: React.FC<{
            data: { amount: number; type: string }[];
            machine: number;
        }> = ({ data, machine }) => {
            const TablePiece: React.FC<{
                amount: number;
                type: string;
                index: number;
                machine: number;
            }> = ({ amount, type, index, machine }) => {
                if (type === 'year') {
                    return (
                        <div className="h-8 w-full flex items-center justify-center">
                            <p>
                                {languageInfo.language['g2-screens'][
                                    'history-year'
                                ].replace('[]', String(amount))}
                            </p>
                        </div>
                    );
                }

                return (
                    <div
                        className={`h-8 w-full flex items-center justify-center border-2 border-BGdark-lighter ${
                            index > 0 ? 'border-t-0' : ''
                        } ${machine === 6 ? 'border-r-2' : 'border-r-0'}`}
                    >
                        {amount ? <p>{amount}€</p> : null}
                    </div>
                );
            };

            return (
                <div className="flex flex-col w-24 items-center justify-center">
                    <div className="w-full flex flex-col justify-center items-center h-8">
                        {machine ? (
                            <p>
                                {machine}.{' '}
                                {languageInfo.language[
                                    'g4-screens'
                                ].machine.toLowerCase()}
                            </p>
                        ) : null}
                    </div>

                    {data.map((dI, i) => {
                        return (
                            <TablePiece
                                key={i}
                                index={i}
                                machine={machine}
                                amount={dI.amount}
                                type={dI.type}
                            />
                        );
                    })}
                </div>
            );
        };

        return (
            <div className="flex justify-center items-center">
                <TableColumn machine={0} data={yearData} />

                <TableColumn machine={1} data={machineData.machine1} />

                <TableColumn machine={2} data={machineData.machine2} />

                <TableColumn machine={3} data={machineData.machine3} />

                <TableColumn machine={4} data={machineData.machine4} />

                <TableColumn machine={5} data={machineData.machine5} />

                <TableColumn machine={6} data={machineData.machine6} />
            </div>
        );
    };

    const MinimalPrices = () => {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <h3 className="mb-4">
                    {languageInfo.language['g4-screens'].rules['initial-price']}
                </h3>

                <div className="flex w-80 flex-col items-center justify-center border-2 border-BGdark-lighter">
                    <div className="flex w-full items-end h-8 border-b-2 border-BGdark-lighter">
                        <div className="h-full flex w-1/2 items-center justify-center border-r-2 border-BGdark-lighter">
                            <p>
                                1.{' '}
                                {languageInfo.language[
                                    'g4-screens'
                                ].machine.toLowerCase()}
                            </p>
                        </div>

                        <div className="h-full flex w-1/2 items-center justify-center">
                            <p>200000</p>
                        </div>
                    </div>

                    <div className="flex w-full items-end h-8 border-b-2 border-BGdark-lighter">
                        <div className="h-full flex w-1/2 items-center justify-center border-r-2 border-BGdark-lighter">
                            <p>
                                2.{' '}
                                {languageInfo.language[
                                    'g4-screens'
                                ].machine.toLowerCase()}
                            </p>
                        </div>

                        <div className="h-full flex w-1/2 items-center justify-center">
                            <p>150000</p>
                        </div>
                    </div>

                    <div className="flex w-full items-end h-8 border-b-2 border-BGdark-lighter">
                        <div className="h-full flex w-1/2 items-center justify-center border-r-2 border-BGdark-lighter">
                            <p>
                                3.{' '}
                                {languageInfo.language[
                                    'g4-screens'
                                ].machine.toLowerCase()}
                            </p>
                        </div>

                        <div className="h-full flex w-1/2 items-center justify-center">
                            <p>100000</p>
                        </div>
                    </div>

                    <div className="flex w-full items-end h-8 border-b-2 border-BGdark-lighter">
                        <div className="h-full flex w-1/2 items-center justify-center border-r-2 border-BGdark-lighter">
                            <p>
                                4.{' '}
                                {languageInfo.language[
                                    'g4-screens'
                                ].machine.toLowerCase()}
                            </p>
                        </div>

                        <div className="h-full flex w-1/2 items-center justify-center">
                            <p>50000</p>
                        </div>
                    </div>

                    <div className="flex w-full items-end h-8 border-b-2 border-BGdark-lighter">
                        <div className="h-full flex w-1/2 items-center justify-center border-r-2 border-BGdark-lighter">
                            <p>
                                5.{' '}
                                {languageInfo.language[
                                    'g4-screens'
                                ].machine.toLowerCase()}
                            </p>
                        </div>

                        <div className="h-full flex w-1/2 items-center justify-center">
                            <p>20000</p>
                        </div>
                    </div>

                    <div className="flex w-full items-end h-8">
                        <div className="h-full flex w-1/2 items-center justify-center border-r-2 border-BGdark-lighter">
                            <p>
                                6.{' '}
                                {languageInfo.language[
                                    'g4-screens'
                                ].machine.toLowerCase()}
                            </p>
                        </div>

                        <div className="h-full flex w-1/2 items-center justify-center">
                            <p>5000</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (
        gameInfo.activeGame?.type === 'Ražošana' &&
        gameInfo.g4Data.machines &&
        gameInfo.g4Data.machines.filter((m) => m.owner === null).length === 0
    ) {
        if (gameInfo.g6Data.rulePage === 1) {
            if (gameInfo.activeGame.admin === userInfo.info?._id) {
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <h3 className="mb-4">
                            {languageInfo.language['g4-screens'].teams}
                        </h3>

                        <div className="flex">
                            {gameInfo.g4Data.teams?.map((team, j) => {
                                return (
                                    <div
                                        key={j}
                                        className="flex flex-col w-80 mx-4"
                                    >
                                        <h3>
                                            {j + 1}.{' '}
                                            {
                                                languageInfo.language[
                                                    'g4-screens'
                                                ].team
                                            }
                                        </h3>

                                        {team.map((teammate, i) => {
                                            if (typeof teammate !== 'string') {
                                                return null;
                                            }

                                            return (
                                                <TeammateInfo
                                                    key={i}
                                                    id={teammate}
                                                    i={i}
                                                />
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }

            return (
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <G4TeamRules />
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full w-full">
                <h3 className="mb-4">
                    {languageInfo.language['g4-screens'].income}
                </h3>

                <Table />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <MinimalPrices />
        </div>
    );
}

export default G4Rules;
export { G4TeamRules };
