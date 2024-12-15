import React from 'react';
import LoadingWhite from '../loading/LoadingWhite';

interface Props {
    text: string;
    fn: any;
    disabled: boolean;
    clicked: boolean;
    id?: string;
}

const ChangeYearButton: React.FC<Props> = ({ text, fn, disabled, clicked, id }) => {
    return (
        <div className="relative">
            <button
                id={id}
                disabled={disabled}
                className={`bg-BGdark_lightblue text-white w-full h-[50px] text-base rounded-sm  ${
                    disabled && 'opacity-70 cursor-default'
                }`}
                onClick={(e) => fn(e)}
            >
                {!clicked ? (
                    <p className="text-white">{text}</p>
                ) : (
                    <LoadingWhite />
                )}
            </button>
        </div>
    );
};

export default ChangeYearButton;

//blur:

// background: #575D68;
// filter: blur(4px);
// border-radius: 3px;
