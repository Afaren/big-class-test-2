'use strict';


function formatTags(tags) {
  return tags.map(tag => {
    let tagPart = tag.split('-');
    return {
      barcode: tagPart[0],
      amount: parseFloat(tagPart[1]) || 1
    }
  })
}

function mergeTags(formattedTags) {
  return formattedTags.reduce((acc, cur) => {
    let found = acc.find(i => i.barcode === cur.barcode);
    if (found)
      found.amount += cur.amount;
    else
      acc.push(cur);
    return acc;
  }, [])
}

function getCartItems(mergedBarcodes, allItems) {
  return mergedBarcodes.reduce((acc, cur)=> {
    let found = allItems.find(item => item.barcode === cur.barcode);
    return acc.push(Object.assign({}, found, {amount: cur.amount}));
  }, []);
}

function getBuyTwoFreeOneItems(cartItems, allPromotions) {
  let buyTwoFreeOneItems = allPromotions.find(p => p.hasOwnProperty('type'));
  let allBuyTwoFreeOneBarcodes = buyTwoFreeOneItems.barcodes;
  return cartItems.filter(item => allBuyTwoFreeOneBarcodes.find(entry => entry === item.barcode) === undefined ? false : true);
}

function calculateOriginSubtotal(cartItems) {
  return cartItems.map(item=> Object.assign({}, item, {originSubTotal: item.amount * item.price}));
}

function calculateDiscount(buyTwoFreeOneItems, cartItems) {
  return cartItems.map(item=> {
    let found = buyTwoFreeOneItems.find(entry => entry === item.barcode);
    if (found) {
      let number = item.amount - Math.floor(item.amount / 3);
      if (number > 0)
        return Object.assign({}, item, {discount: item.price * (number)});
      else
        return Object.assign({}, item, {discount: 0});

    } else {
      return Object.assign({}, item, {discount: 0});
    }
  })

}

function getTotalPrice(subTotalCartItems) {
  return subTotalCartItems.reduce( (acc, cur) => {
    return acc += (cur.originSubTotal - cur.discount);
  }, 0)

}

module.exports = {
  formatTags,
  mergeTags,
  getCartItems,
  getBuyTwoFreeOneItems,
  calculateOriginSubtotal,
  calculateDiscount,
  getTotalPrice


};