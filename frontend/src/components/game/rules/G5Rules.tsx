import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../../redux/slices/userSlice';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G5Rules() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const Buildings = () => {
        const TableRow: React.FC<{
            labels: boolean;
            building: string;
            cost: number;
            visitors: string;
        }> = ({ labels, building, cost, visitors }) => {
            if (labels) {
                return (
                    <div className="w-full flex justify-between items-center mb-2">
                        <div className="flex w-1/3 h-full items-center justify-center">
                            <small className="text-center">
                                {
                                    languageInfo.language['g5-screens'].rules
                                        .title
                                }
                            </small>
                        </div>

                        <div className="flex w-1/3 h-full items-center justify-center">
                            <small className="text-center">
                                {
                                    languageInfo.language['g5-screens'].rules
                                        .expenses
                                }
                            </small>
                        </div>

                        <div className="flex w-1/3 h-full items-center justify-center">
                            <small className="text-center">
                                {
                                    languageInfo.language['g5-screens'].rules[
                                        'customer-increase'
                                    ]
                                }
                            </small>
                        </div>
                    </div>
                );
            }

            if (building === languageInfo.language['g5-screens'].pool) {
                return (
                    <div className="w-full h-28 flex justify-between items-center border-t-2 border-BGdark-lighter">
                        <div className="flex w-1/3 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                            <small className="text-center">{building}</small>
                        </div>

                        <div className="flex w-1/3 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                            <p className="text-center">{cost}</p>
                        </div>

                        <div className="flex w-1/3 h-full flex-col items-center justify-center">
                            <p>+10%</p>
                            <small className="text-center">
                                (
                                {
                                    languageInfo.language['g5-screens'][
                                        'clean-water'
                                    ]
                                }
                                )
                            </small>

                            <p>+50%</p>
                            <small className="text-center">
                                (
                                {
                                    languageInfo.language['g5-screens'][
                                        'dirty-water'
                                    ]
                                }
                                )
                            </small>
                        </div>
                    </div>
                );
            }

            return (
                <div className="w-full h-10 flex justify-between items-center border-t-2 border-BGdark-lighter">
                    <div className="flex w-1/3 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                        <small className="text-center">{building}</small>
                    </div>

                    <div className="flex w-1/3 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                        <p className="text-center">{cost}</p>
                    </div>

                    <div className="flex w-1/3 h-full items-center justify-center">
                        <p className="text-center">{visitors}</p>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex flex-col items-center justify-center w-72 mx-4">
                <h3 className="mb-2">
                    {languageInfo.language['g5-screens'].buildings}
                </h3>

                <div className="flex flex-col w-full justify-center items-center">
                    <TableRow labels={true} building="" cost={0} visitors="" />

                    <div className="flex flex-col w-full justify-center items-center border-2 border-BGdark-lighter border-t-0">
                        <TableRow
                            labels={false}
                            building={
                                languageInfo.language['g5-screens'].restaurant
                            }
                            cost={100000}
                            visitors="+10%"
                        />

                        <TableRow
                            labels={false}
                            building={
                                languageInfo.language['g5-screens'][
                                    'conference-hall'
                                ]
                            }
                            cost={200000}
                            visitors="+20%"
                        />

                        <TableRow
                            labels={false}
                            building={
                                languageInfo.language['g5-screens'][
                                    'teniss-court'
                                ]
                            }
                            cost={300000}
                            visitors="+30%"
                        />

                        <TableRow
                            labels={false}
                            building={languageInfo.language['g5-screens'].pool}
                            cost={500000}
                            visitors="+10%"
                        />
                    </div>
                </div>

                <small className="mt-2 text-center">
                    {languageInfo.language['g5-screens']['next-year-income']}
                </small>
            </div>
        );
    };

    const Chances = () => {
        const TableRow: React.FC<{
            labels: boolean;
            clients: number;
            waterClean: boolean;
            weatherClear: boolean;
            chance: string;
        }> = ({ labels, clients, waterClean, weatherClear, chance }) => {
            if (labels) {
                return (
                    <div className="w-full flex justify-between items-center mb-2">
                        <div className="flex w-1/4 h-full items-center justify-center">
                            <small className="text-center">
                                {
                                    languageInfo.language['g5-screens'][
                                        'annual-clients'
                                    ]
                                }
                            </small>
                        </div>

                        <div className="flex w-1/4 h-full items-center justify-center">
                            <small className="text-center">
                                {languageInfo.language['g5-screens'].weather}
                            </small>
                        </div>

                        <div className="flex w-1/4 h-full items-center justify-center">
                            <small className="text-center">
                                {languageInfo.language['g5-screens'].water}
                            </small>
                        </div>

                        <div className="flex w-1/4 h-full items-center justify-center">
                            <small className="text-center">
                                {languageInfo.language['g5-screens'].chance}
                            </small>
                        </div>
                    </div>
                );
            }

            return (
                <div className="w-full h-8 flex justify-between items-center border-t-2 border-BGdark-lighter">
                    <div className="flex w-1/4 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                        <p className="text-center">{clients}</p>
                    </div>

                    <div className="flex w-1/4 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                        <p className="text-center">
                            {weatherClear
                                ? languageInfo.language['g5-screens'].good
                                : languageInfo.language['g5-screens'].bad}
                        </p>
                    </div>

                    <div className="flex w-1/4 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                        <p className="text-center">
                            {waterClean
                                ? languageInfo.language['g5-screens'].clean
                                : languageInfo.language['g5-screens'].dirty}
                        </p>
                    </div>

                    <div className="flex w-1/4 h-full items-center justify-center">
                        <p className="text-center">{chance}</p>
                    </div>
                </div>
            );
        };

        return (
            <div className="flex flex-col items-center justify-center w-80 mx-4">
                <h3 className="mb-2 text-center">
                    {languageInfo.language['g5-screens']['chance-conseq']}
                </h3>

                <div className="flex flex-col w-full justify-center items-center">
                    <TableRow
                        labels={true}
                        clients={0}
                        waterClean={false}
                        weatherClear={false}
                        chance=""
                    />

                    <div className="flex flex-col w-full justify-center items-center border-2 border-BGdark-lighter border-t-0">
                        <TableRow
                            labels={false}
                            clients={50000}
                            waterClean={true}
                            weatherClear={true}
                            chance="1/6"
                        />

                        <TableRow
                            labels={false}
                            clients={40000}
                            waterClean={true}
                            weatherClear={false}
                            chance="2/6"
                        />

                        <TableRow
                            labels={false}
                            clients={30000}
                            waterClean={false}
                            weatherClear={true}
                            chance="2/6"
                        />

                        <TableRow
                            labels={false}
                            clients={10000}
                            waterClean={false}
                            weatherClear={false}
                            chance="1/6"
                        />
                    </div>
                </div>

                <small className="mt-2 text-center">
                    {languageInfo.language['g5-screens'].penalty}
                </small>
            </div>
        );
    };

    const AdminRules = () => {
        return (
            <div className="flex h-full items-center justify-center pt-8 mb-4">
                <Chances />

                <Buildings />

                <PriceChange />
            </div>
        );
    };

    const PlayerRules = () => {
        return (
            <div className="flex h-full items-center justify-center pt-8 mb-4">
                <Chances />

                <Buildings />
            </div>
        );
    };

    const ActiveRules = () => {
        if (userInfo.info && gameInfo.activeGame?.admin === userInfo.info._id) {
            return <AdminRules />;
        }

        return <PlayerRules />;
    };

    return <AdminRules />;
}

