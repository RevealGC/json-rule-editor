import * as ActionTypes from './action-types';
const HOSTURL = "http://cto-tasks002-ite.ite.edl.census.gov:8002"
import axios from 'axios';
export const removeRule = (ruleIndex) => {
    const payload = { ruleIndex };

    return ({ type: ActionTypes.REMOVE_RULE, payload});
}

export const updateRule = (rule, ruleIndex) => {
    const payload = { rule, ruleIndex };

    return ({ type: ActionTypes.UPDATE_RULE, payload});
}

export const addRule = (rule) => { 
    // console.log("🚀 ~ file: rules.js:17 ~ addRule ~ rule", rule)
    const payload = rule;
    return ({ type: ActionTypes.ADD_RULE, payload});
}

export const removeRules = (outcome) => {
    const payload = { outcome };

    return ({ type: ActionTypes.REMOVE_RULES, payload});
}

export const reset = () => {
    return ({type: ActionTypes.RESET_RULE});
}




export const handleRule = (action, editRule={}) => async (dispatch) => {
    const rule = editRule;
    switch(action) {

        case 'FETCH_FROMDB_ALLRULES_REDUX':{

                let url = HOSTURL + '/rulesrepo?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
                let ret = await axios.get(url)
                let rowData = ret.data.data
                rowData = rowData.map((row, index) => {
                 return { ...row, key: index +1 }
                })
             
               return dispatch({ type: ActionTypes.ADD_ALLRULES_REDUX, payload: rowData});
        }
        case 'ADD': {
            return dispatch(addRule(rule));
        }
        case 'UPDATE': {
            const { ruleIndex } = editRule;
            return dispatch(updateRule(rule, ruleIndex)); 
        }
        case 'REMOVERULE': {
            return dispatch(removeRule(rule));
        }
        case 'REMOVERULES': {
            
            return dispatch(removeRules(rule));
        }
        case 'RESET': {
            return dispatch(reset());
        }
    }
};
