import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import axios from 'axios'


import { processEngine, updateParsedRules } from '../../validations/rule-validation';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import ButtonGroup from '../button/button-groups';
import operator from '../../data-objects/operator.json';
import Tabs from '../../components/tabs/tabs'
import ReactJson from 'react-json-view'


import ToggleButton from 'react-toggle-button'
import { RadioGroup, Radio } from 'react-radio-group'

import * as Message from '../../constants/messages';
import ApperanceContext from '../../context/apperance-context';


import { handleDebug } from '../../actions/debug';
import { handleDecision } from '../../actions/decisions'

import { responsiveFontSizes } from '@mui/material';
import SweetAlert from 'react-bootstrap-sweetalert';


import ImputeGrid from './imputeGrid';
import { max } from 'lodash';


const tabs = [{ name: 'General' }, { name: 'If-Then' }, { name: 'Action' }, { name: 'Track' },{ name: 'API' }, { name: 'Settings' }];
const HOSTURL = 'http://localhost'

const newRuleObject = {
    "event": {
        "ruleId": "0",
        "active": true,
        "name": "Rule Name(edit me)",
        "actionType": "impute",
        "validationType": "validation",
        "rulePriority": "5",
        "params": {
            "rvs": "[]",
            "action": [

            ],
            "message": "Enter the message you want to display...",
            "actionType": "impute"
        },
        "type": "0"
    },
    "index": -1,
    "conditions": {
        "all": [
            {
                "fact": "checkCondition",
                "path": "$.value",
                "operator": "equal",
                "value": true,
                "params": {
                    "conditionstring": "RCPT_TOT > 0"
                }
            }
        ]
    }
}

class RuleEditor extends Component {

