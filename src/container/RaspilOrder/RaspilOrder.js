import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import RaspilBreadcrumbs from '../../components/RaspilBreabcrumbs/RaspilBreadcrumbs';
import RaspilButton from '../../components/RaspilButton/RaspilButton';
import NoMatch from '../../components/NoMatch/NoMatch';
import Spinner from '../../components/Spinner/Spinner';
import RaspilSimpleAlert from '../../components/RaspilSimpleAlert/RaspilSimpleAlert';
import RaspilModal from '../../components/RaspilModal/RaspilModal';
import RaspilMenu from '../../components/RaspilMenu/RaspilMenu';
import RaspilFAB from '../../components/RaspilFAB/RaspilFAB';
import RaspilIconButton from '../../components/RaspilIconButton/RaspilIconButton';

import renderDate from '../../utilities/date';
import * as helperFunctions from '../../utilities/helperFunctions';
import * as asyncFunctions from '../../utilities/asyncFunctions';
import * as syncActions from '../../store/actions/syncActions';
import * as asyncActions from '../../store/actions/asyncActions';

import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';

import classes from './RaspilOrder.module.scss';

RaspilOrder.propTypes = {
  history: PropTypes.object,
  isNewOrder: PropTypes.bool,
  id: PropTypes.string,
};

export function RaspilOrder({
  match: {
    path,
    params: { id },
  },
  history,
  isNewOrder,
}) {
  const dispatch = useDispatch();

  const options = useSelector((state) => state.helper);
  const ordersRedux = useSelector((state) => state.orders);
  const {
    ordersArray: reduxOrdersArray,
    order: reduxOrder,
    loading,
    textLoading,
    error,
    errorMessage,
    noMatch,
    noMatchMessage,
    spravka,
  } = ordersRedux;

  //states Component
  const [stateOpenModal, setStateOpenModal] = useState(false);
  const [stateOrder, setStateOrder] = useState({
    isOrderPassedToFabric: false,
    isOrderCanceled: false,
    isOrderEditing: false,
    isOrderDelete: false,
    numberSelectedPosition: undefined,
    dataSelectedPosition: null,
    isViewMode: false,
  });

  useEffect(() => {
    dispatch(asyncActions.getOrderFromServer(id, isNewOrder));
    return () => {
      dispatch(syncActions.noMatch(false, ''));
      dispatch(syncActions.error(false, ''));
    };
  }, [dispatch, id, isNewOrder]);

  async function updatePositionOnServer(idPosition, position) {
    const { id, positions: oldPositionsArray, status } = reduxOrder;
    const orderKey = helperFunctions.getOrderKey(reduxOrdersArray, id);
    const isNan = Number.isNaN(Number(idPosition));

    let newPositionsArray;
    if (!isNan) {
      if (position) {
        newPositionsArray = [...oldPositionsArray];
        newPositionsArray.splice(idPosition, 1, position);
      } else {
        newPositionsArray = [...oldPositionsArray].filter(
          (el, index) => index !== idPosition
        );
      }
    } else {
      newPositionsArray = [...oldPositionsArray, position];
    }
    const newSumPositions = newPositionsArray.reduce((sum, current) => {
      return +sum + +current.totalSum;
    }, 0);

    const newOrder = {
      ...reduxOrder,
      positions: newPositionsArray,
      sum: newSumPositions,
    };
    const { positions, ...shortOrder } = {
      ...newOrder,
      orderKey,
      date: newOrder.date[status],
    };

    try {
      const urlOrders = helperFunctions.getUrl('ordersKey', id);
      const urlOrder = helperFunctions.getUrl('orderKey', orderKey);
      await Promise.all([
        asyncFunctions.setDataOnServer(urlOrder, 'PUT', newOrder),
        asyncFunctions.setDataOnServer(urlOrders, 'PUT', shortOrder),
      ]);

      setStateOrder({
        ...stateOrder,
        isOrderEditing: true,
      });

      await dispatch(asyncActions.getDataForRedux('orders', undefined, status));
      await dispatch(asyncActions.getDataForRedux('order', orderKey));
    } catch (error) {
      dispatch(
        syncActions.error(
          error,
          'К сожалению, изменения в заказе не сохранились. Сервер временно недоступен.'
        )
      );
    }
  }
  async function deletePositionFromServer(event, idPosition) {
    await dispatch(syncActions.fetchStart('Позиция заказа удаляется...'));
    await updatePositionOnServer(idPosition, undefined);
  }

  function handleChancelModal() {
    setStateOpenModal(false);
  }

  function handleEditOrCreatePosition(event, numberSelectedPosition) {
    const dataSelectedPosition =
      reduxOrder?.positions[numberSelectedPosition] ?? null;
    const isNan = Number.isNaN(Number(numberSelectedPosition));
    const isSelectedPosition =
      !isNan && typeof numberSelectedPosition === 'number';

    setStateOpenModal(true);
    setStateOrder({
      ...stateOrder,
      isViewMode: isSelectedPosition,
      dataSelectedPosition,
      numberSelectedPosition,
      isSelectedPosition,
    });
  }

  async function changeStatusOrder(newStatusOrder) {
    const orders = {
      canceled: {
        message: 'Oтмена заказа',
        errorMessage:
          'К сожалению, заказ не отменен. Сервер временно недоступен.',
        state: 'isOrderCanceled',
      },
      sent: {
        message: 'Отправка заказа в производство...',
        errorMessage:
          'К сожалению, заказ не отправлен в производство. Сервер временно недоступен.',
        state: 'isOrderPassedToFabric',
      },
    };
    const { id, date } = reduxOrder;

    const orderKey = helperFunctions.getOrderKey(reduxOrdersArray, id);

    const dateLocal = new Date();

    const newStatus = {
      ...reduxOrder,
      status: newStatusOrder,
      date: {
        ...date,
        [newStatusOrder]: dateLocal.toISOString(),
      },
    };
    const { positions, ...newStatusShotOrder } = {
      ...newStatus,
      orderKey,
      date: dateLocal.toISOString(),
    };
    const urlOrders = helperFunctions.getUrl('ordersKey', id);
    const urlOrder = helperFunctions.getUrl('orderKey', orderKey);
    try {
      await dispatch(syncActions.fetchStart(orders[newStatusOrder].message));
      await Promise.all([
        asyncFunctions.setDataOnServer(urlOrder, 'PUT', newStatus),
        asyncFunctions.setDataOnServer(urlOrders, 'PUT', newStatusShotOrder),
      ]);

      await dispatch(asyncActions.getDataForRedux('orders'));

      setStateOrder({
        ...stateOrder,
        [orders[newStatusOrder].state]: !stateOrder[
          orders[newStatusOrder].state
        ],
      });
      await dispatch(asyncActions.getDataForRedux('order', orderKey));
    } catch (error) {
      dispatch(syncActions.error(error, orders[newStatusOrder].errorMessage));
    }
  }

  async function handleDeleteOrder() {
    dispatch(syncActions.fetchStart('Удаление заказа...'));
    const { status, id } = reduxOrder;

    const orderKey = helperFunctions.getOrderKey(reduxOrdersArray, id);
    const urlOrders = helperFunctions.getUrl('ordersKey', id);
    const urlOrder = helperFunctions.getUrl('orderKey', orderKey);

    if (status === 'created' || status === 'canceled') {
      try {
        await asyncFunctions.setDataOnServer(urlOrder, 'DELETE');
        await asyncFunctions.setDataOnServer(urlOrders, 'DELETE');
        await dispatch(asyncActions.getDataForRedux('orders'));
        dispatch(syncActions.deleteOrder());
        setStateOrder((state) => {
          return {
            ...state,
            isOrderDelete: !stateOrder.isOrderDelete,
          };
        });
      } catch (error) {
        dispatch(
          syncActions.error(
            error,
            'К сожалению, заказ не удалился. Сервер временно недоступен.'
          )
        );
      }
    } else {
      changeStatusOrder('canceled');
    }
  }

  function renderOrder(props) {
    function renderButtonAndPosition() {
      function renderButton() {
        let buttonDeleteText,
          isDisabledButtonDelete,
          isDisabledButoonPassedToFab,
          isDisabledButtonAddPosition;
        const termsDisabled = {
          isEditing: {
            sent: true,
            accepted: true,
            confirmed: true,
          },
          statusOrder: {
            passedToFabric: true,
            finished: true,
            shipped: true,
          },
        };

        if (!isNewOrder) {
          if (reduxOrder) {
            const { status, positions } = reduxOrder;
            const termsDisabledFromStatus =
              termsDisabled.statusOrder[status] ?? false;

            const termsDisabledFromEditing =
              termsDisabled.isEditing[status] ?? false;

            buttonDeleteText =
              status === 'created' || status === 'canceled'
                ? 'Удалить заказ'
                : 'Отменить заказ';

            isDisabledButtonDelete = termsDisabledFromStatus;

            isDisabledButtonAddPosition =
              termsDisabledFromStatus || positions.length >= 4;

            isDisabledButoonPassedToFab =
              termsDisabledFromStatus ||
              (termsDisabledFromEditing && !stateOrder.isOrderEditing);
          }
        } else {
          buttonDeleteText = 'Удалить заказ';
          isDisabledButtonDelete = isNewOrder;
          isDisabledButoonPassedToFab = isNewOrder;
        }
        return (
          <div className={classes.buttonGroupAndBreadcrumbs}>
            <RaspilBreadcrumbs {...props} isNewOrder={isNewOrder} nested />
            <div className={classes.buttonGroup}>
              <RaspilButton
                variant='outlined'
                disabled={isDisabledButtonDelete}
                color='primary'
                clicked={handleDeleteOrder}>
                {buttonDeleteText}
              </RaspilButton>
              <RaspilButton
                variant='outlined'
                disabled={isDisabledButoonPassedToFab}
                clicked={() => changeStatusOrder('sent')}
                color='primary'>
                В производство
              </RaspilButton>
              <RaspilButton
                variant='outlined'
                color='primary'
                disabled={isDisabledButtonAddPosition}
                clicked={handleEditOrCreatePosition}>
                Добавить позицию
              </RaspilButton>
            </div>
          </div>
        );
      }
      function renderPosition() {
        let header, positionArray;
        if (!isNewOrder && reduxOrder) {
          const { date, id, sum, status } = reduxOrder;
          const renderNewDate = date[status] ? renderDate(date[status]) : null;
          header = (
            <div className={classes.Order}>
              <h3 className={classes.HeaderOrder}>
                <p>Заказ</p>
                <span>{id}</span>
                <span>от</span>
                {renderNewDate}
                <span style={{ color: options[status].color }}>
                  {options[status].label}
                </span>
              </h3>
              <h2>{`Итого: ${sum}\u{20BD}`}</h2>
            </div>
          );
          positionArray = reduxOrder.positions.map((el, index) => {
            const statusIcon = {
              passedToFabric: true,
              finished: true,
              shipped: true,
            };
            const {
              length,
              width,
              quantity,
              totalSum,
              packing,
              plate,
              kromka2mm,
              kromka04mm,
              kromka1mm,
            } = el;

            const iconEdit = statusIcon[status] ? (
              <VisibilityIcon />
            ) : (
              <EditIcon />
            );
            const deleteIcon =
              reduxOrder.positions.length > 1 ? <DeleteIcon /> : null;

            const kromkaRender = (kromka, type) => {
              const kromkaRender =
                kromka && kromka?.value !== 'no_kromka' ? (
                  <div className={classes.total}>
                    <span> Кромка</span>
                    <span>{type} - </span>
                    <span className={classes.decor}>
                      {spravka.decors[kromka.value].label}
                    </span>
                  </div>
                ) : kromka && kromka?.value === 'no_kromka' ? (
                  <div className={classes.total}>
                    <span> Кромка</span>
                    <span>{type} - </span>
                    <span className={classes.decor}>нет</span>
                  </div>
                ) : null;
              return kromkaRender;
            };

            return (
              <Paper
                key={index}
                classes={{ root: classes.Position }}
                elevation={3}>
                <div className={classes.number}>
                  <div>Позиция#{index + 1}</div>
                  <div>{`${totalSum}\u{20BD}`}</div>
                </div>
                <div className={classes.packing}>
                  <span className={classes.header}>Упаковка:</span>
                  {packing ? 'Упаковать' : 'Без упаковки'}
                </div>
                <div className={classes.plate}>
                  <span className={classes.header}>Плитa:</span>
                  <span className={classes.total}>
                    {spravka.decors[plate.type].label}
                  </span>
                  <span className={classes.total}>
                    {spravka.decors[plate.value].label}
                  </span>
                  <div>{length}*</div>
                  <div className={classes.total}>{width}</div>
                  <div className={classes.total}>{quantity}шт.</div>
                </div>
                <div className={classes.kromkaAndIconGroup}>
                  <div className={classes.kromka}>
                    <span className={classes.header}>Кромка:</span>
                    {kromkaRender(kromka2mm, '2mm')}
                    {kromkaRender(kromka04mm, '04mm')}
                    {kromkaRender(kromka1mm, '1mm')}
                  </div>
                  <div className={classes.iconGroup}>
                    <RaspilIconButton
                      clicked={(event) =>
                        handleEditOrCreatePosition(event, index)
                      }>
                      {iconEdit}
                    </RaspilIconButton>
                    <RaspilIconButton
                      disabled={statusIcon[status]}
                      clicked={(event) =>
                        deletePositionFromServer(event, index)
                      }>
                      {deleteIcon}
                    </RaspilIconButton>
                  </div>
                </div>
              </Paper>
            );
          });
        } else {
          header = <h2>Новый заказ</h2>;
        }

        return (
          <div className={classes.RaspilPositionsList}>
            {header}
            {positionArray}
          </div>
        );
      }

      const renderButtonAndPosition =
        !stateOrder.isOrderPassedToFabric &&
        !stateOrder.isOrderCanceled &&
        !stateOrder.isOrderDelete ? (
          <div className={classes.renderOrder}>
            {renderButton()}
            {renderPosition()}
          </div>
        ) : stateOrder.isOrderPassedToFabric ? (
          <div className={classes.helperInfo}>
            <h2>Заказ успешно отправлен в производство</h2>
            <Link to='/'>Перейти ко всем заказам</Link>
          </div>
        ) : stateOrder.isOrderCanceled ? (
          <div className={classes.helperInfo}>
            <h2>Заказ успешно отменен</h2>
            <Link to='/canceled'>Перейти к отмененным заказам</Link>
          </div>
        ) : stateOrder.isOrderDelete ? (
          <div className={classes.helperInfo}>
            <h2>Заказ удален навсегда</h2>
            <Link to='/'>Перейти ко всем заказам</Link>
          </div>
        ) : null;
      return renderButtonAndPosition;
    }

    //total logic rendering;
    const allDataLoading = !loading && !error && spravka && !noMatch;
    const errorNotLoadingOrdersArray = !loading && error && !!!reduxOrdersArray;
    const errorOrderArrayLoading = !loading && error && !!reduxOrdersArray;

    if (allDataLoading) {
      return renderButtonAndPosition();
    } else if (errorOrderArrayLoading) {
      return (
        <RaspilSimpleAlert
          text={errorMessage}
          error={error}
          {...props}
          redirectToOrders
        />
      );
    } else if (errorNotLoadingOrdersArray) {
      return (
        <>
          <h3>Сервер не доступен</h3>
          <RaspilSimpleAlert text={errorMessage} error={error} {...props} />
        </>
      );
    } else if (noMatch) {
      return <NoMatch text={noMatchMessage} />;
    } else {
      return <Spinner text={textLoading ? textLoading : null} />;
    }
  }

  return (
    <>
      <div className={classes.Header}>
        <div className={classes.RaspilMenu}>
          <RaspilMenu />
        </div>
        <div className={classes.Fab}>
          <Link to='/neworder' className={classes.Link}>
            <RaspilFAB>заказ</RaspilFAB>
          </Link>
        </div>
      </div>
      <Switch>
        <Route path={`${path}`} render={(props) => renderOrder(props)} />
      </Switch>
      <RaspilModal
        handleChancel={handleChancelModal}
        open={stateOpenModal}
        isNewOrder={isNewOrder}
        isViewMode={stateOrder.isViewMode}
        numberSelectedPosition={stateOrder.numberSelectedPosition}
        isSelectedPosition={stateOrder.isSelectedPosition}
      />
    </>
  );
}
