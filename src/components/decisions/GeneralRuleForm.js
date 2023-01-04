import React, { useState } from 'react';

function FormExample(props) {
  // Declare a state variable called "name" and set its initial value to the "name" prop, or an empty string if the prop is not provided
  const [name, setName] = useState(props.name || '');

  // Declare a state variable called "active" and set its initial value to the "active" prop, or false if the prop is not provided
  const [active, setActive] = useState(props.active || false);

  // Declare a state variable called "priority" and set its initial value to the "priority" prop, or 1 if the prop is not provided
  const [priority, setPriority] = useState(props.priority || 1);

  const [validationType, setValidationType] = useState(props.validationType || '');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleToggle = () => {
    setActive(!active);
  };
  const handleValidationTypeChange = (event) => {
    setValidationType(event.target.value);
  };
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  return (
    <form style={{ width: '800px', 'margin': '20px;' }}>
       
        <label>
        Active:
        <input type="checkbox" checked={active} onChange={handleToggle} />
      </label>
      <label>
        Priority:
        <select value={priority} onChange={handlePriorityChange}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
          <option value={10}>10</option>
        </select>
      </label>
      <br />
  
      <div className="form-field" style={{'margin': '20px;', 'padding': '20px;'}}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
  
      <br />
 
      <br />
      <label>
        Type:
        <input  type="text" value={validationType} onChange={handleValidationTypeChange} />
      </label>
      </div>
    </form>
  );
}
export default FormExample;