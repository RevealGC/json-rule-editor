
// import ruleset from '../reducers/ruleset-reducer';
// Manages rulesets. To manage rules go to the action for rules.js
import axios from 'axios';
import * as ActionTypes from './action-types';
import { updateState } from './app';


export const uploadRuleset = (ruleset)  => (dispatch) => {
    dispatch(updateState('open'));
    return dispatch({
        type: ActionTypes.UPLOAD_RULESET,
        payload: { ruleset }
    });
}

// uploadDBRuleset UPLOAD_DBRULESET 'UPLOAD_DBRULESET'
export const uploadDBRuleset = (ruleset) => (dispatch) => {
    dispatch(updateState('open'));
    return dispatch({
        type: ActionTypes.UPLOAD_DBRULESET,
        payload: {ruleset}
    })
}


export const addRuleset = (name) => (dispatch) => {
    dispatch(updateState('open'));
    return dispatch({
        type: ActionTypes.ADD_RULESET,
        payload: { name }
    });
}



export const updateRulesetIndex = (name) => {
    return ({
        type: ActionTypes.UPDATE_RULESET_INDEX,
        payload: { name }
    })
}

export const loadRuleTypes =  ()=> async (dispatch)=>{
    // make an axios call and get all validation types
    let url = 'http://cto-tasks002-ite.ite.edl.census.gov:8002/rulesrepo/getruletype'
    let ruleType = await axios(url)
    return dispatch({
        type: ActionTypes.LOAD_RULE_TYPES,
        payload: {ruleType:ruleType.data}
    })


}



// Takes an array of rules and is called from rulegrid.js and saves all rules from the db in the redux state
// the rules are accessed via its property allRulesRedux
export const addAllRulesRedux = (rules) => (dispatch) => {
    dispatch(updateState('closed'));
    return dispatch({
        type: ActionTypes.ADD_ALLRULES_REDUX,
        payload: rules
    })
}