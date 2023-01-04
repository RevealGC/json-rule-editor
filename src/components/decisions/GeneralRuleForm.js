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
    event.preventDefault();
    setName(event.target.value);
    props.handleChangeRuleName(event.target.value)
   
  };

  const handleToggle = () => {


    setActive(!active);
    props.handleToggleActive(event.target.value)
    
    
  };
  const handleValidationTypeChange = (event) => {
    event.preventDefault();
    setValidationType(event.target.value);
    props.handleValidationType(event.target.value)


  };
  const handlePriorityChange = (event) => {
    event.preventDefault();
    setPriority(event.target.value);
    props.handleRulePriority(event.target.value)
   
  };

  return (
    <form style={{ width: '800px',  }}>
       
        <label>
        <span >Active:</span>
        <input type="checkbox" checked={active} onChange={handleToggle} />
      </label>
      <label>
        <span >Priority: </span>
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
  
      <div className="form-field" >
      <label>
      <span >Name:</span>
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
  
      <br />
 
      <br />
      <label>
      <span>Type: </span>
        <input  type="text" value={validationType} onChange={handleValidationTypeChange} />
      </label>
      </div>
    </form>
  );
}
export default FormExample;