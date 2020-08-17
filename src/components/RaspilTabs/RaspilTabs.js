import React from 'react';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import classes from './RaspilTabs.module.scss';

const RaspilTabs = ({ handleChange, disabled, valueTabs, spravka }) => {
  // console.log('%cRaspilTabs', 'color: grey');
  const modelTabs = ['mm16', 'mm25', 'mm0810', 'mdf', 'orgalit'];
  const indexValue = modelTabs.findIndex((el) => el === valueTabs);
  const tabs = modelTabs.map((el, index) => {
    return (
      <Tab
        label={spravka.decors[el].label}
        key={index}
        disabled={disabled}
        value={index}
      />
    );
  });
  return (
    <Paper square>
      <Tabs
        variant='scrollable'
        scrollButtons='auto'
        value={indexValue}
        indicatorColor='primary'
        textColor='primary'
        className={classes.Tabs}
        onChange={handleChange}>
        {tabs}
      </Tabs>
    </Paper>
  );
};
export default RaspilTabs;
