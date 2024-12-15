import React from 'react';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLanguage } from '../../requests/languageRequests';

const LanguageControls = () => {
    const dispatch = useDispatch();

    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const handleDelete = async (id: string) => {
        await deleteLanguage({ dispatch, id });
    };

    return (
        <div className="w-full max-w-[600px] gap-3 grid grid-cols-3 mt-8">
            {languageInfo.languages?.map((lng, i) => (
                <div className="relative p-2 w-full rounded-sm border" key={i}>
                    {lng.language_id.toUpperCase()}

                     {lng.language_id.toLowerCase() !== 'lv' && (
                        <button
                            className="absolute -top-1 -right-1 bg-red-500 flex items-center justify-center w-5 h-5 rounded-full text-white text-lg"
                            onClick={() => handleDelete(lng._id)}
                        >
                            -
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default LanguageControls;
