import React, {Component} from 'react';
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
import  ToggleSwitch from "../../components/toggle/toggleswitch"
import * as Message from '../../constants/messages';
import ApperanceContext from '../../context/apperance-context';
// import { transformRuleToTree } from '../../utils/transform';
// import { isContains } from '../../utils/stringutils';


import { handleDebug } from '../../actions/debug';
const tabs = [{name: 'General'}, {name: 'Condition'}, {name: 'Outcome'}, {name: 'Validate'}];

class RuleEditor extends Component {

    constructor(props){
        super(props);


        const outcome = props.editDecision ? props.outcome : {value: 'New', params:[] };
        const conditions= this.props.conditions
       

        const condition = conditions[0]

        const active = condition.event && condition.event.params && condition.event.params.active ? condition.event.params.active :true



        const ruleId = condition.event.ruleId || condition.event.type || '0'
        const name = condition.event.name || ''
        const  message = condition.event.params.message || ''
        const responseVariables = condition.event && condition.event.params && condition.event.params.rvsJSON ? condition.event.params.rvsJSON :
        (condition.event && condition.event.params && condition.event.params.rvs ? JSON.parse(condition.event.params.rvs) :[]) 
        
        const actionType = condition.event && condition.event.params && condition.event.params.actionType ? condition.event.params.actionType : 'nofify'




        

        this.state={showAddRuleCase: false,
            conditions: this.props.conditions,
            outcome,
            condition,ruleId,name,message,actionType,responseVariables,active,
         activeTab: 'General', generateFlag: false,

             searchCriteria: '',
             editCaseFlag: false,
             editCondition: [],
            //  message: Message.NO_DECISION_MSG,
             decisions: props.decisions || [],
             bannerflag: false };
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

        this.addDebug = this.addDebug.bind(this);
        this.addDebug(this.props.conditions)

    }


    handleTab = (tabName) => {
        this.setState({activeTab: tabName});
    }




    handleSearch = (value) => {
        this.setState({ searchCriteria: value})
    }

    handleAdd = () => {
        this.setState({showAddRuleCase: true, bannerflag: true });
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
        
        this.setState({ editCaseFlag: true, editCondition, 
            editDecisionIndex: decisionIndex, 
            editOutcome: { value: decision.event.type, params: outputParams }});
    }

    addDebug(debug){
        // this.props.handleDebug('ADD', {debug});
        

        this.props.handleDebug('ADD', {label:'time', data:debug}, 0)
   
    }

    addCondition(condition) {
        this.props.handleDecisions('ADD', { condition });
        this.setState({ showAddRuleCase: false });
    }

    updateCondition(condition) {
        this.props.handleDecisions('UPDATE', { condition, 
            decisionIndex: this.state.editDecisionIndex });
        this.setState({ editCaseFlag: false });
    }

    removeCase(decisionIndex) {
        this.props.handleDecisions('REMOVECONDITION', { decisionIndex});
    }

