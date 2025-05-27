export default class User {
    constructor(public username: string, public password: string){
        this.username = String(username);
        this.password = String(password);
    }

    validUsername(){
        return this.username?.length && (/^[a-zA-Z0-9_]{3,30}$/.test(this.username))
    }

    validPassword(){
        return this.password?.length && (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,32}$/.test(this.password));
    }

    format(){
        return {}
    }
}