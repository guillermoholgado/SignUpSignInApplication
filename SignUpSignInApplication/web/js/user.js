
class User{
  
    constructor(id=0,
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
        this.phone= phone;
        this.city=city;
        this.email=email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleInitial=middleInitial;
        this.password = password;
        this.state=state;
        this.city=city;
        this.street=street;
    }
    
    static fromJSON(json){
        return new User(
                json.id,
                json.firstName,
                json.lastName,
                json.middleInitial,
                json.email,
                json.city,
                json.phone,
                json.password,
                json.street,
                json.state,
                json.zip,
                 
                );
    }
}

export{User};
