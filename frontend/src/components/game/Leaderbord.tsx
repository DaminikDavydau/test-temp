import React from 'react'
import AdminBottomOptions from './BottomOptions';
import LeaderboardPlayers from './LeaderboardPlayers';

function Leaderbord() {
    return (
        <div className="page flex flex-col items-center justify-between">
            <LeaderboardPlayers />

            <AdminBottomOptions />
        </div>
    )
}

export default Leaderbord