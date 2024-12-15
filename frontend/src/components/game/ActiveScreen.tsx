import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import ActiveGame from './ActiveGame';
import BancruptScreen from './BancruptScreen';
import Leaderbord from './Leaderbord';
import PausedGame from './PausedGame';
import RuleContainer from './rules/RuleContainer';
import ShowcaseScreen from './showcase/ShowcaseScreen';
import WaitingRoom from './WaitingRoom';

function ActiveScreen() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);

    if (!gameInfo.activeGame) {
        return null;
    }

    if (gameInfo.activeGame.type === 'Ražošana') {
        if (gameInfo.returns || gameInfo.crisisYearResult) {
            return <ShowcaseScreen />;
        }

        if (gameInfo.showRules) {
            return <RuleContainer />;
        }

        if (
            !gameInfo.activeGame.year ||
            (gameInfo.activeGame.year !== 'yearOne' &&
                !gameInfo.activeGame.started)
        ) {
            return <Leaderbord />;
        }

        if (gameInfo.playerInfo?.is_bancrupt) {
            return <BancruptScreen />;
        }

        if (
            gameInfo.activeGame.paused &&
            userInfo.info?._id !== gameInfo.activeGame.admin
        ) {
            return <PausedGame />;
        }

        if (gameInfo.activeGame.started) {
            return <ActiveGame />;
        }

        if (!gameInfo.activeGame.started) {
            return <WaitingRoom />;
        }
    }

    if (gameInfo.showRules) {
        return <RuleContainer />;
    }

    if (
        gameInfo.playerInfo?.is_bancrupt &&
        gameInfo.activeGame.type === 'Lēnāk brauksi - tālāk tiksi' &&
        (gameInfo.returns || gameInfo.crisisYearResult)
    ) {
        return <ShowcaseScreen />;
    }

    if (
        !gameInfo.playerInfo?.is_bancrupt &&
        (gameInfo.returns || gameInfo.crisisYearResult)
    ) {
        return <ShowcaseScreen />;
    }

    if (
        !gameInfo.activeGame.year ||
        (gameInfo.activeGame.year !== 'yearOne' && !gameInfo.activeGame.started)
    ) {
        return <Leaderbord />;
    }

    if (gameInfo.playerInfo?.is_bancrupt) {
        return <BancruptScreen />;
    }

    if (
        gameInfo.activeGame.paused &&
        userInfo.info?._id !== gameInfo.activeGame.admin
    ) {
        return <PausedGame />;
    }

    if (gameInfo.activeGame.started) {
        return <ActiveGame />;
    }

    if (!gameInfo.activeGame.started) {
        return <WaitingRoom />;
    }

    return null;
}

export default ActiveScreen;
