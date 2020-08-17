export function getOrderKey(array, id) {
  const selectedOrder = Object.values(array).filter((el) => id === el.id);
  if (selectedOrder.length === 0) {
    return null;
  } else {
    return selectedOrder[0].orderKey;
  }
}
export const getUrl = (request, key) => {
  const url = {
    orders: 'https://raspil.firebaseio.com/orders.json',
    spravka: 'https://raspil.firebaseio.com/spravka.json',
    order: `https://raspil.firebaseio.com/order/${key}.json`,
    counter: 'https://raspil.firebaseio.com/counterOrders.json',
    setOrder: 'https://raspil.firebaseio.com/order.json',
    ordersKey: `https://raspil.firebaseio.com/orders/${key}.json`,
    orderKey: `https://raspil.firebaseio.com/order/${key}.json`,
  };
  return url[request];
};
