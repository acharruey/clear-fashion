const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { 'v5': uuidv5 } = require('uuid');
/**
 * Parse webpage vêtements
 * @param  {String} data - html response
 * @return {Object} vêtements
 */
const parse = data => {
  const $ = cheerio.load(data);
  return $("li[class='item']")
    .map((i, element) => {
      const link = $(element)
        .find('.product-info .product-name a')
        .attr('href');
      return {
<<<<<<< HEAD
        '_id': uuidv5(link, uuidv5.URL),
=======
>>>>>>> d7b9c60b588b755b7423e67cb86c6216c7bc5f1e
        'link': link,
        'brand': 'montlimart',
        'price': parseFloat(
          $(element)
            .find('.product-info .price-box .regular-price .price')
            .text()
            .trim()
            .replace(/\s/g, ' ')
            .replace(/,/, '.')
        ),
        'name': $(element)
          .find('.product-info .product-name a')
          .attr('title'),
        'photo': $(element)
          .find('.product-image img')
<<<<<<< HEAD
          .attr('src')
=======
          .attr('src'),
        'id': uuidv5(link, uuidv5.URL)
>>>>>>> d7b9c60b588b755b7423e67cb86c6216c7bc5f1e
      };
    })
    .get();
};



/**
* Scrape all the products for a given url page
* @param  {[type]}  url
* @return {Array|null}
*/
module.exports.scrape = async url => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const body = await response.text();
            return parse(body);
        }
        console.error(response);    
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};