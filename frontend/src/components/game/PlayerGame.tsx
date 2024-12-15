import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import AviableFunds from './AviableFunds';
import AdminBottomOptions from './BottomOptions';
import G5ExtraInfo from './G5/G5ExtraInfo';
import PlayerOptions from './PlayerOptions';
import ActiveSidebar from './sidebars/ActiveSidebar';

function PlayerGame() {
    const gameInfo: GameInfo = useSelector(selectGame);

    return (
        <div className="w-full h-full flex items-center justify-between">
            {(!gameInfo.g4Data.team || gameInfo.g4Data.team.length < 3) &&
            gameInfo.activeGame?.type !== 'Frizētava' ? (
                <div className="w-3/12 h-full">
                    <ActiveSidebar />
                </div>
            ) : null}

            <div className="flex-1 relative h-full flex flex-col py-10 justify-center">
                <AviableFunds />

                <PlayerOptions />

                <AdminBottomOptions />
            </div>

            {gameInfo.activeGame?.type === 'Viesnīca' ? (
                <div className="h-full">
                    <G5ExtraInfo />
                </div>
            ) : null}
        </div>
    );
}

export default PlayerGame;