    constructor(props) {
        super(props);

        this.getRowId = this.props.getRowId;

        const displayRuleEditor = true;

        const outcome = props.editDecision ? props.outcome : { value: 'New', params: [] };


        const decisionIndex = this.props.decisionIndex
        console.log("🚀 ~ file: ruleeditor.js:83 ~ RuleEditor ~ constructor ~ decisionIndex", decisionIndex)
        const conditions = this.props.conditions

        console.log("🚀 ~ file: ruleeditor.js ~ line 85 ~ RuleEditor ~ constructor ~ conditions", conditions)

        const handleCancel = this.props.handleCancel
        const facts = this.props.facts.facts


        const condition = (conditions.length) ? conditions[0] : newRuleObject.condition


        const conditionstring = condition.conditions && condition.conditions.all && condition.conditions.all[0].params ? condition.conditions.all[0].params.conditionstring : 'RCPT_TOT > 0'  // is an object of all/or array of conditions


        const conditionStringObject = { parseSuccess: true, ruleResult: true }

        const apiChecked = condition.event.params && condition.event.params.apiChecked ? condition.event.params.apiChecked : false

        const active = condition.event && condition.event.active ? condition.event.active : false

        console.log("🚀 ~ file: ruleeditor.js:97 ~ RuleEditor ~ constructor ~ active", active)


        const params = condition.event && condition.event.params ? condition.event.params : []
        const action = params.action || [];

        const validationType = condition.event && condition.event.validationType ? condition.event.validationType : 'validation'

        // Default the ruleId to 0 if its a new record and set rulePriority to 5 by default
        const ruleId = condition.event && condition.event.ruleId ? condition.event.ruleId || condition.event.type : 0
        const rulePriority = condition.event && condition.event.rulePriority ? condition.event.rulePriority : 5



        const name = condition.event ? condition.event.name : ''
        const message = condition.event ? condition.event.params.message : ''
        const responseVariables = condition.event && condition.event.params && condition.event.params.rvsJSON ? condition.event.params.rvsJSON :
            (condition.event && condition.event.params && condition.event.params.rvs ? JSON.parse(condition.event.params.rvs) : [])

        const actionType = condition.event && condition.event.params && condition.event.params.actionType ? condition.event.params.actionType : 'nofify'


        const apiSource = params.apiSource
            ? params.apiSource
            : {
                url: 'http://census.gov',
                verb: 'POST',
                headers: [{ key: 'X-JBID', value: 'kapoo' }, { key: 'X-API-KEY', value: '12345ABC233' }],
                data: [{ key: 'row', value: 3 }],
                query: [{ key: 'DEBUG', value: true }]
            }



        this.state = {
            showAddRuleCase: false,
            conditions: this.props.conditions,
            outcome,
            condition, ruleId, name, message, actionType, responseVariables, active, validationType, params, decisionIndex, action, apiSource, conditionstring, conditionStringObject, facts, rulePriority, displayRuleEditor, apiChecked,

            removeAlert: false, successAlert: false,
            actionParseObject: [], // gives the result of passing an array to the test action API end point. It will provide name value pairs and the imputedValue as an array.


            activeTab: 'If-Then', generateFlag: false,

            searchCriteria: '',
            editCaseFlag: false,
            editCondition: [],
            //  message: Message.NO_DECISION_MSG,
            decisions: props.decisions || [],
            bannerflag: false
        };
        console.log("🚀 ~ file: ruleeditor.js:156 ~ RuleEditor ~ constructor ~ facts", facts)
        this.handleUpdateRule = this.handleUpdateRule.bind(this);
        this.updateCondition = this.updateCondition.bind(this);
        this.editCondition = this.editCondition.bind(this);
        this.addCondition = this.addCondition.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.cancelAddAttribute = this.cancelAddAttribute.bind(this);
        this.removeDecisions = this.removeDecisions.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSearch = this.handleSearch.bind(this);


        this.handleChangeRuleMessage = this.handleChangeRuleMessage.bind(this)
        this.handleChangeRuleName = this.handleChangeRuleName.bind(this)
        this.onChangeOutcomeValue = this.onChangeOutcomeValue.bind(this);
        this.onToggleActive = this.onToggleActive.bind(this);
        this.onToggleAPI = this.onToggleAPI.bind(this);

        this.handleValidationType = this.handleValidationType.bind(this)
        this.handleRulePriority = this.handleRulePriority.bind(this)

        this.addResponseVariables = this.addResponseVariables.bind(this)
        this.deleteRVActions = this.deleteRVActions.bind(this)
        this.handleShowRuleJSON = this.handleShowRuleJSON.bind(this)
        this.handleResponseVariables = this.handleResponseVariables.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleChangeActionType = this.handleChangeActionType.bind(this)
        this.handleActions = this.handleActions.bind(this)
        this.handleCompileConditionString = this.handleCompileConditionString.bind(this)
        this.handleCompileImputeObject = this.handleCompileImputeObject.bind(this)


        // this.addActions = this.addActions.bind(this);
        // this.deleteActions = this.deleteActions.bind(this);
        this.handleTestRule = this.handleTestRule.bind(this)
        this.handleDeployRule = this.handleDeployRule.bind(this)




        this.addDebug = this.addDebug.bind(this);
        this.addDebug(this.props.conditions)

    }

    componentDidMount() {
        this.handleCompileConditionString()
        this.generateDescription()
    }
    handleTab = (tabName) => {
        this.setState({ activeTab: tabName });
    }





    handleSearch = (value) => {
        this.setState({ searchCriteria: value })
    }

    handleUpdateRule = () => {
        // this.setState({ showAddRuleCase: true, bannerflag: true });

        this.updateCondition(this.formRule())
    }

    cancelAddAttribute = () => {
        this.setState({ showAddRuleCase: false, editCaseFlag: false, bannerflag: false });
    }

    editCondition(decisionIndex) {
        const decision = this.props.decisions[decisionIndex];
        const editCondition = transformRuleToTree(decision);
        let outputParams = [];
        if (decision.event.params && Object.keys(decision.event.params).length > 0) {
            outputParams = Object.keys(decision.event.params).map(key => ({ pkey: key, pvalue: decision.event.params[key] }))
        }

        this.setState({
            editCaseFlag: true, editCondition,
            editDecisionIndex: decisionIndex,
            editOutcome: { value: decision.event.type, params: outputParams }
        });
    }

