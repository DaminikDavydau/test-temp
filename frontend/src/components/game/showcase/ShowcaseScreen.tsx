import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../../redux/slices/gameSlice';
import AviableFunds from '../AviableFunds';
import AdminBottomOptions from '../BottomOptions';
import FirstResultShow from './FirstResultShow';
import SecondResultShow from './SecondResultShow';
import PlayerOptions from '../PlayerOptions';
import G3Showcase from './G3Showcase';
import G5Showcase from './G5Showcase';
import G4Showcase from './G4Showcase';
import G6Showcase from './G6Showcase';

function ShowcaseScreen() {
    const gameInfo: GameInfo = useSelector(selectGame);

    if (gameInfo.activeGame && gameInfo.activeGame.type === 'Krīzes gads') {
        return (
            <div className="page flex flex-col items-center justify-center">
                {gameInfo.crisisYearResult?.page === 1 ? (
                    <FirstResultShow />
                ) : gameInfo.crisisYearResult?.page === 2 ? (
                    <SecondResultShow />
                ) : null}

                <AdminBottomOptions />
            </div>
        );
    } else if (
        gameInfo.activeGame &&
        gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi' &&
        gameInfo.crisisYearResult
    ) {
        return (
            <div className="page flex flex-col items-center justify-center">
                <G3Showcase />

                <AdminBottomOptions />
            </div>
        );
    } else if (
        gameInfo.activeGame &&
        gameInfo.activeGame.type === 'Viesnīca' &&
        gameInfo.crisisYearResult
    ) {
        return (
            <div className="page flex flex-col items-center justify-center">
                <G5Showcase />

                <AdminBottomOptions />
            </div>
        );
    } else if (gameInfo.activeGame?.type === 'Ražošana') {
        return (
            <div className="page flex flex-col items-center justify-center">
                <G4Showcase />

                <AdminBottomOptions />
            </div>
        );
    } else if (gameInfo.activeGame?.type === 'Frizētava') {
        return (
            <div className="page flex flex-col items-center justify-center">
                <G6Showcase />

                <AdminBottomOptions />
            </div>
        );
    } else
        return (
            <div className="page flex flex-col items-center justify-center">
                <AviableFunds />

                <PlayerOptions />

                <AdminBottomOptions />
            </div>
        );
}

export default ShowcaseScreen;
