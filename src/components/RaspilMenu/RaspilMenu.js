import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import classes from './RaspilMenu.module.scss';

export default function RaspilMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  //useSelector
  const stateRedux = useSelector((state) => state.helper);

  const optionsArray = [];
  for (let key in stateRedux) {
    const option = (
      <MenuItem
        key={key}
        onClick={handleClose}
        classes={{ root: classes.MenuItem }}>
        <Link to={`/${stateRedux[key].value}`}>{stateRedux[key].label}</Link>
      </MenuItem>
    );
    optionsArray.push(option);
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleClose() {
    setAnchorEl(null);
  }
  return (
    <>
      <Button onClick={handleClick} variant='contained' color='primary'>
        Заказы
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {optionsArray}
      </Menu>
    </>
  );
}
