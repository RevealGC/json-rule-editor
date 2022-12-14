import React, { Component } from 'react';
import { connect } from 'react-redux';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Panel from '../panel/panel';

import GridEditor from './grid-editor';
import { AgGridReact } from 'ag-grid-react';

// import the react-json-view component
import ReactJson from 'react-json-view'

import  RuleEditor  from "./ruleeditor"


import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Tabs from '../../components/tabs/tabs';

const tabs = [{ name: 'Service' }, { name: 'Headers' }, { name: 'Params' }, { name: 'Body' }];


import InputField from '../forms/input-field';
import SelectField from '../forms/selectmenu-field';
import Button from '../button/button';
import ButtonGroup from '../button/button-groups';
import operator from '../../data-objects/operator.json';
import decisionValidations from '../../validations/decision-validation';
import Tree from '../tree/tree';
import { has } from 'lodash/object';
import { getNodeDepthDetails, getNodeDepth } from '../../utils/treeutils';
import { transformTreeToRule } from '../../utils/transform';
import { sortBy } from 'lodash/collection';
import { validateAttribute } from '../../validations/decision-validation';
import { PLACEHOLDER } from '../../constants/data-types';
import ApperanceContext from '../../context/apperance-context';
import { handleDebug } from '../../actions/debug';







const nodeStyle = {
    shape: 'circle',
    shapeProps: {
        fill: '#1ABB9C',
        r: 10,
    },
};

const factsButton = [{ label: 'Add Facts', disable: false },
{ label: 'Add All', disable: false },
{ label: 'Add Any', disable: false },
{ label: 'Remove', disable: false }];

const topLevelOptions = [{ label: 'All', active: false, disable: false },
{ label: 'Any', active: false, disable: false }];

const outcomeOptions = [{ label: 'Add Outcome', active: false, disable: false },
{ label: 'Edit Conditions', active: false, disable: false }];




// "parsed_rule": {
//     "event": {
//         "name": "Price change check",
//         "type": "1",
//         "params": {
//             "rvs": "[\"COMP1\"]",
//             "action": [
//                 {
//                     "COMPUTE-ON-COMPUTED-VAR": " \"INCOME_LOAN\" +100000"
//                 },
//                 {
//                     "TOTAL_INCOME_BONUS2": " \"INCOME_LOAN\" * \"BASE_LOAN\" "
//                 }
//             ],
//             "message": " COMP1 >=10 CHAINED RULE VIA COMP1 WHICH IS COMPUTED EARLIER"
//         }
//     },
//     "conditions": {
//         "all": [
//             {
//                 "id": 1,
//                 "fact": "COMP1",
//                 "value": 10,
//                 "operator": ">="
//             }
//         ]
//     }
// }

// event: {  // define the event to fire when the conditions evaluate truthy
//     type: 'fouledOut',
//     params: {
//       message: 'Player has fouled out!'
//     }
//   }
// })







