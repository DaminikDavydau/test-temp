import React from 'react';
import PageModule from '../../src/modules/PageModule';
import { UserInfo, selectUser } from '../../src/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import AdminModule from '../../src/modules/AdminModule';
import LanguageForm from '../../src/components/admin/LanguageForm';
import LanguageControls from '../../src/components/admin/LanguageControls';

const Languages = () => {
    const userInfo: UserInfo = useSelector(selectUser);

    return (
        <PageModule title="Business games | Languages" hasFooter>
            {userInfo.info && userInfo.info.role > 1 && (
                <AdminModule>
                    <LanguageForm />

                    <LanguageControls />
                </AdminModule>
            )}
        </PageModule>
    );
};

export default Languages;
