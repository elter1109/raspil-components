import React from 'react';
import { Link } from 'react-router-dom';
import classes from './NoMatch.module.scss';

export default function NoMatch({ location, match, text }) {
 
  return (
    <div className={classes.found}>
      <div className={classes.notfound}>
        <div className={classes.notfound404}>
          <h1>Oops!</h1>
          {text ? <h2>{text}</h2> : <h2>404 - Страница не найдена</h2>}
        </div>
        <Link to='/'>Перейти на страницу ваших заказов</Link>
      </div>
    </div>
  );
}
