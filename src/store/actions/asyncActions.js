import * as helperFunctions from '../../utilities/helperFunctions';
import * as asyncFunctions from '../../utilities/asyncFunctions';
import * as syncActions from './syncActions';

export const getDataForRedux = (request, key, filter = 'allorders') => {
  return async (dispatch, getState) => {
    const getStateRedux = getState();
    const { orders: state } = getStateRedux;
    if (!state.loading) {
      await dispatch(syncActions.fetchStart('Идет загрузка...'));
    }
    try {
      const newResult = await asyncFunctions.getDataFromServer(
        helperFunctions.getUrl(request, key)
      );

      if (newResult?.error) {
        dispatch(
          syncActions.error(
            true,
            'Данные на сервере закрыты для просмотра, возможно нужна авторизация'
          )
        );
      } else {
        if (request === 'orders') {
          dispatch(syncActions.fetchOrdersSuccess(newResult, filter));
        } else if (request === 'spravka') {
          dispatch(syncActions.fetchSpravkaSuccess(newResult));
        } else if (request === 'order') {
          dispatch(syncActions.fetchOrderSuccess(newResult));
        }
      }
    } catch (err) {
      dispatch(syncActions.error(err, 'Cервер временно не доступен'));
    }
  };
};
export const getOrderFromServer = (id, isNewOrder) => async (
  dispatch,
  getState
) => {
  const getStateRedux = getState();
  const { orders: state } = getStateRedux;

  const newOrderNoSpravka = isNewOrder && !!!state.spravka;

  const newOrderHasSpravka = isNewOrder && !!state.spravka;

  const hasOrdersArrayNoSpravkaNoOrder =
    !!!state.spravka && !!state.ordersArray && !!!state.order && !isNewOrder;

  const noOrdersArrayNoSpravkaNoOrder =
    !!!state.spravka && !!!state.ordersArray && !!!state.order && !isNewOrder;

  const NoOrder =
    !!state.spravka && !!state.ordersArray && !!!state.order && !isNewOrder;

  const hasAll =
    !!state.spravka && !!state.ordersArray && !!state.order && !isNewOrder;

  await dispatch(syncActions.fetchStart('Идет загрузка...'));

  try {
    if (hasOrdersArrayNoSpravkaNoOrder) {
      const key = helperFunctions.getOrderKey(state.ordersArray, id);
      const result = await Promise.all([
        asyncFunctions.getDataFromServer(helperFunctions.getUrl('spravka')),
        asyncFunctions.getDataFromServer(helperFunctions.getUrl('order', key)),
      ]);
      const [newSpravka, newOrder] = result;
      dispatch(syncActions.fetchSpravkaSuccess(newSpravka));
      dispatch(syncActions.fetchOrderSuccess(newOrder));
    } else if (newOrderNoSpravka) {
      dispatch(getDataForRedux('spravka'));
    } else if (newOrderHasSpravka) {
      dispatch(syncActions.endLoading());
    } else if (noOrdersArrayNoSpravkaNoOrder) {
      const result = await Promise.all([
        asyncFunctions.getDataFromServer(helperFunctions.getUrl('spravka')),
        asyncFunctions.getDataFromServer(helperFunctions.getUrl('orders')),
      ]);
      const [newSpravka, newOrders] = result;
      const key = newOrders ? helperFunctions.getOrderKey(newOrders, id) : null;
      if (key !== null) {
        const newOrder = await asyncFunctions.getDataFromServer(
          helperFunctions.getUrl('order', key)
        );
        await dispatch(syncActions.fetchSpravkaSuccess(newSpravka));
        await dispatch(syncActions.fetchOrderSuccess(newOrder));
        await dispatch(syncActions.fetchOrdersSuccess(newOrders));
      } else {
        await dispatch(
          syncActions.noMatch(true, 'Такой страницы не существует')
        );
        await dispatch(syncActions.fetchOrdersSuccess(newOrders));
        await dispatch(syncActions.fetchSpravkaSuccess(newSpravka));
      }
    } else if (hasAll || NoOrder) {
      const order = Object.values(state.ordersArray).filter(
        (el) => id === el.id
      );
      const [selectedOrder] = order;

      if (state.order?.id === selectedOrder.id) {
        dispatch(syncActions.endLoading());
      } else {
        dispatch(getDataForRedux('order', selectedOrder.orderKey));
      }
    }
  } catch (error) {
    dispatch(syncActions.error(error, 'Сервер временно не доступен'));
  }
};
export const getOrdersFromServer = (path) => async (dispatch, getState) => {
  const getStateRedux = getState();
  const { orders: state } = getStateRedux;

  if (state.ordersArray === undefined) {
    dispatch(getDataForRedux('orders'));
  } else if (state.ordersArray === null) {
    return;
  } else {
    const arrayPath = path.split('/').filter((x) => x);
    const [newPath] = arrayPath;
    dispatch(syncActions.setFilter(newPath));
  }
};
