import { UPDATE_NAV_STATE, LOG_IN, SEARCH_RID_DB } from './action-types';


export function updateState(flag) {
    return ({
        type: UPDATE_NAV_STATE,
        payload: { flag }
    });
}

export function login() {
    return ({
        type: LOG_IN,
    });
}

export function setsearchRIDText(value) {
   // This is where you will call the axios for data and update the data with ruleset
   if(value.length> 4) {
    console.log( "In app containers " + value)
   
   }

   return ({ type: SEARCH_RID_DB, payload: { value } })
   }
   
  
