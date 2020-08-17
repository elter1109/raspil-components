import React, { useEffect } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Spinner from '../../components/Spinner/Spinner';
import RaspilBreadcrumbs from '../../components/RaspilBreabcrumbs/RaspilBreadcrumbs';
import RaspilSimpleAlert from '../../components/RaspilSimpleAlert/RaspilSimpleAlert';
import RaspilMenu from '../../components/RaspilMenu/RaspilMenu';
import RaspilFAB from '../../components/RaspilFAB/RaspilFAB';

import * as asyncActions from '../../store/actions/asyncActions';
import renderDate from '../../utilities/date';

import { useSelector, useDispatch } from 'react-redux';

import classes from './RaspilViewOrders.module.scss';

RaspilViewOrders.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
};

export function RaspilViewOrders({ history, match }) {
  const { path } = match;

  //useSelector
  const stateRedux = useSelector((state) => {
    return state.orders;
  });
  const {
    ordersArray: reduxOrdersArray,
    filter,
    loading,
    textLoading,
    error,
    errorMessage,
  } = stateRedux;

  const options = useSelector((state) => state.helper);
  const dispatch = useDispatch();

  function openOrder(id) {
    history.push(`/${id}`);
  }

  useEffect(() => {
    dispatch(asyncActions.getOrdersFromServer(path));
  }, [dispatch, path]);

  const addOrderButton = (
    <div className={classes.Fab}>
      <Link to='/neworder' className={classes.Link}>
        <RaspilFAB>заказ</RaspilFAB>
      </Link>
    </div>
  );
  function renderContent(props) {
    if (!loading && reduxOrdersArray && !error) {
      const valuesArray =
        filter === 'allorders'
          ? Object.values(reduxOrdersArray)
          : Object.values(reduxOrdersArray).filter(
              (el) => el.status === filter
            );

      const sortArray = [...valuesArray].sort(function (a, b) {
        const regex = /[^A-Z]+(\d+)/g;
        const newA = a.id.match(regex);
        const newB = b.id.match(regex);
        return +newA - +newB;
      });

      const renderListOrder =
        sortArray.length > 0 ? (
          sortArray.map((el, index) => {
            const { date, id, payed, status, sum } = el;
            return (
              <Paper
                key={index}
                classes={{ root: classes.Orders }}
                elevation={3}
                onClick={() => openOrder(id)}>
                <span className={classes.title}>
                  <span className={classes.miniTitle}>Заказ</span>
                  <h4>{id}</h4>
                </span>
                <span className={classes.title}>
                  <span className={classes.miniTitle}>Дата заказа</span>
                  <h4>{renderDate(date)}</h4>
                </span>
                <span
                  className={classes.statusOrder}
                  style={{ color: options[el.status].color }}>
                  {options[status].label}
                </span>
                <span className={classes.title}>
                  <span className={classes.miniTitle}>Оплачено</span>
                  <h4>{`${payed}\u{20BD}`}</h4>
                </span>
                <span className={classes.title}>
                  <span className={classes.miniTitle}>Итого:</span>
                  <h4>{`${sum}\u{20BD}`}</h4>
                </span>
              </Paper>
            );
          })
        ) : (
          <h3>Нет заказов</h3>
        );
      return (
        <div className={classes.RaspilOrders}>
          <RaspilBreadcrumbs {...props} />
          <div className={classes.renderListOrder}>{renderListOrder}</div>
        </div>
      );
    } else if (error) {
      return (
        <>
          <h3>Сервер не доступен</h3>
          <RaspilSimpleAlert text={errorMessage} error={error} />
        </>
      );
    } else if (!loading && !reduxOrdersArray && !error) {
      return (
        <h2 className={classes.titleNoOrders}>
          У вас пока нет заказов, чтобы добавить новый заказ нажмите на кнопку
          {addOrderButton}
        </h2>
      );
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
        {addOrderButton}
      </div>
      <Switch>
        <Route path={`${path}`} render={(props) => renderContent(props)} />
      </Switch>
    </>
  );
}
