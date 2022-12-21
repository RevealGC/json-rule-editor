/**
 
I want to creat an react ag-grid with the following columns name, description, active, rvs,refper_start, refper_end, condition, tracked, parsed_rule, priority, created_by, modified_by, created_at, modified_at. The field name must use cellRenderer as agGroupCellRenderer. Use axios to get data from the api end point.



 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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


var facts = {reporting_id:8771348140}


  class RulesGrid extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        selectedCondition:{},
        columnDefs: [
          { headerName: 'Active', field: 'active', cellRenderer: 'agGroupCellRenderer', sortable: true ,filter: 'agTextColumnFilter', checkboxSelection: true},
          { headerName: 'ID', field: 'id', sortable: true , filter: 'agTextColumnFilter', },
          { headerName: 'Name', field: 'name', sortable: true , filter: 'agTextColumnFilter', },
        
          { headerName: 'Rule Condition', field: 'condition' ,valueGetter: this.getConditionString,width: 400, sortable: true ,filter: 'agTextColumnFilter'},
          { headerName: 'Message', field: 'description', sortable: true ,filter: 'agTextColumnFilter',width: 300, },
     
          { headerName: 'Action Type', field: 'actionType' ,valueGetter: this.getActionType,width: 100, sortable: true ,filter: 'agTextColumnFilter', hide: true},

          { headerName: 'Action', field: 'action' ,valueGetter: this.getAction,width: 400, sortable: true ,filter: 'agTextColumnFilter'},

          { headerName: 'Track', field: 'parsed_rule.event.params.rvs', sortable: true ,filter: 'agTextColumnFilter',},
          { headerName: 'RefPer Start', field: 'refper_start', sortable: true ,filter: 'agTextColumnFilter',hide: true  },
          { headerName: 'RefPer End', field: 'refper_end' , sortable: true ,filter: 'agTextColumnFilter',hide: true },
          { headerName: 'Parsed Rule', field: 'parsed_rule', sortable: true ,filter: 'agTextColumnFilter', hide: true},
         
          { headerName: 'Priority', field: 'priority', sortable: true,valueGetter: this.getRulePriority ,filter: 'agTextColumnFilter', },
         
          { headerName: 'Created By', field: 'created_by', sortable: true ,filter: 'agTextColumnFilter', },
          { headerName: 'Modified By', field: 'modified_by', sortable: true ,filter: 'agTextColumnFilter', },
          { headerName: 'Created At', field: 'created_at', sortable: true ,filter: 'agTextColumnFilter', },
          { headerName: 'Modified At', field: 'modified_at', sortable: true ,filter: 'agTextColumnFilter', }
        ],
        rowData: []
      }
    }
    componentDidMount() {

      let url = HOSTURL+'/rulesrepo?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
      axios.get(url)
        .then(res => {
          this.setState({ rowData: res.data.data });
        });
    }
    detailCellRenderer (params) {

      let rule = [params.data.data]

      return (<div className="rule-flex-container_X">
        <RuleEditor conditions = {rule} facts={facts} decisionIndex={0} /> </div>)
      
      }
getRulePriority(params){
  try {
    let ret = params.data.parsed_rule.event.rulePriority
    return ret
  } catch (error) {
    return ''
  }
}
getAction(params){
  try {
    let ret = params.data.parsed_rule.event.params.action 

    return arrayToString(ret)
   
  } catch (error) {
    return ''
  }
}
getActionType(params){
  try {
    let ret = params.data.parsed_rule.event.actionType
    return ret
  } catch (error) {
    return ''
  }
}

getConditionString(params){
  try {
    let ret = params.data.parsed_rule.conditions.all[0].params.conditionstring
    return ret
  } catch (error) {
    return ''
  }
}

    onFirstDataRendered = (params) => {
      setTimeout(function () {
          // params.api.getDisplayedRowAtIndex(0).setExpanded(false);
          params.api.columnModel.autoSizeAllColumns(true)
          // gridRef.current.columnApi.autoSizeAllColumns(true);
      }, 0);
  }
    render() {
      return (
        <div className="ag-theme-alpine" id="myGrid" style={{ height:1200 }}>
        <AgGridReact

onRowClicked={(e) => 
  {
  this.setState({selectedCondition:e.data.parsed_rule})
  this.props.handleDebug('ADD', { label: 'time', data: { rule: e.data.parsed_rule}}, 0)
  }
}


          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          animateRows={true}
          masterDetail={true}
          detailCellRenderer={this.detailCellRenderer.bind(this)}
          detailCellRendererParams={this.state.selectedCondition}
          detailRowAutoHeight= {true}
          embedFullWidthRows={true}
          rowSelection={'multiple'}
          pagination={true}
          paginationPageSize={50}
          onFirstDataRendered={this.onFirstDataRendered.bind(this)}
          theme="alpine"
        />
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