    addDebug(debug) {
        // this.props.handleDebug('ADD', {debug});


        this.props.handleDebug('ADD', { label: 'time', data: debug }, 0)

    }

    addCondition(condition) {
        this.props.handleDecision('ADD', { condition, decisionIndex: 0 });

    }

    updateCondition(condition) {

        const { responseVariables, name, ruleId, message, actionType, params, active, validationType, action, conditionStringObject, rulePriority } = this.state





        let rowData = { parsed_rule: condition, id: ruleId, data: condition, responseVariables, name, ruleId, message, actionType, params, active, validationType, action, conditionStringObject, rulePriority, key: this.props.decisionIndex }
        this.addDebug({ rowData, log: 'line 261 in ruleeditor' })

        this.props.performCrudOperations('update', this.props.decisionIndex, rowData);
        // (condition.index == -1) ? 'ADD' : 'UPDATE'
        // this.props.handleDecision((condition.index == -1) ? 'ADD' : 'UPDATE', {
        //     condition,
        //     decisionIndex: this.state.decisionIndex
        // });

        // this.setState({ displayRuleEditor: !this.state.displayRuleEditor });
    }

    removeCase(decisionIndex) {
        this.props.handleDecision('REMOVECONDITION', { decisionIndex });
    }

    removeDecisions(outcome) {
        this.props.handleDecision('REMOVEDECISIONS', { outcome });
    }

    handleReset() {
        this.props.handleDecision('RESET');
    }
    //NK FILTER
    filterOutcomes = () => {
        const { searchCriteria } = this.state;
        const { outcomes } = this.props;
        let filteredOutcomes = {};
        Object.keys(outcomes).forEach((key) => {
            if (isContains(key, searchCriteria)) {
                filteredOutcomes[key] = outcomes[key];
            }
        });
        return filteredOutcomes;
    }


    onChangeOutcomeValue(e, type) {
        const outcome = { ...this.state.outcome };
        outcome[type] = e.target.value;
        this.setState({ ruleId });
    }
    handleChangeRuleName(event) {
        event.preventDefault()
        let { outcome } = this.state
        let value = event.target.value
        this.setState({ name: value })

    }
    handleChangeRuleMessage(event) {
        event.preventDefault()
        let { outcome } = this.state
        let value = event.target.value
        this.setState({ message: value })
    }

    handleChangeActionOptions(event) {
        event.preventDefault()
        let val = event.target.value
        const { actionType } = this.state;
        this.setState({ actionType: event.target.value });
    }

    handleServiceGUPDRadioGroup(event) {
        event.preventDefault()
        const { apiGUPType } = this.state
        this.setState({ apiGUPType: event.target.value })
    }
    handleValidationType(event) {
        event.preventDefault()
        this.setState({ validationType: event.target.value })
    }
    handleRulePriority(event) {
        event.preventDefault()
        this.setState({ rulePriority: event.target.value })
    }




    ifThenPanel() {
        // condition, ruleId, name,message, responseVariables, actionType

        const { conditions, outcome, condition, ruleId, name, message, responseVariables, actionType, validationType, rulePriority, conditionStringObject } = this.state
        const success = conditionStringObject.parseSuccess
        const hasError = !success

        return (<div>
            <div> {this.conditionPanel()} </div>
            <div className="add-field-panel " >
                <Panel className="add-field-panel" title='Then Message'>
                    <textarea
                        style={{
                            width: '100%', height: '75px', padding: '20px',
                            'box-sizing': 'border-box',
                            border: '2px solid #ccc',
                            'border-radius': '4px',
                            'background-color': '#f8f8f8',
                            'font-size': '16px',
                            'resize': 'vertical'
                        }}
                        className="ag-theme-alpine" onChange={(value) => this.handleChangeRuleMessage(value)}
                        value={message}
                        error={hasError} label="Rule Message"
                        placeholder='Enter the message'

                        readOnly={false} />

                </Panel>


            </div>



        </div>)

    }

