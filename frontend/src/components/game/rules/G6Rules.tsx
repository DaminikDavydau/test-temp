import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo } from '../../../redux/slices/gameSlice';
import { selectGame } from './../../../redux/slices/gameSlice';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G6Rules() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const Cell: React.FC<{
        title: boolean;
        txt: string;
        firstPart: boolean;
        cash?: boolean;
        bt: boolean;
        bl: boolean;
        stars?: boolean;
        starAmount?: number;
        double?: boolean;
        center?: boolean;
    }> = ({
        title,
        txt,
        firstPart,
        cash,
        bt,
        bl,
        stars,
        starAmount,
        double,
        center,
    }) => {
        if (title) {
            if (firstPart) {
                return (
                    <div
                        className={` flex justify-center items-end w-24 pb-2 ${
                            double ? 'h-48' : 'h-24'
                        }`}
                    >
                        <p className="text-center">
                            {txt}
                            {cash ? '€' : ''}
                        </p>
                    </div>
                );
            }

            return (
                <div
                    className={`flex justify-center items-end pb-2 w-24 ${
                        double ? 'h-24' : 'h-12'
                    }`}
                >
                    <p className="text-center">
                        {txt}
                        {cash ? '€' : ''}
                    </p>
                </div>
            );
        }

        if (stars && starAmount) {
            return (
                <div
                    className={`h-8 flex justify-center items-center w-24 border-2 border-BGdark-lighter ${
                        bt ? '' : 'border-t-0'
                    } ${bl ? '' : 'border-l-0'}`}
                >
                    {new Array(starAmount).fill(null).map((y, i) => {
                        return (
                            <img
                                key={i}
                                src="/icons/star.png"
                                alt="star"
                                className="h-4 mx-1"
                            />
                        );
                    })}
                </div>
            );
        }

        return (
            <div
                className={`${
                    double ? 'h-16' : 'h-8'
                } flex justify-center items-end w-24 border-2 border-BGdark-lighter ${
                    bt ? '' : 'border-t-0'
                } ${bl ? '' : 'border-l-0'} ${
                    center ? 'justify-center items-center' : ''
                }`}
            >
                <p className="text-center">
                    {txt}
                    {cash ? '€' : ''}
                </p>
            </div>
        );
    };

    const TouristAmount = () => {
        return (
            <div className="flex items-center justify-center flex-col my-4 mx-4">
                <h3>{languageInfo.language['g6-screens'].rules.title}</h3>

                <div className="flex items-end justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={true}
                            title={true}
                            txt={
                                languageInfo.language['g6-screens'][
                                    'tourist-amount'
                                ]
                            }
                            firstPart={true}
                        />

                        <Cell
                            double={true}
                            bt={true}
                            bl={true}
                            title={false}
                            txt={languageInfo.language['g6-screens'].low}
                            firstPart={false}
                            center
                        />

                        <Cell
                            double={true}
                            bt={false}
                            bl={true}
                            title={false}
                            txt={languageInfo.language['g6-screens'].mid}
                            firstPart={false}
                            center
                        />

                        <Cell
                            double={true}
                            bt={false}
                            bl={true}
                            title={false}
                            txt={languageInfo.language['g6-screens'].high}
                            firstPart={false}
                            center
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={false}
                            title={true}
                            txt={languageInfo.language['g6-screens'].chance}
                            firstPart={true}
                        />

                        <Cell
                            double={true}
                            bt={true}
                            bl={false}
                            title={false}
                            txt="1/5"
                            firstPart={false}
                            center
                        />

                        <Cell
                            double={true}
                            bt={false}
                            bl={false}
                            title={false}
                            txt="1/2"
                            firstPart={false}
                            center
                        />

                        <Cell
                            double={true}
                            bt={false}
                            bl={false}
                            title={false}
                            txt="3/10"
                            firstPart={false}
                            center
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={false}
                            title={true}
                            txt={languageInfo.language['g6-screens'].location}
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={false}
                            title={false}
                            txt={languageInfo.language['g6-screens'].center}
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt={languageInfo.language['g6-screens'].periphery}
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt={languageInfo.language['g6-screens'].center}
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt={languageInfo.language['g6-screens'].periphery}
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt={languageInfo.language['g6-screens'].center}
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt={languageInfo.language['g6-screens'].periphery}
                            firstPart={false}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={false}
                            title={true}
                            txt={languageInfo.language['g6-screens']['ad-exp']}
                            firstPart={false}
                        />

                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <Cell
                                    title={false}
                                    bt={true}
                                    bl={true}
                                    txt="1000"
                                    firstPart={false}
                                    cash={true}
                                />

                                <Cell
                                    title={false}
                                    bt={false}
                                    bl={false}
                                    txt="700"
                                    firstPart={false}
                                />

                                <Cell
                                    title={false}
                                    bt={false}
                                    bl={false}
                                    txt="-"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="1000"
                                    firstPart={false}
                                />

                                <Cell
                                    title={false}
                                    bt={false}
                                    bl={false}
                                    txt="400"
                                    firstPart={false}
                                />

                                <Cell
                                    title={false}
                                    bt={false}
                                    bl={false}
                                    txt="1500"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="700"
                                    firstPart={false}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <Cell
                                    bt={true}
                                    bl={false}
                                    title={false}
                                    txt="1500"
                                    firstPart={false}
                                    cash={true}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="1400"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="400"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="1600"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="900"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="2000"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="500"
                                    firstPart={false}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <Cell
                                    bt={true}
                                    bl={false}
                                    title={false}
                                    txt="5000"
                                    firstPart={false}
                                    cash={true}
                                />

                                <Cell
                                    bt={false}
                                    title={false}
                                    bl={false}
                                    txt="1600"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="700"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="2000"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    title={false}
                                    bl={false}
                                    txt="1200"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="2600"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="1500"
                                    firstPart={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const BuySellPrices = () => {
        return (
            <div className="flex items-center justify-center flex-col mx-4 my-4">
                <h3>{languageInfo.language['g6-screens']['room-price']}</h3>

                <div className="flex items-end justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={true}
                            title={true}
                            txt={languageInfo.language['g6-screens'].locationc}
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={true}
                            title={false}
                            txt={languageInfo.language['g6-screens'].center}
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={true}
                            title={false}
                            txt={languageInfo.language['g6-screens'].periphery}
                            firstPart={false}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={false}
                            bl={false}
                            title={true}
                            txt={languageInfo.language['g6-screens'].buy}
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={false}
                            title={false}
                            txt="45 000"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="30 000"
                            firstPart={false}
                            cash={true}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={false}
                            title={true}
                            txt={languageInfo.language['g6-screens'].sell}
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={false}
                            title={false}
                            txt="60 000"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="40 000"
                            firstPart={false}
                            cash={true}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const BarberSalaries = () => {
        return (
            <div className="flex items-center justify-center flex-col mx-4">
                <h3>{languageInfo.language['g6-screens']['barber-pay']}</h3>

                <div className="flex items-end justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={true}
                            title={true}
                            txt={
                                languageInfo.language['g6-screens'][
                                    'qualification-j'
                                ]
                            }
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={true}
                            title={false}
                            txt=""
                            firstPart={false}
                            stars={true}
                            starAmount={3}
                        />

                        <Cell
                            bt={false}
                            bl={true}
                            title={false}
                            stars={true}
                            starAmount={2}
                            txt=""
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={true}
                            title={false}
                            stars={true}
                            starAmount={1}
                            txt=""
                            firstPart={false}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={false}
                            title={true}
                            txt={languageInfo.language['g6-screens'].salary}
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={false}
                            title={false}
                            txt="7000"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="5000"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="3000"
                            firstPart={false}
                            cash={true}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const MachinePrices = () => {
        return (
            <div className="flex items-center justify-center flex-col mx-4 relative">
                <h3>{languageInfo.language['g6-screens']['machine-exp']}</h3>

                <div className="flex items-end justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={true}
                            title={true}
                            txt={
                                languageInfo.language['g6-screens'][
                                    'machine-lvl'
                                ]
                            }
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={true}
                            title={false}
                            txt=""
                            firstPart={false}
                            stars={true}
                            starAmount={3}
                        />

                        <Cell
                            bt={false}
                            bl={true}
                            title={false}
                            stars={true}
                            starAmount={2}
                            txt=""
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={true}
                            title={false}
                            stars={true}
                            starAmount={1}
                            txt=""
                            firstPart={false}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={false}
                            title={true}
                            txt={languageInfo.language.constants.price}
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={false}
                            title={false}
                            txt="4000"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="3000"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="2000"
                            firstPart={false}
                            cash={true}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={true}
                            title={true}
                            txt={
                                languageInfo.language['g6-screens'].maintenance
                            }
                            firstPart={false}
                        />

                        <Cell
                            bt={true}
                            bl={false}
                            title={false}
                            txt="1000"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="500"
                            firstPart={false}
                            cash={true}
                        />

                        <Cell
                            bt={false}
                            bl={false}
                            title={false}
                            txt="300"
                            firstPart={false}
                            cash={true}
                        />
                    </div>
                </div>

                <p className="text-center absolute -bottom-14">
                    {languageInfo.language['g6-screens']['maintenance-notif']}
                </p>
            </div>
        );
    };

    const ServicePrices = () => {
        return (
            <div className="flex items-center justify-center flex-col mx-4">
                <h3>{languageInfo.language['g6-screens']['service-costs']}</h3>

                <div className="flex items-end justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={true}
                            title={true}
                            txt={
                                languageInfo.language['g6-screens'][
                                    'machine-lvl'
                                ]
                            }
                            firstPart={true}
                        />

                        <Cell
                            bt={true}
                            bl={true}
                            title={false}
                            txt=""
                            firstPart={false}
                            stars={true}
                            starAmount={3}
                        />

                        <Cell
                            bt={false}
                            bl={true}
                            title={false}
                            stars={true}
                            starAmount={2}
                            txt=""
                            firstPart={false}
                        />

                        <Cell
                            bt={false}
                            bl={true}
                            title={false}
                            stars={true}
                            starAmount={1}
                            txt=""
                            firstPart={false}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <Cell
                            bt={true}
                            bl={false}
                            title={true}
                            txt={
                                languageInfo.language['g6-screens']
                                    .qualification
                            }
                            firstPart={false}
                        />

                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <Cell
                                    title={false}
                                    bt={true}
                                    bl={true}
                                    txt=""
                                    firstPart={false}
                                    cash={true}
                                    stars={true}
                                    starAmount={3}
                                />

                                <Cell
                                    title={false}
                                    bt={false}
                                    bl={false}
                                    txt="30"
                                    firstPart={false}
                                />

                                <Cell
                                    title={false}
                                    bt={false}
                                    bl={false}
                                    txt="30"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="20"
                                    firstPart={false}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <Cell
                                    bt={true}
                                    bl={false}
                                    title={false}
                                    txt=""
                                    firstPart={false}
                                    stars={true}
                                    starAmount={2}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="25"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="15"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="15"
                                    firstPart={false}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <Cell
                                    bt={true}
                                    bl={false}
                                    title={false}
                                    txt=""
                                    firstPart={false}
                                    stars={true}
                                    starAmount={1}
                                />

                                <Cell
                                    bt={false}
                                    title={false}
                                    bl={false}
                                    txt="15"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="10"
                                    firstPart={false}
                                />

                                <Cell
                                    bt={false}
                                    bl={false}
                                    title={false}
                                    txt="10"
                                    firstPart={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const BaseClientInfo = () => {
        return (
            <div className="flex items-start justify-center flex-col mt-4">
                <h3>{languageInfo.language['g6-screens']['base-clients']}</h3>

                <p>{languageInfo.language['g6-screens']['in-center']}: 3000</p>
                <p>
                    {languageInfo.language['g6-screens']['in-periphery']}: 2000
                </p>
            </div>
        );
    };

    const FirstRulePage = () => {
        return (
            <div className="flex items-center justify-center h-full w-full ">
                <BuySellPrices />

                <TouristAmount />

                {/* <BaseClientInfo /> */}
            </div>
        );
    };

    const SecondRulePage = () => {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <BarberSalaries />

                <MachinePrices />

                <ServicePrices />
            </div>
        );
    };

    const ActiveRulePage = () => {
        if (gameInfo.g6Data.rulePage === 0) {
            return <FirstRulePage />;
        }

        return <SecondRulePage />;
    };

    return <ActiveRulePage />;
}

export default G6Rules;
