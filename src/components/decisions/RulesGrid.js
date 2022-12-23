/**
 
I want to creat an react ag-grid with the following columns name, description, active, rvs,refper_start, refper_end, condition, tracked, parsed_rule, priority, created_by, modified_by, created_at, modified_at. The field name must use cellRenderer as agGroupCellRenderer. Use axios to get data from the api end point.



 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../button/button';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';

import RuleEditor from './ruleeditor'

import { handleDebug } from '../../actions/debug';

const HOSTURL = 'http://localhost'

const arrayToString = (arr) => {
  return arr.reduce((acc, obj) => {
    // loop through the keys of each object
    for (const key in obj) {
      // add the key and value to the accumulator string, separated by a colon
      acc += `${key}: ${obj[key]}, `;
    }
    return acc;
  }, '');
};


var facts = { reporting_id: 8771348140 }


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




class RulesGrid extends React.Component {
  constructor(props) {
    super(props);
    this.gridApi = ''
    this.state = {
      selectedCondition: {},
      rowIndex: 0,
      ruleCounts: 0,
      displayNewRow: false,

      columnDefs: [
        { headerName: 'Active', field: 'active', cellRenderer: 'agGroupCellRenderer', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: true },
        { headerName: 'ID', field: 'id', sortable: true, filter: 'agTextColumnFilter', },
        { headerName: 'Name', field: 'name', sortable: true, filter: 'agTextColumnFilter', },

        { headerName: 'Rule Condition', field: 'condition', valueGetter: this.getConditionString, width: 400, sortable: true, filter: 'agTextColumnFilter' },
        { headerName: 'Message', field: 'description', sortable: true, filter: 'agTextColumnFilter', width: 300, },

        { headerName: 'Action Type', field: 'actionType', valueGetter: this.getActionType, width: 100, sortable: true, filter: 'agTextColumnFilter', hide: true },

        { headerName: 'Action', field: 'action', valueGetter: this.getAction, width: 400, sortable: true, filter: 'agTextColumnFilter' },

        { headerName: 'Track', field: 'parsed_rule.event.params.rvs', sortable: true, filter: 'agTextColumnFilter', },
        { headerName: 'RefPer Start', field: 'refper_start', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'RefPer End', field: 'refper_end', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Parsed Rule', field: 'parsed_rule', sortable: true, filter: 'agTextColumnFilter', hide: true },

        { headerName: 'Priority', field: 'priority', sortable: true, valueGetter: this.getRulePriority, filter: 'agTextColumnFilter', },

        { headerName: 'Created By', field: 'created_by', sortable: true, filter: 'agTextColumnFilter', },
        { headerName: 'Modified By', field: 'modified_by', sortable: true, filter: 'agTextColumnFilter', },
        { headerName: 'Created At', field: 'created_at', sortable: true, filter: 'agTextColumnFilter', },
        { headerName: 'Modified At', field: 'modified_at', sortable: true, filter: 'agTextColumnFilter', }
      ],
      rowData: []
    }
    this.onGridReady = this.onGridReady.bind(this)
    this.createNewRow = this.createNewRow.bind(this)
    this.performCrudOperations  = this.performCrudOperations.bind(this)
    this.getRowId = this.getRowId.bind(this)
  }
  componentDidMount() {

    let url = HOSTURL + '/rulesrepo?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
    axios.get(url)
      .then(res => {
        this.setState({ rowData: res.data.data, ruleCounts:res.data.data.length });
      });
  }

  detailCellRenderer(params) {

    let rule = [params.data.data]

    return (<div className="rule-flex-container_X">
      <RuleEditor conditions={rule} 
      performCrudOperations ={this.performCrudOperations}
     
      
      facts={facts} decisionIndex={0} /> </div>)

  }
  getRulePriority(params) {
    try {
      let ret = params.data.parsed_rule.event.rulePriority
      return ret
    } catch (error) {
      return ''
    }
  }
  getAction(params) {
    try {
      let ret = params.data.parsed_rule.event.params.action

      return arrayToString(ret)

    } catch (error) {
      return ''
    }
  }
  getActionType(params) {
    try {
      let ret = params.data.parsed_rule.event.actionType
      return ret
    } catch (error) {
      return ''
    }
  }

  getConditionString(params) {
    try {
      let ret = params.data.parsed_rule.conditions.all[0].params.conditionstring
      return ret
    } catch (error) {
      return ''
    }
  }
  crudRule() {
    let { rowIndex } = this.state
    if (rowIndex) this.createNewRow()
  }

  debug(data){
    this.props.handleDebug('ADD', { label: 'time', data}, 0)
  }


 

  getRowId = params => params.data.id;

  performCrudOperations = (operation, rowIndex, rowData) => {

  
    // Get a reference to the ag-Grid component
    const gridApi = this.gridApi;


    // rowData = newRuleObject // testing



    this.debug( {rowData, log:'"🚀 ~ file: RulesGrid.js ~ line 193 ~ RulesGrid ~ gridApi", gridApi' })
    
 

    if (operation === 'create') {
      // Insert a new row


      gridApi.applyTransaction({ add: [rowData] });
    } else if (operation === 'read') {
      // Get the row data for a specific row
      const rowNode = gridApi.getRowNode(rowIndex);
      const rowData = rowNode.data;
      console.log(`Row data: ${rowData}`);
    } else if (operation === 'update') {
      // Update an existing row
      gridApi.applyTransaction({ update: [{ index: rowIndex, data: rowData }] });
    } else if (operation === 'delete') {
      // Delete an existing row
      gridApi.applyTransaction({ remove: [rowData] });
    }
  }
  createNewRow() {
    this.setState({ displayNewRow: true });
    // this.performCrudOperations('create', null, newRuleObject);
  }

  onFirstDataRendered = (params) => {
    setTimeout(function () {
      // params.api.getDisplayedRowAtIndex(0).setExpanded(false);
      params.api.columnModel.autoSizeAllColumns(true)
      // gridRef.current.columnApi.autoSizeAllColumns(true);
    }, 0);
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
  }

  handleCancelNewRow = (params) => {
    this.setState({ displayNewRow: !this.state.displayNewRow });
  }


  render() {
    const { rowIndex } = this.state

    const buttonProps = { primaryLabel: 'Add Rule', secondaryLabel: 'Cancel' };

    return (
      <div>
        <div className="btn-group">
          {/* <Button label={buttonProps.primaryLabel} onConfirm={this.createNewRow} classname="primary-btn" /> */}
          
          <Button label={this.state.displayNewRow ? 'Cancel':'Add'} onConfirm={this.handleCancelNewRow.bind(this)} classname="primary-btn" />
        </div>

        {this.state.displayNewRow && <div className="rule-flex-container_X">
          <RuleEditor conditions={[newRuleObject]} facts={facts} handleDebug={this.props.handleDebug.bind(this)} decisionIndex={this.state.ruleCounts} 

getRowId ={this.getRowId}
          performCrudOperations={this.performCrudOperations}
          /> </div>
        }
        <div className="ag-theme-alpine" id="myGrid" style={{ height: 1200 }}>
          <AgGridReact

            onRowClicked={(e) => {
              this.setState({ selectedCondition: e.data.parsed_rule, rowIndex: e.rowIndex })
            
            }
            }
            onGridReady={this.onGridReady}

            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            animateRows={true}
            masterDetail={true}
            detailCellRenderer={this.detailCellRenderer.bind(this)}
            detailCellRendererParams={this.state.selectedCondition}
            detailRowAutoHeight={true}
            embedFullWidthRows={true}
            rowSelection={'multiple'}
            pagination={true}
            paginationPageSize={50}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            theme="alpine"
          />
        </div>
      </div>
    );
  }

}

RulesGrid.defaultProps = {
  ruleset: {},
  handleAttribute: () => false,
  handleDecisions: () => false,
  updatedFlag: false,
}

const mapStateToProps = (state) => ({
  ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
  updatedFlag: state.ruleset.updatedFlag,
  facts: state.ruleset.rulesets[state.ruleset.activeRuleset]
});

const mapDispatchToProps = (dispatch) => ({
  handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
  handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
  handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesGrid);





  // export default RulesGrid;