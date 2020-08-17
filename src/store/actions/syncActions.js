export const fetchStart = (textLoading) => {
  return {
    type: 'FETCH_START',
    textLoading,
  };
};
export const error = (error, errorMessage) => {
  return {
    type: 'ERROR',
    error: error,
    errorMessage,
  };
};
export const noMatch = (noMatch, message) => {
  return {
    type: 'NO_MATCH',
    noMatch,
    noMatchMessage: message,
  };
};
export const endLoading = () => {
  return {
    type: 'END_LOADING',
  };
};
export const fetchOrdersSuccess = (orders, filter) => {
  return {
    type: 'FETCH_ORDERS_SUCCESS',
    ordersArray: orders,
    filter: filter,
  };
};
export const setFilter = (filter) => {
  return {
    type: 'SET_FILTER',
    filter: filter,
  };
};
export const deleteOrder = () =>{
 
  return {
    type: 'DELETE_ORDER',
  };
}
export const fetchOrderSuccess = (order) => {
  
  return {
    type: 'FETCH_ORDER_SUCCESS',
    order: order,
  };
};
export const fetchSpravkaSuccess = (spravka) => {
  return {
    type: 'FETCH_SPRAVKA_SUCCESS',
    spravka: spravka,
  };
};
