import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';

// import ToolBar from '../toolbar/toolbar';
// import AddDecision from './add-decision';
// import DecisionDetails from './decision-details';
// import Banner from '../panel/banner';

import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import ButtonGroup from '../button/button-groups';
import operator from '../../data-objects/operator.json';
import Tabs from '../../components/tabs/tabs'

import ToggleButton from 'react-toggle-button'
import { RadioGroup, Radio } from 'react-radio-group'

import * as Message from '../../constants/messages';
import ApperanceContext from '../../context/apperance-context';
// import { transformRuleToTree } from '../../utils/transform';
// import { isContains } from '../../utils/stringutils';


import { handleDebug } from '../../actions/debug';
const tabs = [{ name: 'General' }, { name: 'Condition' }, { name: 'Outcome' }, { name: 'Validate' }];

class RuleEditor extends Component {

    constructor(props) {
        super(props);


        const outcome = props.editDecision ? props.outcome : { value: 'New', params: [] };


        const decisionIndex = this.props.decisionIndex
        const conditions = this.props.conditions
        const handleCancel = this.props.handleCancel




        const condition = conditions[0]



        // "conditions": {
        //     "all": [
        //         {
        //             "fact": "checkCondition",
        //             "path": "$.value",
        //             "params": {
        //                 conditionstring: "substr(reporting_id,0, 2) == \"87\" and substr(street, 0,3) == \"942\""
        //             },
        //             "operator": "equal",
        //             "value": true
        //         }
        //     ]
        // },

        const conditionstring = condition.conditions.all && condition.conditions.all[0].params ? condition.conditions.all[0].params.conditionstring : 'RCPT_TOT > 0'  // is an object of all/or array of conditions






        const active = condition.event && condition.event.params && condition.event.params.active ? condition.event.params.active : true
        const params = condition.event && condition.event.params ? condition.event.params : []
        const action = params.action || [];

        const validationType = condition.event && condition.event.params && condition.event.params.validationType ? condition.event.params.validationType : 'validation'

        const ruleId = condition.event.ruleId || condition.event.type || 0
        const name = condition.event.name || ''
        const message = condition.event.params.message || ''
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
            condition, ruleId, name, message, actionType, responseVariables, active, validationType, params, decisionIndex, action, apiSource, conditionstring,
            activeTab: 'General', generateFlag: false,

            searchCriteria: '',
            editCaseFlag: false,
            editCondition: [],
            //  message: Message.NO_DECISION_MSG,
            decisions: props.decisions || [],
            bannerflag: false
        };
        this.handleAdd = this.handleAdd.bind(this);
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

        this.handleValidationType = this.handleValidationType.bind(this)
        this.addResponseVariables = this.addResponseVariables.bind(this)
        this.deleteRVActions = this.deleteRVActions.bind(this)
        this.handleShowRuleJSON = this.handleShowRuleJSON.bind(this)
        this.handleResponseVariables = this.handleResponseVariables.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleChangeActionType = this.handleChangeActionType.bind(this)
        this.handleActions = this.handleActions.bind(this)


        this.addActions = this.addActions.bind(this);
        this.deleteActions = this.deleteActions.bind(this);




