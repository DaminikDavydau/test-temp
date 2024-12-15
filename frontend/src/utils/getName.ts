const getFullName = (fullName: string) => {
    const splitName = fullName.split(' ');

    const name = splitName[0];
    const surname = splitName[splitName.length - 1];

    return { name, surname };
};

const getPlayerName = (fullName: string | undefined) => {
    if (!fullName) {
        return '';
    }
    const splitName = fullName.split(' ');

    const name = splitName[0];
    const surnameLetter = splitName[splitName.length - 1][0];

    return `${name} ${surnameLetter}.`;
};

export { getFullName, getPlayerName };
