const valid = (username: string, email: string, password: string, cf_password: string) => {
    if(!username || !email || !password)
        return "Please fill in all fields."

    if(!validateUsername(username))
        return "Username can't contain special characters";

    if(!validateEmail(email)){
        return "Invalid email."
    }

    if(password.length < 6){
        return "Password must be at least 6 characters."
    }
}

const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const validateUsername = (username: string) => {
    if(username.length > 15){
        return false;
    }

    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(format.test(username)){
        return false;
    }

    return true;
}

export default valid;

export {
    validateEmail,
    validateUsername
};