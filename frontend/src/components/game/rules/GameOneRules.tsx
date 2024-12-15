import React from 'react';
import { ruleVariablesArray } from './../../../data/ruleVariables';
import RuleTable from './RuleTable';
import {
    LanguageInfo,
    selectLanguage,
} from '../../../redux/slices/languageSlice';
import { useSelector } from 'react-redux';

function GameOneRules() {
    const languageInfo: LanguageInfo = useSelector(selectLanguage);

    return (
        <div className="w-full flex flex-col items-center justify-start pt-10">
            <h3 className="mb-2">
                {languageInfo.language['g1-screens'].rules.chances}
            </h3>

            <div className="flex flex-col items-center justify-start h-60 lg:h-80 xl:h-auto overflow-y-scroll px-4">
                <RuleTable
                    values={ruleVariablesArray.businessOne}
                    icon="/icons/hairdresser-black.png"
                />

                <RuleTable
                    values={ruleVariablesArray.businessTwo}
                    icon="/icons/farm-house-black.png"
                />

                <RuleTable
                    values={ruleVariablesArray.businessThree}
                    icon="/icons/shop-black.png"
                />

                <RuleTable
                    values={ruleVariablesArray.businessFour}
                    icon="/icons/hospital-black.png"
                />

                <RuleTable
                    values={ruleVariablesArray.businessFive}
                    icon="/icons/bank-black.png"
                />
            </div>
        </div>
    );
}

export default GameOneRules;
