import * as ActionTypes from '../actions/action-types';
 import { cloneDeep } from 'lodash/lang';
 import { findIndex } from 'lodash/array';

     
 const removeElements = (keysArray, rules) =>{
    let filteredArray = rules.filter(item => !keysArray.includes(item.key));
    return filteredArray;
}


const dateTime = () =>{
    // Create a date object with the current time
    var date = new Date();
  
    // Extract the hours, minutes, and seconds from the date object
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
  
    // Convert the hours, minutes, and seconds to strings and add leading zeros if necessary
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
  
    // Create a string in the format "hh:mm:ss"
    var timeString = hours + ":" + minutes + ":" + seconds;
  
    // Return the string
    return timeString;
  }




var initTime = dateTime()
const initialState = {
    rulesets: [],
    allRulesRedux:[],
    activeRuleset: 0,
    updatedFlag: false,
    uploadedRules: [],
    ruleType:[{type:'validation'}, {type:'All'}],
    debugData :[{label:initTime, data:{'WELCOME':'Welcome to QBES Editor & Debugger'}}]
}


const replaceRulesetByIndex = (rulesets, targetset, index) => {
     return [ ...rulesets.slice(0, index), targetset, ...rulesets.slice(index + 1)];
}


function ruleset(state = initialState, action='') {

    switch(action.type) {

     
        case ActionTypes.ADD_ALLRULES_REDUX: {

            const rowData= action.payload;

            return {...state, updatedFlag: true, allRulesRedux:rowData}
      
            //  return { ...state, allRulesRedux: cloneDeep(rules)}
        }

        case ActionTypes.LOAD_RULE_TYPES: {
            const {ruleType} = action.payload
            state.ruleType = ruleType
            return {...state}
        }

        case ActionTypes.ADD_DEBUG: {
            const { debug } = action.payload;
            debug.label = dateTime()

            const debugData = state.debugData.push(debug)
             return { ...state,...debugData}
                     
         }
 
         case ActionTypes.RESET_DEBUG: {
            
             return { ...state, debugData:[]}
         }

        case ActionTypes.UPLOAD_RULESET: {

            const { ruleset } = action.payload;
            const rulesets = state.rulesets.concat(ruleset);
            const count = rulesets.length === 0 ? 0 : rulesets.length;
             return { ...state, rulesets: cloneDeep(rulesets), activeRuleset: count-1, uploadedRules: cloneDeep(rulesets)}
        }

        case ActionTypes.UPLOAD_DBRULESET: {

            const { ruleset } = action.payload;
            const rulesets = state.rulesets.concat(ruleset);
             return { ...state, rulesets: cloneDeep(rulesets),  uploadedRules: cloneDeep(rulesets)}
        }
        case ActionTypes.ADD_RULESET: {

            const { name } = action.payload;
            const rulset = { name, attributes: [], decisions: []};
            const count = state.rulesets.length === 0 ? 0 : state.rulesets.length;
             return { ...state, rulesets: state.rulesets.concat(rulset),  activeRuleset: count}
        }



// Done: payload is an object of type rules. It adds the new rule in front and generates the key for the rule so it can be rendered. 
        case ActionTypes.ADD_RULE:{
            const rules = action.payload;
            let  allRulesRedux = state.allRulesRedux
            rules.key = allRulesRedux.length + 1
            allRulesRedux.unshift(rules)
            return {...state,  updatedFlag: true, ...allRulesRedux}
        }

        case ActionTypes.REMOVE_RULE:{
            const key = action.payload;
            let  allRulesRedux = state.allRulesRedux
            allRulesRedux.splice(key, 1)
            return {...state,  updatedFlag: true, ...allRulesRedux}
        }


        case ActionTypes.REMOVE_RULES:{
            const keysArray = action.payload.outcome; // array of all the keys to remove
            return {...state,  updatedFlag: true, ...{allRulesRedux: removeElements(keysArray, state.allRulesRedux)}}
        }



        case ActionTypes.UPDATE_RULESET_INDEX: {

            const { name } = action.payload;
            const index = findIndex(state.rulesets, { name });
             return { ...state, activeRuleset: index}
        }
        
        case ActionTypes.ADD_DECISION: {

           const condition  = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.decisions = activeRuleSet.decisions.concat(condition);

            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.UPDATE_DECISION: {
            const { condition, decisionIndex } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions[decisionIndex] = condition;
 
             return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
         }
        case ActionTypes.REMOVE_DECISION: {

            const { decisionIndex } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions.splice(decisionIndex, 1);
 
             return { ...state,
                     updatedFlag: true,
                     rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.REMOVE_DECISIONS: {

            const { outcome } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
 
            activeRuleSet.decisions = activeRuleSet.decisions.filter(decision => decision.event && decision.event.type !== outcome);
 
             return { ...state,
                     updatedFlag: true,
                     rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }


        case ActionTypes.ADD_ATTRIBUTE: {
           const { attribute } = action.payload;
           const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
           activeRuleSet.attributes.push(attribute);

            return { ...state,
                    updatedFlag: true,
                    rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }
            
        case ActionTypes.UPDATE_ATTRIBUTE: {
            const { attribute, index } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.attributes.splice(index, 1, attribute);

            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.REMOVE_ATTRIBUTE: {

            const { index } = action.payload;
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            activeRuleSet.attributes.splice(index, 1);

            return { ...state,
                updatedFlag: true,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
        }

        case ActionTypes.RESET_ATTRIBUTE: {
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            if(state.uploadedRules[state.activeRuleset] && state.uploadedRules[state.activeRuleset].attributes) {
                activeRuleSet.attributes = cloneDeep(state.uploadedRules[state.activeRuleset].attributes);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
            }
            return { ...state };
        }

        case ActionTypes.RESET_DECISION: {
            const activeRuleSet =  { ...state.rulesets[state.activeRuleset] };
            if(state.uploadedRules[state.activeRuleset] && state.uploadedRules[state.activeRuleset].decisions) {
                activeRuleSet.decisions = cloneDeep(state.uploadedRules[state.activeRuleset].decisions);

            return { ...state,
                rulesets: replaceRulesetByIndex(state.rulesets, activeRuleSet, state.activeRuleset)}
            }
            return { ...state };
        }


        default:
            return { ...state };
    }
}

export default ruleset;