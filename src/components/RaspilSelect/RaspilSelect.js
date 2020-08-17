import React from 'react';
import { useSelector} from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

import classes from './RaspilSelect.module.scss';

function RaspilSelect({
  disabled,
  label,
  handleChange,
  value,
  error,
  helperText,
  data,
  name,
}) {
  const ordersRedux = useSelector((state) => state.orders);
  const { spravka } = ordersRedux;
  const avatarPlate = (src, alt) => {
    return (
      <Avatar
        variant='square'
        alt={alt}
        src={src}
        classes={{ root: classes.avatar }}
      />
    );
  };
  const content = spravka.types[data].map((el, index) => {
    let menuItem;
    const { decor } = el;
    if (decor === 'no_kromka') {
      menuItem = (
        <MenuItem key={index} value='no_kromka'>
          {<p className={classes.textNot}>Без кромки</p>}
        </MenuItem>
      );
    } else {
      const { id, label, src } = spravka.decors[decor];
      menuItem = (
        <MenuItem key={index} value={id}>
          {src ? avatarPlate(src, label) : null}
          {<p className={classes.text}>{label}</p>}
        </MenuItem>
      );
    }

    return menuItem;
  });

  return (
    <TextField
      select
      variant='outlined'
      classes={{ root: classes.TextSelect }}
      value={value}
      helperText={helperText}
      error={error}
      label={label}
      disabled={disabled}
      fullWidth
      name={name}
      SelectProps={{
        classes: {
          root: classes.Select,
        },
      }}
      onChange={handleChange}>
      {content}
    </TextField>
  );
}
export default React.memo(RaspilSelect);
