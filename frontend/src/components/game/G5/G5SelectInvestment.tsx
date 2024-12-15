import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    construcionObjects,
    ObjectInterface,
    roomPrices,
} from '../../../constants/G5Constants';
import {
    GameInfo,
    selectGame,
    setInvestments,
} from '../../../redux/slices/gameSlice';
import G5SelectInvestmentValue, {
    SelectBuildingButton,
} from './G5SelectInvestmentAmount';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

function G5SelectInvestment() {
    const gameInfo: GameInfo = useSelector(selectGame);

    const [invested, setInvested] = useState(false);

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

    const PriceSelection = () => {
        const languageInfo: LanguageInfo = useSelector(selectLanguage);

        return (
            <div className="flex-1 flex-col flex items-center justify-center">
                <img
                    src="/icons/room-outline.png"
                    alt="room key"
                    className="w-20 my-4"
                />

                <h3 className="text-center mb-4">
                    {languageInfo.language['g5-screens']['room-price']}:
                </h3>

                <div className="flex flex-col">
                    <div className="flex items-center justify-center">
                        {roomPrices.slice(0, 5).map((price, i) => {
                            return (
                                <G5SelectInvestmentValue key={i} val={price} />
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center">
                        {roomPrices.slice(5, 10).map((price, i) => {
                            return (
                                <G5SelectInvestmentValue key={i} val={price} />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const BuildingObject: React.FC<{ object: ObjectInterface }> = ({
        object,
    }) => {
        const gameInfo: GameInfo = useSelector(selectGame);
        const languageInfo: LanguageInfo = useSelector(selectLanguage);

        const dispatch = useDispatch();

        const [owned, setOwned] = useState(false);

        useEffect(() => {
            const playerOwns = gameInfo.playerBuildings[object.alt];
            if (playerOwns) {
                setOwned(true);
            }
        }, [gameInfo.playerBuildings]);

        const selectIvValue = (
            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
            e.preventDefault();

            if (gameInfo.investments.iv2 === object.price) {
                return;
            }

            dispatch(
                setInvestments({ ...gameInfo.investments, iv2: object.price })
            );
        };

        return (
            <div className="flex flex-col items-center justify-center w-52 m-2">
                <img src={object.icon} alt={object.alt} className="h-16" />

                <p className="my-1">
                    {
                        languageInfo.language['g5-screens']['building-names'][
                            object.name
                        ]
                    }
                </p>

                <div className="w-40">
                    <SelectBuildingButton
                        text={`${object.price}€`}
                        disabled={owned}
                        fn={selectIvValue}
                        clicked={false}
                        owned={owned}
                    />
                </div>
            </div>
        );
    };

    const BuildingSelection = () => {
        return (
            <div className="flex-1 flex-col flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex">
                        {construcionObjects.slice(0, 2).map((object, i) => {
                            return <BuildingObject key={i} object={object} />;
                        })}
                    </div>

                    <div className="flex">
                        {construcionObjects.slice(2, 4).map((object, i) => {
                            return <BuildingObject key={i} object={object} />;
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const ActiveSelection = () => {
        if (invested) {
            return null;
        }

        if (gameInfo.investments.iv1) {
            return <BuildingSelection />;
        }

        return <PriceSelection />;
    };

    if (!gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="flex w-full h-full justify-end items-center">
            <ActiveSelection />
        </div>
    );
}

export default G5SelectInvestment;
