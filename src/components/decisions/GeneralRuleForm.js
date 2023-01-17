import React, { useState } from 'react';
import './GeneralRuleForm.css';

import { Modal, Button, Icon, Form, Input, Dropdown, TextArea, Checkbox, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


import Panel from "../panel/panel";
import { toInteger } from 'lodash';
function FormExample(props) {
  // Declare a state variable called "name" and set its initial value to the "name" prop, or an empty string if the prop is not provided
  const [name, setName] = useState(props.name || '');

  const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState(props.validationType || '');

  // Declare a state variable called "active" and set its initial value to the "active" prop, or false if the prop is not provided
  const [active, setActive] = useState(props.active);

  // Declare a state variable called "priority" and set its initial value to the "priority" prop, or 1 if the prop is not provided
  const [priority, setPriority] = useState((props.priority));

  const [validationType, setValidationType] = useState(props.validationType || '');

  const [description, setDescription] = useState(props.description || '');


  const [ruleTypeOptions, setRuleTypeOptions] = useState(props.ruleType.map((type) => ({ key: type.type, value: type.type, text: type.type })))


  const handleNameChange = (event) => {
    event.preventDefault();
    setName(event.target.value);
    props.handleChangeRuleName(event.target.value)

  };

  const handleToggle = (event) => {
    event.preventDefault();
    props.handleToggleActive(!active)
    setActive(!active)

    // setActive(event.target.checked)



  };
  const handleValidationTypeChange = (event, { value }) => {
    event.preventDefault();
    setValidationType(value);
    setSelectedOption(value);
    setInputValue(value);
    props.handleValidationType(value)


  };

  // (e, { value }) => setPriority(value)

  const handlePriorityChange = (event, { value }) => {
    event.preventDefault();
    props.handleRulePriority(value)
    setPriority(value);


  };

const handleChangeDescription = (event) => {
  event.preventDefault();
  props.handleChangeDescription(event.target.value)
  setDescription(event.target.value);


};

  return (

    <div style={{ 'margin-top': 20, display: 'block' }}>
      <Panel title="Configure">
        {/* <div className="flex-container"> */}
        <div className="flex-container" style={{ display: 'flex', 'alignItems': 'center' }} >

          <Form.Field style={{ width: '400px', }}
            control={Input}
            label="Rule Name"
            placeholder="Enter a rule name"

            value={name}
            onChange={handleNameChange}
          />

          <div style={{ width: 100 }}>
            <Form.Field style={{ width: '40px', }}
              control={Checkbox}
              label="Active"
              checked={active}
              value={active}
              onChange={handleToggle}
            />
          </div>


          <div style={{ width: 100 }} >


            {/* PRIORITY */}

            <Dropdown button
              className='icon'
              floating
              labeled
              icon='tasks'
              options={[...Array(10).keys()].map((num) => ({ key: num + 1 + '', value: num + 1 + '', text: num + 1 + '' }))}
              search
              text={priority}
              onChange={handlePriorityChange}
            />

          </div>
        </div>
        {/* Save and type start and end  */}
        <div className="flex-container" style={{ display: 'flex', 'margin-top': '20px', 'alignItems': 'center' }}>
          <div  >
            <Form.Field style={{ }}
              control={Input}
              label="Save As"
              placeholder="Enter a new type or select from the following"

              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value)
                handleValidationTypeChange(event)
              }}
            />
            </div>
            <div>
            <Dropdown button
              className='icon'
              floating
            
              labeled
              icon='folder open'
              options={ruleTypeOptions}
              search
              // text={props.ruleType}
              onChange={handleValidationTypeChange}
            />
           
          </div>
        </div>

        {/* Save and type start and end */}
      </Panel>
      {/* <Panel title="Description">
      <div className="flex-container" style={{ display: 'flex', padding:'20px', 'margin-top': '20px', 'alignItems': 'center' }}>
          <div  >
            <Form.TextArea style={{ display: 'flex',width:"100%", height:'200xpx'}}
             
              placeholder="Enter a new description"
              value={description}
              onChange={handleChangeDescription}
            />
            </div>
            </div>
        </Panel>         */}
    </div>
  );


}
export default FormExample;

