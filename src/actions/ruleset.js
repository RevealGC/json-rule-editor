
// import ruleset from '../reducers/ruleset-reducer';
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
