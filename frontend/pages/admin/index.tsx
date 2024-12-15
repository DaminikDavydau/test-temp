import React from 'react';
import PageModule from '../../src/modules/PageModule';
import { UserInfo, selectUser } from '../../src/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import AdminModule from '../../src/modules/AdminModule';
import { LanguageInfo, selectLanguage } from '../../src/redux/slices/languageSlice';

const Index = () => {
    const userInfo: UserInfo = useSelector(selectUser);
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <PageModule title="Business games | Admin" hasFooter>
            {userInfo.info && userInfo.info.role > 1 && (
                <AdminModule>
                    <p>{languageInfo.language['admin-screen']['admin-panel']}</p>
                </AdminModule>
            )}
        </PageModule>
    );
};

export default Index;
