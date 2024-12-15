import Head from 'next/head';
import React from 'react';
import ForgotPasswordForm from '../../src/components/auth/ForgotPasswordForm';
import Navigation from '../../src/components/navigation/Navigation';
import CokkiePopup from '../../src/components/notifs/CokkiePopup';
import Notification from '../../src/components/notifs/Notification';
import { appName } from '../../src/constants/constants';

function ForgotPassword() {
    return (
        <div className="page">
            <Head>
                <title>{appName} | Paroles maiņa</title>
            </Head>

            <Navigation />

            <Notification />

            <CokkiePopup />

            <ForgotPasswordForm />
        </div>
    );
}

export default ForgotPassword;
