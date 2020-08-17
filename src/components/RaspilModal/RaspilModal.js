import React from 'react';
import { useSelector } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import classes from './RaspilModal.module.scss';

export default function RaspilModal({
  open,
  handleChancel,
  isNewOrder,
  numberSelectedPosition,
  isSelectedPosition,
}) {
  
  const ordersRedux = useSelector((state) => state.orders);
  const numberOrder = ordersRedux?.order?.id ?? null;
  const numberPosition = ordersRedux?.order ? +numberSelectedPosition + 1 : null

  const dialogTitle = isNewOrder ? (
    <p>Новый заказ</p>
  ) : isSelectedPosition ? (
    <div className={classes.title}>
      <p>Заказ</p>
      <p>{numberOrder}</p>
      <p>позиция#{numberPosition}</p>
    </div>
  ) : (
    <div className={classes.title}>
      <p>Заказ</p>
      <p>{numberOrder}</p>
      <p>Новая позиция</p>
    </div>
  );

  const dialog = (
    <Dialog
      onClose={handleChancel}
      open={open}
      PaperProps={{
        classes: { root: classes.Dialog },
        elevation: 3,
      }}
      maxWidth={false}
      scroll={'paper'}>
      <DialogTitle classes={{root: classes.dialogTitle}}>{dialogTitle}</DialogTitle>
      <DialogContent dividers={true} classes={{ root: classes.DialogContent }}>
      <p>Raspil Position Editor Component</p>
      </DialogContent>
    </Dialog>
  );

  return dialog;
}