class AddDecision extends Component {
    constructor(props) {
        super(props);


        


        const outcome = props.editDecision ? props.outcome : {value: 'New', params:[] };
        console.log("🚀 ~ file: add-decision.js ~ line 119 ~ AddDecision ~ constructor ~ outcome", outcome)

        const addAttribute = { error: {}, name: '', operator: '', value: '' };
        const node = props.editDecision ? props.editCondition.node : {};
        const activeNode = { index: 0, depth: 0 };
        const ruleName = (props.editDecision && props.editCondition.event.name) ? props.editCondition.event.name :''
        const ruleId = (props.editDecision && props.editCondition.event.type) ? props.editCondition.event.type : 'NEW'
        const ruleMessage = props.editDecision && props.editCondition.event.params.message ? props.editCondition.event.params.message :''


        // nk

    const rowData = [
            {name: "X-JBID", value: "kapoo"},
            {name: "X-API", value: "23482394729387498234"},
        
        ];
        
        const columnDefs = [
            { field: "name", sortable: true, filter: true ,editable: true},
            { field: "value", sortable: true, filter: true  ,editable: true},

        ];  


        const actionType = props.editDecision ? props.actionType : { value: 'API' }
        const actionString = props.editDecision && props.editCondition.event.params.action ? props.editCondition.event.params.action : [{name:''}];
       
       const action =  actionString


        
        const responseVariables = props.editDecision && props.editCondition.event.params.rvs ? JSON.parse(props.editCondition.event.params.rvs) : [];
        

        const apiSource = props.editDecision && props.editCondition.event.apiSource 
            ? props.editCondition.event.apiSource 
            :   {
                url: 'http://census.gov',
                verb: 'POST',
                headers: [{key:'X-JBID', value: 'kapoo'}, {key: 'X-API-KEY', value: '12345ABC233'}],
                data: [{key: 'row', value:3 }],
                query: [{key: 'DEBUG', value: true}]
                }
        
        
        
        
        
        //nk

        this.state = {
            attributes: props.attributes,
            outcome,
            action, responseVariables, actionType,apiSource,
            addAttribute,
            enableTreeView: props.editDecision,
            enableFieldView: false,
            enableOutcomeView: false,
            ruleId, ruleName,ruleMessage,
            rowData : [
                {name: "X-JBID", value: "kapoo"},
                {name: "X-API", value: "23482394729387498234"},
            
            ],
            columnDefs : [
                { field: "name", sortable: true, filter: true ,editable: true},
                { field: "value", sortable: true, filter: true  ,editable: true},
    
            ],

            // nk
            enableActionView: false,
            enableResponseVariableView: false,
            actionType: 'notify',
            activeAPITab: 'Service',
            apiGUPType: 'GET',
            // end nk



            node,
            topLevelOptions,
            factsButton: factsButton.map(f => ({ ...f, disable: true })),
            outcomeOptions: outcomeOptions.map(f => ({ ...f, disable: true })),
            formError: '',
            addPathflag: false,
            activeNodeDepth: [activeNode]
        };
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onChangeNewFact = this.onChangeNewFact.bind(this);
        this.onChangeOutcomeValue = this.onChangeOutcomeValue.bind(this);
        this.handleTopNode = this.handleTopNode.bind(this);
        this.handleActiveNode = this.handleActiveNode.bind(this);
        this.handleChildrenNode = this.handleChildrenNode.bind(this);
        // this.handleFieldCancel = this.handleFieldCancel.bind(this);
        // this.handleOutputPanel = this.handleOutputPanel.bind(this);
        this.handleOutputParams = this.handleOutputParams.bind(this);
        this.addParams = this.addParams.bind(this);
        // this.handleResponseVariables = this.handleResponseVariables.bind(this);
        this.handleAPITab = this.handleAPITab.bind(this);
        this.handleServiceGUPDRadioGroup = this.handleServiceGUPDRadioGroup.bind(this);
        // this.gupHeaderTable = this.gupHeaderTable.bind(this);

        this.handleChangeRuleMessage = this.handleChangeRuleMessage.bind(this)
        this.handleChangeRuleName = this.handleChangeRuleName.bind(this)

        this.handleChangeActionOptions = this.handleChangeActionOptions.bind(this);
        this.addActions = this.addActions.bind(this);
        this.deleteActions = this.deleteActions.bind(this);
        this.deleteRVActions = this.deleteRVActions.bind(this);
        this.addResponseVariables = this.addResponseVariables.bind(this);
        // this.addRadioGroup = this.addRadioGroup.bind(this);
        // this.imputeAggregatePanel = this.imputeAggregatePanel.bind(this);
        this.addPath = this.addPath.bind(this);

        this.handleShowRuleJSON = this.handleShowRuleJSON.bind(this)
    }

    handleAPITab = (tabName) => {
        this.setState({activeAPITab: tabName});
    }

// NK
    handleShowRuleJSON(){
        this.props.handleDebug('ADD', {label:'time', data:{outcome: this.state.outcome}}, 0)
    }


