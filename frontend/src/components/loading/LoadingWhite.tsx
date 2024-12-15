import React from 'react';

function LoadingWhite() {
    return (
        <div className="h-full flex items-center justify-center py-2">
            <img
                src="/icons/loading_white.png"
                alt="loading white"
                className="h-full animate-spin max-h-6"
            />
        </div>
    );
}

export default LoadingWhite;
