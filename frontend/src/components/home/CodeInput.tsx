import React from 'react';

interface Props {
    text: string;
    type: 'text' | 'number' | 'email' | 'password';
    placeholder: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
}

const CodeInput: React.FC<Props> = ({ text, type, setText, placeholder }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[50px]"
        />
    );
};

export default CodeInput;
