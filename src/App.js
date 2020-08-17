import React from 'react';
import { StylesProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';

import {RaspilAppBar} from './components/RaspilAppBar/RaspilAppBar';
import {Profile} from './container/Profile';
import {RaspilViewOrders} from './container/RaspilViewOrders/RaspilViewOrders';
import {RaspilOrder} from './container/RaspilOrder/RaspilOrder';

import classes from './App.module.scss'

export default function App() {
  return (
    <StylesProvider injectFirst>
      <Router>
        <RaspilApp />
      </Router>
    </StylesProvider>
  );
}

function RaspilApp() {
  const pathsOrders = [
    '/allorders',
    '/created',
    '/sent',
    '/accepted',
    '/confirmed',
    '/passedToFabric',
    '/finished',
    '/shipped',
    '/canceled',
  ];

  return (
    <div className={classes.RaspilApp}>
      <RaspilAppBar />
      <main className={classes.main}>
        <Switch>
          <Route path='/profile' component={Profile} />
          <Route
            path='/neworder'
            render={(props) => {
              return <RaspilOrder {...props} isNewOrder />;
            }}
          />
          <Route
            path={pathsOrders.map((el) => el)}
            render={(props) => {
              return <RaspilViewOrders {...props} />;
            }}
          />
          <Route
            path='/:id'
            render={(props) => (
              <>
                <RaspilOrder {...props} />
              </>
            )}
          />
          <Redirect exact from='/' to='/allorders' />
        </Switch>
      </main>
    </div>
  );
}
