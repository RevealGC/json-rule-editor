import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';
import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import Table from '../table/table';
import Banner from '../panel/banner';
import * as Message from '../../constants/messages';
import { processEngine,processEngineValidate, validateRuleset } from '../../validations/rule-validation';
import Loader from '../loader/loader';
import { ViewOutcomes } from '../attributes/view-attributes';
import {handleAttribute} from '../../actions/attributes'
import { handleDebug } from '../../actions/debug';



/**
 * Will take in facts, rules, attended, network, addOnFacts to pass to the backend for processing one or many rules.
 * Facts is an object of name value pairs.  Rules is array of  objects of event, condition and index.  Additional params to axios include
 * showNetwork , attended and addOnFacts(should be passed as an object).
 * 
 * The axios post call wraps the facts in an array. Decison or rules should be an array.
 * 
 * 
 * ValidateRules call will pass similar object as below to processEngine
 * 
 {"facts":[{"reporting_id":"3010008883",....."}],"rules":[{"event":{"ruleId":228,"active":true,"name":"Creating a new rule. Change its name....","actionType":"impute","validationType":"new","rulePriority":"5","params":{"action":[{"RCPT_TOT ":" RCPT_TOT"}],"message":"Enter the message you want to display... . Some initial conditions have been pre-defined.","rvsJSON":["PAY_ANN"],"apiSource":{},"actionType":"impute","apiChecked":false,"rvs":"[\"PAY_ANN\"]"},"type":"228"},"index":-1,"conditions":{"all":[{"fact":"checkCondition","path":"$.value","operator":"equal","value":true,"params":{"conditionstring":"RCPT_TOT > 0"}}]}}],"showNetwork":true,"attended":false}
 */



class ValidateRules extends Component {

    constructor(props) {
        super(props);
        const conditions = props.attributes.filter(attr => attr.type !== 'object' && ({ name: attr.name, value: ''}))
        this.state = { attributes: [],
             conditions,
             message: Message.NO_VALIDATION_MSG,
             loading: false,
             outcomes: [],
             error: false,
             attended: false,
             network: true,
            };
        this.handleAttributeLocal = this.handleAttributeLocal.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.validateRules = this.validateRules.bind(this);
    }

    handleAttributeLocal(e, index) {
        const attribute = { ...this.state.conditions[index], name: e.target.value };
        const conditions = [ ...this.state.conditions.slice(0, index), attribute, ...this.state.conditions.slice(index + 1)];
        this.setState({ conditions });
    }

    handleValue(e, index) {
        let dataType = this.state.conditions[index].type 
        let value = (dataType === 'number') ? parseInt(e.target.value, 10) : e.target.value 

        const attribute = { ...this.state.conditions[index], value };

        this.props.handleAttribute('UPDATE',attribute, index);
        const conditions = [ ...this.state.conditions.slice(0, index), attribute, ...this.state.conditions.slice(index + 1)];
        this.setState({ conditions });
    }

    handleAdd() {
        this.setState({ conditions: this.state.conditions.concat([{name: ''}])});
    }

    async validateRules(e) {
        e.preventDefault();
       
      
        let facts = {};
        const { decisions, attributes } = this.props;
        this.setState({loading: true});
        this.state.conditions.forEach(condition => {
           const attrProps = attributes.find(attr => attr.name === condition.name);
           if (attrProps.type === 'number') {
            facts[condition.name] = Number(condition.value);
           } else if (condition.value && condition.value.indexOf(',') > -1) {
            facts[condition.name] = condition.value.split(',');
           } else {
            facts[condition.name] = condition.value;
           }
        })
        

// update the redux state with attributes
    

 
    let result = 
    // await processEngineValidate([facts], decisions, this.state.attended, this.state.network)
    await processEngineValidate([facts], decisions, this.state.attended, this.state.network)
  
    this.props.handleDebug('ADD', {label:'time', data:{result}}, 0)
    this.setState({loading: false, result,  result: true, error: false, errorMessage: '',});
    
return;


        validateRuleset(facts, decisions).then(outcomes => {
            this.setState({loading: false, outcomes,  result: true, error: false, errorMessage: '',});
        }).catch((e) => {
            this.setState({loading: false, error: true, errorMessage: e.error, result: true, });
        });
    }


    toggleAttended = ()=>{
        this.setState({attended: !this.state.attended})
    }

    toggleNetwork= ()=>{
        this.setState({network: !this.state.network})
    }

/**
 * 
 * @returns 
 */
    attributeItems = () => {
        const { conditions, loading, outcomes, result, error, errorMessage } = this.state;
       
       
       
        const { attributes } = this.props;
        const options = attributes.map(att => att.name);

        const formElements = //conditions
        attributes.map((condition, index) =>
            (<tr key={condition.name + index || 'item'+index}>
                <td><SelectField options={options} onChange={(e) => this.handleAttributeLocal(e, index)}
                     value={condition.name} readOnly/></td>
                <td colSpan='2'>{<InputField onChange={e => this.handleValue(e, index)} value={condition.value} />}</td>
            </tr>)
        );

        let message;
        if (result) {
            if (error) {
                message = <div className="form-error">Problem occured when processing the rules. Reason is {errorMessage}</div>
            } else if (outcomes && outcomes.length < 1) {
                message = <div></div>
            } else if (outcomes && outcomes.length > 0) {
                message = (<div className="view-params-container">
                                <h4>Outcomes  </h4>
                                <ViewOutcomes  items={outcomes}/>
                            </div>)
            } else {
                message = undefined;
            }
        }
        return (
        <React.Fragment>
             <div className="btn-group">
                <Panel title="Validate dataset">
              
               <div className="form-field" style={{ display:'flex' }}>
               <Button label={'Validate Ruleset'} onConfirm={this.validateRules} classname="primary-btn" type="submit" />
              <label >
               Attended: </label>
             <input style={{ 'width': '40','margin-left':'20px',}}  type="checkbox" checked={this.state.attended} 
             onChange={this.toggleAttended.bind(this)} 
             />


<label >
               Network: </label>
             <input style={{ 'width': '40','margin-left':'20px',}}  type="checkbox" checked={this.state.network} 
             onChange={this.toggleNetwork.bind(this)} 
            //  onChange={this.setState({network: !this.state.network})}
              />

             
           </div>
           </Panel>
           </div>
           <Panel title="Update">
            <Table columns={['Name', 'Value']}>
                     {formElements}
            </Table>
            </Panel>
           
            <hr/>
                { loading && <Loader /> }
                { !loading && message }
        </React.Fragment>)
    }

    render() {
        return (<React.Fragment>
        {this.props.decisions.length < 1 && <Banner message={this.state.message}/> }
        {this.props.decisions.length > 0 &&
        <Panel>
            <form>
                <div>
                 
                    {this.attributeItems()}
                </div>
            </form>
        </Panel>}
        </React.Fragment>);
    }
}

ValidateRules.defaultProps = ({
    attributes: [],
    decisions: [],
});

ValidateRules.propTypes = ({
    attributes: PropTypes.array,
    decisions: PropTypes.array,
});


const mapStateToProps = (state) => ({
    // ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
    // updatedFlag: state.ruleset.updatedFlag,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
    handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
    handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))
    
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ValidateRules);




// export default ValidateRules;