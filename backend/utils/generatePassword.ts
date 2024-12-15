export const generatePassword = () => {
    let codeChars: number[] = [];

    while (codeChars.length < 6) {
        let codeChar = Math.floor(Math.random() * (9 + 1));

        codeChars = [...codeChars, codeChar];
    }

    let password = '';

    codeChars.forEach((c) => {
        password = `${password}${c}`;
    });

    return password;
};
