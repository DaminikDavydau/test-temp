import React from 'react';
import { UserInfo, selectUser } from '../../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdmin } from '../../requests/adminRequests';

const AdminControls = () => {
    const dispatch = useDispatch();

    const userInfo: UserInfo = useSelector(selectUser);

    const handleDelete = async (id: string) => {
        await deleteAdmin({ dispatch, id });
    };

    return (
        <div className="w-full max-w-[600px] gap-3 grid grid-cols-3 mt-8 pb-40">
            {userInfo.admins?.map((admin, i) => (
                <div
                    className="relative p-2 w-full rounded-sm border flex flex-col"
                    key={i}
                >
                    <strong>{admin.name}</strong>
                    <small>{admin.email}</small>
                    <small className="font-bold mt-0.5 text-BGdark_lightblue-lighter">
                        {admin.role === 1 ? 'Teacher' : 'Admin'}
                    </small>

                    <button
                        className="absolute -top-1 -right-1 bg-red-500 flex items-center justify-center w-5 h-5 rounded-full text-white text-lg"
                        onClick={() => handleDelete(admin._id)}
                    >
                        -
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AdminControls;
