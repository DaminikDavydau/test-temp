import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearNotification,
    selectNotification,
} from '../../redux/slices/notificationSlice';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

const NOTIF_INTERVAL = 5;

function Notification() {
    const notificationInfo = useSelector(selectNotification);
    const dispatch = useDispatch();

    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [notifTimer, setNotifTimer] = useState(NOTIF_INTERVAL);

    useEffect(() => {
        if (!notificationInfo.message) {
            setNotifTimer(NOTIF_INTERVAL);
            return;
        }

        const countDownInterval = setInterval(() => {
            if (notifTimer > 0) {
                setNotifTimer(notifTimer - 1);
            } else {
                dispatch(clearNotification());
            }
        }, 1000);
        return () => {
            clearInterval(countDownInterval);
        };
    }, [notifTimer, notificationInfo.message]);

    if (
        notificationInfo.type !== 'error' &&
        notificationInfo.type !== 'success' &&
        notificationInfo.type !== 'loading'
    ) {
        return null;
    }

    if (
        !notificationInfo.message ||
        !languageInfo.language['server-notifications'][notificationInfo.message]
    ) {
        return null;
    }

    return (
        <div className="w-full flex items-start justify-center absolute top-0 left-0 z-50 mt-28">
            <div className="w-80 p-4 bg-BGlight-white border-2 border-BGgray-dark">
                <p className="text-base font-mono">
                    {
                        languageInfo.language['server-notifications'][
                            notificationInfo.message
                        ]
                    }
                </p>
            </div>
        </div>
    );
}

export default Notification;
