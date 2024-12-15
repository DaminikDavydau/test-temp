import Link from 'next/link';
import React from 'react';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

const AdminSidebar = () => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <ul className="w-60 flex flex-col h-full border-r-2">
            <li>
                <Link href="/admin/languages">
                    <div className="w-full p-4 flex items-center justify-center cursor-pointer border-b-2">
                        <p>{languageInfo.language['admin-screen'].languages}</p>
                    </div>
                </Link>
            </li>

            <li>
                <Link href="/admin/admins">
                    <div className="w-full p-4 flex items-center justify-center cursor-pointer border-b-2">
                        <p>{languageInfo.language['admin-screen'].admins}</p>
                    </div>
                </Link>
            </li>
        </ul>
    );
};

export default AdminSidebar;
