import React from 'react';

interface Props {
    icon: string;
    returnRate: number;
    chance: string;
}

const G1SidebarOption: React.FC<Props> = ({ icon, returnRate, chance }) => {
    return (
        <div className="flex items-center justify-center h-12">
            <img src={icon} alt="game" className="w-10 mr-2" />

            <div className="flex h-full items-center justify-center">
                <div className="flex items-center justify-center border-2 border-BGgray-darker w-20 h-full">
                    <p>{returnRate}%</p>
                </div>

                <div className="flex items-center justify-center border-2 border-BGgray-darker w-20 h-full border-l-0">
                    <p>{chance}</p>
                </div>
            </div>
        </div>
    );
};

export default G1SidebarOption;
