const options = {
  neworder: {
    label: 'Новый заказ',
    value: 'neworder',
    color: 'rgba(0, 0, 0, 0.54)',
  },
  allorders: {
    label: 'Все заказы',
    value: 'allorders',
    color: 'rgba(0, 0, 0, 0.54)',
  },

  created: {
    label: 'Создан',
    value: 'created',
    color: '#ff9800',
  },

  sent: {
    label: 'Отправлен',
    value: 'sent',
    color: '#2196f3',
  },
  accepted: {
    label: 'В обработке',
    value: 'accepted',
    color: '#1976d2',
  },
  confirmed: { label: 'Подтвержден', value: 'confirmed', color: '#81c784' },
  passedToFabric: {
    label: 'В производстве',
    value: 'passedToFabric',
    color: '#4caf50',
  },
  finished: { label: 'Готов', value: 'finished', color: '#388e3c' },
  shipped: { label: 'Отгружен', value: 'shipped', color: '#0000008a' },
  canceled: { label: 'Отменен', value: 'canceled', color: '#f44336' },
};

export default function helperReducer(state = options, action) {
  switch (action.type) {
    default:
      return state;
  }
}
