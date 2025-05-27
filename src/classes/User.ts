const bcrypt = require('bcrypt');

export default class User {
    public passwordHash: string;
    constructor(public username: string){
        this.username = String(username);
        this.passwordHash = '';
    }

    validUsername(){
        return this.username?.length && (/^[a-zA-Z0-9_]{3,30}$/.test(this.username))
    }

    //validate password before storing hashed password in class variable - return value is success of operation
        //storing the plaintext password in memory could be a security risk - instead bring it straight from request params into hashing function with validation inline
    async setPassword(password: string){
        if(!(password?.length && (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,32}$/.test(password)))) return false;
        this.passwordHash = await bcrypt.hash(password, 10);
        return true;
    }

    format(){
        return {username: this.username, passwordHash: this.passwordHash};
    }
}