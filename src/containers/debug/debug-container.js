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
        field: 'id', headerName: 'Workflow ID', filter: 'agTextColumnFilter', checkboxSelection: true, aggFunc: 'sum',
        cellRenderer: 'agGroupCellRenderer', showRowGroup: true, sortable: true
    },
    { field: 'parent_id', headerName: 'Parent Workflow ID', filter: 'agTextColumnFilter', sortable: true },
    { field: 'reporting_id', headerName: 'RID', filter: 'agTextColumnFilter', sortable: true },
    { field: 'status', filter: 'agTextColumnFilter', sortable: true },
    { field: 'elapsed_time', headerName: 'CPU Time(ms)', filter: 'agNumberColumnFilter', sortable: true },
    { field: 'error_message', headerName: 'Error', filter: 'agTextColumnFilter', sortable: true },
    { field: 'aggregate', headerName: 'Aggregate', filter: 'agTextColumnFilter', valueFormatter: stringifierAggregate, sortable: true },
    { field: 'facts', headerName: 'Facts', filter: 'agTextColumnFilter', valueFormatter: stringifierFact, sortable: true },

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

class DebugContainer extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            activeTab: 'Debug',
            rowData: [],
            columnDefs: columnDefs,
         
            detailCellRendererParams: {



                detailGridOptions: {
                    columnDefs,
                    onRowSelected:

                    function (params) {
                    console.log("🚀 ~ file: debug-container.js ~ line 106 ~ DebugContainer ~ constructor ~ params", params)
                    // dispatch(handleDebug('ADD', { label: 'time', data: { outcome: detailRowNode.data.result } }, 0))
                        alertMe(params.data.result)
                        // params.api.forEachNode(detailRowNode => {
                        //   if(detailRowNode.isSelected()) {
                        //     console.log("🚀 ~ file: debug-container.js ~ line 106 ~ DebugContainer ~ constructor ~ detailRowNode", detailRowNode.data.result)
                        //     alertMe(detailRowNode.data.result)

                        // //   this.props.handleDebug('ADD', { label: 'time', data: { outcome: detailRowNode.data.result } }, 0)}
                        //   }})
                        },



                    defaultColDef: {
                        flex: 1,
                    },
                },
                getDetailRowData: (params) => {
                    // params.successCallback(params.data.spadJobsHasMany);
                    params.successCallback(params.data.spadself);
                }
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
            params.api.columnApi.autoSizeAllColumns(true)
            // gridRef.current.columnApi.autoSizeAllColumns(true);
        }, 0);
    };

     alertMe(data) {
        alert('Data received. Call the Action')
        // const dispatch = useDispatch();
        // dispatch(handleDebug('ADD', { label: 'time', data }, 0));
        
    }

    spadTables() {

        const { background } = this.context;
        const { columnDefs, rowData, detailCellRendererParams } = this.state

        return (
            <div>
                <div className="ag-theme-alpine" id="myGrid" style={{ height: 500, width: 1200 }}>
                    <AgGridReact
                        onRowSelected={(e) => this.props.handleDebug('ADD', { label: 'time', data: { outcome: e.data.result } }, 0)}
                        onRowClicked={(e) => this.props.handleDebug('ADD', { label: 'time', data: { outcome: e.data.result } }, 0)}
                        masterDetail={true}
                        alertMe={this.alertMe.bind(this)}
                        rowData={rowData}
                        columnDefs={columnDefs}
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