const path = require('path');

const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const utils = require('./utils/utils');
const fakeBDD = require('./BDD/bdd');
const config = require('./config');
const products = require('./models/product');
const users = require('./models/user');
const token = require('./models/token');
const { hash } = require('bcryptjs');

const app = express();

const port = config.port;


// ============== Password Checking ===============
function passwordChecking(password) {
  let isPasswordOk = bcrypt.compareSync(password, hash); // true if OK else false
  return isPasswordOk;
};

// ===============================================

// Allowed origins if skipTheCheckingOfOrigin = false
const allowedOrigins = [
  "http://localhost:5550",
  "localhost:5555",
  "http://yourapp.com",
];

// Do you want to skip the checking of the origin and grant authorization?
// si la valeur est true : skip la vérification et si la valeur est false : il vérifie
const skipTheCheckingOfOrigin = true;

// MIDDLEWARES
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      // or allow all origines (skipTheCheckingOfOrigin === true)
      console.log("origin: ", origin);
      // s'il n'y a pas d'origine (vient d'un mobile) et que la non vérification de l'origine est true, l'autorisation est accordée
      if (!origin && skipTheCheckingOfOrigin === true)
        return callback(null, true);
      // s'il y a une origine (vient d'un ordinateur) et que la non vérification de l'origine est true, l'autorisation est accordée
      if (origin && skipTheCheckingOfOrigin === true)
        return callback(null, true);

      // si l'origine n'est pas dans le tableau allowedOrigins, ça déclenche une erreur et l'autorisation n'est pas accordée (false)
      if (!allowedOrigins.includes(origin)) {
        console.log("origin: => ", origin);
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";

        return callback(new Error(msg), false);
      }
      // origin is in the array allowedOrigins so authorization is granted
      return callback(null, true);
    },
  })
);

// The following allows you to serve static files from the "public" folder
// To access a file from the public folder you have to type : localhost:6555/my-static-file.jpeg
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.use(express.json());
app.use(fileUpload());

// =============================== ROUTES ===============================
app.get("/products", (req, res) => {
  console.log("req: ", req);
  console.log("========================================================");
  console.log("req.headers: ", req.headers);
  const headers = req.headers;
  const host = headers.host;

  console.log("host: ", host);
  // on demande au model d'aller dans la class Products et exécute la méthode getProducts
  productsList = products.getProducts();
  res.json({ "items": productsList});
});

app.post("/products/:id", (req, res) => {
  console.log('id: ', req.params.id);
  productsList = products.getProducts();
  for (item of productsList) {
    if (item.id == req.params.id) {
      res.json({ "item": item });
    }
  }
});

app.post("/login", (req, res) => {  console.log("req.headers: ", req.headers);
  console.log("req.body: ", req.body);
  console.log("req.query: ", req.query);
  console.log("req.params: ", req.params);
  const password = req.body.password;
  const email = req.body.email;
  // concaténation d'email et password
  const emailNPasswordFromIonic = email + password;
  // hashage d'email et password
  const hashFromIonic = utils.createHash(emailNPasswordFromIonic, utils.salt);
  // demande au model d'aller dans la class Users et exécute la méthode login (vérifie si le hashFromIonic est déjà dans la BDD)
  const responseFromUser = users.login(hashFromIonic);
      console.log(responseFromUser);
      if (responseFromUser.status == 200) {
        const endOfValidity = responseFromUser.endOfValidity;
        const hashedToken = responseFromUser.hashedToken;
        // TODO: stocker hashedToken + endOfValidity dans la table hashed_token
        res.status(200);
        res.json({"token": responseFromUser.token});
      } else {
        res.status(401);
        res.json({"error": responseFromUser.error});
      }
});

app.post("/signup", (req, res) => {
  console.log("req.headers: ", req.headers);
  console.log("req.body: ", req.body);
  console.log("req.query: ", req.query);
  console.log("req.params: ", req.params);

  // If password and email have been sent by the user
  if (typeof(req.body.password) != "undefined" && typeof(req.body.email) != "undefined"){
    const password = req.body.password;
    const email = req.body.email;
    const emailNPassword = email + password;
    const salt = utils.salt;
    const hashedEmailNPassword = utils.createHash(emailNPassword, salt);
    const codeOTP = utils.generateString(7);
    const now = Date.now();
    const validityDurationInMinute = 10;
    console.log("now :", now);
    let codeOTPEndOfValidity = parseInt(now);
    codeOTPEndOfValidity += 1000 * 60 * validityDurationInMinute;
    // Storing in fakeBDD
    fakeBDD["pre_register"][codeOTP] = {
      "email": email,
      "hash": hashedEmailNPassword,
      "codeOTPEndOfValidity": codeOTPEndOfValidity,
    }
    
    console.log("fakeBDD: ", fakeBDD);

    // Sending a code via email
    let messageOfEmail = `Hello, your validation code is : ${codeOTP}`;
    console.log(messageOfEmail);
    let isEmailSent = utils.sendEmail(email, messageOfEmail);
  
    // Returns a message to indicate that an email containing the activation code has been sent
    if (isEmailSent == true){
      res.status(200);
      res.json({msg : `Validation code sent to ${email}`});
    }else{
      res.status(400);
      res.json({error : `Unable to send email to ${email}`});
    }
  }

  // If the codeOTP has been sent by the user (req.body.codeOTP exists)
  // lorsque l'utilisateur écrit son code reçu par email
  else if (typeof(req.body.codeOTP) != "undefined"){
    const codeOTP = req.body.codeOTP;

    // variable preUser qui stocke pre_register et le code
    const preUser = fakeBDD["pre_register"][codeOTP];
    // si preUser est inconnu, renvoie une erreur
    if(typeof(preUser) == "undefined"){
      res.status(400);
      res.json({"error": "Code not valid!"});
    }
    // si la date de validité est encore bonne
    let endOfValidity = fakeBDD["pre_register"][codeOTP]["codeOTPEndOfValidity"];
    endOfValidity = parseInt(endOfValidity);
    console.log("validity :",  fakeBDD["pre_register"][codeOTP]["codeOTPEndOfValidity"]);
    if(Date.now() < endOfValidity){
      console.log("c'est valide");
      const hash = fakeBDD["pre_register"][codeOTP]["hash"];
      const hashId = utils.generateString(7);
      fakeBDD["hashes"] = {"id": hashId, "hash": hash};
      // génère un id
      const userId = utils.generateString(7);
      // création du user
      const user = {
        "id": userId,
        "email": fakeBDD["pre_register"][codeOTP]["email"],
        "birthDate": fakeBDD["pre_register"][codeOTP]["birthDate"],
        "hashId": hashId,
      }
      // envoi du user dans la BDD
      fakeBDD["users"].push(user);
      res.status(200);
      return res.json({"msg": "Registered with success!"});
    // si la date de validité n'est plus bonne
    }else{
      // si le code écrit par l'utilisateur n'existe pas
      res.status(400);
      return res.json({"error": "Code not valid!"});
    }
  
  }
});

app.post("/upload", (req, res) => {
  if (req.files) {
    console.log("File received: ");
    console.log(req.files);

    let file = req.files.file;
    console.log("file: ", file);

    let filename = file.name;

    // Move file from memory to folder
    file.mv(`./storage/${filename}`, function (err) {
      if (err) {
        res.json({ error: err });
      } else {
        res.json({ msg: "Receipt and storage of a file with success" });
      }
    });
  } else {
  }
});

// launch server
app.listen(port, (err, res) => {
  console.log(`Listening to port ${port}`);
});
