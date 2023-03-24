const fakeBDD = require('../BDD/bdd');

class User{
    getUsers(){
        return fakeBDD.users;
    }

    getUserByHashId(hashId){
        usersList = this.getUsers;
        for(let user of users){
            if (user.hashId == hashId){
                return user;
            }
        }
        return null;
    }
    
    login(hashFromFront){
        // pour chaque élément de hash : compare avec hashFromIonic
        for (let elt of fakeBDD.hash){
            if (elt.hash == hashFromFront){
                const status = 200;
                const validityPeriodInMinute = 30;
                const token = utils.generateToken(30);
                const hashedToken = utils.createHash(token, utils.salt);
                const endOfValidity = Date.now() + 60 * validityPeriodInMinute;
                return {
                    "status": status,
                    "token": token,
                    "hashedToken": hashedToken,
                    "endOfValidity": endOfValidity,
                };
                
            }
        }
        const status = 401;
        const error = "invalid credentials";
        return {"status": status, "error": error};


    }
}

const users = new User();

module.exports = users;