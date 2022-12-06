import React, { Component, useRef, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Title from '../../components/title/title';
import PropTypes from 'prop-types';


import PageTitle from '../../components/title/page-title'

import styled from "styled-components";
import Panel from '../../components/panel/panel';
import ReactJson from 'react-json-view'
import Tabs from '../../components/tabs/tabs';

import { AgGridReact } from 'ag-grid-react';

import { handleDebug } from '../../actions/debug';

import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import axios from 'axios'
import InputField from '../../components/forms/input-field';
const tabs = [{ name: 'Debug' }, { name: 'Spad' }];


// const Dotenv = require('dotenv-webpack');
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
    { field: 'parent_id', width: 200, headerName: 'Parent Workflow ID', filter: 'agTextColumnFilter', sortable: true },
    { field: 'reporting_id',width: 200,  headerName: 'RID', filter: 'agTextColumnFilter', sortable: true },
    { field: 'status', width: 150, filter: 'agTextColumnFilter', sortable: true },
    { field: 'elapsed_time', width: 150, headerName: 'Time(ms)', filter: 'agNumberColumnFilter', sortable: true },
    { field: 'error_message',width: 150,  headerName: 'Error', filter: 'agTextColumnFilter', sortable: true },
    { field: 'aggregate',width: 300,  headerName: 'Aggregate', filter: 'agTextColumnFilter', valueFormatter: stringifierAggregate, sortable: true },
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


    // { field: 'result' , resizable: true, valueFormatter: stringifier, wrapText: true, autoHeight: true, }  ,

    { field: 'created_date', headerName: 'Date Created', filter: 'agTextColumnFilter' },
    { field: 'last_modified_date', headerName: 'Date Modified', filter: 'agTextColumnFilter' },
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
    return JSON.stringify(params.data.merge_data);
}
function stringifierAggregate(params) {
    return JSON.stringify(params.data.aggregate);
}
function stringifierFact(params) {
    return JSON.stringify(params.data.facts);
}


// this.props.handleDebug('ADD', { label: 'time', data: { facts: e.data.facts, aggregate:e.data.aggregate, valid:e.data.result.rules.valid , invalid:e.data.result.rules.invalid, deltaFacts: e.data.result.rules.deltaFacts } }, 0)},
class DebugContainer extends Component {

    constructor(props) {

        super(props);

        this.state = {
            activeTab: 'Debug',
            rowData: [],
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

            },
            template: (params) => {
                let rid = params.data.reporting_id
                return `
                    <div style="height:100%; background-color: #EDF6FF; padding:20px; box-sizing:border-box;"> <div style="height:10%;">RID: </div><div style="height:90%;" ref="eDetailGrid"></div></div>`
            },

            debugPanelDisplay: false, theme: { background: 'light', toggleBackground: this.toggleBackground }
        };
        this.handleReset = this.handleReset.bind(this)
        this.onGridReady = this.onGridReady.bind(this)




    }

    componentDidMount() {
        document.body.className = this.state.theme.background;
        this.onGridReady()
    }

    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
        }
    }

    handleTab = (tabName) => {
        this.setState({ activeTab: tabName });
    }



    handleReset() {
        // alert("Reset debugger")
        this.props.resetDebug()
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

    onFirstDataRendered = (params) => {
        setTimeout(function () {
            // params.api.getDisplayedRowAtIndex(0).setExpanded(false);
            params.api.columnModel.autoSizeAllColumns(true)
            // gridRef.current.columnApi.autoSizeAllColumns(true);
        }, 0);
    };
// shows aggregates
debugPanelAttribute(data) {
    
        this.props.handleDebug('ADD', { label: 'time', data: { aggregate: data.data.aggregate  } }, 0)

    }

    debugPanelResult(data) {
        this.props.handleDebug('ADD', { label: 'time', data: { aggregate: data.data.result  } }, 0)
    }

    spadTables() {

        const { background } = this.context;
        const { columnDefs, rowData, detailCellRendererParams } = this.state

        let priorRowIndex = -1;
        return (
            <div>
                <div className="ag-theme-alpine" id="myGrid" style={{ height:800 }}>
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


    debugPanel() {
        const debugData = this.props.debugData.reverse()

        return (
            debugData.map((d, index, debugData) => {
                let collapsed = (index === 0) ? false : true
                return (<Panel title={d.label} >
                    <ReactJson displayObjectSize={false} displayDataTypes={false} collapsed={collapsed}
                        src={d.data} onClick={this.handleReset} /> </Panel>
                )
            }))
    }

    render() {
        const { rowData, columnDefs } = this.state
        const { background } = this.context;

        return (
            <div>
                <div className={`attributes-header ${background}`}>
                    <div >
                        <div className="attr-link" onClick={this.props.resetDebug}>
                            <span className="reset-icon" /><span className="text">Reset</span>
                        </div>

                        <div className="attr-link" onClick={this.onGridReady}>
                            <span className="plus-icon" /><span className="text">Load</span>
                        </div>
                    </div>
                </div>
                <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
                <div className="tab-page-container">

                    {this.state.activeTab === 'Debug' &&
                        <div className="attr-link" >

                            {this.debugPanel()}
                        </div>}
                    {this.state.activeTab === 'Spad' && rowData.length > 0 &&
                        <div>
                            {this.spadTables()}
                            {this.debugPanel()}

                        </div>

                    }
                </div></div>)
    }
}



const mapStateToProps = (state, ownProps) => ({
    debugData: state.ruleset.debugData
});

const mapDispatchToProps = (dispatch) => ({
    resetDebug: () => dispatch(handleDebug("RESET", {}, 0)),
    handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))

});

export default connect(mapStateToProps, mapDispatchToProps)(DebugContainer);