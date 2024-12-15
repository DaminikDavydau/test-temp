import React from 'react';
import Image from 'next/image';

interface Props {
    id?: string;
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeCheckbox: React.FC<Props> = ({
    checked,
    setChecked
}) => {
    return (
        <div
            id={'home-check-box'}
            onClick={() => setChecked(!checked)}
            className={`${
                checked ? 'bg-BGgray-darker' : 'bg-white border-gray-700'
            } w-5 h-5 flex items-center justify-center border-2 border-BGgray_light mr-3`}
        >
            {checked && (
                <Image
                    width={12}
                    height={12}
                    src="/icons/white-checkmark.png"
                    objectFit="cover"
                />
            )}
        </div>
    );
};

export default HomeCheckbox;
