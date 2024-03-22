function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;

  const taxPrice = 0.2 * itemsPrice;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(shippingPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice),
  };
}

module.exports = { calcPrices };
