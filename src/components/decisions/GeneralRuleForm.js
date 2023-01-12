import React, { useState } from 'react';
import './GeneralRuleForm.css';
import Panel from "../panel/panel";
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
    <div >
      {/* <div style={{  'margin-top': 20 , display:'block'}}> */}
      <div className="flex-container">
        <form >
          <Panel title="Rule Name">
          <div className="form-field">
          <label >
              <span >Rule Name:</span> </label>
            <input type="text" value={name} onChange={handleNameChange} />
          </div>
          </Panel>


          <Panel title="Configure">
          <div className="form-field" style={{maxWidth:100 }}>
              
              
             
               <label >
                Active: </label>
              <input style={{ 'width': '100%','margin-left':'20px',}} className={`checkbox`} type="checkbox" checked={props.active} onChange={handleToggle}  style={{ height: '30px', width: '30px', 'margin-left': '30px'}}/>
              



             
                {/* PRIORITY */}
                <label >
                <span >Priority: </span> </label>
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
              </Panel>
        </form>
      </div>
      <div className="flex-container">
      <Panel title="Save As...">
        <form >
          <div className="form-field" >
            <div>
            <label>
                <span>Rule Type:</span></label>

              <input style={{ 'width': '300px','margin-left':'10px',}}  type="text" value={inputValue} onChange={(event) => {setInputValue(event.target.value)
                handleValidationTypeChange(event)
              }} />
            </div>
            <div className="form-field" >
              <span style={{ 'margin-left': '116px', 'margin-top': '-30px' }}/>
            <select style={{ 'width': '95%','margin-left':'14px', 'margin-top':'-4px'   }} onChange={handleValidationTypeChange} className={`form-field-drpdwn`}> {props.ruleType.map((type) => (<option key={type.type} value={type.type}>{type.type}</option>
              ))}
              </select>
          
           
            </div>
          </div>
        </form>
       </Panel>
      </div>
    
      
    </div>
  );
  

}
export default FormExample;
               {/* <GeneralRuleFormV2 
       name={this.state.name}
       active={this.state.active}
       priority={this.state.rulePriority}
       ruleType={this.props.ruleType}
      validationTypes={this.state.validationType}
      onNameChange={this.handleChangeRuleName}
      onActiveChange={this.onToggleActive}
      onPriorityChange={this.handleRulePriority}
     
      onRuleTypeChange={this.handleValidationType}
    /> */}
