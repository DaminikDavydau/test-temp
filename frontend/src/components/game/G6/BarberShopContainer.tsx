import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    starsFromBudget,
    starsFromSkill,
} from '../../../constants/G6Constants';
import {
    GameInfo,
    selectGame,
    setG4Investment,
    updateNewBarbershop,
} from '../../../redux/slices/gameSlice';
import { IBarbershop, IPlayer } from '../../../types/barber';
import BarberShop from './BarberShop';
import G6SelectInvestmentValue from './G6SelectInvestmentValue';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function BarberShopContainer() {
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [location, setLocation] = useState<string | number | boolean>('city');
    const [budget, setBudget] = useState<string | number | boolean>(2);
    const [level, setLevel] = useState<string | number | boolean>(1);
    const [skill, setSkill] = useState<string | number | boolean>(1);
    const [isLearning, setIsLearning] = useState<boolean>(false);
    const [playerSkill, setPlayerSkill] = useState<number | null>(null);
    const [minbudget, setMinBudget] = useState<number | null>(null);
    const [minlevel, setMinLevel] = useState<number | null>(null);
    const [minskill, setMinSkill] = useState<number | null>(null);
    const [ownerWorking, setOwnerWorking] = useState<string | number | boolean>(
        true
    );
    const [prevOW, setPrevOW] = useState<null | boolean>(null);
    const [prewBBs, setPrewBBs] = useState<null | IBarbershop>(null);
    const [savedBbs, setSavedBbs] = useState<null | IBarbershop>(null);
    const [prewBarber, setPrewBarber] = useState<null | IPlayer>(null);

    useEffect(() => {
        if (gameInfo.g6Data.newBarbershop.location === 'city') {
            setLocation('centrs');
        } else if (gameInfo.g6Data.newBarbershop.location === 'country') {
            setLocation('perifērija');
        }
    }, [gameInfo.g6Data.newBarbershop]);

    useEffect(() => {
        if (gameInfo.g6Data.newBarbershop.isNew && ownerWorking) {
            setSkill(1);
        }
    }, [gameInfo.g6Data.newBarbershop.isNew, ownerWorking]);

    useEffect(() => {
        if (
            !savedBbs &&
            gameInfo.g6Data.editing &&
            typeof gameInfo.g6Data.prevIndex === 'number'
        ) {
            let prevBarbershopVersion: IBarbershop | null = null;

            if (
                typeof gameInfo.g6Data.prevIndex === 'number' &&
                gameInfo.g6Data.savedBarbershops.length >=
                    gameInfo.g6Data.prevIndex + 1
            ) {
                prevBarbershopVersion =
                    gameInfo.g6Data.savedBarbershops[gameInfo.g6Data.prevIndex];
            }

            setSavedBbs(prevBarbershopVersion);
        } else if (!gameInfo.g6Data.editing) {
            setSavedBbs(null);
        }
    }, [
        savedBbs,
        gameInfo.g6Data.editing,
        gameInfo.g6Data.prevIndex,
        gameInfo.g6Data.savedBarbershops,
    ]);

    useEffect(() => {
        if (gameInfo.g6Data.editing && ownerWorking) {
            if (
                skill >
                (starsFromSkill[gameInfo.g6Data.playerSkill.skill] as any)
            ) {
                return;
            }
            setSkill(starsFromSkill[gameInfo.g6Data.playerSkill.skill]);
        } else if (gameInfo.g6Data.editing && prewBarber && prewBBs) {
            setSkill(starsFromSkill[prewBBs.barber.skill]);
        } else if (gameInfo.g6Data.editing) {
            setSkill(1);
        }
    }, [
        gameInfo.g6Data.editing,
        ownerWorking,
        prewBarber,
        gameInfo.g6Data.playerSkill,
        prewBBs,
    ]);

    useEffect(() => {
        if (gameInfo.g6Data.editing && !prewBBs) {
            setPrewBBs(gameInfo.g6Data.newBarbershop);
        } else if (!gameInfo.g6Data.editing && prewBBs) {
            setPrewBBs(null);
        }

        if (gameInfo.g6Data.editing && !prewBarber) {
            setPrewBarber(gameInfo.g6Data.playerSkill);
        } else if (!gameInfo.g6Data.editing && prewBarber) {
            setPrewBarber(null);
        }
    }, [
        gameInfo.g6Data.editing,
        prewBBs,
        gameInfo.g6Data.newBarbershop,
        gameInfo.g6Data.playerSkill,
        prewBarber,
    ]);

    useEffect(() => {
        if (gameInfo.g6Data.newBarbershop.ownerWorking) {
            if (
                (gameInfo.g6Data.playerSkill.skill === 'base' && skill === 2) ||
                (gameInfo.g6Data.playerSkill.skill === 'mid' && skill === 3)
            ) {
                setIsLearning(true);
            }
        }
    }, [isLearning, gameInfo.g6Data.newBarbershop]);

    useEffect(() => {
        if (
            !playerSkill &&
            gameInfo.g6Data.barbershops &&
            gameInfo.activeGame?.year !== 'yearOne'
        ) {
            let minPlayerSkill = 1;

            gameInfo.g6Data.barbershops.forEach((bbs) => {
                const skillNum = starsFromSkill[bbs.barber.skill];

                if (bbs.ownerWorking && skillNum > minPlayerSkill) {
                    minPlayerSkill = skillNum;
                }
            });

            setPlayerSkill(minPlayerSkill);
        }
    }, [playerSkill, gameInfo.g6Data.barbershops, gameInfo.activeGame]);

    useEffect(() => {
        if (
            !gameInfo.g6Data.newBarbershop.isNew &&
            !minbudget &&
            !minlevel &&
            !minskill &&
            prewBarber &&
            prewBBs
        ) {
            const nBudget = starsFromBudget[prewBBs.budget];

            let nSkill = starsFromSkill[prewBBs.barber.skill];

            if (gameInfo.g6Data.newBarbershop.ownerWorking) {
                nSkill = starsFromSkill[prewBarber.skill];
            }

            const nLevel = starsFromSkill[prewBBs.equipment];

            const nOW = prewBBs.ownerWorking;

            setBudget(nBudget);
            setLevel(nLevel);
            setSkill(nSkill);
            setOwnerWorking(nOW);
            setPrevOW(nOW);
            setMinBudget(nBudget);
            setMinSkill(nSkill);
            setMinLevel(nLevel);
        } else if (gameInfo.g6Data.newBarbershop.isNew) {
            setMinBudget(null);
            setMinSkill(null);
            setMinLevel(null);
        }
    }, [
        gameInfo.g6Data.newBarbershop,
        minbudget,
        minlevel,
        minskill,
        gameInfo.g6Data.playerSkill,
    ]);

    useEffect(() => {
        const G6Investment = {
            barbershops: gameInfo.g6Data.barbershops,
            player: gameInfo.g6Data.playerSkill,
        };

        const stringifyedInvestment = JSON.stringify(G6Investment);

        dispatch(setG4Investment(stringifyedInvestment));
    }, [gameInfo.g6Data.barbershops, gameInfo.g6Data.playerSkill]);

    useEffect(() => {
        if (!ownerWorking && !gameInfo.g6Data.editing) {
            setSkill(1);
        }
    }, [ownerWorking, gameInfo.g6Data.editing]);

    useEffect(() => {
        if (!gameInfo.g6Data.editing) {
            gameInfo.g6Data.barbershops.forEach((bbs) => {
                if (bbs.ownerWorking) {
                    setOwnerWorking(false);
                }
            });
        } else {
            setOwnerWorking(gameInfo.g6Data.newBarbershop.ownerWorking);
        }
    }, [gameInfo.g6Data.barbershops, gameInfo.g6Data.editing]);

    useEffect(() => {
        if (gameInfo.g6Data.editing) {
            const newBBsProps = {
                location: gameInfo.g6Data.newBarbershop.location,
                budget: budget,
                level: level,
                skill: ownerWorking
                    ? starsFromSkill[gameInfo.g6Data.playerSkill.skill]
                    : skill,
                isLearning: ownerWorking
                    ? skill >
                      (starsFromSkill[gameInfo.g6Data.playerSkill.skill] as any)
                    : false,
                ownerWorking: ownerWorking,
            };

            if (gameInfo.g6Data.newBarbershop.isNew && !ownerWorking) {
                newBBsProps['skill'] = Number(skill);
            }

            dispatch(updateNewBarbershop(newBBsProps));
        } else if (gameInfo.g6Data.newBarbershop.isNew) {
            dispatch(
                updateNewBarbershop({
                    location,
                    budget,
                    level,
                    isLearning: ownerWorking ? skill === 2 : false,
                    skill: ownerWorking ? 1 : skill,
                    ownerWorking,
                })
            );
        }
    }, [
        location,
        budget,
        level,
        skill,
        ownerWorking,
        minbudget,
        minlevel,
        minskill,
    ]);

    console.log(skill);

    if (!gameInfo.g6Data.choosingBarberShop) {
        return (
            <div className="w-full h-full flex items-center justify-center flex-col">
                <PlayerBarberShops showcase={false} />

                <h3 className="text-center">
                    {
                        languageInfo.language['g6-screens'].notification[
                            'less-clients'
                        ]
                    }
                </h3>
            </div>
        );
    }

    const ActiveChoice = () => {
        if (
            !gameInfo.g6Data.g6InvestmentPage ||
            gameInfo.g6Data.g6InvestmentPage === 0
        ) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center">
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center mx-4">
                            <img
                                src="/icons/location.png"
                                alt="location"
                                className="h-12"
                            />

                            <h3 className="my-1">
                                {
                                    languageInfo.language['g6-screens'][
                                        'barbershop-location'
                                    ]
                                }
                            </h3>

                            <div className="flex justify-center items-center">
                                <G6SelectInvestmentValue
                                    val="centrs"
                                    setVal={setLocation}
                                    check={location}
                                    cost="45 000€"
                                    stars={false}
                                    disabled={
                                        !gameInfo.g6Data.newBarbershop.isNew &&
                                        prewBBs &&
                                        prewBBs.location !== 'city'
                                            ? true
                                            : false
                                    }
                                    prevS={
                                        prewBBs && prewBBs.location === 'city'
                                            ? true
                                            : false
                                    }
                                />

                                <G6SelectInvestmentValue
                                    val="perifērija"
                                    setVal={setLocation}
                                    check={location}
                                    cost="30 000€"
                                    stars={false}
                                    disabled={
                                        !gameInfo.g6Data.newBarbershop.isNew &&
                                        prewBBs &&
                                        prewBBs.location !== 'country'
                                            ? true
                                            : false
                                    }
                                    prevS={
                                        prewBBs &&
                                        prewBBs.location === 'country'
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center mx-4">
                            <img
                                src="/icons/electric.png"
                                alt="electric"
                                className="h-12"
                            />

                            <h3 className="my-1">
                                {
                                    languageInfo.language['g6-screens'][
                                        'ad-budget'
                                    ]
                                }
                            </h3>

                            <div className="flex justify-center items-center">
                                <G6SelectInvestmentValue
                                    val={1}
                                    setVal={setBudget}
                                    check={budget}
                                    cost="500€"
                                    stars={true}
                                    prevS={minbudget ? minbudget === 1 : false}
                                />

                                <G6SelectInvestmentValue
                                    val={2}
                                    setVal={setBudget}
                                    check={budget}
                                    cost="1500€"
                                    stars={true}
                                    placeholder={
                                        languageInfo.language['g6-screens'][
                                            'yearly-pay'
                                        ]
                                    }
                                    prevS={minbudget ? minbudget === 2 : false}
                                />

                                <G6SelectInvestmentValue
                                    val={3}
                                    setVal={setBudget}
                                    check={budget}
                                    cost="5000€"
                                    stars={true}
                                    prevS={minbudget ? minbudget === 3 : false}
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-center">
                        {
                            languageInfo.language['g6-screens'].notification[
                                'less-clients'
                            ]
                        }
                    </h3>

                    <div className="w-full h-24 border-t-4 border-BGlight mt-2 flex items-center justify-center">
                        <h3>
                            {gameInfo.g6Data.barbershopExpenses >= 0
                                ? languageInfo.language['g6-screens'].expenses
                                : languageInfo.language['g6-screens'].savings}
                            :{' '}
                            {gameInfo.g6Data.barbershopExpenses >= 0
                                ? gameInfo.g6Data.barbershopExpenses
                                : gameInfo.g6Data.barbershopExpenses * -1}
                            €
                        </h3>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-full w-full flex flex-col items-center justify-center">
                <div className="absolute top-10 left-10 flex flex-col items-start justify-center">
                    <div className="flex justify-start items-center mb-2">
                        <img
                            src="/icons/location.png"
                            alt="location"
                            className="h-6 mr-2"
                        />

                        <p>{location}</p>
                    </div>

                    <div className="flex justify-start items-center">
                        <img
                            src="/icons/electric.png"
                            alt="location"
                            className="h-6 mr-2"
                        />

                        {new Array(budget).fill('').map((y, i) => {
                            return (
                                <img
                                    key={i}
                                    src="/icons/star.png"
                                    alt="star"
                                    className={`h-4 mx-1`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="h-full w-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center mx-4">
                        <img
                            src="/icons/hairdresser-black.png"
                            alt="hairdresser"
                            className="h-12"
                        />

                        <h3 className="my-1">
                            {languageInfo.language['g6-screens']['machine-lvl']}
                        </h3>

                        <div className="flex justify-center items-center">
                            <G6SelectInvestmentValue
                                val={1}
                                setVal={setLevel}
                                check={level}
                                cost="2000€"
                                stars={true}
                                prevS={minlevel ? minlevel === 1 : false}
                            />

                            <G6SelectInvestmentValue
                                val={2}
                                setVal={setLevel}
                                check={level}
                                cost="3000€"
                                stars={true}
                                placeholder={
                                    languageInfo.language['g6-screens'][
                                        'yearly-pay'
                                    ]
                                }
                                prevS={minlevel ? minlevel === 2 : false}
                            />

                            <G6SelectInvestmentValue
                                val={3}
                                setVal={setLevel}
                                check={level}
                                cost="4000€"
                                stars={true}
                                placeholder={
                                    languageInfo.language['g6-screens'][
                                        'yearly-pay'
                                    ]
                                }
                                prevS={minlevel ? minlevel === 3 : false}
                            />
                        </div>
                    </div>

                    <div
                        className={`flex flex-col items-center justify-center mx-4 w-80`}
                    >
                        <img
                            src="/icons/hairdresser.png"
                            alt="hairdresser"
                            className="h-12"
                        />

                        <h3 className="my-1">
                            {languageInfo.language['g6-screens'].qualification}
                        </h3>

                        <G6SelectInvestmentValue
                            val={
                                languageInfo.language['g6-screens'][
                                    'self-employment'
                                ]
                            }
                            setVal={setOwnerWorking}
                            check={ownerWorking}
                            cost=""
                            disabled={
                                gameInfo.g6Data.barbershops.find(
                                    (bbs) => bbs.ownerWorking === true
                                )
                                    ? true
                                    : false
                            }
                            prevS={prevOW ? prevOW : false}
                            stars={false}
                            full={true}
                        />

                        {ownerWorking ? (
                            <>
                                <div className="flex justify-center items-start">
                                    <G6SelectInvestmentValue
                                        val={1}
                                        setVal={setSkill}
                                        check={skill}
                                        cost=""
                                        stars={true}
                                        prevS={prevOW ? minskill === 1 : false}
                                        disabled={
                                            prewBarber &&
                                            starsFromSkill[prewBarber.skill] > 1
                                                ? true
                                                : false
                                        }
                                    />

                                    <G6SelectInvestmentValue
                                        val={2}
                                        setVal={setSkill}
                                        check={skill}
                                        cost="2000€"
                                        stars={true}
                                        placeholder={
                                            languageInfo.language['g6-screens'][
                                                'yearly-pay'
                                            ]
                                        }
                                        prevS={
                                            prewBarber &&
                                            starsFromSkill[prewBarber.skill] ===
                                                2
                                                ? true
                                                : false
                                        }
                                        disabled={
                                            prewBarber &&
                                            starsFromSkill[prewBarber.skill] > 2
                                                ? true
                                                : false
                                        }
                                        disableShow={
                                            prewBarber &&
                                            starsFromSkill[prewBarber.skill] >=
                                                2
                                                ? true
                                                : false
                                        }
                                    />

                                    <G6SelectInvestmentValue
                                        val={3}
                                        setVal={setSkill}
                                        check={skill}
                                        cost="4000€"
                                        stars={true}
                                        placeholder={
                                            languageInfo.language['g6-screens'][
                                                'yearly-pay'
                                            ]
                                        }
                                        prevS={prevOW ? minskill === 3 : false}
                                        disabled={
                                            starsFromSkill[
                                                gameInfo.g6Data.playerSkill
                                                    .skill
                                            ] < 2
                                                ? true
                                                : prewBarber &&
                                                  starsFromSkill[
                                                      prewBarber.skill
                                                  ] < 2
                                                ? true
                                                : false
                                        }
                                        disableShow={
                                            prewBarber &&
                                            starsFromSkill[prewBarber.skill] ===
                                                3
                                                ? true
                                                : false
                                        }
                                    />
                                </div>

                                <p className="text-center">
                                    {
                                        languageInfo.language['g6-screens'][
                                            'qualify-in-year'
                                        ]
                                    }
                                </p>
                            </>
                        ) : null}

                        <G6SelectInvestmentValue
                            val={
                                languageInfo.language['g6-screens'][
                                    'employ-someone'
                                ]
                            }
                            setVal={setOwnerWorking}
                            check={ownerWorking}
                            cost=""
                            stars={false}
                            full={true}
                        />

                        {ownerWorking ? null : (
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex justify-center items-start">
                                    <G6SelectInvestmentValue
                                        val={1}
                                        cost="3000€"
                                        setVal={setSkill}
                                        check={skill}
                                        stars={true}
                                        prevS={
                                            savedBbs &&
                                            starsFromSkill[
                                                savedBbs.barber.skill
                                            ] === 1
                                                ? true
                                                : false
                                        }
                                    />

                                    <G6SelectInvestmentValue
                                        val={2}
                                        setVal={setSkill}
                                        check={skill}
                                        cost="5000€"
                                        stars={true}
                                        prevS={
                                            savedBbs &&
                                            starsFromSkill[
                                                savedBbs.barber.skill
                                            ] === 2
                                                ? true
                                                : false
                                        }
                                    />

                                    <G6SelectInvestmentValue
                                        val={3}
                                        setVal={setSkill}
                                        check={skill}
                                        cost="7000€"
                                        stars={true}
                                        disabled={false}
                                        prevS={
                                            savedBbs &&
                                            starsFromSkill[
                                                savedBbs.barber.skill
                                            ] === 3
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-center">
                    {
                        languageInfo.language['g6-screens'].notification[
                            'less-clients'
                        ]
                    }
                </h3>

                <div className="w-full h-24 border-t-4 border-BGlight mt-2 flex items-center justify-center">
                    <h3>
                        {gameInfo.g6Data.barbershopExpenses >= 0
                            ? languageInfo.language['g6-screens'].expenses
                            : languageInfo.language['g6-screens'].savings}
                        :{' '}
                        {gameInfo.g6Data.barbershopExpenses >= 0
                            ? gameInfo.g6Data.barbershopExpenses
                            : gameInfo.g6Data.barbershopExpenses * -1}
                        €
                    </h3>
                </div>
            </div>
        );
    };

    return <ActiveChoice />;
}

const PlayerBarberShops: React.FC<{ showcase: boolean }> = ({ showcase }) => {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="h-full w-full flex items-center justify-center">
            {gameInfo.g6Data.barbershops.length === 0 ? (
                <h3 className="text-center">
                    {languageInfo.language['g6-screens']['no-barbershops']}
                </h3>
            ) : (
                <div className="grid items-center grid-cols-2">
                    {gameInfo.g6Data.barbershops.map((bbs, i) => {
                        return (
                            <BarberShop
                                key={i}
                                data={bbs}
                                index={i}
                                showcase={showcase}
                            />
                        );
                    })}
                    {/* {new Array(MAX_BARBERSHOPS - gameInfo.g6Data.barbershops.length)
                        .fill('')
                        .map((_y, i) => {
                            return (
                                <div
                                    className="flex items-center justify-between h-16 w-96 border-2 rounded-md m-2 p-2"
                                    key={i}
                                ></div>
                            );
                        })} */}
                </div>
            )}
        </div>
    );
};

export default BarberShopContainer;
export { PlayerBarberShops };
