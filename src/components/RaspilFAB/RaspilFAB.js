import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import classes from './RaspilFAB.module.scss';

export default function RaspilFAB({ clicked, disabled, children }) {
  return (
    <Fab
      classes={{ root: classes.fab }}
      size='medium'
      variant='extended'
      onClick={clicked}
      disabled={disabled}
      color='secondary'>
      <AddIcon />
      {children}
    </Fab>
  );
}
