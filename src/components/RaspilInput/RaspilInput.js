import React, { createRef, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import classes from './RaspilInput.module.scss';

export default function RaspilInput({
  disabled,
  type,
  label,
  helperText,
  name,
  value,
  touched,
  isNoValid,
  errorMessage,
  handleInputChange,
  step,
  min,
  max,
}) {
  let inputEl;
  if (type === 'number') {
    inputEl = createRef();
  }

  useEffect(() => {
    if (
      type === 'number' &&
      inputEl.current.value !== (value.toString && value.toString())
    ) {
      inputEl.current.value = value;
    }
  }, [value, type, inputEl]);
  return (
    <TextField
      name={name}
      variant='outlined'
      classes={{ root: classes.TextField }}
      rowsMax={4}
      value={value}
      error={isNoValid && touched}
      helperText={isNoValid && touched ? errorMessage : helperText}
      label={label}
      type={type}
      disabled={disabled}
      fullWidth
      inputProps={{
        step: step,
        min: min,
        max: max,
        className: classes.Input,
        ref: inputEl,
      }}
      onChange={handleInputChange}
    />
  );
}
RaspilInput.propTypes = {
  disabled: PropTypes.bool,
  type: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  touched: PropTypes.bool,
  isNoValid: PropTypes.bool,
  errorMessage: PropTypes.string,
  handleInputChange: PropTypes.func,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
};
