import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import ApperanceContext from '../../context/apperance-context';

/**
 * actionArray is a an array of action which is comprised of objets like so:
 * {"RVNAME": "Computational Expression or logical one", 
 * 
 * The aggrid  expects data as
 *  data: [
                { key: 'Key 1', value: 'Value 1', expression:'' },
                { key: 'Key 2', value: 'Value 2' },
                { key: 'Key 3', value: 'Value 3' },
            ],

            As a first step convert it to the form we need and create the initial state with the conversion.
 */
class ImputeGrid extends Component {

    constructor(props) {
        super(props);


        this.actionArray = this.props.actionArray
        this.actionArrayKeys = Object.keys(this.props.actionArray)
        this.data = []

        this.actionArrayAsObject = this.actionArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        Object.keys(this.actionArrayAsObject).map(k => this.data.push({ key: k, expression: this.actionArrayAsObject[k], value:'N/A' }));



        
        this.state = {
            actionArray: this.props.actionArray,
            data: this.data
        };


        this.componentDidUpdate= (prevProps)=> {
            if (this.props.actionParseObject !== prevProps.actionParseObject) {
              // re-render the component when someProp is updated
              this.setState({data:this.props.actionParseObject.actionParseObject })
            }
          }


        this.updateValues = (actionParseObject) => {
            this.setState({data: actionParseObject})
        }




        this.columnDefs = [
            {
                headerName: 'Variable', field: 'key', editable: true,
                sortable: true, filter: 'agTextColumnFilter',


                cellEditor: 'agTextCellEditor'
            },
          
            {
                headerName: 'Expression', field: 'expression', editable: true, cellEditor: 'agLargeTextCellEditor', cellEditorPopup: true,
                sortable: true, filter: 'agTextColumnFilter',

                flex: 4,
            },
            {
                headerName: 'Value', field: 'value', editable: false, cellEditor: 'agLargeTextCellEditor', cellEditorPopup: true,
                sortable: true, filter: 'agTextColumnFilter',

                flex: 2,
            }
        ];

        this.setImputedValues = (actionValues) => {

            this.setState({ actionValues})
        }


        this.addRow = () => {
            // Add a new row to the table
            this.setState((prevState) => ({
                data: [...prevState.data, { key: 'New Key', expression: 'New Value', value:'N/A' }],
            }));
        };

        this.deleteRow = (index) => {
            // Delete a row from the table
            this.setState((prevState) => ({
                data: [
                    ...prevState.data.slice(0, index),
                    ...prevState.data.slice(index + 1),
                ],
            }));
        };

        this.reCreateActionArray = () => {
            let actionArray = []
            this.state.data.map(d => actionArray.push({ [d.key]: d.expression }))
            this.setState({ actionArray })
            this.props.validateAction(actionArray)

        }
        this.updateRow = (index, newData) => {
            // Update the data in a row of the table
            this.setState((prevState) => ({
                data: [
                    ...prevState.data.slice(0, index),
                    newData,
                    ...prevState.data.slice(index + 1),
                ],
            }));
        };

        this.onGridReady = (params) => {
            this.gridApi = params.api;
        };

        this.onSelectionChanged = () => {
            // Get the selected rows and store them in the state
            const selectedRows = this.gridApi.getSelectedRows();
            this.setState({ selectedRows });
        };

        this.deleteSelectedRows = () => {
            // Delete the selected rows from the table
            const newData = this.state.data.filter(
                (row) => !this.state.selectedRows.includes(row)
            );
            this.setState({ data: newData });
        };

        this.updateSelectedRows = (newData) => {
            // Update the data in the selected rows
            const updatedData = this.state.data.map((row) => {
                if (this.state.selectedRows.includes(row)) {
                    return newData;
                }
                return row;
            });
            this.setState({ data: updatedData });
        };
        // this will render the ag-grid in ImputeGrid in ruleseditor on line 715+
        this.render = () => {
            return (
                <div className="ag-theme-alpine" style={{ height: '400px', width: 'auto','margin':'10px' }}>

                    <div className={`attributes-header `}  >
                    
                        {this.props.actions.map((action) => (
                            <div className="attr-link" onClick={action.value}>
                                <span className={action.icon} /><span className="text">
                                    {action.name}
                                </span>
                            </div>
                        ))}
                          
                    </div>
                    <div  style={{ height: '400px', width: '800px;','margin':'10px' }}>
                    <AgGridReact
                        columnDefs={this.columnDefs}
                        rowData={this.state.data}
                        onGridReady={this.onGridReady}
                        onSelectionChanged={this.onSelectionChanged}
                        defaultColDef= {{ flex: 1,resizable: true}}
                        animateRows={true}
                        pagination={true}
                        paginationPageSize={50}
                        rowSelection="multiple"
                    />
                    </div>
                </div>
            );
        }
    }
}
ImputeGrid.contextType = ApperanceContext;
export default ImputeGrid;
