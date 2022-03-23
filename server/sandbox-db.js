/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand');
const savedProducts = require('./products.json');
const fs = require('fs');
//const db = require('./db');

const links = {
  'dl': 'https://www.dedicatedbrand.com/en/men/all-men'
}

async function sandbox (eshop) {
  try {

    console.log(`🕵️‍♀️ browsing listed sources`);
    const products = await dedicatedbrand.scrape(links['dl']);
    const all_products = products;

    let today = (new Date()).toLocaleDateString('fr-FR');

    for (let i = 0; i < all_products.length; i++) {
      all_products[i].date = today;
      let alreadyExist = false;
      for (let j = 0; j < savedProducts.length && alreadyExist == false; j++) {
        if ((all_products[i].name == savedProducts[j].name) && (all_products[i].price == savedProducts[j].price)) {
          alreadyExist = true;
        }
      }

      if (alreadyExist != true && all_products[i].price!=null) {
        savedProducts.push(all_products[i]);
      }
    }

    for (let i = 0; i < savedProducts.length; i++) {
      let alreadyExist = false;
      for (let j = 0; j < all_products.length && alreadyExist == false; j++) {
        if ((all_products[j].name == savedProducts[i].name) && (all_products[j].price == savedProducts[i].price)) {
          alreadyExist = true;
        }
      }
      if (alreadyExist == false) {
        savedProducts.splice(i, 1);
      }
    }


    fs.writeFileSync("./products.json", JSON.stringify(savedProducts, null, 4));

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
const [, , eshop] = process.argv;
sandbox(eshop);
