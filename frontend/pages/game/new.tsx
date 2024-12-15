import React from 'react'
import Head from "next/head"
import { appName } from '../../src/constants/constants'
import CreateGameContainer from '../../src/components/createGame/CreateGameContainer'
import Notification from '../../src/components/notifs/Notification'
import CokkiePopup from '../../src/components/notifs/CokkiePopup';

function NewGame() {
    return (
        <div className="page">
            <Head>
                <title>{appName} | create game</title>
            </Head>

            <Notification />

            <CokkiePopup />

            <CreateGameContainer />
        </div>
    )
}

export default NewGame