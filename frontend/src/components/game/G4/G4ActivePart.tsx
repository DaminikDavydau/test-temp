import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo } from '../../../redux/slices/gameSlice';
import G4FirstPart from './G4FirstPart';
import { selectGame } from './../../../redux/slices/gameSlice';
import G4SecondPart from './G4SecondPart';

function G4ActivePart() {
    const gameInfo: GameInfo = useSelector(selectGame);

    return (
        <div className="flex w-full h-full justify-center items-center">
            {gameInfo.g4Data.machines &&
            gameInfo.g4Data.machines.filter((m) => m.owner === null).length >=
                1 ? (
                <G4FirstPart />
            ) : (
                <G4SecondPart />
            )}
        </div>
    );
}

export default G4ActivePart;
