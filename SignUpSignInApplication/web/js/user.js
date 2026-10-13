class User{
    constructor(id,
                zip,
                phone,
                city,
                email,
                firstName,
                lastName,
                middleInitial,
                password,
                state,
                street){
        this.id=id;
        this.zip=zip;
        this.phone=phone;
        this.city=city;
        this.email=email;
        this.firstName=firstName;
        this.lastName=lastName;
        this.middleInitial=middleInitial;
        this.password=password;
        this.state=state;
        this.street=street;
    }
    static fromJSON(json){
        return new User(json.id,
                        json.zip,
                        json.phone,
                        json.city,
                        json.email,
                        json.firstName,
                        json.lastName,
                        json.middleInitial,
                        json.password,
                        json.state,
                        json.street);
    }
}
export {User};
