import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    starsFromBudget,
    starsFromSkill,
} from '../../../constants/G6Constants';
import {
    editBarbershop,
    GameInfo,
    selectGame,
} from '../../../redux/slices/gameSlice';
import { IBarbershop } from '../../../types/barber';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';

const BarberShop: React.FC<{
    data: IBarbershop;
    index: number;
    showcase?: boolean;
}> = ({ data, index, showcase }) => {
    const gameInfo: GameInfo = useSelector(selectGame);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const dispatch = useDispatch();

    const [total, setTotal] = useState<number | null>(null);
    const [invested, setInvested] = useState(false);

    useEffect(() => {
        if (
            gameInfo.crisisYearResult &&
            Array.isArray(gameInfo.crisisYearResult.barbershopReturns) &&
            gameInfo.crisisYearResult.barbershopReturns.length >= index + 1
        ) {
            const activeInc =
                gameInfo.crisisYearResult.barbershopReturns[index];
            if (typeof activeInc !== 'string') {
                setTotal(activeInc.incomesFromClients);
            }
        }
    }, [gameInfo.crisisYearResult, index]);

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

    const editItem = () => {
        if (invested) {
            return;
        }
        dispatch(editBarbershop(index));
    };

    return (
        <div className="flex items-center justify-between p-2 h-16 w-96 border-2 rounded-md m-2">
            <img
                src="/icons/barbershop.png"
                alt="barbershop"
                className="h-full"
            />

            <div className="flex flex-col items-start justify-start flex-1 px-2">
                <div className="flex items-center justify-start">
                    <img
                        src="/icons/location.png"
                        alt="location"
                        className="h-5 mr-1"
                    />

                    <p>
                        {data.location === 'city'
                            ? languageInfo.language['g6-screens'].center
                            : languageInfo.language['g6-screens'].periphery}
                    </p>
                </div>

                <div className="flex justify-start items-center">
                    <div className="flex items-center justify-center mr-2">
                        <img
                            src="/icons/hairdresser-black.png"
                            alt="hairdresser"
                            className="h-5 mr-1"
                        />

                        {new Array(starsFromSkill[data.equipment])
                            .fill('')
                            .map((_y, i) => {
                                return (
                                    <img
                                        key={i}
                                        src="/icons/star.png"
                                        alt="star"
                                        className={`h-4 mr-1`}
                                    />
                                );
                            })}
                    </div>

                    <div className="flex items-center justify-center mr-2">
                        <img
                            src="/icons/hairdresser.png"
                            alt="barber"
                            className="h-5 mr-1"
                        />

                        {data.ownerWorking
                            ? new Array(
                                  starsFromSkill[
                                      gameInfo.g6Data.playerSkill.skill
                                  ]
                              )
                                  .fill('')
                                  .map((_y, i) => {
                                      return (
                                          <img
                                              key={i}
                                              src="/icons/star.png"
                                              alt="star"
                                              className={`h-4 mr-1`}
                                          />
                                      );
                                  })
                            : new Array(starsFromSkill[data.barber.skill])
                                  .fill('')
                                  .map((_y, i) => {
                                      return (
                                          <img
                                              key={i}
                                              src="/icons/star.png"
                                              alt="star"
                                              className={`h-4 mr-1`}
                                          />
                                      );
                                  })}

                        {(data.ownerWorking &&
                            gameInfo.g6Data.playerSkill.isLearning) ||
                        (!data.ownerWorking && data.barber.isLearning) ? (
                            <img
                                src="/icons/star.png"
                                alt="star"
                                className="h-4 mr-1 opacity-50"
                            />
                        ) : null}
                    </div>

                    <div className="flex items-center justify-center">
                        <img
                            src="/icons/electric.png"
                            alt="budget"
                            className="h-5 mr-1"
                        />

                        {new Array(starsFromBudget[data.budget])
                            .fill('')
                            .map((_y, i) => {
                                return (
                                    <img
                                        key={i}
                                        src="/icons/star.png"
                                        alt="star"
                                        className={`h-4 mr-1`}
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>

            {typeof total === 'number' ? (
                <div className="flex flex-col items-center justify-center">
                    <small>{languageInfo.language['g6-screens'].income}</small>

                    <small>
                        {total > 0 ? '+' : ''}
                        {total}€
                    </small>
                </div>
            ) : null}

            {!gameInfo.crisisYearResult && !invested ? (
                <img
                    src="/icons/edit.png"
                    alt="edit"
                    className={`h-7 cursor-pointer ${
                        invested ? 'cursor-default' : ''
                    }`}
                    onClick={() => editItem()}
                />
            ) : null}
        </div>
    );
};

export default BarberShop;
