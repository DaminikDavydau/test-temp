import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import JoinGameContainer from '../../src/components/join/JoinGameContainer';
import CokkiePopup from '../../src/components/notifs/CokkiePopup';
import Notification from '../../src/components/notifs/Notification';
import { appName } from '../../src/constants/constants';

function Code() {
    const router = useRouter();

    const {code} = router.query;

    return (
        <div className="page">
            <Head>
                <title>{appName} | Join game</title>
            </Head>

            <Notification />

            <CokkiePopup />

            <JoinGameContainer />
        </div>
    );
}

export default Code;
