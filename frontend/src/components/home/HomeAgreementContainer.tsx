import React, { useEffect, useState } from 'react';
import HomeCheckbox from './HomeCheckbox';

interface Props {
    id?: string;
    agreement: string;
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeAgreementContainer: React.FC<Props> = ({
    id,
    checked,
    setChecked,
    agreement,
}) => {
    return (
        <div className="w-full flex mt-6 justify-start items-start">
            <HomeCheckbox checked={checked} setChecked={setChecked} />

            <div className="flex-1">
                <a
                    href="/files/Privatuma_politika.pdf"
                    download
                    className="text-sm"
                >
                    {agreement}
                </a>
            </div>
        </div>
    );
};

export default HomeAgreementContainer;
