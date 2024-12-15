import React, { useEffect, useState } from 'react';
import { createUser, getAdmins } from '../../requests/adminRequests';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { UserInfo, selectUser } from '../../redux/slices/userSlice';

const AdminForm = () => {
    const dispatch = useDispatch();

    const languageInfo: LanguageInfo = useSelector(selectLanguage);
    const userInfo: UserInfo = useSelector(selectUser);

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        if (!userInfo.admins) {
            getAdmins({ dispatch });
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        if (!name || !email || !role) {
            return;
        }

        setLoading(true);

        await createUser({ name, email, role: Number(role), dispatch });

        setName('');
        setEmail('');
        setRole('');

        setLoading(false);
    };

    return (
        <form
            className="w-full max-w-[600px] gap-2 flex flex-col"
            onSubmit={handleSubmit}
        >
            <strong className="text-2xl">
                {languageInfo.language['admin-screen']['new-admin']}
            </strong>

            <div className="flex flex-col gap-1 mt-2">
                <label
                    className="form_label flex items-center justify-start gap-1 w-full"
                    htmlFor="name"
                >
                    {languageInfo.language['join-game-screen'].name}{' '}
                    <span className="text-red-500">*</span>
                </label>

                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={languageInfo.language['join-game-screen'].name}
                    className="h-10"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label
                    className="form_label flex items-center justify-start gap-1 w-full"
                    htmlFor="email"
                >
                    {languageInfo.language['profile-screen'].email}{' '}
                    <span className="text-red-500">*</span>
                </label>

                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={languageInfo.language['profile-screen'].email}
                    className="h-10"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label
                    className="form_label flex items-center justify-start gap-1 w-full"
                    htmlFor="role"
                >
                    {languageInfo.language['admin-screen'].role}{' '}
                    <span className="text-red-500">*</span>
                </label>

                <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-10"
                >
                    <option value=""></option>
                    <option value="1">
                        {languageInfo.language['admin-screen'].teacher}
                    </option>
                    <option value="2">
                        {languageInfo.language['admin-screen'].admin}
                    </option>
                </select>
            </div>

            <button
                type="submit"
                className="px-8 h-12 bg-BGgreen text-white mt-2 max-w-[200px]"
                disabled={loading}
            >
                {languageInfo.language['admin-screen'].save}
            </button>
        </form>
    );
};

export default AdminForm;
