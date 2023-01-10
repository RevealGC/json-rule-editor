/**
 
I want to creat an react ag-grid with the following columns name, description, active, rvs,refper_start, refper_end, condition, tracked, parsed_rule, priority, created_by, modified_by, created_at, modified_at. The field name must use cellRenderer as agGroupCellRenderer. Use axios to get data from the api end point.



 */
import React from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
import { GridApi, ColumnApi } from 'ag-grid-community';
import PropTypes from 'prop-types';

import { processEngine, updateParsedRules } from "../../validations/rule-validation";

import RuleEditor from './ruleeditor'
import SweetAlert from 'react-bootstrap-sweetalert';

import IconLink from '../menus/IconLink'

import { handleDebug } from '../../actions/debug';

import { addAllRulesRedux } from '../../actions/ruleset';
import { truncate } from 'lodash';

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
const groupDisplayType = 'multipleColumns';
const gridOptions = {
  rowMultiSelectWithClick: true,
  groupDefaultExpanded: 1,
  getRowStyle: function (params) {
    return {

      margin: '0px',


    }
  }
};


// var facts = { reporting_id: 8771348140 }


const newRuleObject = {

  "event": {
    "ruleId": "0",
    "active": true,
    "name": "Creating a new rule. Change its name....",
    "actionType": "impute",
    "validationType": "new",
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

// const cellStyle = {
//   display: 'flex',
//   'alignItems': 'center',
//   'font-weight': 'bold',
//   'color': 'gray'
// };
const cellStyle = {
  fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
  fontSize: '14px',
  fontWeight: '450',
    display: 'flex',
  'alignItems': 'center',
  fill: '#fff',
  stroke: '#fff',
  strokeWidth: 0,
  color: '#505050',
  'border-right': '0.5px dotted'
}


function stripHTML(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
function truncateString(str, len) {
  if (str && str.length > len) {
    return str.substring(0, len) + "...";
  }
  return stripHTML(str)

}

/**
 * Want to create a react component
 */

class RulesGrid extends React.Component {
  constructor(props) {
    super(props);
    this.gridApi = ''
    this.allRulesRedux = this.props.allRulesRedux


    // rowGroup: true,

    this.state = {
      selectedCondition: {},
      rowIndex: 0,
      allRulesRedux: this.props.allRulesRedux,
      ruleCounts: 0,
      displayNewRow: false,

      submitAlert: false, removeAlert: false, successAlert: false, removeDecisionAlert: false, noFactsAlert: false,

      columnDefs: [


        //Type: GROUP like validation or user ruleset 

        {
          field: 'type', valueGetter: this.getValidationType, rowGroup: true, cellRenderer: 'agGroupCellRenderer', sortable: true, filter: 'agTextColumnFilter', hide: true,

          headerName: "Rule Type", 

          cellClassRules: {
            "bold-text": function(params) {
              // return a boolean value to determine whether to apply the
              // 'bold-text' class to the cell
              return true
            }
          }
        },





        { headerName: '#', field: 'key', checkboxSelection: true, cellStyle: cellStyle, sortable: true, cellRenderer: 'agGroupCellRenderer', filter: 'agTextColumnFilter', comparator: (a, b) => { return a - b } },



        { headerName: 'Rule ID', field: 'id', valueGetter: this.getRuleId, cellStyle: cellStyle, sortable: true, filter: 'agTextColumnFilter', comparator: (a, b) => { return a - b } },

        { headerName: 'Active', field: 'active', sortable: true, filter: 'agTextColumnFilter', hide: true, cellStyle: cellStyle },

        { headerName: 'Name', field: 'name', valueGetter: this.getRuleName, cellStyle: cellStyle, sortable: true, filter: 'agTextColumnFilter', },

        // DESCRIPTION
        { headerName: 'Description', width: 800, field: 'description', autoHeight: true, editable: true, wrapText: true, sortable: true, filter: 'agTextColumnFilter', cellEditor: 'agTextCellEditor', cellEditorPopup: true, valueGetter: this.truncateDescription, cellStyle: cellStyle },


        { headerName: 'Rule Condition', cellStyle: cellStyle, field: 'condition', valueGetter: this.getConditionString, width: 400, sortable: true, filter: 'agTextColumnFilter' },

        {
          headerName: 'Message', field: 'description', cellStyle: cellStyle,
          valueGetter: this.getRuleMessage, sortable: true, filter: 'agTextColumnFilter',
        },

        { headerName: 'Track', cellStyle: cellStyle, field: 'track', valueGetter: this.getTrackVariables, width: 100, sortable: true, filter: 'agTextColumnFilter', },


        { headerName: 'Action Type', field: 'actionType', cellStyle: cellStyle, valueGetter: this.getActionType, width: 100, sortable: true, filter: 'agTextColumnFilter', hide: true },



        { headerName: 'Action', field: 'action', cellStyle: cellStyle, valueGetter: this.getAction, width: 400, sortable: true, filter: 'agTextColumnFilter' },

        { headerName: 'RefPer Start', cellStyle: cellStyle, field: 'refper_start', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'RefPer End', cellStyle: cellStyle, field: 'refper_end', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Parsed Rule', cellStyle: cellStyle, field: 'parsed_rule', sortable: true, filter: 'agTextColumnFilter', hide: true },

        { headerName: 'Priority', field: 'priority', width: 200, sortable: true,  cellStyle: cellStyle,valueGetter: this.getRulePriority, filter: 'agTextColumnFilter', },

        { headerName: 'Created By', cellStyle: cellStyle, width: 100, field: 'created_by', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Modified By', cellStyle: cellStyle, width: 100, field: 'modified_by', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Created At', cellStyle: cellStyle, width: 100, field: 'created_at', sortable: true, filter: 'agTextColumnFilter', hide: true },
        { headerName: 'Modified At', cellStyle: cellStyle, width: 100, field: 'modified_at', sortable: true, filter: 'agTextColumnFilter', hide: true }
      ],
      rowData: [],
      backupRowData: [],
      defaultColDef: {
        flex: 1,
        sortable: true,
        resizable: true,


      },

      autoGroupColumnDef: {
        // minWidth: 200,
      },
      groupMultiAutoColumn: true,
      enableRangeSelection: true,
      groupUseEntireRow: true,
    }
    this.onGridReady = this.onGridReady.bind(this)
    this.createNewRow = this.createNewRow.bind(this)
    this.performCrudOperations = this.performCrudOperations.bind(this)
    this.getRowId = this.getRowId.bind(this)
    this.loadData = this.loadData.bind(this)
    this.addAllRulesRedux = this.props.addAllRulesRedux.bind(this)
    this.removeDecisions = this.removeDecisions.bind(this);
    this.onCellClicked = this.onCellClicked.bind(this)

    this.addRowData = this.addRowData.bind(this)
    this.executeMultipleRules = this.executeMultipleRules.bind(this)
  }



  /**
   * On ag-grid cell clicked. get the data and print it to debug window.
   * @param {*} event 
   */
  onCellClicked = (event) => {
    // the event contains the row and column index of the clicked cell
    const rowIndex = event.rowIndex;
    const colId = event.column.colId;
    // you can use these indices to get the row data and column definition from the grid's api
try
  {  
    const rowData = this.gridApi.getDisplayedRowAtIndex(rowIndex).data;
    const colDef = this.gridApi.getColumnDef(colId)
    // now you can read the name and value of the cell as follows:
    const name = colDef.field;
    // const value = rowData[name];
    var value = rowData[name]
    if (name === 'condition') {    // show the condition string.
      value = rowData.parsed_rule.conditions.all[0].params.conditionstring
    }

    if (name === 'track') {
      value = rowData.parsed_rule.event.params.rvs
    }
    if (name === 'action') {
      value = JSON.stringify(rowData.parsed_rule.event.params.action)
    }
    if (name === 'priority') {
      value = rowData.parsed_rule.event.rulePriority
    }
    value = stripHTML(value)
    this.props.handleDebug('ADD', { label: 'time', data: { name, ...{ value: value } } }, 0)
  }
  catch(e){

  }

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



    let newRow = {
      parsed_rule: newRuleObject,
      active: true,
      type: 'new',
      data: newRuleObject,
      description: 'New Rule',
      name: newRuleObject.event.name,
      key: newId

    }



    newRowData.push(newRow);
    this.setState({ rowData: newRowData });
    this.props.addAllRulesRedux(newRowData);
    // get the index of the newly added row
    // const newRowIndex = this.state.rowData.length
    // open the detail of the newly added row
  
    // this.gridApi.getRowNode(newRowIndex).setExpanded(true);


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

 executeMultipleRules =async ()=>{

  const { facts } = this.props.facts
    if (!facts) {
      // alert("To Execute Rules, please load and select a Dataset")
      this.setState({noFactsAlert:true})
    

   
      return;
 }
    const gridApi = this.gridApi;
    // Get the selected row nodes
    const selectedRowNodes = gridApi.getSelectedNodes();
    // Get the data for the selected rows
    const selectedRowData = selectedRowNodes.map(node => node.data);
    const rules = selectedRowData.map(r => r.parsed_rule)
    // now get the facts and call the end point.

   
    let result = await processEngine([facts], rules);
    this.setState({successAlert:true})
    this.props.handleDebug("ADD", { label: "time", data: { result } }, 0);
   
  }
  reloadRulesFromDB = () => {
    this.setState({ rowData: [] });
    this.props.addAllRulesRedux([])
    this.loadData(true)
  };






  async componentDidMount() {
    await this.loadData()
    this.gridApi.gridOptions.onGridReady = this.onGridReady;


  }



  async loadData(init = false) {


    let allRulesRedux = this.props.allRulesRedux
    if (allRulesRedux.length > 0 && init == false) {
      // pull from redux state
      this.setState({ rowData: allRulesRedux })
      return;

    }
    let url = HOSTURL + '/rulesrepo?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
    let ret = await axios.get(url)
    let rowData = ret.data.data
    rowData = rowData.map((row, index) => {
      return { ...row, key: index + 1 }
    })

    this.setState({ rowData, backupRowData: rowData, ruleCounts: ret.data.data.length });
    this.props.addAllRulesRedux(rowData)
    const allColumnIds = [];
    gridOptions.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
    gridOptions.columnApi.autoSizeColumns(allColumnIds);


  }






  detailCellRenderer(params) {

    let rule = [params.data.data]

    return (<div>
      <RuleEditor conditions={rule} description={params.data.description}
        reloadRulesFromDB={this.reloadRulesFromDB}
        performCrudOperations={this.performCrudOperations}
        handleCancel={this.handleCancel}
        // facts={this.props.facts} 

        decisionIndex={params.rowIndex} /> </div>)

  }

  getValidationType(params) {
    try {
      let ret = params.data.parsed_rule.event.validationType
      return (ret)
    } catch (error) {
      return ''
    }
  }
  getRulePriority(params) {
    try {
      let ret = params.data.parsed_rule.event.rulePriority
      return (ret)
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
  getRuleName(params) {
    try {
      let ret = params.data.parsed_rule.event.name

      return (ret)

    } catch (error) {
      return ''
    }
  }

  getTrackVariables(params) {
    try {
      let ret = params.data.parsed_rule.event.params.rvs

      return (ret)

    } catch (error) {
      return ''
    }
  }


  getRuleMessage(params) {
    try {
      let ret = params.data.parsed_rule.event.params.message

      return stripHTML(ret)

    } catch (error) {
      return ''
    }
  }

  truncateDescription(params) {

    try {
      let ret = params.data.description
      return truncateString(stripHTML(ret), 100)
    }
    catch (error) {

      return ''
    }
  }

  getRuleId(params) {
    try {
      let ret = params.data.id
      return ret
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

  // debug(data) {
  //   this.props.handleDebug('ADD', { label: 'time', data }, 0)
  // }




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
      allRowData.forEach(row => { out.push(row) })
      out[rowData.key - 1] = rowData
      this.setState({ rowData: out });
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
    // setTimeout(function () {
    // params.api.getDisplayedRowAtIndex(1).setExpanded(false);

    // }, 0);
  }



  onGridReady = function(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridColumnApi.autoSizeColumns();

  

    const allColumnIds = [];
    gridOptions.columnApi.getAllColumns().forEach(column => allColumnIds.push(column.colId));
    gridOptions.columnApi.autoSizeColumns(allColumnIds);

    const newRowIndex = this.state.rowData.length;
    this.gridApi.getRowNode(newRowIndex).setExpanded(true);



    // // Assume that `api` is a reference to the GridApi
    // const columnApi =   params.api.getColumnApi();



    // // Get a reference to the desired column
    // const column = columnApi.getColumn('type');

    // // Get an array of the distinct values in the column
    // const distinctValues =  column.getUniqueValues();
    // console.log("🚀 ~ file: RulesGrid.js:575 ~ RulesGrid ~ distinctValues", distinctValues)


    // this.gridApi.getRowNode(1).setExpanded(true);

    // get the index of the newly added row
    // const newRowIndex = this.state.rowData.length - 1;
    // open the detail of the newly added row


    // this.gridApi.sizeColumnsToFit();

    // await this.loadData()
    // params.api.columnModel.autoSizeAllColumns()



  }




  handleCancel = () => {
    this.alert("REACHED RGRID at579")
    // this.setState({ displayNewRow: !this.state.displayNewRow });
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
      {this.state.noFactsAlert && this.noFactsAlert()}
      

    </div>);
  }
  cancelAlert = () => {
    this.setState({ removeAlert: false, successAlert: false, noFactsAlert: false, removeDecisionAlert: false });
  }
  noFactsAlert = ()=> {
    return (
      <div style={{ width: "fit-content" }}>
        <SweetAlert
          success
          title={"Please select a Dataset to execute the rules against. "}
          onConfirm={this.cancelAlert.bind(this)}
          onCancel={this.cancelAlert.bind(this)}
        >
          {this.state.updatedAlert}
        </SweetAlert>
      </div>
    );
  };
  successAlert = () => {
    return (
      <div style={{ width: "fit-content" }}>
        <SweetAlert
          success
          title={"Rules have been executed successfully!! "}
          onConfirm={this.cancelAlert.bind(this)}
          onCancel={this.cancelAlert.bind(this)}
        >
          {this.state.updatedAlert}
        </SweetAlert>
      </div>
    );
  };

  removeDecisions() {
    const gridApi = this.gridApi;

    // Get the selected row nodes
    const selectedRowNodes = gridApi.getSelectedNodes();
    // Get the data for the selected rows
    const selectedRowData = selectedRowNodes.map(node => node.data);
    const rids = selectedRowData.map(r => r.id)


    try {
      let url = HOSTURL + '/rulesrepo/' + JSON.stringify(rids) + '?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
      let result = axios.delete(url)
        .then((response) => {
          if (response.status === 200) {
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
    this.setState({ successAlert: false, removeDecisionAlert: false })

  }
  deleteSelectedRows = () => {
    // Get a reference to the ag-Grid component
    const gridApi = this.gridApi;
    const selectedRowNodes = gridApi.getSelectedNodes();

    if (!selectedRowNodes.length) return
    this.setState({ removeDecisionAlert: true });
  }

  render() {
    const { rowIndex, rowData } = this.state
    const { background } = this.context;
    const ruleCount = rowData.length;

    const links = [
      { label: 'Add', className: 'plus-icon', onClick: this.addRowData },
      { label: 'Execute', className: 'submit-icon', onClick: this.executeMultipleRules },
      { label: 'Refresh', className: 'submit-icon', onClick: this.reloadRulesFromDB },
      { label: 'Delete', className: 'reset-icon', onClick: this.deleteSelectedRows },
    ]

    return (
      <div   >
        {this.alert()}



        <div className={`attributes-header ${background}`} 
        style={{ display: 'block',  }} >
          <IconLink links={links} />
        </div>
     
        <div className="ag-theme-alpine" id="myGrid" style={{ height: 1000, margin: '10px',  }}>
          <AgGridReact

            onRowClicked={(e) => {
              if(e.data) this.setState({ selectedCondition: e.data.parsed_rule, rowIndex: e.rowIndex })

            }
            }
            rowMultiSelectWithClick={true}
            onGridReady={this.onGridReady}
            getRowNodeId={this.getRowNodeId}
            detailRowAutoHeight={true}
            onCellClicked={this.onCellClicked}

            columnDefs={this.state.columnDefs}
            rowData={rowData}
            animateRows={true}
            masterDetail={true}

            groupSelectsChildren={true}

            detailCellRenderer={this.detailCellRenderer.bind(this)}
            groupDisplayType={groupDisplayType}
            gridOptions={gridOptions}

            // detailCellRendererParams={this.state.selectedCondition}
           
            defaultColDef={{
              flex: 1,
              minWidth: 150,
              filter: true,
              sortable: true,
              resizable: true,
            }}
            embedFullWidthRows={false}
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
  updateState: () => false,
}

RulesGrid.propTypes = {
  updateState: PropTypes.func,
}



const mapStateToProps = (state) => ({
  ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
  allRulesRedux: state.ruleset.allRulesRedux, // gets all the rules pulled from the db and not from the ruleset.
  updatedFlag: state.ruleset.updatedFlag,
  facts: state.ruleset.rulesets[state.ruleset.activeRuleset]
});

const mapDispatchToProps = (dispatch) => ({
  addAllRulesRedux: (rules) => dispatch(addAllRulesRedux(rules)),
  handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
  handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
  handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesGrid);





  // export default RulesGrid;