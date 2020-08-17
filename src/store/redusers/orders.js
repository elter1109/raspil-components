const initialState = {
  loading: false,
  error: false,
};
export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_ORDERS_SUCCESS':
      return {
        ...state,
        ordersArray: action.ordersArray,
        filter: action.filter,
        loading: false,
        textLoading: ''
      };
    case 'FETCH_ORDER_SUCCESS':
      return {
        ...state,
        order: action.order,
        loading: false,
        textLoading: ''
      };
      case 'DELETE_ORDER':
        return {
          ...state,
          order: null,
        };
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        textLoading: action.textLoading
      };
    case 'ERROR':
      return {
        ...state,
        error: action.error,
        errorMessage: action.errorMessage,
        loading: false,
      };
      case 'NO_MATCH':
        return {
          ...state,
          noMatch: action.noMatch,
          noMatchMessage: action.noMatchMessage,
          loading: false,
        };
      case 'END_LOADING':
      return {
        ...state,
        loading: false,
        textLoading: ''
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.filter,
      };
    case 'FETCH_SPRAVKA_SUCCESS':
      return {
        ...state,
        spravka: action.spravka,
        loading: false,
        textLoading: ''
      };
    default:
      return state;
  }
}
