import React from 'react';

interface Props {
    text: string;
    type: 'text' | 'number' | 'email' | 'password';
    placeholder: string;
    setText:
        | React.Dispatch<React.SetStateAction<string | null | undefined>>
        | React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ProfileInput: React.FC<Props> = ({
    text,
    type,
    setText,
    placeholder,
}) => {
    return <strong>{text}</strong>;
};

export default ProfileInput;
