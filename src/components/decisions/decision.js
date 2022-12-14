import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ToolBar from '../toolbar/toolbar';
import AddDecision from './add-decision';
import DecisionDetails from './decision-details';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { transformRuleToTree } from '../../utils/transform';
import { isContains } from '../../utils/stringutils';


import { handleDebug } from '../../actions/debug';

const newRuleObject = {
    "condition": {
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
      "index": 0,
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
  }
class Decision extends Component {

    constructor(props){
        super(props);
        this.state={showAddRuleCase: false,
             searchCriteria: '',
             editCaseFlag: false,
             editCondition: [],
             message: Message.NO_DECISION_MSG,
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

        this.addDebug = this.addDebug.bind(this);

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


    render() {
        const { searchCriteria, bannerflag } = this.state;
        const buttonProps = { primaryLabel: 'Add Rulecase', secondaryLabel: 'Cancel'};
        const editButtonProps = { primaryLabel: 'Update Rulecase', secondaryLabel: 'Cancel'};
        const filteredOutcomes = searchCriteria ? this.filterOutcomes() : this.props.outcomes;
        const { outcomes } = this.props;

        let newIndex  = outcomes.length+1//for the rule to be added be the length +1
        // newRuleObject.condition.index = newIndex;
        newRuleObject.condition.event.type = newIndex;

        return (<div className="rulecases-container">

            { <ToolBar handleAdd={this.handleAdd} reset={this.handleReset} searchTxt={this.handleSearch} /> }

            { this.state.showAddRuleCase && <AddDecision attributes={this.props.attributes} editCondition={newRuleObject.condition}  addDebug={this.addDebug} cancel={this.cancelAddAttribute} buttonProps={buttonProps} /> }
            
            { this.state.editCaseFlag && <AddDecision attributes={this.props.attributes} editCondition={this.state.editCondition} addDebug={this.addDebug}
                 outcome={this.state.editOutcome} editDecision addCondition={this.updateCondition} cancel={this.cancelAddAttribute} buttonProps={editButtonProps} /> }
            
            <DecisionDetails addDebug={this.addDebug} outcomes={filteredOutcomes} attributes={this.props.attributes} editCondition={this.editCondition} removeCase={this.removeCase} removeDecisions={this.removeDecisions} />
            { !bannerflag && Object.keys(outcomes).length < 1 && <Banner message={this.props.decisions[this.state.editDecisionIndex].event.params.message } onConfirm={this.handleAdd}/> }
      </div>);
    }
}

Decision.defaultProps = ({
    handleDecisions: () => false,
    submit: () =>  false,
    reset: () =>  false,
    decisions: [],
    attributes: [],
    outcomes: {},
    handleDebug: () =>false
});

Decision.propTypes = ({
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Decision);

// export default Decision;