import React from 'react';
import Button from '@material-ui/core/Button';

import classes from './RaspilButton.module.scss';

export default function RaspilButton({
  icon,
  variant,
  clicked,
  size,
  disabled,
  children,
  label,
  color,
}) {
  return (
    <Button
      classes={{
        root: classes.button,
        text: classes.text,
        textSizeSmall: classes.sizeSmall,
      }}
      startIcon={icon}
      variant={variant}
      onClick={clicked}
      size={size}
      disabled={disabled}
      label={label}
      color={color}>
      {children}
    </Button>
  );
}