    addResponseVariables() {
        const { responseVariables } = this.state;
        // const newParams = responseVariables.params.concat({ pkey: '', pvalue: '' });
        responseVariables.push('')

        this.setState(responseVariables);
    }
    deleteRVActions() {
        const { responseVariables } = this.state;
        let index = responseVariables.length ? responseVariables.length : 0
        if (index) delete responseVariables[index - 1]
        this.setState(responseVariables);
    }




    handleResponseVariables(e, type, index) {
        const { responseVariables } = this.state;
        responseVariables[index] = e.target.value;
        this.setState(responseVariables);
    }




    responseVariablesPanel() {
        const { outcome, action, responseVariables, actionType } = this.state;
        const { background } = this.context;

        return (
            <div >
                <Panel className="add-field-panel" title='Track Variables'>



                    <div className={`attributes-header ${background}`}>
                        <div className="attr-link" onClick={this.addResponseVariables}>
                            <span className="plus-icon" /><span className="text">Add Response Variables</span>
                        </div>
                        <div className="attr-link" onClick={this.deleteRVActions}>
                            <span className="plus-icon" /><span className="text">Delete Response Variable</span>
                        </div>

                    </div>


                    {responseVariables && responseVariables.length > 0 && responseVariables.map((param, ind) =>
                    (<div key={ind} className="add-field-panel">

                        <InputField onChange={(value) => this.handleResponseVariables(value, 'pvalue', ind)} value={param} label="Variable"
                            placeholder='Enter a response variable to track...' />
                    </div>))


                    }

                </Panel></div>)
    }

    onToggleAPI(apiChecked) {
        this.setState({ apiChecked: !apiChecked })
    }

    onToggleActive(active) {
        this.setState({ active: !active })
    }
    cancelAlert = () => {
        this.setState({ removeAlert: false, successAlert: false, removeDecisionAlert: false });
    }
    async handleTestRule() {
        const { condition, facts, conditionStringObject } = this.state
        console.log("🚀 ~ file: ruleeditor.js:508 ~ RuleEditor ~ handleTestRule ~ facts", facts)
        if (!conditionStringObject.parseSuccess) {



            alert("Error: Test rule " + conditionStringObject)
            return;

        }

        let rules = [this.formRule()]
        let result = await processEngine([facts], rules)
        console.log("🚀 ~ file: ruleeditor.js:520 ~ RuleEditor ~ handleTestRule ~ facts", facts)

        this.props.handleDebug('ADD', { label: 'time', data: { result } }, 0)
    }



    generateApiDescription() {
        const { apiChecked, apiSource } = this.state;
        if (!apiChecked) return ('No api has been defined.')
        return ('API end point is: ' + JSON.stringify(apiSource))

    }

    generateDescription() {
        const { condition, responseVariables, name, ruleId, message, actionType, params, active, validationType, action, conditionStringObject, conditionstring, rulePriority } = this.state

        // If: 
        let description = 'Rule ' + name + ': If ' + conditionstring + ' then send a message: ' + message + ' and track these facts: ' + JSON.stringify(responseVariables) + '. Also perform the following actions:' + JSON.stringify(action) + '. This rule is of type: ' + validationType + '.  It has a rule priority of ' + rulePriority + ' on a scale of 1-10.' +
            this.generateApiDescription()


        this.setState({ description })

        return description;
    }
    /**
     * 
     * @returns the rule object and is not an array. used for display and running the rule
     * added a description field as a state to 
     */
    formRule() {
        const { condition, responseVariables, name, ruleId, message, actionType, params, active, validationType, action, conditionStringObject, rulePriority,
            apiChecked, apiSource } = this.state

        this.generateApiDescription()
            if(!apiChecked)
                var  newApiSource = {}
                else newApiSource = apiSource
        let paramsNew = { ...params, ...{ rvsJSON: responseVariables, rvs: JSON.stringify(responseVariables), action, actionType: actionType, message, apiChecked, 
            apiSource: newApiSource
        } }




        conditionStringObject.condition.conditions.all[0].params.conditionstring = this.state.conditionstring

        const conditionNew = {
            ...condition, ...{ event: { ruleId, active, name, actionType, validationType, rulePriority, params: paramsNew, type: ruleId + '' } },
            ...{ conditions: conditionStringObject.condition.conditions }
        }
        // this.state.condition
        this.setState({ condition: conditionNew })
        return conditionNew
    }

