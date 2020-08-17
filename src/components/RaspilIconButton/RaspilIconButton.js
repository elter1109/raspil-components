import React from 'react';
import IconButton from '@material-ui/core/IconButton';

import classes from './RaspilIconButton.module.scss';

export default function RaspilIconButton(props) {
  const { disabled, label, clicked, component, size } = props;
 
  return (
    <IconButton
      component={component}
      label={label}
      size={size}
      disabled={disabled}
      onClick={clicked}
      classes={{
        root: classes.iconButton,
      }}>
      {props.children}
    </IconButton>
  );
}
