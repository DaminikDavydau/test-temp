import React from 'react'
import AdminBottomOptions from './BottomOptions';
import GamePlayerList from './players/GamePlayerList';

function AdminGame() {
    return (
        <div className="page flex flex-col items-center justify-between">
            <GamePlayerList />

            <AdminBottomOptions />
        </div>
    )
}

export default AdminGame