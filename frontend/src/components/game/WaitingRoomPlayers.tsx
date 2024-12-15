import React from 'react';
import { useSelector } from 'react-redux';
import { GameInfo, selectGame } from '../../redux/slices/gameSlice';

function WaitingRoomPlayers() {
    const gameInfo: GameInfo = useSelector(selectGame);

    return (
        <div className="grid grid-cols-3 mt-20 justify-center items-start max-h-80 overflow-y-scroll">
            {gameInfo.players &&
                gameInfo.players.map((player, i) => {
                    return (
                        <div className="mx-28 py-2" key={i}>
                            <p className="playerName text-xl font-montserrat text-BGdark_lightblue">
                                {player.name}
                            </p>
                        </div>
                    );
                })}
        </div>
    );
}

export default WaitingRoomPlayers;
