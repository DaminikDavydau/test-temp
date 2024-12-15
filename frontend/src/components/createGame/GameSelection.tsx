import React, { useState } from 'react';
import { LanguageInfo, selectLanguage } from '../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

interface Props {
    options: string[];
    activeMode: string;
    setActiveMode: React.Dispatch<React.SetStateAction<string>>;
}

const GameSelection: React.FC<Props> = ({
    activeMode,
    setActiveMode,
    options,
}) => {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    const [opened, setOpened] = useState(false);

    const changeActiveMode = (mode: string) => {
        setActiveMode(mode);
        setOpened(false);
    };

    if (!languageInfo.language) {
        return null;
    }

    if (opened) {
        return (
            <div className="w-full flex flex-col items-center justify-start">
                <div
                    className="flex w-full justify-between items-center bg-BGlight-white p-2 rounded-sm border-b-[1px] border-BGlight cursor-pointer"
                    onClick={() => setOpened(false)}
                >
                    <p>
                        {activeMode === ''
                            ? languageInfo.language['create-game-screen'][
                                  'choose-game'
                              ]
                            : languageInfo.language['game-translations'][
                                  activeMode
                              ]}
                    </p>

                    <img
                        src="/svg/circled-arrow-up.svg"
                        alt="circled arrow up"
                        className="h-6"
                    />
                </div>

                {options.map((option, i) => {
                    return (
                        <div
                            id={option.replaceAll(' ', '_')}
                            key={i}
                            className="flex w-full justify-between items-center bg-BGlight-white p-2 rounded-sm border-b-[1px] border-BGlight cursor-pointer hover:bg-BG_blue-greener"
                            onClick={() => changeActiveMode(option)}
                        >
                            {languageInfo.language['game-translations'][option]}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            className="flex w-full justify-between items-center bg-BGlight-white p-2 rounded-sm cursor-pointer"
            onClick={() => setOpened(true)}
        >
            <p>
                {activeMode === ''
                    ? languageInfo.language['create-game-screen']['choose-game']
                    : languageInfo.language['game-translations'][activeMode]}
            </p>

            <img
                src="/svg/circled-arrow-down.svg"
                alt="circled arrow down"
                className="h-6"
            />
        </div>
    );
};

export default GameSelection;
