import * as ActionTypes from './action-types';

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

export const handleRule = (action, editRule={}) => (dispatch) => {
    const rule = editRule;
    switch(action) {
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
