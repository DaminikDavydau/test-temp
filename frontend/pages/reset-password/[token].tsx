import Head from 'next/head';
import React from 'react';
import ResetPasswordForm from '../../src/components/auth/ResetPasswordForm';
import Navigation from '../../src/components/navigation/Navigation';
import CokkiePopup from '../../src/components/notifs/CokkiePopup';
import Notification from '../../src/components/notifs/Notification';
import { appName } from '../../src/constants/constants';

function Token() {
    return (
        <div className="page">
            <Head>
                <title>{appName} | Paroles maiņa</title>
            </Head>

            <Navigation />

            <Notification />

            <CokkiePopup />

            <ResetPasswordForm />
        </div>
    );
}

export default Token;
