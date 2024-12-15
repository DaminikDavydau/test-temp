import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GameInfo,
    handleRules,
    selectGame,
} from '../../../redux/slices/gameSlice';
import { BuildingSidebar, PriceChange } from '../rules/G5Rules';
import PlayerBuildings from './PlayerBuildings';

function G5ExtraInfo() {
    const dispatch = useDispatch();

    const gameInfo: GameInfo = useSelector(selectGame);

    return (
        <div className="px-2 flex flex-col items-center justify-center h-full bg-BGlight">
            {!gameInfo.investments.iv1 ? <PriceChange /> : <BuildingSidebar />}

            <PlayerBuildings />

            <img
                src="/icons/info.png"
                alt="info"
                className="cursor-pointer mt-4"
                onClick={() => dispatch(handleRules(true))}
            />
        </div>
    );
}

export default G5ExtraInfo;
