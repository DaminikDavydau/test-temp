import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import Footer from '../footer/Footer';
import Navigation from '../navigation/Navigation';
import Notification from '../notifs/Notification';
import ActiveScreen from './ActiveScreen';
import GameHeader from './GameHeader';

function GameContainer() {
    const gameInfo: GameInfo = useSelector(selectGame);

    if (!gameInfo.activeGame || (!gameInfo.admin && !gameInfo.playerInfo)) {
        return (
            <div className="window bg-BG_blue-greener">
                <div className="window_inner">
                    <Navigation />

                    <Notification />
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="window bg-BG_blue-greener">
            <div className="window_inner">
                <Navigation />

                <GameHeader />

                <Notification />

                <ActiveScreen />
            </div>

            <Footer />
        </div>
    );
}

export default GameContainer;
