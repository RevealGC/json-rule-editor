import React, { useState } from 'react';
import './GeneralRuleForm.css';

function GeneralRuleFormV2({ name, active, priority, ruleType, validationTypes, onNameChange, onActiveChange, onPriorityChange, onRuleTypeChange }) {
  const [validName, setValidName] = useState(true);
  const [validRuleType, setValidRuleType] = useState(true);

  const handleSubmit = event => {
    event.preventDefault();
    if (name.length <= 80 && ruleType.length <= 40) {
      console.log(name, active, priority, ruleType);
    } else {
      setValidName(name.length <= 80);
      setValidRuleType(ruleType.length <= 40);
    }
  };

  const onValidationTypesChange = event => {
    event.preventDefault();
    onRuleTypeChange(event.target.value);
    setValidRuleType(event.target.value.length <= 40);
   
    // setValidationType(event.target.value);
    // setSelectedOption(event.target.value);
    // setInputValue(event.target.value);
    // props.handleValidationType(event.target.value)




  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-container">
        <div className="flex-label">Name:</div>
        <div className="flex-control">
          <input
            type="text"
            value={name}
            onChange={event => {
              onNameChange(event.target.value);
              setValidName(event.target.value.length <= 80);
            }}
            className={validName ? "" : "invalid"}
          />
          {!validName && <div className="error-message">Name can't be more than 80 characters</div>}
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-label">Active:</div>
        <div className="flex-control">
          <input
            type="checkbox"
            checked={active}
            onChange={event => onActiveChange(event.target.checked)}
          />
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-label">Priority:</div>
        <div className="flex-control">
          <select value={priority} onChange={event => onPriorityChange(event.target.value)}>
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-label">Validation Types:</div>
        <div className="flex-control">
          {/* <select value={validationTypes} onChange={event => onValidationTypesChange(event)}>
              {validationTypes.map(validationType => 
                <option key={validationType} value={validationType}>{validationType}</option>
              )}
          </select> */}
        </div>
      </div>
      <div className="flex-container">
        <div className="flex-label">Rule Type:</div>
        <div className="flex-control">
          <input
            type="text"
            value={ruleType}
            onChange={event => {
              onRuleTypeChange(event.target.value);
              setValidRuleType(event.target.value.length <= 40);
            }}
            className={validRuleType ? "" : "invalid"}
          />
          {!validRuleType && <div className="error-message">Rule Type can't be more than 40 characters</div>}
        </div>
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
}
export default GeneralRuleFormV2;


// function MyParentComponent() {
//   const [name, setName] = useState("initial value");
//   const [active, setActive] = useState(false);
//   const [priority, setPriority] = useState("");
//   const [ruleType, setRuleType] = useState("");
//   const [validationTypes, setValidationTypes] = useState([]);

//   return (
//     <MyForm 
//       name={name} 
//       active={active} 
//       priority={priority} 
//       ruleType={ruleType}
//       validationTypes={validationTypes}
//       onNameChange={setName}
//       onActiveChange={setActive}
//       onPriorityChange={setPriority}
//       onRuleTypeChange={setRuleType}
//       onValidationTypesChange={setValidationTypes}
//     />
//   );
// }