    handleShowRuleJSON() {
        const condition = this.formRule()
        this.props.handleDebug('ADD', { label: 'time', data: { condition } }, 0)
    }
    handleCancel() {
        this.props.handleCancel(this.state.decisionIndex)
    }


    handleChangeActionType(value) {
        this.setState({ actionType: value })
    }

    // addActions() {
    //     const { action } = this.state;
    //     action.push({ 'name': 'value' });
    //     this.setState(action)
    // }
    // // delete the key and value from the impute panel. remove the selected one.
    // deleteActions() {
    //     const { action } = this.state;
    //     let index = action.length ? action.length : 0
    //     if (index) delete action[index - 1]
    //     this.setState(action);
    // }

    // Adding key or value to the impute panel
    handleActions(e, type, index) {
        const { action } = this.state;
        // const params = [...action.params];
        const newParams = action.map((param, ind) => {
            if (index === ind) {


                if (type === 'pkey') {
                    return { [e.target.value]: Object.values(param) }

                    // return { ...param, : e.target.value };
                } else {
                    return { [Object.keys(param)]: e.target.value }
                    // return { ...param, pvalue: e.target.value };
                }
            }
            return param;
        });

        this.setState({ action: newParams });
    }


    validateAction(action){
        this.setState({action});
        this.handleCompileImputeObject(action)
        
    }

    /**
     * Build the aggregate panel built form actionactionType
     * @returns 
     */
    imputeAggregatePanel() {

        const { params, actionType, action, active, validationType, rulePriority, apiChecked, actionParseObject } = this.state;

        const imputeGrid = React.createRef();
        const actions = [
            { name: 'Add', icon: 'plus-icon', value: () => imputeGrid.current.addRow() },
            { name: 'Delete',icon: 'reset-icon', value: () => imputeGrid.current.deleteSelectedRows() },
            { name: 'Validate',icon: 'plus-icon', value: () => imputeGrid.current.reCreateActionArray() }
        ];

       





        // const imputeActionString = actionParseObject.reduce((acc, actionObject) => {
        //     acc.push(actionObject['ruleResult']);
        //     return acc;
        // }, []);






        let imputeValueString = ''
        for (var i = 0; i < actionParseObject.length; i++) {
            const actionObject = actionParseObject[i].imputedValue;
            const { ruleResult } = actionObject;

            imputeValueString = imputeValueString + ((i) ? ', ' : ' ') + actionParseObject[i].imputedVariable + ': ' + JSON.stringify(ruleResult);
         
        }

        const { background } = this.context;

        if (actionType === 'api' || actionType === 'notify') {
            return (<Panel title='Imputations and Aggregations' className="add-condition-panel "  >

                <div style={{ 'white-space': 'normal', 'text-align': 'left' }}>

                    <div>Active {JSON.stringify(active)}
                        <ToggleButton onToggle={this.onToggleActive} value={active} >

                        </ToggleButton>
                    </div>

                    <RadioGroup name="actionType" selectedValue={actionType} onChange={this.handleChangeActionType}>
                        <Radio value="notify" />Notify
                        <Radio value="impute" />Impute
                        <Radio value="aggregate" />Aggregate
                    </RadioGroup>
                </div>
            </Panel>)
        }
        else

            return (actionType == 'impute' || actionType == 'aggregate') ?
                (<Panel title='Imputations and Aggregations'>

                    <RadioGroup name="actionType" selectedValue={actionType} onChange={this.handleChangeActionType}>
                        <Radio value="notify" />Notify
                        <Radio value="impute" />Impute
                        <Radio value="aggregate" />Aggregate
                    </RadioGroup>

                    {/* Add an impute table grid.  It will be passed actions which are links to add delete and validate actions */}
                    <div className="ag-theme-alpine" style={{ height: 'auto', width: 'auto', 'textAlign': 'left' , 'margin':'20px'}}>
                        <ImputeGrid actions={actions} actionArray = {action} ref={imputeGrid} validateAction ={this.validateAction.bind(this)} />
                    </div>
                    <div>
                        <textarea
                            style={{
                                width: '100%', height: '100px', padding: '20px',
                                'box-sizing': 'border-box',
                                border: '0px solid #eef',
                                'border-radius': '4px',
                                'background-color': '#f8f8f8',
                                'font-size': '16px',
                                'resize': 'both',
                                color: 'gray',
                                'font-style': 'italic'
                            }}
                            className="ag-theme-alpine"
                            value={imputeValueString}
                            label="Status"
                            readOnly={true} />
                    </div>
                </Panel>) : ''
    }


