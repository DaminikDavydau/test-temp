export const valid = (username: string, email: string, password: string) => {
    if (!username || !email || !password)
        return 'Lūdzu aizpildiet visus lauciņus';

    if (!validateUsername(username))
        return 'Lietotājvārds nedrīkst saturēt īpašās rakstzīmes';

    if (!validateEmail(email)) {
        return 'Nepareizs epasta formāts';
    }

    if (password.length < 6) {
        return 'Parolei jābūt vismaz 6 rakstzīmes garai';
    }
};

export const validateEmail = (email: string) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const validateUsername = (username: string) => {
    if (username.length > 15) {
        return false;
    }

    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(username)) {
        return false;
    }

    return true;
};
