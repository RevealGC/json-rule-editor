import { UPDATE_NAV_STATE,SEARCH_RID_DB, LOG_IN} from '../actions/action-types';

const initialState = {
    navState: 'closed',
    loggedIn: false,
    searchRIDText: '12345'
}

const AppReducer = (state=initialState, action) => {
  const type = action.type;
  switch(type) {
    case UPDATE_NAV_STATE: {
      let nav = 'closed';
      if (action.payload && action.payload.flag === 'open') {
        nav = 'open';
      }
      return { ...state, navState: nav };
    }
    case SEARCH_RID_DB:
      return {...state, searchRIDText: action.payload}


    case LOG_IN:
      return { ...state, loggedIn: true };
    default:
      return state;
  }
}

export default AppReducer;