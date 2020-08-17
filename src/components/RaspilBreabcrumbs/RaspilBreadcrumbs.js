import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import classes from './RaspilBreadcrumbs.module.scss';

export default function RaspilBreadcrumbs(props) {
  const {
    location: { pathname },
    isNewOrder,
    nested,
  } = props;
  let linkArray;

  //useSelector
  const options = useSelector((state) => state.helper);
  const ordersRedux = useSelector((state) => state.orders);
  const { filter = 'created' } = ordersRedux;

  const newPathname = pathname.split('/').filter((x) => x);
  const [path] = newPathname;

  if (isNewOrder) {
    linkArray = (
      <Breadcrumbs classes={{ root: classes.Breadcrumbs }}>
        <NavLink
          exact
          activeStyle={{ color: options[path].color }}
          to={`/${path}`}
          className={classes.breadcrumb}>
          {options[path].label}
        </NavLink>
      </Breadcrumbs>
    );
  } else if (nested) {
    linkArray = (
      <>
        <Breadcrumbs classes={{ root: classes.Breadcrumbs }}>
          <NavLink
            exact
            activeStyle={{ color: options[filter].color }}
            to={`/${options[filter].value}`}
            className={classes.breadcrumb}>
            {options[filter].label}
          </NavLink>{' '}
          <NavLink
            exact
            activeStyle={{ color: '#dc004e' }}
            to={`/${path}`}
            className={classes.breadcrumb}>
            {path}
          </NavLink>
        </Breadcrumbs>
      </>
    );
  } else if (!isNewOrder && !nested) {
    linkArray = (
      <Breadcrumbs classes={{ root: classes.Breadcrumbs }}>
        <NavLink
          exact
          activeStyle={{ color: options[path].color }}
          to={`/${path}`}
          className={classes.breadcrumb}>
          {options[path].label}
        </NavLink>
      </Breadcrumbs>
    );
  }

  return linkArray;
}
