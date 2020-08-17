import React from 'react';
import { NavLink } from 'react-router-dom';

import FaceIcon from '@material-ui/icons/Face';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import classes from './RaspilAppBar.module.scss';

export function RaspilAppBar() {
  return (
    <ul className={classes.nav}>
      <li className={classes.nav_item}>
        <NavLink
          exact
          to='/allorders'
          activeStyle={{ borderRight: '4px solid #dc004e' }}
          className={classes.nav_link}>
          <AddShoppingCartIcon classes={{ root: classes.icon }} />
          <span className={classes.textLink}>Заказы</span>
        </NavLink>
      </li>
      <li className={classes.nav_item}>
        <NavLink
          exact
          to='/profile'
          className={classes.nav_link}
          activeStyle={{
            borderRight: '4px solid #dc004e',
          }}>
          <FaceIcon classes={{ root: classes.icon }} />
          <span className={classes.textLink}>Личный профиль</span>
        </NavLink>
      </li>
    </ul>
  );
}
