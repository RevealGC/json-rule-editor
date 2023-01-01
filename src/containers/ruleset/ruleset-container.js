
/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageTitle from '../../components/title/page-title';
import Tabs from '../../components/tabs/tabs';
import Attributes from '../../components/attributes/attributes';
import Decisions from '../../components/decisions/decision';
import ValidateRules from '../../components/validate/validate-rules';
import { handleAttribute } from '../../actions/attributes';
import { handleDecision } from '../../actions/decisions';
import { handleDebug } from '../../actions/debug';
import Banner from '../../components/panel/banner';
import * as Message from '../../constants/messages';
import { groupBy } from 'lodash/collection';
import RuleErrorBoundary from '../../components/error/ruleset-error';
import SweetAlert from 'react-bootstrap-sweetalert';
import { AgGridReact } from 'ag-grid-react';
import RulesGrid from '../../components/decisions/RulesGrid';

import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import axios from 'axios'
// import { Tabs } from '@mui/material';

const HOSTURL = 'http://localhost'
// const HOSTURL = 'process.env.HOSTURL


//   const defaultColDef = useMemo(() => {
//     return {
//       flex: 1,
//     };
//   }, []);


const columnDefs = [
    // group cell renderer needed for expand / collapse icons

    {
        field: 'id', width: 200, headerName: 'Workflow ID', filter: 'agTextColumnFilter', checkboxSelection: true, aggFunc: 'sum',
        cellRenderer: 'agGroupCellRenderer', showRowGroup: true, sortable: true
    },
    { field: 'parent_id', width: 200, headerName: 'Parent Workflow ID', filter: 'agTextColumnFilter', sortable: true , hide: true},
    { field: 'reporting_id',width: 200,  headerName: 'RID', filter: 'agTextColumnFilter', sortable: true },
    { field: 'status', width: 150, filter: 'agTextColumnFilter', sortable: true },
    { field: 'elapsed_time', width: 150, headerName: 'Time(ms)', filter: 'agNumberColumnFilter', sortable: true, hide: true },
    { field: 'error_message',width: 150,  headerName: 'Error', filter: 'agTextColumnFilter', sortable: true, hide: true },
    { field: 'valid',width: 600,  headerName: 'Valid Rules', filter: 'agTextColumnFilter', valueFormatter: stringifierAggregateRules, sortable: true },
    { field: 'facts',width: 400,  headerName: 'Facts', filter: 'agTextColumnFilter', valueFormatter: stringifierFact, sortable: true },

    {
        field: 'merge_status', headerName: 'Merge Status', cellRenderer: function (params, data) {
            if (params.data.merge_status !== 0)
                // return   <button onclick={"return myFunction("+params.data.id+")"}>Merge</button> 
                return <a href={HOSTURL + "/spad/merge/" + params.data.id + '?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo'} target="_blank" rel="noopener"> Merge {params.data.id} </a>

            else return 'N/A'
        }
    }
    ,

    { field: 'merge_data', headerName: 'Merge Data', valueFormatter: stringifier, filter: 'agTextColumnFilter', sortable: true },


    { field: 'result' , resizable: true, valueFormatter: stringifier, autoHeight: true, }  ,
 { field: 'last_modified_date', headerName: 'Modified', filter: 'agTextColumnFilter' },
    { field: 'created_date', headerName: 'Created', filter: 'agTextColumnFilter' },
   
    // { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
];
function myFunction(spadId) {
    alert('Merge spadID ' + spadId)
}
function showMergeLink(params) {

    if (params.data.merge_status === 1)
        return params.data.id
    // return (`<a href="/spad/merge/{params.data.id}">{params.data.id}</a>`)
    else return 'N/A'
}
function stringifier(params) {
    return JSON.stringify(params.data.result);
}
function stringifierAggregateRules(params) {
    let valids = params.data && params.data.result && params.data.result.rules.valid ? params.data.result.rules.valid: []
    let rules = []
   valids.map((valid)=>{
        rules.push(valid.id +": "+valid.message)
 
   })
    return JSON.stringify(rules)
    return JSON.stringify(params.data.aggregate);
}
function stringifierFact(params) {
    return JSON.stringify(params.data.facts);
}




const tabs = [{name: 'Facts'},{name: 'Rules'},  {name: 'Validate'},  { name: 'Spad' }, {name: 'Generate'}];



class RulesetContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {activeTab: 'Facts', generateFlag: false, rowData: [],
        columnDefs: columnDefs,
        detailRowAutoHeight: true,
        detailCellRendererParams: {

            detailGridOptions: {
                columnDefs,
                masterDetail: true,
                embedFullWidthRows: true,
                detailCellRendererParams: {
                    detailGridOptions: {
                        columnDefs,
                        masterDetail: true,
                        embedFullWidthRows: true,
                        onRowSelected: this.debugPanelAttribute.bind(this),
                        onRowClicked: this.debugPanelResult.bind(this),
                        defaultColDef: { flex: 1,resizable: true},
                    },
                   
                    getDetailRowData: (params) => {
                        params.successCallback(params.data.spadLevel2);
                    }
                },
                onRowSelected: this.debugPanelAttribute.bind(this),
                onRowClicked: this.debugPanelResult.bind(this),
                defaultColDef: { flex: 1,resizable: true },
            },
            getDetailRowData: (params) => {
                params.successCallback(params.data.spadself);
            }

        }, };
        this.generateFile = this.generateFile.bind(this);
        this.cancelAlert = this.cancelAlert.bind(this);
        this.onGridReady = this.onGridReady.bind(this)
    }
    componentDidMount() {
      // document.body.className = this.state.theme.background;
      this.onGridReady()
  }
    onFirstDataRendered = (params) => {
      setTimeout(function () {
          // params.api.getDisplayedRowAtIndex(0).setExpanded(false);
          params.api.columnModel.autoSizeAllColumns(true)
          // gridRef.current.columnApi.autoSizeAllColumns(true);
      }, 0);
  }
    async onGridReady() {
      // +this.state.dbSearchText


      let url = HOSTURL + '/spad?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo'
      try {
          let result = await axios.get(url)
          let rowData = result.data
          this.setState({ rowData: rowData.data })


      }
      catch (e) {
          alert(e)
      }
  }
    handleTab = (tabName) => {
        this.setState({activeTab: tabName});
    }


    debugPanelAttribute(data) {
    
      this.props.handleDebug('ADD', { label: 'time', data: { aggregate: data.data.aggregate  } }, 0)

  }

  debugPanelResult(data) {
      this.props.handleDebug('ADD', { label: 'time', data: { aggregate: data.data.result  } }, 0)
  }

    generateFile() {
      const { ruleset } = this.props;
      const fileData = JSON.stringify(ruleset, null,'\t');
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = ruleset.name +'.json';
      link.href = url;
      link.click();
      this.setState({ generateFlag: true });
    }

    cancelAlert() {
      this.setState({ generateFlag: false })
    }

    successAlert = () => {
      const { name } = this.props.ruleset;
      return (<SweetAlert
          success
          title={"File generated!"}
          onConfirm={this.cancelAlert}
        > {`${name} rule is succefully generated at your default download location`}
        </SweetAlert>);
    }
    spadTables() {

      const { background } = this.context;
      const { columnDefs, rowData, detailCellRendererParams } = this.state

      let priorRowIndex = -1;
      return (
          <div>
               <div className={`attributes-header ${background}`}>
                    <div >
                        <span className="attr-link" onClick={this.onGridReady}>
                            <span className="plus-icon" /><span className="text">Load</span>
                        </span>
                    </div>
                </div>
              <div className="ag-theme-alpine" id="myGrid" style={{ height:1200 }}>
                  <AgGridReact
                      onRowSelected={(e) =>
                          this.props.handleDebug('ADD', { label: 'time', data: { aggregate: e.data.aggregate } }, 0)}
                      onRowClicked={(e) => this.props.handleDebug('ADD', { label: 'time', data: { facts: e.data.facts, aggregate: e.data.aggregate, valid: e.data.result.rules.valid, invalid: e.data.result.rules.invalid, deltaFacts: e.data.result.rules.deltaFacts } }, 0)}
                      masterDetail={true}
                      detailRowAutoHeight= {true}
                      embedFullWidthRows={true}
            
                      rowData={rowData}
                      columnDefs={columnDefs}
                      defaultColDef= {{ flex: 1,resizable: true}}
                      detailCellRendererParams={detailCellRendererParams}
                      animateRows={true}
                      pagination={true}
                      paginationPageSize={50}
                      onFirstDataRendered={this.onFirstDataRendered.bind(this)}
                  />
              </div>
          </div>

      );


  }


    render() {
      const { attributes, decisions, name } = this.props.ruleset;
      const {rowData} = this.state
      const indexedDecisions = decisions && decisions.length > 0 && 
          decisions.map((decision, index) => ({ ...decision, index }));
  
      let outcomes;
      if (indexedDecisions && indexedDecisions.length > 0) {
          outcomes = groupBy(indexedDecisions, data => data.event.type);
      }

      const message = this.props.updatedFlag ? Message.MODIFIED_MSG : Message.NO_CHANGES_MSG;

      return <div>
        <RuleErrorBoundary>
          <PageTitle name={name} />
          <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
          <div className="tab-page-container" style={{'margin':'20px'}}>

      {this.state.activeTab === 'Rules' && <RulesGrid facts={attributes}/>}



              {this.state.activeTab === 'Facts' && <Attributes attributes={attributes} 
                handleAttribute={this.props.handleAttribute }/>}
              {this.state.activeTab === 'Decisions' && <Decisions decisions={indexedDecisions || []} attributes={attributes}
              handleDecisions={this.props.handleDecisions} outcomes={outcomes}/>}
              {this.state.activeTab === 'Validate' && <ValidateRules attributes={attributes} decisions={decisions} />}
              {this.state.activeTab === 'Generate' && <Banner message={message} ruleset={this.props.ruleset} onConfirm={this.generateFile}/> }
              {this.state.activeTab === 'Spad' && rowData.length > 0 &&
                        <div>
                            {this.spadTables()}
                          

                        </div>

                    }




              {this.state.generateFlag && this.successAlert()}
          </div>
        </RuleErrorBoundary>
      </div>
    }
}

RulesetContainer.propTypes = {
  ruleset: PropTypes.object,
  handleAttribute: PropTypes.func,
  handleDecisions: PropTypes.func,
  updatedFlag: PropTypes.bool,
  runRules: PropTypes.func,
}

RulesetContainer.defaultProps = {
  ruleset: {},
  handleAttribute: () => false,
  handleDecisions: () => false,
  updatedFlag: false,
}

const mapStateToProps = (state) => ({
  ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
  updatedFlag: state.ruleset.updatedFlag,
});

const mapDispatchToProps = (dispatch) => ({
  handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
  handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
  handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesetContainer);