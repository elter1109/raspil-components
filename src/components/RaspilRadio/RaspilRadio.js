import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import classes from './RaspilRadio.module.scss';

const ARRAY_RADIO_GROUPS = [
  { radioGroupName: 'top', radioGroupLabel: 'Верх' },
  {
    radioGroupName: 'bottom',
    radioGroupLabel: 'Низ',
  },
  {
    radioGroupName: 'right',
    radioGroupLabel: 'Право',
  },
  { radioGroupName: 'left', radioGroupLabel: 'Лево' },
];
const RADIO_BUTTONS = {
  mdf: [
    {
      radioValue: '1mm',
      radioLabel: '1mm',
    },
    {
      radioValue: '',
      radioLabel: 'Без кромки',
    },
  ],
  rest: [
    {
      radioValue: '2mm',
      radioLabel: '2mm',
    },
    {
      radioValue: '04mm',
      radioLabel: '04mm',
    },
    {
      radioValue: '',
      radioLabel: 'Без кромки',
    },
  ],
};

const RaspilRadio = ({ validation, isViewMode, state, handleRadioChange }) => {
  const {
    plate: { type: typePlate },
    straightKromka,
  } = state;
  // console.log('%cRaspilRadio', 'color: blue');

  if (typePlate === 'orgalit') return null;

  const arrayRadioGroup = ARRAY_RADIO_GROUPS.map((el) => {
    const { radioGroupName, radioGroupLabel } = el;
    const newTypePlateValue =
      typePlate === 'mm16' || typePlate === 'mm25' || typePlate === 'mm0810'
        ? 'rest'
        : 'mdf';
    const radio = RADIO_BUTTONS[newTypePlateValue].map((el, id) => {
      const { radioValue, radioLabel } = el;

      const disabledRadio =
        ((state.kromka2mm?.value === 'no_kromka' || false) &&
          radioValue === '2mm') ||
        ((state.kromka04mm?.value === 'no_kromka' || false) &&
          radioValue === '04mm') ||
        ((state.kromka1mm?.value === 'no_kromka' || false) &&
          radioValue === '1mm');

      const formControlLabel = (
        <FormControlLabel
          key={id}
          value={radioValue}
          disabled={isViewMode || validation.isNoValidForm}
          control={
            <Radio color='primary' inputProps={{ disabled: disabledRadio }} />
          }
          label={radioLabel}
        />
      );

      const renderFormControl = !isViewMode
        ? formControlLabel
        : radioValue === straightKromka[radioGroupName]
        ? formControlLabel
        : null;

      return renderFormControl;
    });

    return (
      <RadioGroup
        key={radioGroupName}
        row
        value={straightKromka[radioGroupName]}
        classes={{ root: classes.radioGroup }}
        name={radioGroupName}
        onChange={handleRadioChange}>
        <p className={classes.radioGroupText}>{radioGroupLabel}</p>
        {radio}
      </RadioGroup>
    );
  });

  return (
    <FormControl fullWidth component='fieldset'>
      <FormLabel
        component='legend'
        classes={{ root: classes.formLabel }}
        focused={false}>
        Выберите прямолинейное кромление:
      </FormLabel>
      {arrayRadioGroup}
    </FormControl>
  );
};
export default React.memo(RaspilRadio);
