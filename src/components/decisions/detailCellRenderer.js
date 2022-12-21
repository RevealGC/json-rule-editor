import React from 'react';
import RuleEditor from './ruleeditor'

const DetailCellRenderer = (conditions) => (
    <div>
        <h1>Hello</h1>
  <h1 style={{ padding: '20px' }}>My Custom Detail</h1>

  {JSON.stringify(conditions.data)}
   {/* <RuleEditor conditions={conditions.data}/>  */}
   </div>

);

export default DetailCellRenderer;