    apiPanel() {
        let { actionType, apiChecked, activeAPITab, apiSource } = this.state;
        let onEdit = apiChecked, onAdd = apiChecked, onDelete = apiChecked
        return (true) ?
            (<Panel title='API'>
                <div id="treeWrapper">
                    <ReactJson src={apiSource} displayObjectSize={false} displayDataTypes={false}
                        onEdit={onEdit
                            ? e => {
                                console.log(e);
                                this.setState({ apiSource: e.updated_src });
                            }
                            : false}
                        onDelete={
                            onDelete
                                ? e => {
                                    console.log(e);
                                    this.setState({ apiSource: e.updated_src });
                                }
                                : false
                        }
                        onAdd={
                            onAdd
                                ? e => {
                                    console.log(e);
                                    let name = e.name; // header, query, body anything with key value pairs
                                    let length = e.updated_src[name].length
                                    e.updated_src[name].pop()

                                    e.updated_src[name].push({ key: '', value: '' })

                                    this.setState({ apiSource: e.updated_src });
                                }
                                : false
                        }
                    />
                </div>
            </Panel>) : ''
    }

    handleCompileImputeObject(action) {

        const {  facts } = this.state

        if (!action.length) return;

        var self = this
        let url = HOSTURL + '/rulesrepo/actiontest?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
        try {
            let result = axios.post(url, { facts: [facts], action: JSON.stringify(action) })
                .then((response) => {
                    let actionParseObject = response.data
                    self.setState({ actionParseObject })
                })
                .catch(function (error) {
                    self.setState({ actionParseObject: error.response.data.error })
                    console.log(error)
                })
        }
        catch (e) {
            alert(e)
        }
        return;



    }


    handleCompileConditionString() {
        const { conditionstring, conditionStringObject, facts } = this.state;
        var self = this
        if (!facts) return;
        let url = HOSTURL + '/rulesrepo/testcondition?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
        try {
            let result = axios.post(url, { facts: [facts], conditionstring })
                .then((response) => {
                    let conditionStringObject = response.data
                    self.setState({ conditionStringObject })
                })
                .catch(function (error) {
                    self.setState({ conditionStringObject: error.response.data.error })
                    console.log(error)
                })
        }
        catch (e) {
            alert(e)
        }
        return;
    };




    onChangeConditionString(event) {

        event.preventDefault()
        const conditionstring = event.target.value
        const conditionStringObject = this.state.conditionStringObject

        // NK Check if string is valid or not by making an axios call. Pass the string and it should return the error if any

        // conditionStringObject.condition.conditions.all[0].params.conditionstring = this.state.conditionstring
        this.setState({ conditionstring })//, conditionStringObject })

    }



