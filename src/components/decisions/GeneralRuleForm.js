import React, { useState } from 'react';

function FormExample(props) {
  // Declare a state variable called "name" and set its initial value to the "name" prop, or an empty string if the prop is not provided
  const [name, setName] = useState(props.name || '');

  const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState(props.validationType || '');

  // Declare a state variable called "active" and set its initial value to the "active" prop, or false if the prop is not provided
  const [active, setActive] = useState(props.active);

  // Declare a state variable called "priority" and set its initial value to the "priority" prop, or 1 if the prop is not provided
  const [priority, setPriority] = useState(props.priority || 1);

  const [validationType, setValidationType] = useState(props.validationType || '');

  const handleNameChange = (event) => {
    event.preventDefault();
    setName(event.target.value);
    props.handleChangeRuleName(event.target.value)

  };

  const handleToggle = (event) => {
    // event.preventDefault();

    setActive(event.target.checked)
    props.handleToggleActive(event.target.checked)


  };
  const handleValidationTypeChange = (event) => {
    event.preventDefault();
    setValidationType(event.target.value);
    setSelectedOption(event.target.value);
    setInputValue(event.target.value);
    props.handleValidationType(event.target.value)


  };
  const handlePriorityChange = (event) => {
    event.preventDefault();
    setPriority(event.target.value);
    props.handleRulePriority(event.target.value)

  };


 

  return (
    <div>
      <div style={{ width: 400 }}>
        <form >
          <div className="form-field" >
            <div>
            <label style={{ width: 100 }}>
                <span >Active:</span>  </label>
              <input className={`checkbox`} type="checkbox" checked={props.active} onChange={handleToggle} />
            <label style={{ width: 100, display: 'flex' }}>
              
                <span>Rule Type</span></label>

              <input  style={{ width: '100', display: 'block' }} type="text" value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
             
             
             
           
            </div>
            <div>
            <select onChange={handleValidationTypeChange} className={`form-field-drpdwn`}> {props.ruleType.map((type) => (<option key={type.type} value={type.type}>{type.type}</option>
              ))}
              </select>
            {/* PRIORITY */}
              <label style={{ width: 100 }}>
                <span >Priority </span> </label>
              <select className={`form-field-drpdwn`} value={priority} onChange={handlePriorityChange}>
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
           
            </div>
          </div>
        </form>
      </div>
      <br></br>
      <div style={{ width: 880, 'margin-top': 20 }}>
        <form >
          <div className="form-field">
          <label style={{ width: 100 }}>
              <span >Rule Name</span> </label>
            <input type="text" value={name} onChange={handleNameChange} />
          </div>
        </form>
      </div>
    </div>
  );
  

}
export default FormExample;
