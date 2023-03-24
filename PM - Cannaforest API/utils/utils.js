const bcrypt = require('bcryptjs');  // npm i --save bcryptjs

class Utils {

  salt = "$2a$15$5ZjsrtGFP/r2Z01E5Xme0O€£DePAL";
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-=*.,;:$#})@!";

  generateToken(nbr) {
    return bcrypt.genSaltSync(nbr);
  }

  generateString(length) {
    let result = '';
    const charactersLength = this.chars.length;
    for ( let i = 0; i < length; i++ ) {
        result += this.chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  createHash(string) {
    return bcrypt.hashSync(string, this.salt);
  }

  sendEmail(email, messageOfEmail) {
    // On doit envoyer le codeOTP à l'email de l'utilisateur
    // quand l'email a bien été envoyé, retourne "true"
    return true;
  }

  compareStringToHashedString(string, hashedString) {
    return bcrypt.compareSync(string, hashedString); // true if OK else false
  }
}

const utils = new Utils();
module.exports = utils;



// GENERATEUR DE CODE A N CHIFFRES
  // codeGenerator(numberOfChars) {
  //   let code = "";

  //   for (let i = 0; i < numberOfChars; i++) {
  //     let myNbr = Math.random() * 10;
  //     myNbr = Math.floor(myNbr);
  //     code += myNbr;
  //   }
  //   return code;
  // }