    removeDecisions(outcome) {
        this.props.handleDecisions('REMOVEDECISIONS', { outcome});
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
    handleChangeRuleName(event){
        let {outcome} = this.state
        let value = event.target.value
        this.setState({name:value})
  
    }
    handleChangeRuleMessage(event){
        let {outcome} = this.state
        let value = event.target.value
        this.setState({message:value})
    }

    handleChangeActionOptions(event) {
        let val = event.target.value
        const { actionType } = this.state;
        this.setState({ actionType: event.target.value });
    }

    handleServiceGUPDRadioGroup(event){
        const {apiGUPType} = this.state
        this.setState({apiGUPType: event.target.value})
    }

    generalPanel() {
        // condition, ruleId, name,message, responseVariables, actionType

        const {conditions, outcome, condition, ruleId, name, message, responseVariables, actionType} = this.state
        // const condition = conditions[0]
        // const ruleId = condition.event.ruleId || condition.event.type || '0'
        // const name = condition.event.name || ''
        // const  message = condition.event.params.message || ''
        // const responseVariables = condition.event && condition.event.params && condition.event.params.rvsJSON ? condition.event.params.rvsJSON :
        // (condition.event && condition.event.params && condition.event.params.rvs ? JSON.parse(condition.event.params.rvs) :[]) 
        // const actionType = condition.event && condition.event.params && condition.event.params.actionType ? condition.event.params.actionType : 'nofify'



        return (<div>
            
            general
            {name}
            {ruleId}
            {message}
            {responseVariables}
            {actionType}
          
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
                    </div>
                    <div className="add-field-panel ">
                

                    <div>
                        <InputField onChange={(value) => this.handleChangeRuleMessage(value)}
                            value={message}
                            error={outcome.error && outcome.error.value} label="Message"
                            placeholder='Enter the message to be displayed when rule is fired...'
                        />
                    </div>

               

        </div> </div>)
        // const { outcome, action,ruleId, ruleName,ruleMessage, responseVariables, actionType } = this.state;
        const { editDecision } = this.props;
        const { background } = this.context;
        // messages and rule name panel NK EDIT
        return (<Panel title='Outcome' >
            <div>
                <div className={`attributes-header ${background}`}>
                    {this.addRadioGroup()}
                </div>
                {/* RULE NAME */}
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
                            value={ruleName}
                            error={outcome.error && outcome.error.value} label="Rule Name"
                            placeholder='Enter a rule name...'

                             />
                    </div>

                    <div>
                        <InputField onChange={(value) => this.handleChangeRuleMessage(value)}
                            value={ruleMessage}
                            error={outcome.error && outcome.error.value} label="Message"
                            placeholder='Enter the message to be displayed when rule is fired...'
                        />
                    </div>

                </div>
                {this.imputeAggregatePanel()}
                {this.apiPanel()}
                {this.responseVariablesPanel()}

                {/* <div>
                { outcome.params.length > 0 && outcome.params.map((param, ind) => 
                    (<div key={ind} className="add-field-panel">
                        <InputField onChange={(value) => this.handleOutputParams(value, 'pkey', ind)} 
                        value={(ind == 0) ? 'message' : param.pkey} label={(ind==0)?'Message':'Parameter Name'} readOnly= {(ind==0)?true:false}/>
                        <InputField onChange={(value) => this.handleOutputParams(value, 'pvalue', ind)} value={param.pvalue} label="Value" />
                    </div>)) } 
            </div> */}
            </div>
        </Panel>)
    }




    render() {
        const { searchCriteria, bannerflag ,name, active} = this.state;
        const buttonProps = { primaryLabel: 'Add Rulecase', secondaryLabel: 'Cancel'};
        const editButtonProps = { primaryLabel: 'Update Rulecase', secondaryLabel: 'Cancel'};
        const filteredOutcomes = searchCriteria ? this.filterOutcomes() : this.props.outcomes;
        const { conditions } = this.state;
       
        return (<div className="rulecases-container">
            In ruleeditor.js component with conditions as state. Put a tab here


            <Panel title={'Edit Rule: '+name} >

            
            <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
          <div className="tab-page-container">
            <ToggleSwitch label="active" value={active}/>
              {this.state.activeTab === 'General' && <div>{this.generalPanel()}</div>  }
              {this.state.activeTab === 'Condition' && <div>Condition</div>}
              {this.state.activeTab === 'Outcome'&& <div>Outcome</div>}
              {this.state.activeTab === 'Validate'&& <div>Validate</div> }
        
          </div>
          </Panel>

      </div>);
    }
}
RuleEditor.contextType = ApperanceContext;
RuleEditor.defaultProps = ({
    handleDecisions: () => false,
    submit: () =>  false,
    reset: () =>  false,
    decisions: [],
    attributes: [],
    outcomes: {},
    handleDebug: () =>false
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
