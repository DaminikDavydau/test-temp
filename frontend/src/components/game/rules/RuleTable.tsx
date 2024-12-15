import React from 'react';

interface Value {
    percentage: string;
    chance: string;
}

interface Props {
    values: Value[];
    icon: string;
}

const RuleTable: React.FC<Props> = ({ values, icon }) => {
    return (
        <div>
            <div className="flex items-center justify-center mb-4">
                <img src={icon} alt={icon} className="h-10 mr-4" />

                <div className="flex border-2 border-BGdark-lighter items-center justify-start w-80 h-16">
                    {values.map((val, i) => {
                        return (
                            <div
                                className="w-1/5 h-full border-[1px] border-BGgray-dark flex flex-col items-center justify-center"
                                key={i}
                            >
                                <div className="w-full h-1/2 flex items-center justify-center">
                                    <p>{val.percentage}</p>
                                </div>

                                <div className="w-full h-1/2 border-t-[1px] border-BGgray-dark flex items-center justify-center">
                                    <p>{val.chance}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RuleTable;
