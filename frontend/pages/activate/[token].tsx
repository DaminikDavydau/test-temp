import React from "react";
import Head from "next/head"
import { useEffect } from "react"; 
import { useRouter } from "next/dist/client/router";
import { activateAccount } from "../../src/requests/userRequests";
import Notification from "../../src/components/notifs/Notification";
import { useDispatch } from "react-redux";
import { appName } from "../../src/constants/constants";
import Navigation from "../../src/components/navigation/Navigation";
import Footer from "../../src/components/footer/Footer";
import CokkiePopup from "../../src/components/notifs/CokkiePopup";

function ActivationToken() {
    const router = useRouter();
    const dispatch = useDispatch();

    const {token} = router.query;

    useEffect(() => {
        if(typeof(token) === "string"){
            activateAccount(dispatch, router);
        }
    }, [dispatch, router, token]);

    return (
        <div className="page">
            <Head>
                <title>{appName} | activate account</title>
            </Head>

            <Navigation />

            <Notification />

            <CokkiePopup />

            <Footer />
        </div>
    )
}

export default ActivationToken
