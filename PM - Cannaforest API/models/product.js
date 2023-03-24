const fakeBDD = require('../BDD/bdd');

class Product{
    getProducts(){
        return fakeBDD.products;
    }
}

const products = new Product();

module.exports = products;