import Head from "next/head";
import React from "react"
import AuthForm from "../../src/components/auth/AuthForm";
import Navigation from "../../src/components/navigation/Navigation";
import CokkiePopup from "../../src/components/notifs/CokkiePopup";
import Notification from "../../src/components/notifs/Notification";
import { appName } from "../../src/constants/constants";

function Login() {
    return (
        <div className="page">
            <Head>
                <title>{appName} | login</title>
            </Head>

            <Navigation />

            <Notification />

            <CokkiePopup />

            <AuthForm />
        </div>
    )
}

export default Login