    handleAdd(e) {
        let actionType = this.state.actionType
        e.preventDefault();
        const error = decisionValidations(this.state.node, this.state.outcome);

        if (error.formError) {
            this.setState({ formError: error.formError, outcome: { ...this.state.outcome, error: error.outcome } })
        } else {
            let outcomeParams = {};
            this.state.outcome.params.forEach(param => {
                outcomeParams[param.pkey] = param.pvalue;
            })

            // let params = {rvs: this.state.responseVariables, action:this.state.action, name: this.state.ruleName, message: this.state.ruleMessage}
            const condition = transformTreeToRule(this.state.node, this.state.outcome, outcomeParams);
        
            condition.event.name = this.state.ruleName
            condition.event.params.message = this.state.ruleMessage
            condition.event.params.rvs = JSON.stringify(this.state.responseVariables) // Version 1: Will be deprecated
            condition.event.params.rvsJSON = this.state.responseVariables // Version 2
            
               
            condition.event.params.actionType = this.state.actionType
            if(actionType == 'notify'){
                delete condition.event.params.action
            }
            else {
            condition.event.params.action = this.state.action

            if(actionType == 'impute'){
                let action = this.state.action // array 
                condition.event.params.impute = []
                action.map(a =>{
                    condition.event.params.impute.push({computedRV: Object.keys(a)[0], expression: a[Object.keys(a)[0]]})
                })
       
            // condition.event.params.impute = this.state.action
            }

            if(actionType == 'aggregate')

            
            
         
            condition.event.type = this.state.ruleId // Version 1 to be deprecated NK
            condition.event.ruleId = this.state.ruleId // Version 2 NK
        }
            if(actionType == "API")
                condition.event.apiSource = this.state.apiSource
        
             this.props.addCondition(condition);    
             this.props.handleDebug('ADD', {label:'time', data:{rule:condition}}, 0)
        }
    }

    handleCancel() {
        this.props.cancel();
    }

    onChangeNewFact(e, name) {
        const addAttribute = { ...this.state.addAttribute };
        addAttribute[name] = e.target.value;
        this.setState({ addAttribute });
    }

    onChangeOutcomeValue(e, type) {
        const outcome = { ...this.state.outcome };
        outcome[type] = e.target.value;
        this.setState({ outcome });
    }

