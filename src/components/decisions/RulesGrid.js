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
import SweetAlert from 'react-bootstrap-sweetalert';

import { stack as Menu } from 'react-burger-menu';


import { handleDebug } from '../../actions/debug';

import { addAllRulesRedux } from '../../actions/ruleset';

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


// var facts = { reporting_id: 8771348140 }


const newRuleObject = {

  "event": {
    "ruleId": "0",
    "active": true,
    "name": "Creating a new rule. Change its name....",
    "actionType": "impute",
    "validationType": "validation",
    "rulePriority": "5",
    "params": {
      "rvs": "['PAY_ANN']",
      rvsJSON: ['PAY_ANN'],
      "action": [{ RCPT_TOT: 'RCPT_TOT' }],
      "message": "Enter the message you want to display... . Some initial conditions have been pre-defined.",
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
    this.allRulesRedux = this.props.allRulesRedux

    this.state = {
      selectedCondition: {},
      rowIndex: 0,
      allRulesRedux: this.props.allRulesRedux,
      ruleCounts: 0,
      displayNewRow: false,

      submitAlert: false, removeAlert: false, successAlert: false, removeDecisionAlert: false,

      columnDefs: [
        { headerName: 'Active', field: 'active',  sortable: true, filter: 'agTextColumnFilter',hide: true },
        {
          headerName: '#', field: 'key', sortable: true,cellRenderer: 'agGroupCellRenderer', filter: 'agTextColumnFilter',checkboxSelection: true,

          comparator: (a, b) => { return a - b }

        },

        {
          headerName: 'RID', field: 'id', sortable: true, filter: 'agTextColumnFilter', width:200,

          comparator: (a, b) => { return a - b }

        },



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

        { headerName: 'Created By', field: 'created_by', sortable: true, filter: 'agTextColumnFilter',hide: true },
        { headerName: 'Modified By', field: 'modified_by', sortable: true, filter: 'agTextColumnFilter', hide: true},
        { headerName: 'Created At', field: 'created_at', sortable: true, filter: 'agTextColumnFilter',hide: true },
        { headerName: 'Modified At', field: 'modified_at', sortable: true, filter: 'agTextColumnFilter',hide: true }
      ],
      rowData: [],
      backupRowData: []
    }
    this.onGridReady = this.onGridReady.bind(this)
    this.createNewRow = this.createNewRow.bind(this)
    this.performCrudOperations = this.performCrudOperations.bind(this)
    this.getRowId = this.getRowId.bind(this)
    this.loadData = this.loadData.bind(this)
    this.addAllRulesRedux = this.props.addAllRulesRedux.bind(this)
    this.removeDecisions = this.removeDecisions.bind(this);
 
 this.addRowData = this.addRowData.bind(this)
  }

  getRowNodeId = data => {
    return data.key;
  };
/**
 * create a new row add new row of a rule. addRule
 */
  addRowData = () => {
    let newRowData = this.state.rowData.slice();
    let newId =
      this.state.rowData.length === 0
        ? 0
        : this.state.rowData[this.state.rowData.length - 1].key + 1;



    let newRow  = {
      parsed_rule: newRuleObject,
      active: true,
      type: 'impute',
      data: newRuleObject,
      description: 'New Rule',
      name: newRuleObject.event.name,
      key: newId

    } 



    newRowData.push(newRow);
    this.setState({ rowData: newRowData });
 
 
    // try {
    //   this.gridApi.getDisplayedRowAtIndex(newId-1).setExpanded(true);
    // } catch (error) {
    //   console.log("🚀 ~ file: RulesGrid.js:184 ~ RulesGrid ~ error", error)
      
    // }
    this.props.addAllRulesRedux(newRowData);
    // this.gridApi.getDisplayedRowAtIndex(1).setExpanded(true);
    // this.gridApi.getDisplayedRowAtIndex(8).setExpanded(true)
   
 

  };

  removeRowData = () => {
    let selectedRow = this.gridApi.getSelectedRows()[0];
    let newRowData = this.state.rowData.filter(row => {
      return row !== selectedRow;
    });
    this.setState({ rowData: newRowData });
  };

  updateEvenRowData = () => {
    let newRowData = this.state.rowData.map((row, index) => {
      if (index % 2 === 0) {
        return { ...row, athlete: "Even Row" };
      }
      return row;
    });
    this.setState({ rowData: newRowData });
  };

  updateOddRowData = () => {
    let newRowData = this.state.rowData.map((row, index) => {
      if (index % 2 !== 0) {
        return { ...row, athlete: "Odd Row" };
      }
      return row;
    });
    this.setState({ rowData: newRowData });
  };

  resetRowData = () => {
    this.setState({ rowData: this.state.backupRowData });
  };


  reloadRulesFromDB = () => {
    this.setState({ rowData: [] });
    this.props.addAllRulesRedux([])
    this.loadData(true)
  };






  componentDidMount() {


    this.loadData()
  }



  async loadData(init = false) {


    let allRulesRedux = this.props.allRulesRedux
    if(allRulesRedux.length > 0 && init == false) {
      // pull from redux state
      this.setState({rowData: allRulesRedux})
      return;

    }
    let url = HOSTURL + '/rulesrepo?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
    let ret = await axios.get(url)
    let rowData = ret.data.data
    rowData = rowData.map((row,index) => {
      return{...row,key:index+1}
    })
    this.debug({rowData, log:'line 207: LOADING DATA FROM DB. check for key in rulesgrid'} )
    this.setState({ rowData, backupRowData: rowData,  ruleCounts: ret.data.data.length });
    this.props.addAllRulesRedux(rowData)


  }






  detailCellRenderer(params) {

    let rule = [params.data.data]

    return (<div >
      <RuleEditor conditions={rule}

        performCrudOperations={this.performCrudOperations}
        facts={this.props.facts} decisionIndex={params.rowIndex} /> </div>)

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

  debug(data) {
    this.props.handleDebug('ADD', { label: 'time', data }, 0)
  }




  getRowId = params => params.data.id;

  performCrudOperations = (operation, rowIndex, rowData) => {
    // Get a reference to the ag-Grid component
    const gridApi = this.gridApi;
    
// not using create.  Leave it.
    if (operation === 'create') {
      // Insert a new row
      gridApi.updateRowData({ add: [rowData], addIndex: 0 });

      let allRows = this.state.rowData
      allRows.push(rowData);
      this.setState({ rowData: allRows });
    } else if (operation === 'read') {
      // Get the row data for a specific row
      const rowNode = gridApi.getRowNode(rowIndex);
      const rowData = rowNode.data;
    } else if (operation === 'update') {
      // Update an existing row


       gridApi.updateRowData({ update: [{ index: rowData.key, data: rowData }] });

      const allRowData = this.state.rowData

     let out = []
     allRowData.forEach(row => {out.push(row)})
      out[rowData.key-1] = rowData
       this.setState({ rowData: out});
       this.props.addAllRulesRedux(out)

    } else if (operation === 'delete') {
      // Delete an existing row
      gridApi.applyTransaction({ remove: [rowData] });
    }
  }
  createNewRow() {
    // this.setState({ displayNewRow: true });

    let data = {
      parsed_rule: newRuleObject,
      active: true,
      type: 'impute',
      data: newRuleObject,
      description: 'New Rule',
      name: newRuleObject.event.name,
      id: 0

    }



    return data
    // this.performCrudOperations('create', null, data);
  }

  onFirstDataRendered = (params) => {
    setTimeout(function () {
      // params.api.getDisplayedRowAtIndex(0).setExpanded(false);
      params.api.columnModel.autoSizeAllColumns(true)
      params.api.getDisplayedRowAtIndex(0).setExpanded(true);
      
      // gridRef.current.columnApi.autoSizeAllColumns(true);
    }, 0);
  }

  

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadData()
  }

  handleCancelNewRow = (params) => {
    this.setState({ displayNewRow: !this.state.displayNewRow });
  }

  hideAlert = () => {
    this.setState({
        alert: null
    });
}
removeDecisionAlert = () => {

  return (<SweetAlert
      warning
      showCancel
      confirmBtnText="Yes, Remove it!"
      confirmBtnBsStyle="danger"
      title="Are you sure you want to delete the selected rule(s)"
      onConfirm={this.removeDecisions}
      onCancel={this.cancelAlert}
      focusCancelBtn
  >
      You will not be able to recover the changes!
  </SweetAlert>)
}

alert = () => {
  return (<div >
      {/* {this.state.removeAlert && this.removeCaseAlert()} */}
      {this.state.removeDecisionAlert && this.removeDecisionAlert()}
      {this.state.successAlert && this.successAlert()}
  </div>);
}
cancelAlert = () => {
  this.setState({ removeAlert: false, successAlert: false, removeDecisionAlert: false });
}


removeDecisions(){
  const gridApi = this.gridApi;

  // Get the selected row nodes
  const selectedRowNodes = gridApi.getSelectedNodes();
      // Get the data for the selected rows
      const selectedRowData = selectedRowNodes.map(node => node.data);
      const rids = selectedRowData.map(r=>r.id)
      
      
      try {
      let url = HOSTURL + '/rulesrepo/'+JSON.stringify(rids)+'?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
      let result = axios.delete(url)
      .then((response) => {

        if (response.status === 200) {  
          console.log("🚀 ~ file: RulesGrid.js:436 ~ .then ~ response", response)
        }
        

    })
    .catch(function (error) {
     
        console.log(error)
    })
  }
    catch (e) {
      console.log(e)
  }

      // Delete the selected rows
      gridApi.updateRowData({ remove: selectedRowData });
      this.setState({ successAlert: false, removeDecisionAlert: false})

}
  deleteSelectedRows = () => {
    // Get a reference to the ag-Grid component
    const gridApi = this.gridApi;
    const selectedRowNodes = gridApi.getSelectedNodes();

    if(!selectedRowNodes.length) return
    this.setState({ removeDecisionAlert: true });
  }

  render() {
    const { rowIndex, rowData } = this.state
    const { background } = this.context;


    return (
      <div>
{this.alert()}

<div className={`attributes-header ${background}`}  >
          
          <div className="attr-link" onClick={this.addRowData}>
              <span className="plus-icon" /><span className="text">Add</span> 
          </div>
          <div className="attr-link" onClick={this.deleteSelectedRows}>
               <span className="reset-icon" /><span className="text">Delete</span> 
          </div>

         

        
          <div className="attr-link" onClick={this.reloadRulesFromDB}>
               <span className="reset-icon" /><span className="text">Reload</span> 
          </div>
      

   
    
          
      </div>



        <div className="ag-theme-alpine" id="myGrid" style={{ height: 1000 }}>
          <AgGridReact

            onRowClicked={(e) => {
              this.setState({ selectedCondition: e.data.parsed_rule, rowIndex: e.rowIndex })

            }
            }
            onGridReady={this.onGridReady}
            getRowNodeId={this.getRowNodeId}
            detailRowAutoHeight={true}

            columnDefs={this.state.columnDefs}
            rowData={rowData}
            animateRows={true}
            masterDetail={true}

            detailCellRenderer={this.detailCellRenderer.bind(this)}

            
            // detailCellRendererParams={this.state.selectedCondition}

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
  allRulesRedux : state.ruleset.allRulesRedux, // gets all the rules pulled from the db and not from the ruleset.
  updatedFlag: state.ruleset.updatedFlag,
  facts: state.ruleset.rulesets[state.ruleset.activeRuleset]
});

const mapDispatchToProps = (dispatch) => ({
  addAllRulesRedux: ( rules) => dispatch(addAllRulesRedux(rules)),
  handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
  handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
  handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesGrid);





  // export default RulesGrid;