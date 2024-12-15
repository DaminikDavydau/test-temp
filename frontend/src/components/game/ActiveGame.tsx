import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';
import { selectUser, UserInfo } from '../../redux/slices/userSlice';
import AdminGame from './AdminGame';
import PlayerGame from './PlayerGame';

function ActiveGame() {
    const gameInfo: GameInfo = useSelector(selectGame);
    const userInfo: UserInfo = useSelector(selectUser);

    const [adminView] = useState(
        userInfo.info &&
            gameInfo.activeGame &&
            userInfo.info._id === gameInfo.activeGame.admin
    );

    if (!gameInfo.activeGame || !gameInfo.admin) {
        return null;
    }

    if (adminView) {
        return <AdminGame />;
    }

    return <PlayerGame />;
}

export default ActiveGame;