    conditionPanel() {
        const { conditionstring, outcome, conditionStringObject, facts } = this.state
        const success = conditionStringObject.parseSuccess
        const hasError = !success


        const { background } = this.context;

        return (<Panel title='Specify IF Condition'>
            <div className="add-condition-panel " style={{ 'white-space': 'normal', 'text-align': 'left' }}>
                <div>



                    <textarea
                        style={{
                            width: '100%', height: '100px', padding: '10px',
                            'box-sizing': 'border-box',
                            border: '2px solid #ccc',
                            'border-radius': '4px',
                            'background-color': '#f8f8f8',
                            'font-size': '16px',
                            'resize': 'vertical'

                        }}




                        className="ag-theme-alpine" onChange={(value) => this.onChangeConditionString(value)}
                        value={conditionstring}
                        label="Rule Condition Error"
                        placeholder='Enter the conditions'

                        readOnly={false} />

                    <div> Syntax: {success ? 'Correct' : 'Incorrect'}</div>

                    {/* If has error then show the error in the parent.hint */}
                    <div  >Result: {hasError ? JSON.stringify(conditionStringObject.parent.hint) :

                        conditionStringObject.ruleResult.propertyName ?
                            conditionStringObject.ruleResult.propertyName + " is unknown at this time."
                            :
                            JSON.stringify(conditionStringObject.ruleResult)}</div>

                    {/* Show the status can be true or false based on the value       */}
                    Status: {conditionStringObject.value ? JSON.stringify(conditionStringObject.value) : 'false'}
                </div>
            </div>
            <div className="btn-group">

                {/* Calling validation */}
                <div className={`attributes-header ${background}`}>
                    <div className="attr-link" onClick={this.handleCompileConditionString}>
                        <span className="plus-icon" /><span className="text">Validate</span>
                    </div>
                </div>




            </div>

        </Panel>)

    }


    showAlert(title, message, style) {
        this.setState({
            alert: (
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Sí"
                    cancelBtnText="No"
                    confirmBtnBsStyle={style ? style : "warning"}
                    cancelBtnBsStyle="default"
                    customIcon="thumbs-up.jpg"
                    title={title}
                    onConfirm={this.hideAlert()}
                    onCancel={this.hideAlert}
                >
                    {message}
                </SweetAlert>
            )
        });
    }

    hideAlert = () => {
        this.setState({
            alert: null
        });
    }



    alert = () => {
        return (<div >
            {/* {this.state.removeAlert && this.removeCaseAlert()} */}
            {this.state.removeDecisionAlert && this.removeDecisionAlert()}
            {this.state.successAlert && this.successAlert()}
        </div>);
    }







    cancelAlert() {
        this.setState({ successAlert: false });
    }

    successAlert = () => {
        return (

            <div style={{ width: "fit-content" }}>

                <SweetAlert
                    success
                    title={"Rule has been deployed successfully!! "}
                    onConfirm={this.cancelAlert.bind(this)}
                    onCancel={this.cancelAlert.bind(this)}


                >
                    {this.state.updatedAlert}
                </SweetAlert></div>);
    }


    async handleDeployRule() {
        const r = this.formRule()
        let data = {
            parsed_rule: r,
            active: this.state.active,
            type: this.state.validationType,
            data: r,
            description: this.state.message,
            name: this.state.name,
            id: Number(r.event.ruleId)

        }
        let result = await updateParsedRules(data)
        console.log("🚀 ~ file: ruleeditor.js:763 ~ RuleEditor ~ handleDeployRule ~ result", result)

        this.setState({ successAlert: true, updatedAlert: "Rule # " + result[0].id + " was successfully deployed" })

        // alert("Rule # " + result[0].id + " was successfully deployed", '')
    }

