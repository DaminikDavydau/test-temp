import React from 'react'

interface Props{
    error: string;
}

const Error: React.FC<Props> = ({error}) => {
    if(!error){
        return null;
    }

    return (
        <div className="w-full p-2 bg-red-600 flex items-center justify-center mb-2">
            <p className="text-white">{error}</p>
        </div>
    )
}

export default Error