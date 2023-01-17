import React, { useContext } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import IconLink from '../menus/IconLink'

import ApperanceContext from '../../context/apperance-context'   // '../../context/apperance-context';
import Panel from '../panel/panel';

class TrackVariablesGrid extends React.Component {
    constructor(props) {
        super(props);

       
       const rowData = props.responseVariables.map((r, index)=> {return {key:index, rvs:r}}) 
       const cellStyle = {
        // fontFamily : '"Helvetica Neue", Roboto, Arial, "Droid Sans", sans-serif',
        fontFamily:
        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
    
        fontSize: '14px',
        fontWeight: '400',
          display: 'flex',
        'alignItems': 'center',
        fill: '#fff',
        stroke: '#fff',
        strokeWidth: 0,
        color: '#808080',
        'border-right': '0.5px dotted'
      }

        this.state = {
           
            columnDefs: [
                {
                    headerName: "Track",
                    field: "rvs",
                    editable: true,
                    cellEditor: 'select',
                    cellEditorParams: {
                        values: props.facts,
                    },
                    sortable: true, filter: 'agTextColumnFilter',
                    width: 400,
                    height: 60,
                    cellStyle
                }
            ],
            rowData
        }
    }
    onAddRow = () => {
        this.setState({
            rowData: [...this.state.rowData, {key:this.state.rowData.length, rvs: 'Select...' }]
        });
    }
    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    }
    onRemoveSelected = () => {
        let selectedData = this.gridApi.getSelectedRows();
        this.gridApi.updateRowData({ remove: selectedData });

     
        setTimeout(() => {
            let rowData = [];
            this.gridApi.forEachNode(node => rowData.push(node.data));
            this.setState({rowData})
            this.saveResponseVariables()
          }, 100);

    }

    saveResponseVariables = () => {
        this.props.saveResponseVariables(this.state.rowData)
    }


    render() {

   
        const links = [
            { label: 'Submit',display: this.props.displaySubmit, className: 'save', onClick: this.saveResponseVariables },
            { label: 'Add', display: this.props.displaySubmit,className: 'paperclip', onClick: this.onAddRow},
            { label: 'Remove',display: this.props.displaySubmit, className: 'eraser', onClick: this.onRemoveSelected },
           
          ]


        return (
            <div className="ag-theme-alpine" style={{padding:40,margin:20,  height: '500px', width: '600px' }}>
               

<div  className={`attributes-header `}
            style={{ display: 'block', }} >
            <IconLink links={links} />
          </div>



                {/* <button onClick={this.onAddRow}>Add Row</button>
                <button onClick={this.onRemoveSelected}>Remove Selected</button> */}
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    onGridReady={this.onGridReady}
                    rowSelection='multiple'
                    enableCellChangeFlash={true}
                    suppressMovableColumns={true}
                    suppressFieldDictionary={true}
                />
              
            </div>
        );
    }
}
export default TrackVariablesGrid;