import * as ActionTypes from './action-types';

export const add = (debug) => {
    const payload = { debug };
    return ({ type: ActionTypes.ADD_DEBUG, payload});
}

export const update = (debug, index) => {
    const payload = { debug, index };

    return ({ type: ActionTypes.UPDATE_DEBUG, payload});
}

export const remove = (debug, index) => {
    const payload = { debug, index };

    return ({ type: ActionTypes.REMOVE_DEBUG, payload});
}

export const reset = () => {
    return ({type: ActionTypes.RESET_DEBUG})
}


export const handleDebug = (action, debug, index) => (dispatch) => {
    switch(action) {
        case 'ADD':
            return dispatch(add(debug));
        case 'UPDATE':
            return dispatch(update(debug, index));
        case 'REMOVE':
            return dispatch(remove(debug, index));
        case 'RESET':
            return dispatch(reset());
    }
};