// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrand = "";

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Percentile calculator
 */

 function Percent(products,nb) {
  const temp =currentProducts.sort((x,y)=> x.price-y.price)
  const index=Math.round(temp.length*(nb/100))
  return products[index].price
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};


/**
 * Render brand selector
 * @param  {Object} brand
 */
 const renderBrands = products => {
  const brand=[];
  const options = products.map(obj => {
    if (!brand.includes(obj.brand)){
      brand.push(obj.brand);
      return `<option value="${obj.brand}" ${currentBrand===obj.brand ? "selected" : ""}>${obj.brand}</option>`
    }
  });

  options.unshift(`<option value="">All brands</option>`)

  selectBrand.innerHTML = options.join('')

  if(currentBrand===""){
    selectBrand.selectedIndex = 0
  }
};




/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML = currentProducts.filter(obj => new Date()-new Date(obj.released) < (24*60*60*1000*14)).length;
  spanp50.innerHTML= Percent(currentProducts,50) + "€"
  spanp90.innerHTML= Percent(currentProducts,90) + "€"
  spanp95.innerHTML= Percent(currentProducts,95) + "€"
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(products)
};

/**
 * Declaration of all Listeners
 */

 function refresh(){
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => {
      if(currentBrand!==""){
        currentProducts=currentProducts.filter(obj => obj.brand === currentBrand)
      }
      render(currentProducts, currentPagination)
    });
};



/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', event => {
  currentPagination.pageSize=parseInt(event.target.value);
  currentPagination.currentPage=1;
  refresh();
});



/**
 * Select the page to display
 * @type {[type]}
 */
selectPage.addEventListener('change', event => {
  currentPagination.currentPage=parseInt(event.target.value);
  refresh()
})

/**
 * Select the brand of products to display
 * @type {[type]}
 */

selectBrand.addEventListener('change', event => {
   currentBrand=event.target.value
   refresh()
});


/**
 * Sort the products to display
 * @type {[type]}
 */
 selectSort.addEventListener('change', event => {
  switch(event.target.value){
    default:
      break;
    case 'price-asc':
      currentProducts=currentProducts.sort((x,y)=> x.price-y.price)
      break;
    case 'price-desc':
      currentProducts=currentProducts.sort((x,y)=> x.price-y.price).reverse()
      break;
    case 'date-asc':
      currentProducts=currentProducts.sort((x,y)=> new Date(x.released)-new Date(y.released)).reverse()
      break;
    case 'date-desc':
      currentProducts=currentProducts.sort((x,y)=> new Date(x.released)-new Date(y.released))
      break;
    case 'no-filter':
      refresh()
      break;
  }
  renderProducts(currentProducts,currentPagination)
});



document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/**
 * Select the newly released products (less than 2 weeks)
 */

 document.getElementById('recent_released').addEventListener('click', function () {
  currentProducts.forEach(obj => {
    obj.new=true
    if((new Date()-new Date(obj.released)) > (24*60*60*1000*14)){
      obj.new=false;
    }
  })
  currentProducts=currentProducts.filter(obj => obj.new === true)
  render(currentProducts, currentPagination);
});


/**
 * Select the products that have a reasonable price (less than 50€)
 */

 document.getElementById('reasonable_price').addEventListener('click', function () {
  currentProducts=currentProducts.filter(obj => obj.price < 50.0)
  render(currentProducts, currentPagination);
}); 