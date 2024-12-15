import React from 'react';
import { appName } from '../../constants/constants';

function HomeLogo() {
    return (
        <div className="w-full flex justify-center items-center h-2/6 max-h-64">
            <img
                src="/big-logo.svg"
                alt={`${appName} logo`}
                className="h-full"
            />
        </div>
    );
}

export default HomeLogo;
