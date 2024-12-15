import React from 'react';
import AdminSidebar from '../components/navigation/AdminSidebar';

const AdminModule: React.FC<{ children?: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div className="w-full flex items-start justify-start h-full">
            <AdminSidebar />

            <div className="flex flex-1 items-center justify-start flex-col h-full p-8 pt-16">
                {children}
            </div>
        </div>
    );
};

export default AdminModule;
