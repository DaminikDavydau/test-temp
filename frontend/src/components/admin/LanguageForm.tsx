import React, { useState } from 'react';
import { uploadLanguage } from '../../requests/adminRequests';
import { useDispatch, useSelector } from 'react-redux';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';

const LanguageForm = () => {
    const dispatch = useDispatch();

    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectFile = (incFiles: FileList) => {
        const file = incFiles[0];

        if (file.type === 'application/json') {
            setFile(file);
        }
    };

    const handleDrag = function (e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = function (e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            selectFile(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            selectFile(e.target.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading || !file) {
            return;
        }

        setLoading(true);

        const success = await uploadLanguage({ languageJson: file, dispatch });

        if (success) {
            setFile(null);
            alert(languageInfo.language['admin-screen']['upload-success']);
        }

        setLoading(false);
    };

    return (
        <form className="w-full max-w-[600px]" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
                <label
                    className="form_label flex items-center justify-start gap-1 w-full"
                    htmlFor="files"
                >
                    {languageInfo.language['admin-screen']['language-json']}{' '}
                    <span className="text-red-500">*</span>
                </label>

                <div
                    className={`w-full flex flex-col border-2 border-dashed relative h-28 rounded-lg ${
                        dragActive && 'border-pink-500'
                    }`}
                    onDrag={handleDrag}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        name="files"
                        id="files"
                        className="hidden"
                        accept="application/JSON"
                        multiple
                        onChange={handleFileSelect}
                    />

                    <div className="absolute w-full h-full flex items-center justify-center bg-transparent p-1">
                        <div
                            className={`flex w-full h-full flex-col items-center justify-center`}
                        >
                            <p>
                                {
                                    languageInfo.language['admin-screen'][
                                        'upload-json'
                                    ]
                                }
                            </p>

                            <small>
                                {
                                    languageInfo.language['admin-screen'][
                                        'click-to-select'
                                    ]
                                }
                            </small>
                        </div>
                    </div>

                    <label
                        htmlFor="files"
                        className="w-full h-full rounded-md cursor-pointer bg-transparent z-10"
                    ></label>
                </div>

                <div className="overflow-x-auto w-full whitespace-nowrap py-2">
                    {file && (
                        <div className={`inline-block mr-2 h-20`}>
                            <div className="relative flex flex-col items-center justify-center group w-full h-full rounded-md border-2 px-2">
                                <p>{file.name.replace('.json', '')}</p>

                                <strong>.json</strong>

                                <button
                                    className="opacity-0 group-hover:opacity-100 transition-none absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 text-lg z-10 text-white"
                                    onClick={(e) => {
                                        e.preventDefault();

                                        setFile(null);
                                    }}
                                    type="button"
                                >
                                    -
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="px-8 h-12 bg-BGgreen text-white"
                disabled={loading}
            >
                {languageInfo.language['admin-screen'].save}
            </button>
        </form>
    );
};

export default LanguageForm;
