/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand');
const montlimartbrand = require('./sites/montlimartbrand');
const adressebrand = require('./sites/adressebrand');
const savedProducts = require('./products.json');
const fs = require('fs');
const db = require('./db');
const { Console } = require('console');

const links = {
  'dl': 'https://www.dedicatedbrand.com/en/men/all-men',
  'ml': 'https://www.montlimart.com/toute-la-collection.html?limit=all',
  'al': 'https://adresse.paris/630-toute-la-collection'
}

async function sandbox (eshop) {
  try {
    console.log(`🕵️‍♀️ browsing listed sources`);
    const products = await dedicatedbrand.scrape(links['dl']);
    const products2 = await montlimartbrand.scrape(links['ml']);
    const products3 = await adressebrand.scrape(links['al']);
    const all_products = products.concat(products2, products3);

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
    await db.insert(savedProducts);
    
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
const [, , eshop] = process.argv;
sandbox(eshop);
