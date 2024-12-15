import React, { useEffect, useState } from 'react';
import ChangeYearButton from '../game/ChangeYearButton';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

function CokkiePopup() {
    const [show, setShow] = useState(false);

    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');

        if (!cookiesAccepted || cookiesAccepted !== 'true') {
            setShow(true);
        }
    }, []);

    const dontAccept = () => {
        setShow(false);
        return;
    };

    const accept = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setShow(false);
    };

    if (!show) {
        return null;
    }

    return (
        <div className="w-full h-full fixed top-0 left-0 flex items-center justify-center z-50 bg-tpBg">
            <div className="w-96 h-60 flex rounded-md bg-BGlight-white flex-col items-center justify-between p-4">
                <h3>{languageInfo.language.notifications.cookies}</h3>

                <p>{languageInfo.language.notifications['cookies-accenpt']}</p>

                <div className="flex w-full justify-between items-center">
                    <div className="w-40">
                        <ChangeYearButton
                            text={languageInfo.language.notifications.decline}
                            fn={dontAccept}
                            disabled={false}
                            clicked={false}
                        />
                    </div>

                    <div className="w-40">
                        <ChangeYearButton
                            id="acceptCookiesButton"
                            text={languageInfo.language.notifications.accept}
                            fn={accept}
                            disabled={false}
                            clicked={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CokkiePopup;