    addParams() {
        const { outcome } = this.state;
        const newParams = outcome.params.concat({ pkey: '', pvalue: '' });
        this.setState({ outcome: { ...outcome, params: newParams } });
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

    deleteRVActions() {
        const { responseVariables } = this.state;
        let index = responseVariables.length ? responseVariables.length : 0
        if (index) delete responseVariables[index - 1]
        this.setState(responseVariables);
    }

    addResponseVariables() {
        const { responseVariables } = this.state;
        // const newParams = responseVariables.params.concat({ pkey: '', pvalue: '' });
        responseVariables.push('')

        this.setState(responseVariables);
    }



    addPath() {
        this.setState({ addPathflag: true });
    }

    handleOutputParams(e, type, index) {
        const { outcome } = this.state;
        const params = [...outcome.params];
        const newParams = params.map((param, ind) => {
            if (index === ind) {
                if (type === 'pkey') {
                    return { ...param, pkey: e.target.value };
                } else {
                    return { ...param, pvalue: e.target.value };
                }
            }
            return param;
        });
        this.setState({ outcome: { ...outcome, params: newParams } });
    }

    handleChangeRuleName(event){
        let {outcome} = this.state
        let value = event.target.value
        this.setState({ruleName:value})
  
    }
    handleChangeRuleMessage(event){
        let {outcome} = this.state
        let value = event.target.value
        this.setState({ruleMessage:value})
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
    // handleResponseVariables(e, type, index) {
    //     const { responseVariables } = this.state;
    //     responseVariables[index] = e.target.value;
    //     this.setState(responseVariables);
    // }


    handleTopNode(value) {
        let parentNode = { ...this.state.node };
        const activeNode = { index: 0, depth: 0 };
        if (has(parentNode, 'name')) {
            parentNode.name = value === 'All' ? 'all' : 'any';
        } else {
            parentNode = { name: value === 'All' ? 'all' : 'any', nodeSvgShape: nodeStyle, children: [] };
        }
        const topLevelOptions = this.state.topLevelOptions.map(option => {
            if (option.label === value) {
                return { ...option, active: true };
            }
            return { ...option, active: false };
        })

        const factsButton = this.state.factsButton.map(button => ({ ...button, disable: false }));
        const outcomeOptions = this.state.outcomeOptions.map(button => ({ ...button, disable: false }));

        this.setState({
            enableTreeView: true, topNodeName: value, node: parentNode,
            activeNodeDepth: [activeNode], topLevelOptions, factsButton, outcomeOptions
        });
    }

    mapNodeName(val) {
        const node = {};
        const { addAttribute: { name, operator, value, path }, attributes } = this.state;
        if (val === 'Add All' || val === 'Add Any') {
            node['name'] = val === 'Add All' ? 'all' : 'any';
            node['nodeSvgShape'] = nodeStyle;
            node['children'] = [];
        } else {
            node['name'] = name;
            let factValue = value.trim();
            const attProps = attributes.find(att => att.name === name);
            if (attProps.type === 'number') {
                factValue = Number(value.trim());
            }
            let fact = { [operator]: factValue };
            if (path) {
                fact['path'] = `.${path}`;
            }
            node['attributes'] = { ...fact };
        }
        return node;
    }

    handleChildrenNode(value) {
        let factOptions = [...factsButton];
        if (value === 'Add Facts') {
            this.setState({ enableFieldView: true });
        } else {
            const { activeNodeDepth, node, attributes } = this.state;
            const addAttribute = { error: {}, name: '', operator: '', value: '' };
            if (value === 'Add fact node') {
                const error = validateAttribute(this.state.addAttribute, attributes);
                if (Object.keys(error).length > 0) {
                    let addAttribute = this.state.addAttribute;
                    addAttribute.error = error;
                    this.setState({ addAttribute });
                    return undefined;
                }
            }
            if (activeNodeDepth && node) {
                const newNode = { ...node };

                const getActiveNode = (pNode, depthIndex) => pNode[depthIndex];

                let activeNode = newNode;
                const cloneDepth = value === 'Remove' ? activeNodeDepth.slice(0, activeNodeDepth.length - 1) : [...activeNodeDepth]
                cloneDepth.forEach(nodeDepth => {
                    if (nodeDepth.depth !== 0) {
                        activeNode = getActiveNode(activeNode.children, nodeDepth.index);
                    }
                });
                const childrens = activeNode['children'] || [];
                if (value !== 'Remove') {
                    activeNode['children'] = childrens.concat(this.mapNodeName(value));
                } else {
                    const lastNode = activeNodeDepth[activeNodeDepth.length - 1];
                    childrens.splice(lastNode.index, 1);
                    factOptions = this.state.factsButton.map(button =>
                        ({ ...button, disable: true }));
                }

                this.setState({ node: newNode, enableFieldView: false, addAttribute, factsButton: factOptions });
            }
        }
    }


    handleActiveNode(node) {
        const depthArr = getNodeDepthDetails(node);
        const sortedArr = sortBy(depthArr, 'depth');

        const factsNodemenu = this.state.factsButton.map(button => {
            if (button.label !== 'Remove') {
                return { ...button, disable: true };
            }
            return { ...button, disable: false };
        });

        const parentNodeMenu = this.state.factsButton.map(button => {
            if (sortedArr.length < 1 && button.label === 'Remove') {
                return { ...button, disable: true };
            }
            return { ...button, disable: false };
        });

        const facts = node.name === 'all' || node.name === 'any' ? parentNodeMenu : factsNodemenu;
        const outcomeMenus = outcomeOptions.map(option => ({ ...option, disable: false }));
        this.setState({ activeNodeDepth: sortedArr, factsButton: facts, outcomeOptions: outcomeMenus });
    }

    // handleFieldCancel() {
    //     const addAttribute = { error: {}, name: '', operator: '', value: '' };
    //     this.setState({ enableFieldView: false, addAttribute });
    // }

    // handleOutputPanel(value) {
    //     if (value === 'Add Outcome') {
    //         const factsOptions = this.state.factsButton.map(fact => ({ ...fact, disable: true }))
    //         const options = this.state.outcomeOptions.map(opt => {
    //             if (opt.label === 'Add Outcome') {
    //                 return { ...opt, active: true };
    //             }
    //             return { ...opt, active: false };
    //         });
    //         this.setState({
    //             enableOutcomeView: true, enableTreeView: false,
    //             //nk
    //             enableActionView: true, enableResponseVariableView: true,
    //             // end nk
    //             enableFieldView: false, outcomeOptions: options, factsButton: factsOptions
    //         });
    //     }
    //     if (value === 'Edit Conditions') {
    //         const options = this.state.outcomeOptions.map(opt => {
    //             if (opt.label === 'Edit Conditions') {
    //                 return { ...opt, active: true };
    //             }
    //             return { ...opt, active: false };
    //         });
    //         this.setState({
    //             enableOutcomeView: false,
    //             //nk
    //             enableActionView: false, enableResponseVariableView: false,
    //             // end nk

    //             enableTreeView: true, enableFieldView: false, outcomeOptions: options
    //         });
    //     }
    // }
// NK: Add topPanel as a tab for expressions
    // topPanel() {
    //     const { topLevelOptions, factsButton, outcomeOptions } = this.state;

    //     return (<div>
    //         Place a tab here in add-decision.js line 583
            
    //         <div className="add-decision-step">
    //         <div className="step1"><div>Step 1: Add Toplevel</div><ButtonGroup buttons={topLevelOptions} onConfirm={this.handleTopNode} /></div>
    //         <div className="step2"><div> Step 2: Add / Remove facts</div><ButtonGroup buttons={factsButton} onConfirm={this.handleChildrenNode} /></div>
    //         <div className="step3"><div> Step 3: Add Outcome</div><ButtonGroup buttons={outcomeOptions} onConfirm={this.handleOutputPanel} /></div>
    //     </div></div>)
    // }

    // fieldPanel() {
    //     const { attributes, addAttribute, addPathflag } = this.state;
    //     const attributeOptions = attributes.map(attr => attr.name);
    //     const attribute = addAttribute.name && attributes.find(attr => attr.name === addAttribute.name);
    //     const operatorOptions = attribute && operator[attribute.type];
    //     const { background } = this.context;

    //     const placeholder = addAttribute.operator === 'contains' || addAttribute.operator === 'doesNotContain' ?
    //         PLACEHOLDER['string'] : PLACEHOLDER[attribute.type]

    //     return (<Panel>

    //         <div className={`attributes-header ${background}`}>
    //             <div className="attr-link" onClick={this.addPath}>
    //                 <span className="plus-icon" /><span className="text">Add Path</span>
    //             </div>
    //         </div>

    //         <div className="add-field-panel">
    //             <div><SelectField options={attributeOptions} onChange={(e) => this.onChangeNewFact(e, 'name')}
    //                 value={addAttribute.name} error={addAttribute.error.name} label="Facts" /></div>
    //             <div><SelectField options={operatorOptions} onChange={(e) => this.onChangeNewFact(e, 'operator')}
    //                 value={addAttribute.operator} error={addAttribute.error.operator} label="Operator" /></div>
    //             <div><InputField onChange={(value) => this.onChangeNewFact(value, 'value')} value={addAttribute.value}
    //                 error={addAttribute.error.value} label="Value" placeholder={placeholder} /></div>
    //         </div>

    //         {addPathflag && <div className="add-field-panel half-width">
    //             <div>
    //                 {/*<InputField onChange={(value) => this.onChangeNewFact(value, 'path')} value={addAttribute.path}
    //                     label="Path" placeholder={"Enter path value - dont give prefix ' . ' "}/> */}
    //                 <SelectField options={attributeOptions} onChange={(e) => this.onChangeNewFact(e, 'path')}
    //                     value={addAttribute.path} label="Path" />
    //             </div>
    //         </div>}

    //         <div className="btn-group">
    //             <Button label={'Add'} onConfirm={() => this.handleChildrenNode('Add fact node')} classname="btn-toolbar" type="submit" />
    //             <Button label={'Cancel'} onConfirm={this.handleFieldCancel} classname="btn-toolbar" />
    //         </div>
    //     </Panel>)
    // }

    // addRadioGroup() {
    //     const { actionType } = this.state;
    //     return (
    //         <div onChange={this.handleChangeActionOptions}>
    //             <input type="radio" value="notify" checked={actionType == 'notify'} name="radio-buttons" /> notify
    //             <input type="radio" value="impute" checked={actionType == 'impute'} name="radio-buttons" /> impute
    //             <input type="radio" value="aggregate" checked={actionType == 'aggregate'} name="radio-buttons" /> aggregate
    //             <input type="radio" value="API" checked={actionType == 'API'} name="radio-buttons" /> API
    //         </div>
    //     )

    // }

    // addServiceGUPDRadioGroup() {
    //     const { apiGUPType } = this.state;
    //     return (
    //         <Panel title='Service Type'>
    //         <div onChange={this.handleServiceGUPDRadioGroup}>
    //             <input type="radio" value="GET" checked={apiGUPType == 'GET'} name="radio-buttons" /> GET
    //             <input type="radio" value="PUT" checked={apiGUPType == 'PUT'} name="radio-buttons" /> PUT
    //             <input type="radio" value="POST" checked={apiGUPType == 'POST'} name="radio-buttons" /> POST
    //             <input type="radio" value="DELETE" checked={apiGUPType == 'DELETE'} name="radio-buttons" /> DELETE
    //         </div>
    //         </Panel>
    //     )

    // }


    // gupHeaderTable(){
    
    //  const  {rowData, columnDefs} = this.state
    //     return (
    //         <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
    //             <AgGridReact
    //                 rowData={rowData}
    //                 columnDefs={columnDefs}>
    //             </AgGridReact>
    //         </div>
    //     );


    // }


    // onConfirm={this.handleTab} activeTab={this.state.activeTab}
    // apiPanel() {
    //     let { actionType, activeAPITab, apiSource } = this.state;
    //       let onEdit = true, onAdd = true, onDelete = true
    //     return (actionType == 'API') ?
    //     (<Panel title='API'>
    //         <div id="treeWrapper">
    //         <ReactJson src={apiSource} displayObjectSize ={false} displayDataTypes={false} 
    //        onEdit={ onEdit
    //         ? e => {
    //               console.log(e);
    //               this.setState({ apiSource: e.updated_src });
    //           }
    //         : false}
    //         onDelete={
    //             onDelete
    //                 ? e => {
    //                       console.log(e);
    //                       this.setState({ apiSource: e.updated_src });
    //                   }
    //                 : false
    //         }
    //         onAdd={
    //             onAdd
    //                 ? e => {
    //                       console.log(e);
    //                       let name = e.name; // header, query, body anything with key value pairs
    //                       let length = e.updated_src[name].length
    //                         e.updated_src[name].pop()

    //                       e.updated_src[name].push({key:'', value:''})

    //                       this.setState({ apiSource: e.updated_src });
    //                   }
    //                 : false
    //         }
    //         /> 
    //         </div>
    //         </Panel>)  : ''
    // }




    // responseVariablesPanel() {
    //     const { outcome, action, responseVariables, actionType } = this.state;
    //     const { background } = this.context;

    //     return (<Panel title='Response Variables'>
    //         <div className={`attributes-header ${background}`}>
    //             <div className="attr-link" onClick={this.addResponseVariables}>
    //                 <span className="plus-icon" /><span className="text">Add Response Variables</span>
    //             </div>
    //             <div className="attr-link" onClick={this.deleteRVActions}>
    //                 <span className="plus-icon" /><span className="text">Delete Response Variable</span>
    //             </div>

    //         </div>


    //         {responseVariables && responseVariables.length > 0 && responseVariables.map((param, ind) =>
    //         (<div key={ind} className="add-field-panel">

    //             <InputField onChange={(value) => this.handleResponseVariables(value, 'pvalue', ind)} value={param} label="Value"
    //                 placeholder='Enter a response variable to track...' />
    //         </div>))


    //         }

    //     </Panel>)
    // }

    // imputeAggregatePanel() {

    //     const { outcome, action, responseVariables, actionType } = this.state;
    //     const { background } = this.context;

    //     return (actionType == 'impute' || actionType == 'aggregate') ?
    //         (<Panel title='Imputations and Aggregations'>
    //             <div className={`attributes-header ${background}`}>
    //                 <div className="attr-link" onClick={this.addActions}>
    //                     <span className="plus-icon" /><span className="text">Add Action</span>
    //                 </div>


    //                 <div className="attr-link" onClick={this.deleteActions}>
    //                     <span className="plus-icon" /><span className="text">Delete Action</span>
    //                 </div>

    //             </div>

    //             {action && action.length > 0 && action.map((param, ind) =>


    //             (<div key={ind} className="add-field-panel">
    //                 <InputField onChange={(value) => this.handleActions(value, 'pkey', ind)}
    //                     label="Actions"
    //                     value={Object.keys(param)}
    //                     placeholder='Enter a computed variable name...' />
    //                 <InputField onChange={(value) => this.handleActions(value, 'pvalue', ind)}
    //                     value={Object.values(param)} label="Value"
    //                     placeholder='Enter an expression or logical condition to compute...'
    //                 />
    //             </div>))


    //             }
    //             <div>Imputations and Aggregations</div>
    //         </Panel>) : ''
    // }


    // outputPanel() {
    //     const { outcome, action,ruleId, ruleName,ruleMessage, responseVariables, actionType } = this.state;
    //     const { editDecision } = this.props;
    //     const { background } = this.context;
    //     // messages and rule name panel NK EDIT
    //     return (<Panel title='Outcome' >
    //         <div>
    //             <div className={`attributes-header ${background}`}>
    //                 {this.addRadioGroup()}
    //             </div>
    //             {/* RULE NAME */}
    //             <div className="add-field-panel ">
    //                 <div>
    //                     <InputField onChange={(value) => this.onChangeOutcomeValue(value, 'value')}
    //                         value={ruleId}
    //                         error={outcome.error && outcome.error.value} label="Rule ID"
    //                         placeholder='Enter a rule name...'

    //                         readOnly={true} />
    //                 </div>
    //                 <div>
    //                     <InputField onChange={(value) => this.handleChangeRuleName(value)}
    //                         value={ruleName}
    //                         error={outcome.error && outcome.error.value} label="Rule Name"
    //                         placeholder='Enter a rule name...'

    //                          />
    //                 </div>

    //                 <div>
    //                     <InputField onChange={(value) => this.handleChangeRuleMessage(value)}
    //                         value={ruleMessage}
    //                         error={outcome.error && outcome.error.value} label="Message"
    //                         placeholder='Enter the message to be displayed when rule is fired...'
    //                     />
    //                 </div>

    //             </div>
    //             {this.imputeAggregatePanel()}
    //             {this.apiPanel()}
    //             {this.responseVariablesPanel()}

    //             {/* <div>
    //             { outcome.params.length > 0 && outcome.params.map((param, ind) => 
    //                 (<div key={ind} className="add-field-panel">
    //                     <InputField onChange={(value) => this.handleOutputParams(value, 'pkey', ind)} 
    //                     value={(ind == 0) ? 'message' : param.pkey} label={(ind==0)?'Message':'Parameter Name'} readOnly= {(ind==0)?true:false}/>
    //                     <InputField onChange={(value) => this.handleOutputParams(value, 'pvalue', ind)} value={param.pvalue} label="Value" />
    //                 </div>)) } 
    //         </div> */}
    //         </div>
    //     </Panel>)
    // }

    // treePanel() {
    //     const { node } = this.state;
    //     const depthCount = getNodeDepth(node);

    //     return (<Panel>
    //         <Tree treeData={node} count={depthCount} onConfirm={this.handleActiveNode} />
    //     </Panel>)
    // }


    // addPanel() {
    //     const { enableTreeView, enableFieldView, enableOutcomeView } = this.state;

    //     return (<div>
    //         {this.topPanel()}
    //         {enableFieldView && this.fieldPanel()}
    //         {enableOutcomeView && this.outputPanel()}
    //         {enableTreeView && this.treePanel()}
    //     </div>);

    // }
    handleCancel(index) {
        const cases = [...this.state.showCase];
        let updateCase = cases[index];
        updateCase = { ...updateCase, case: !updateCase.case }
        cases[index] = { ...updateCase };
        this.setState({ showCase: cases });

    }
    render() {
        const { buttonProps } = this.props;
        // let facts = this.getFacts(decisionIndex)
        if(!this.state.showCase)
        return (<div className="rule-flex-container_X">
            <RuleEditor conditions={[]} facts={[]} decisionIndex={0} 
            handleCancel={this.props.cancel.bind(this)}/>
            </div>)
            else return (<div/>);
            
           
            {/* {transformedData && transformedData.map((data, caseIndex) => (<div className="decision-box" key={`case - ${caseIndex} - ${decisionIndex}`}>
                <div className="tool-flex">
                    <div><a href="" onClick={(e) => this.editCondition(e, data.index)}><span className="fa fa-edit" /></a></div>
                    <div><a href="" onClick={((e) => this.handleRemoveCondition(e, data.index))}><span className="fa fa-trash-o" /></a></div>
                </div>
                <Tree treeData={data.node} count={data.depthCount} />
                
            </div>))} */}
        // </div>)     

        // return (
        //     <form>
        //         <div className="add-rulecase-wrapper">
        //             {this.addPanel()}
        //             {this.state.formError && <p className="form-error"> {this.state.formError}</p>}
        //             <div className="btn-group">
        //                 <Button label={buttonProps.primaryLabel} onConfirm={this.handleAdd} classname="primary-btn" />
        //                 <Button label='View Rule' onConfirm={this.handleShowRuleJSON} classname="primary-btn"  />

        //                 <Button label={buttonProps.secondaryLabel} onConfirm={this.handleCancel} classname="cancel-btn" />


        //             </div>

        //         </div>
        //     </form>
        // );
    }
}

AddDecision.contextType = ApperanceContext;

AddDecision.defaultProps = ({
    addCondition: () => false,
    cancel: () => false,
    attribute: {},
    buttonProps: {},
    attributes: [],
    outcome: {},
    editDecision: false,
    editCondition: {},
    addDebug: () => false,
    resetDebug: () => false
});

AddDecision.propTypes = ({
    addCondition: PropTypes.func,
    cancel: PropTypes.func,
    attribute: PropTypes.object,
    buttonProps: PropTypes.object,
    attributes: PropTypes.array,
    outcome: PropTypes.object,
    editDecision: PropTypes.bool,
    editCondition: PropTypes.object,
    addDebug: PropTypes.func,
    resetDebug: PropTypes.func
});

const mapStateToProps = (state, ownProps) => ({
  
    debugData: state.ruleset.debugData
});

const mapDispatchToProps = (dispatch) => ({
    handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))
    
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(AddDecision);



