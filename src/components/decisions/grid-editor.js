'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule]);

class GridEditor extends Component {
  constructor(props) {
    super(props);
    const rows = props.rows
    this.state = {
      columnDefs: [{ field: 'key' ,  wrapText: true,
      autoHeight: true,sortable: true, filter: true , editable:true},
       { field: 'value' ,
      wrapText: true,
      autoHeight: true,
      sortable: true, filter: true,  editable:true}],
      rowData: props.rows,
      rowSelection: 'single',
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onRowDataA = () => {
    // this.gridApi.setRowData(rowDataA);
    this.setState({rowData:rowDataA})
  };

  onRowDataB = () => {
    // this.gridApi.setRowData(rowDataB);
    this.setState({rowData:rowDataB})
  };

  render() {

    const {rowData, rowDataA, rowDataB, columnDefs} = this.state

    return (
      <div>
            {/* <div style={{ marginBottom: '5px', minHeight: '30px' }}>
            <button onClick={() => this.onRowDataA()}>Row Data A</button>
            <button onClick={() => this.onRowDataB()}>Row Data B</button>
          </div> */}
      <div style={{ width: '100%', height: '100%' }}>
            <div className="ag-theme-alpine-dark" style={{height: 400, width: 600}}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}>
                </AgGridReact>
            </div>
            </div>
            </div>
        );
     
  }
}
/**
 * 
 * 
 * 
 */ 




// // specify the data
// var rowDataA = [
//   { make: 'Toyota', model: 'Celica', price: 35000 },
//   { make: 'Porsche', model: 'Boxter', price: 72000 },
//   { make: 'Aston Martin', model: 'DBX', price: 190000 },
// ];
// var rowDataB = [
//   { make: 'Toyota', model: 'Celica', price: 35000 },
//   { make: 'Ford', model: 'Mondeo', price: 32000 },
//   { make: 'Porsche', model: 'Boxter', price: 72000 },
//   { make: 'BMW', model: 'M50', price: 60000 },
//   { make: 'Aston Martin', model: 'DBX', price: 190000 },
// ];

export default  GridEditor; 