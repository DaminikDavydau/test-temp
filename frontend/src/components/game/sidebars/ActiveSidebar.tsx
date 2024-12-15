import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import G1SidebarInfo from './G1SidebarInfo';
import G2SidebarInfo from './G2SidebarInfo';
import G3SidebarInfo from './G3SidebarInfo';
import G4SidebarInfo from './G4SidebarInfo';
import G5SidebarInfo from './G5SidebarInfo';

function ActiveSidebar() {
    const gameInfo: GameInfo = useSelector(selectGame);

    if (!gameInfo.activeGame) {
        return null;
    }

    return (
        <div className="w-full h-full border-r-2 border-BGlight">
            {gameInfo.activeGame.type === 'Bankrots' ? (
                <G1SidebarInfo />
            ) : gameInfo.activeGame.type === 'Krīzes gads' ? (
                <G2SidebarInfo />
            ) : gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi' ? (
                <G3SidebarInfo />
            ) : gameInfo.activeGame.type === 'Viesnīca' ? (
                <G5SidebarInfo />
            ) : gameInfo.activeGame.type === 'Ražošana' ? (
                <G4SidebarInfo />
            ) : null}
        </div>
    );
}

export default ActiveSidebar;