        this.addDebug = this.addDebug.bind(this);
        this.addDebug(this.props.conditions)

    }


    handleTab = (tabName) => {
        this.setState({ activeTab: tabName });
    }




    handleSearch = (value) => {
        this.setState({ searchCriteria: value })
    }

    handleAdd = () => {
        this.setState({ showAddRuleCase: true, bannerflag: true });
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
        this.props.handleDecisions('ADD', { condition });
        this.setState({ showAddRuleCase: false });
    }

    updateCondition(condition) {
        this.props.handleDecisions('UPDATE', {
            condition,
            decisionIndex: this.state.editDecisionIndex
        });
        this.setState({ editCaseFlag: false });
    }

    removeCase(decisionIndex) {
        this.props.handleDecisions('REMOVECONDITION', { decisionIndex });
    }

    removeDecisions(outcome) {
        this.props.handleDecisions('REMOVEDECISIONS', { outcome });
    }

    handleReset() {
        this.props.handleDecisions('RESET');
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
        let { outcome } = this.state
        let value = event.target.value
        this.setState({ name: value })

    }
    handleChangeRuleMessage(event) {
        let { outcome } = this.state
        let value = event.target.value
        this.setState({ message: value })
    }

    handleChangeActionOptions(event) {
        let val = event.target.value
        const { actionType } = this.state;
        this.setState({ actionType: event.target.value });
    }

    handleServiceGUPDRadioGroup(event) {
        const { apiGUPType } = this.state
        this.setState({ apiGUPType: event.target.value })
    }
    handleValidationType(event) {
        this.setState({ validationType: event.target.value })
    }





    generalPanel() {
        // condition, ruleId, name,message, responseVariables, actionType

        const { conditions, outcome, condition, ruleId, name, message, responseVariables, actionType, validationType } = this.state

        return (<div>

            {/* general
            {name}
            {ruleId}
            {message}
            {responseVariables}
            {actionType} */}

            <div className="add-field-panel ">
                <div>
                    <InputField onChange={(value) => this.onChangeOutcomeValue(value, 'value')}
                        value={ruleId}
                        error={outcome.error && outcome.error.value} label="Rule ID"
                        placeholder='Enter a rule name...'

                        readOnly={true} />
                </div>
                <div>
                    <InputField onChange={(value) => this.handleChangeRuleName(value)}
                        value={name}
                        error={outcome.error && outcome.error.value} label="Rule Name"
                        placeholder='Enter a rule name...'

                    />
                </div>
                <div>
                    <InputField onChange={(value) => this.handleValidationType(value)}
                        value={validationType}
                        error={outcome.error && outcome.error.value} label="Rule Category"
                        placeholder='Enter a validation type(For example: "validation")...'

                    />
                </div>
            </div>
            <div className="add-field-panel ">


                <div>
                    <InputField onChange={(value) => this.handleChangeRuleMessage(value)}
                        value={message}
                        error={outcome.error && outcome.error.value} label="Message"
                        placeholder='Enter the message to be displayed when rule is fired...'
                    />
                </div>



            </div>
            {this.responseVariablesPanel()}


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

        return (<Panel title='Response Variables'>
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

                <InputField onChange={(value) => this.handleResponseVariables(value, 'pvalue', ind)} value={param} label="Value"
                    placeholder='Enter a response variable to track...' />
            </div>))


            }

        </Panel>)
    }



    onToggleActive(active) {
        this.setState({ active: !active })
    }

    handleShowRuleJSON() {
        const { condition, responseVariables, name, ruleId, message, actionType, params, active, validationType, action } = this.state
        let paramsNew = { ...params, ...{ rvsJSON: responseVariables, action, actionType: actionType, message } }
        const conditionNew = { ...condition, ...{ event: { ruleId, active, name, actionType, validationType, params: paramsNew, type: ruleId + '' } } }
        // this.state.condition
        this.setState({ condition: conditionNew })

        this.props.handleDebug('ADD', { label: 'time', data: { condition: conditionNew } }, 0)
    }
    handleCancel() {
        this.props.handleCancel(this.state.decisionIndex)
    }


    handleChangeActionType(value) {
        this.setState({ actionType: value })
    }

    addActions() {
        const { action } = this.state;
        action.push({ 'name': 'value' });
        this.setState(action)
    }

    deleteActions() {
        const { action } = this.state;
        let index = action.length ? action.length : 0
        if (index) delete action[index - 1]
        this.setState(action);
    }
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
    imputeAggregatePanel() {

        const { params, actionType, action } = this.state;
        // const action = this.state.params.action 

        const { background } = this.context;

        return (actionType == 'impute' || actionType == 'aggregate') ?
            (<Panel title='Imputations and Aggregations'>
                <div className={`attributes-header ${background}`}>
                    <div className="attr-link" onClick={this.addActions}>
                        <span className="plus-icon" /><span className="text">Add Action</span>
                    </div>


                    <div className="attr-link" onClick={this.deleteActions}>
                        <span className="plus-icon" /><span className="text">Delete Action</span>
                    </div>

                </div>

                {action && action.length > 0 && action.map((param, ind) =>


                (<div key={ind} className="add-field-panel">
                    <InputField onChange={(value) => this.handleActions(value, 'pkey', ind)}
                        label="Actions"
                        value={Object.keys(param)}
                        placeholder='Enter a computed variable name...' />
                    <InputField onChange={(value) => this.handleActions(value, 'pvalue', ind)}
                        value={Object.values(param)} label="Value"
                        placeholder='Enter an expression or logical condition to compute...'
                    />
                </div>))


                }
                <div>Imputations and Aggregations</div>
            </Panel>) : ''
    }


    apiPanel() {
        let { actionType, activeAPITab, apiSource } = this.state;
        let onEdit = true, onAdd = true, onDelete = true
        return (actionType == 'API') ?
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


    onChangeConditionString(conditionstring){
        // NK Check if string is valid or not by making an axios call. Pass the string and it should return the error if any
        this.setState(conditionstring)
    }
    conditionPanel() {
        const { conditionstring, outcome } = this.state

        const { background } = this.context;

        return (<Panel >
            <div className="add-condition-panel ">
                <div>
                    <InputField onChange={(value) => this.onChangeConditionString(value)}
                        value={conditionstring}
                        error={outcome.error && outcome.error.value} label="Rule Condition"
                        placeholder='Enter the conditions'

                        readOnly={false} />
                </div>
            </div>
        </Panel>)

    }


    render() {
        const { searchCriteria, bannerflag, name, active, validationType, ruleId, actionType } = this.state;
        const buttonProps = { primaryLabel: ruleId ? 'Update RuleCase' : 'Add Rulecase', secondaryLabel: 'Cancel' };
        const editButtonProps = { primaryLabel: 'Update Rulecase', secondaryLabel: 'Cancel' };
        const filteredOutcomes = searchCriteria ? this.filterOutcomes() : this.props.outcomes;
        const { conditions } = this.state;

        return (<div className="rulecases-container">
            <Panel title={'Edit Rule: ' + name} >

                <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
                <div className="tab-page-container">
                    Active <ToggleButton onToggle={this.onToggleActive} value={active} />
                    Type: {validationType} {actionType}
                    <RadioGroup name="actionType" selectedValue={actionType} onChange={this.handleChangeActionType}>
                        <Radio value="notify" />Notify
                        <Radio value="impute" />Impute
                        <Radio value="aggregate" />Aggregate
                        <Radio value="api" />API
                    </RadioGroup>


                    {this.state.activeTab === 'General' && <div>{this.generalPanel()}</div>}
                    {this.state.activeTab === 'Condition' && <div> {this.conditionPanel()} </div>}
                    {this.state.activeTab === 'Outcome' && <div>{this.imputeAggregatePanel()}</div>}
                    {this.state.activeTab === 'Validate' && <div>Validate</div>}
                    <div className="btn-group">
                        <Button label={buttonProps.primaryLabel} onConfirm={this.handleAdd} classname="primary-btn" />
                        <Button label='View Rule' onConfirm={this.handleShowRuleJSON} classname="primary-btn" />

                        <Button label={buttonProps.secondaryLabel} onConfirm={this.handleCancel} classname="cancel-btn" />


                    </div>

                </div>
            </Panel>

        </div>);
    }
}
RuleEditor.contextType = ApperanceContext;
RuleEditor.defaultProps = ({
    handleDecisions: () => false,
    submit: () => false,
    reset: () => false,
    decisions: [],
    attributes: [],
    outcomes: {},
    handleDebug: () => false
});

RuleEditor.propTypes = ({
    handleDecisions: PropTypes.func,
    submit: PropTypes.func,
    reset: PropTypes.func,
    decisions: PropTypes.array,
    attributes: PropTypes.array,
    outcomes: PropTypes.object,
    handleDebug: PropTypes.func
});

const mapStateToProps = (state, ownProps) => ({

    // debugData: state.ruleset.debugData
});
const mapDispatchToProps = (dispatch) => ({
    handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))

});

export default connect(mapStateToProps, mapDispatchToProps)(RuleEditor);
