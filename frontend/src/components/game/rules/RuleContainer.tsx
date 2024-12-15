import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import AdminBottomOptions from '../BottomOptions';
import G4Rules from './G4Rules';
import G5Rules from './G5Rules';
import G6Rules from './G6Rules';
import GameOneRules from './GameOneRules';
import GameThreeRules from './GameThreeRules';
import GameTwoRules from './GameTwoRules';

function RuleContainer() {
    const gameInfo: GameInfo = useSelector(selectGame);

    return (
        <div className="page flex flex-col items-center justify-start">
            {gameInfo.activeGame?.type === 'Bankrots' ? (
                <GameOneRules />
            ) : gameInfo.activeGame?.type === 'Krīzes gads' ? (
                <GameTwoRules />
            ) : gameInfo.activeGame?.type === 'Lēnāk brauksi - tālāk tiksi' ? (
                <GameThreeRules />
            ) : gameInfo.activeGame?.type === 'Viesnīca' ? (
                <G5Rules />
            ) : gameInfo.activeGame?.type === 'Ražošana' ? (
                <G4Rules />
            ) : gameInfo.activeGame?.type === 'Frizētava' ? (
                <G6Rules />
            ) : (null)}

            <AdminBottomOptions />
        </div>
    );
}

export default RuleContainer;
