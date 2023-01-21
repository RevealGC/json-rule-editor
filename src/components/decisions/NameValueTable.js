import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

/**
 * 
 * This table uses the ag-grid-react library to create a grid of name-value pairs. The handleValueChange function updates the state of the table's data when a cell value is changed.

You can use this component by passing it an array of name-value pairs.

const nameValuePairs = [
  { name: "Name1", value: "Value1" },
  { name: "Name2", value: "Value2" },
  { name: "Name3", value: "Value3" },
  // ...
];

<NameValueTable nameValuePairs={nameValuePairs} />


 * @param {*} param0 
 * @returns 
 */
const NameValueTable = ({ nameValuePairs }) => {
  const [pairs, setPairs] = useState(nameValuePairs);

  const handleValueChange = (event) => {
    setPairs(event.data);
  };

  const columnDefs = [
    { headerName: "Name", field: "name", editable: false },
    { headerName: "Value", field: "value", editable: true },
  ];

  return (
    <div className="ag-theme-balham" style={{ height: '300px', width: '600px' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={pairs}
        onCellValueChanged={handleValueChange}
      />
    </div>
  );
};

export default NameValueTable;
