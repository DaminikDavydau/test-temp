import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    GameInfo,
    InvestmentsInterface,
    selectGame,
} from '../../redux/slices/gameSlice';

interface Props {
    bId: string;
    text: number;
    type: 'number';
    allInvested: boolean;
    placeholder: string;
    setText: React.Dispatch<React.SetStateAction<number>>;
}

const SelectInvestmentAmount: React.FC<Props> = ({
    bId,
    type,
    setText,
    placeholder,
}) => {
    const gameInfo: GameInfo = useSelector(selectGame);
    const [bancrupted, setBancrupted] = useState(false);
    const [returns, setReturns] = useState<Record<string, number>>({
        returnRate: 0,
        returnAmount: 0,
    });
    const [bIdIntense] = useState(`b${bId[2]}`);

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        if (gameInfo.bancrupcies) {
            setBancrupted(gameInfo.bancrupcies[bIdIntense]);
        }
    }, [bId, gameInfo.bancrupcies]);

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
            setDisabled(true);
        }
    }, [gameInfo.activeGame, gameInfo.gameInvestments, gameInfo.playerInfo]);

    useEffect(() => {
        if (gameInfo.returns) {
            setReturns({
                returnRate:
                    Number(gameInfo.returns[bIdIntense]?.returnRate) * 100,
                returnAmount: Number(
                    gameInfo.returns[bIdIntense]?.returnAmount
                ),
            });
        }
    }, [bIdIntense, gameInfo.returns]);

    const changeText = (e: any) => {
        if (disabled) {
            return;
        }

        setText(Number(e.target.value));
    };

    if (!gameInfo.activeGame) {
        return null;
    }

    if (bancrupted) {
        return (
            <div className="w-full flex items-center justify-center">
                <img
                    src="/svg/black-cross.svg"
                    alt="black cross"
                    className="h-8"
                />
            </div>
        );
    }

    if (returns.returnRate) {
        return (
            <div className="w-full flex items-center justify-center flex-col">
                <h3>{returns.returnRate}%</h3>

                {returns.returnAmount && returns.returnAmount > 0 ? (
                    <h4>
                        {returns.returnAmount > 0 && '+'}
                        {returns.returnAmount}€
                    </h4>
                ) : null}
            </div>
        );
    }

    if (gameInfo.returns) {
        return (
            <div className="w-full flex items-center justify-center">
                <h3>0%</h3>
            </div>
        );
    }

    if (gameInfo.playerInfo?.is_bancrupt) {
        return null;
    }

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={gameInfo.investments[bId as keyof InvestmentsInterface]}
            onChange={(e) => changeText(e)}
            min={0}
            disabled={disabled}
            className={`w-full h-8 border-2 px-2 border-BGdark_lightblue-lighter  ${
                disabled && 'cursor-not-allowed'
            }`}
        />
    );
};

export default SelectInvestmentAmount;
