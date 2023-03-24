const public_path = `http://localhost:5550/`;
// const public_path = `http://localhost:${PORT}/`;


const products = [
    { id: 1, name: 'Sativa', price: 50, category: 'Portugal', img: public_path + 'images/sativa.png' },
    { id: 2, name: 'Indica', price: 100, category: 'Portugal', img: public_path + 'images/indica.png' },
    { id: 3, name: 'Ruderalis', price: 70, category: 'Portugal', img: public_path + 'images/ruderalis.png' },
    { id: 4, name: 'White Widow', price: 200, category: 'Portugal', img: public_path + 'images/whitewidow.png' }
  ];

const users = [
  { id: "hf596zx", name: "Loïc", email: "loic@gmail.com", hashId: "12345678" },
  { id: "hf596zx", name: "Edith", email: "edith@haleur.stp", hashId: "1" },
  { id: "5fvd5hv", name: "Tamara", email: "tamara@gmail.com", hashId: "87654321" },
  { id: "fj554fd", name: "Raphaella", email: "raphaella@gmail.com", hashId: "abcdefgh" },
  { id: "67fsf75", name: "Valentin", email: "valentin@gmail.com", hashId: "hgfedcba" }
];

const hash = [
  {id: '1', hash: '$2a$15$5ZjsrtGFP/r2Z01E5Xme0OORiznGVS3/PpurrtbMIH1ItWxqLzIFq'}
];

const hashed_token = [];

const fakeBDD = {
    "products": products,
    "users": users,
    "hash": hash,
    "hashed_token": hashed_token,
    "pre_register": {},
  };


module.exports = fakeBDD;