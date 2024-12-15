import React from 'react';
import LoadingWhite from '../loading/LoadingWhite';

interface Props {
    text: string;
    fn: any;
    disabled: boolean;
    clicked: boolean;
    id?: string;
}

const JoinGameButton: React.FC<Props> = ({ text, fn, disabled, clicked, id }) => {
    const doStuff = async (e: any) => {
        if (clicked) {
            return;
        }

        await fn(e);
    };

    return (
        <div className="relative">
            <button
                id={id}
                disabled={disabled}
                className={`bg-BGdark_lightblue-lighter text-white w-[170px] h-[50px] text-base rounded-sm ${
                    disabled && 'opacity-70 cursor-default'
                }`}
                onClick={(e) => doStuff(e)}
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

export default JoinGameButton;
