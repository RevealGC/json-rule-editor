import React, { Component, useRef, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import Title from '../../components/title/title';
import PropTypes from 'prop-types';


import PageTitle from '../../components/title/page-title'

import styled from "styled-components";
import Panel from '../../components/panel/panel';
import ReactJson from 'react-json-view'
import Tabs from '../../components/tabs/tabs';

import { AgGridReact } from 'ag-grid-react';

import { handleDebug } from '../../actions/debug';


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import axios from 'axios'
const tabs = [{ name: 'Debug' }, { name: 'Spad' }];




//   const defaultColDef = useMemo(() => {
//     return {
//       flex: 1,
//     };
//   }, []);

const columnDefs = [
    // group cell renderer needed for expand / collapse icons
 
    { field: 'id', headerName: 'Workflow ID', filter: 'agTextColumnFilter', cellRenderer: 'agGroupCellRenderer', showRowGroup: true, sortable: true },
    { field: 'reporting_id', headerName:'RID', filter: 'agTextColumnFilter', sortable: true },
    { field: 'status', filter: 'agTextColumnFilter', sortable: true },
    { field: 'request' },

    { field: 'created_date', headerName: 'Date Created', filter: 'agTextColumnFilter' },
    { field: 'last_modified_date', headerName: 'Date Modified',  filter: 'agTextColumnFilter' },
    // { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
];



class DebugContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'Debug',
            rowData: [],
            columnDefs: columnDefs,
            detailCellRendererParams: {
                detailGridOptions: {
                    columnDefs: [
                        { field: 'valid' },
                        { field: 'invalid' },
                        { field: 'facts' },
                        { field: 'debug' }
                    ],
                    defaultColDef: {
                        flex: 1,
                    },
                },
                getDetailRowData: (params) => {
                    params.successCallback(params.data.spadJobsHasMany);
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
        let url = 'http://localhost/spad' + '?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo'
        try {
            let result = await axios.get(url)
            let rowData = result.data
            console.log("🚀 ~ file: debug-container.js ~ line 102 ~ DebugContainer ~ onGridReady ~ rowData", rowData)
            this.setState({ rowData: rowData.data })

        }
        catch (e) {
            alert(e)
        }
    }

    onFirstDataRendered = (params) => {
        setTimeout(function () {
            params.api.getDisplayedRowAtIndex(0).setExpanded(true);
        }, 0);
    };

    spadTables() {

        const { columnDefs, rowData, detailCellRendererParams} = this.state
        console.log("🚀 ~ file: debug-container.js ~ line 124 ~ DebugContainer ~ gupHeaderTable ~ rowData", rowData)

        return (


            <div>
               
            <div className="ag-theme-alpine" id="myGrid" style={{ height: 300, width: 400 }}>
                <AgGridReact
                 onRowSelected={(e) => this.props.handleDebug('ADD', {label:'time', data:{outcome: e.data.spadJobsHasMany}}, 0) }
                    
                    
                    
                 
                 onRowClicked= {(e) => this.props.handleDebug('ADD', {label:'time', data:{outcome: e.data.spadJobsHasMany}}, 0) }
                    
                    masterDetail={true}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    detailCellRendererParams={detailCellRendererParams}
                 
                
               
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={5}
                    onFirstDataRendered={this.onFirstDataRendered.bind(this)}
                />
            </div>
            </div>
        );


    }


    debugPanel() {
        const debugData = this.props.debugData
        return (   
            debugData.map(d => {
                return (<Panel title={d.label} >
                    <ReactJson displayObjectSize={false} displayDataTypes={false} collapsed={true}
                        src={d.data} onClick={this.handleReset}/> </Panel>

                )
            }))
    }

    render() {
        const debugData = this.props.debugData
        const { rowData, columnDefs } = this.state

        return (
            <div>
                <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
                <div className="tab-page-container">
                    {this.state.activeTab === 'Debug' &&
                        <div className="attr-link" >
                            <PageTitle className="reset-icon" name={"Reset"} />
                            {this.debugPanel()}
                        </div>}
                    {this.state.activeTab === 'Spad' && rowData.length > 0 &&
                        <div>
                            <Panel>
                            {this.spadTables()}
                            {this.debugPanel()}
                            </Panel>
                          
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