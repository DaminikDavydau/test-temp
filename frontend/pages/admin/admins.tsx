import React from 'react';
import PageModule from '../../src/modules/PageModule';
import { UserInfo, selectUser } from '../../src/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import AdminModule from '../../src/modules/AdminModule';
import AdminForm from '../../src/components/admin/AdminForm';
import AdminControls from '../../src/components/admin/AdminControls';

const Admins = () => {
    const userInfo: UserInfo = useSelector(selectUser);

    return (
        <PageModule title="Business games | Admins" hasFooter>
            {userInfo.info && userInfo.info.role > 1 && (
                <AdminModule>
                    <AdminForm />

                    <AdminControls />
                </AdminModule>
            )}
        </PageModule>
    );
};

export default Admins;