    render() {
        const { searchCriteria, bannerflag, name, active, validationType, ruleId, actionType, rulePriority, displayRuleEditor, successAlert, apiChecked, outcome } = this.state;
        const buttonProps = { primaryLabel: ruleId ? 'Update' : 'Add Rulecase', secondaryLabel: 'Cancel' };
        const editButtonProps = { primaryLabel: 'Update Rulecase', secondaryLabel: 'Cancel' };
        const filteredOutcomes = searchCriteria ? this.filterOutcomes() : this.props.outcomes;
        const { conditions } = this.state;
        return (!displayRuleEditor) ? (<div><span /></div>) :

            (<div style={{ display: 'flex', maxWidth: '1000px', padding: '20px', margin: '10px' }}>
                {this.alert()}
                <div title={name} >

                    <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
                    <div className="tab-page-container" style={{  width: '1000px', padding: '20px', margin: '50px' }} >

                        {this.state.activeTab === 'General' && <div> 
                            
                        <Panel title="Enter rule name" >
                <InputField onChange={(value) => this.handleChangeRuleName(value)}
                    value={name}
                    error={outcome.error && outcome.error.value} label=""
                    placeholder='Enter a rule name...'

                />
            </Panel>  
                            
                            
                            
                            
                               <textarea
                            style={{
                                width: '100%', height: '300px', padding: '20px',
                                'box-sizing': 'border-box',
                                border: '1px solid #eef',
                                'border-radius': '4px',
                                'background-color': '#f8f8f8',
                                'font-size': '16px',
                                'resize': 'vertical',
                                color: 'gray',
                                'font-style': 'italic'
                            }}




                            className="ag-theme-alpine"
                            value={this.state.description}
                            label="Rule Condition Error"
                            placeholder='Enter the conditions'

                            readOnly={true} /> </div>}

                         {this.state.activeTab === 'Track' && <div>{this.responseVariablesPanel()}</div>}   

                        {this.state.activeTab === 'If-Then' && <div> {this.ifThenPanel()} </div>}
                        {this.state.activeTab === 'Condition' && <div> {this.conditionPanel()} </div>}


                        {this.state.activeTab === 'API' && <div> API Active Status <ToggleButton onToggle={this.onToggleAPI} value={apiChecked} />
                            {this.apiPanel()}
                        </div>}


                        {this.state.activeTab === 'Action' && <div> {this.imputeAggregatePanel()}</div>}
                        {this.state.activeTab === 'Settings' &&
                            <div>
                                <Panel title='Category and Weights' >
                                    <InputField onChange={(value) => this.handleValidationType(value)}
                                        value={validationType}
                                        error={outcome.error && outcome.error.value} label="Category"
                                        placeholder='Enter a validation type(For example: "validation")...'
                                    />
                                    <SelectField options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} onChange={(e) =>
                                        this.handleRulePriority(e)
                                    }
                                        value={rulePriority} label="Weights" />
                                </Panel>




                            </div>}

                        <div className="btn-group">
                            <Button label={buttonProps.primaryLabel} onConfirm={this.handleUpdateRule} classname="primary-btn" />
                            <Button label='View Rule' onConfirm={this.handleShowRuleJSON} classname="primary-btn" />

                            <Button label='Test Rule' onConfirm={this.handleTestRule} classname="primary-btn" />

                            <Button label='Deploy Rule' onConfirm={this.handleDeployRule} classname="primary-btn" />


                        </div>

                    </div>
                </div>

            </div>);
    }
}
RuleEditor.contextType = ApperanceContext;
RuleEditor.defaultProps = ({
    submit: () => false,
    reset: () => false,
    decisions: [],
    attributes: [],
    outcomes: {},
    handleDebug: () => false,
    handleDecision: () => false
}


);

RuleEditor.propTypes = ({
    submit: PropTypes.func,
    reset: PropTypes.func,
    decisions: PropTypes.array,
    attributes: PropTypes.array,
    outcomes: PropTypes.object,
    handleDebug: PropTypes.func,
    handleDecision: PropTypes.func,
    hello: PropTypes.func
});

const mapStateToProps = (state, ownProps) => ({

    // debugData: state.ruleset.debugData
});
const mapDispatchToProps = (dispatch) => ({
    handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index)),
    handleDecision: (operation, decision) => dispatch(handleDecision(operation, decision)),

});

export default connect(mapStateToProps, mapDispatchToProps)(RuleEditor);