const PriceChange = () => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const TableRow: React.FC<{
        labels: boolean;
        price: string;
        visitors: number;
    }> = ({ labels, price, visitors }) => {
        if (labels) {
            return (
                <div className="w-full flex justify-between items-center mb-2">
                    <div className="flex w-1/2 h-full items-center justify-center">
                        <small className="text-center">
                            {languageInfo.language['g5-screens'].price}
                        </small>
                    </div>

                    <div className="flex w-1/2 h-full items-center justify-center">
                        <small className="text-center">
                            {
                                languageInfo.language['g5-screens'][
                                    'customer-count'
                                ]
                            }
                        </small>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full h-8 flex justify-between items-center border-t-2 border-BGdark-lighter">
                <div className="flex w-1/2 h-full items-center justify-center border-r-2 border-BGdark-lighter">
                    <small className="text-center">{price}</small>
                </div>

                <div className="flex w-1/2 h-full items-center justify-center">
                    <p className="text-center">
                        {visitors > 0 ? '+' : ''}
                        {visitors}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center w-60 mx-4">
            <h3 className="mb-2">
                {languageInfo.language['g5-screens']['price-change']}
            </h3>

            <div className="flex flex-col w-full justify-center items-center">
                <TableRow labels={true} price="" visitors={0} />

                <div className="flex flex-col w-full justify-center items-center border-2 border-BGdark-lighter border-t-0">
                    <TableRow
                        labels={false}
                        price="-5 / -4"
                        visitors={40000}
                    />

                    <TableRow
                        labels={false}
                        price="-3 / -2"
                        visitors={20000}
                    />

                    <TableRow labels={false} price="-1" visitors={10000} />

                    <TableRow labels={false} price="1" visitors={-5000} />

                    <TableRow
                        labels={false}
                        price="2 / 3"
                        visitors={-10000}
                    />

                    <TableRow
                        labels={false}
                        price="4 / 5"
                        visitors={-20000}
                    />
                </div>
            </div>
        </div>
    );
};

const BuildingSidebar = () => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const TableRow: React.FC<{
        labels: boolean;
        icon: string;
        visitors: number;
    }> = ({ labels, icon, visitors }) => {
        if (labels) {
            return (
                <div className="w-full flex justify-center items-center mb-2">
                    <div className="w-1/2 pl-10 flex justify-center items-center">
                        <small className="text-center">
                            {
                                languageInfo.language['g5-screens'][
                                    'customer-increase'
                                ]
                            }
                        </small>
                    </div>
                </div>
            );
        }

        if (icon.includes('pool')) {
            return (
                <div className="w-full h-32 flex justify-center items-center">
                    <div className="h-10 flex items-center justify-center py-1">
                        <img src={icon} alt="pool" className="h-full mr-2" />
                    </div>

                    <div
                        className={`flex flex-col w-1/2 h-full items-center justify-center border-2 border-BGdark-lighter border-t-0`}
                    >
                        <p className="text-center mb-1">+50%</p>

                        <small className="text-center">
                            (
                            {languageInfo.language['g5-screens']['clean-water']}
                            )
                        </small>

                        <p className="text-center">+10%</p>

                        <small className="text-center mb-1">
                            (
                            {languageInfo.language['g5-screens']['dirty-water']}
                            )
                        </small>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full h-10 flex justify-center items-center">
                <div className="h-full flex items-center justify-center py-1">
                    <img
                        src={icon}
                        alt="business type"
                        className="h-full mr-2"
                    />
                </div>

                <div
                    className={`flex w-1/2 h-full items-center justify-center border-2 border-BGdark-lighter ${
                        icon.includes('restaurant')
                            ? 'border-t-2'
                            : 'border-t-0'
                    }`}
                >
                    <p className="text-center">
                        {visitors > 0 ? '+' : ''}
                        {visitors}%
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center w-48 mx-4">
            <div className="flex flex-col w-full justify-center items-center">
                <TableRow labels={true} icon="" visitors={0} />

                <div className="flex flex-col w-full justify-center items-center">
                    <TableRow
                        labels={false}
                        icon="/icons/restaurant.png"
                        visitors={10}
                    />

                    <TableRow
                        labels={false}
                        icon="/icons/conference.png"
                        visitors={20}
                    />

                    <TableRow
                        labels={false}
                        icon="/icons/tennis.png"
                        visitors={30}
                    />

                    <TableRow
                        labels={false}
                        icon="/icons/pool.png"
                        visitors={50}
                    />
                </div>
            </div>

            <small className="mt-2 text-center">
                {languageInfo.language['g5-screens']['next-year-income']}
            </small>
        </div>
    );
};

export default G5Rules;
export { PriceChange, BuildingSidebar };
