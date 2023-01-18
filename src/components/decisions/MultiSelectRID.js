import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Modal, Button, Icon, Form, Input, Dropdown, TextArea, Checkbox, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';



function MultiselectRID(props) {
  const [ridsForProcessing, setRidsForProcessing] = useState([]);
  const [inputValue, setInputValue] = useState(''); // is the search string. 
  const [options, setOptions] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);


  
//   const HOSTURL='http://localhost/reporting_unit/findRID?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
  useEffect(() => {
    if (debouncedValue !== '' || debouncedValue.length > 3) {
        const RIDSURL=`http://localhost/reporting_unit/findRID/${debouncedValue}?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false`
        axios.get(RIDSURL)
      .then(response => {
        setOptions(response.data);
        // setDropdownOpen(true)
      })
      .catch(error => {
        console.log(error);
      });
    }
  }, [debouncedValue]);

  const handleChange = (event) => {
    setRidsForProcessing(event.target.selectedOptions);
  };

  const handleInputChange = (event) => {
    event.preventDefault(); 
    setInputValue(event.target.value);
  };

  const loadRuleSetForRid = async (event) =>{
    event.preventDefault(); 
    // 
    await props.loadRuleSet(inputValue)
  }


  const  optionsList= options.map((option) => ({ key: option.reporting_id, 
    value: option.reporting_id, 
    text: option.value
  
  }))
   console.log("🚀 ~ file: MultiSelectRID.js:50 ~ MultiselectRID ~ optionsList", optionsList)
   
  const handleOptionClick = (event, { value }) => {
    event.preventDefault(); 
    props.loadRuleSet(value);
    setInputValue(value);
   
  };


  const handleSearchTextChange = (event, { value }) => {
          
            setInputValue(value)
            setDebouncedValue(value)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  return (
    <div style={{height:400,width:'100%',}}>
{/* Need an input field, followed by a dropdown of rids coming from the axios call */}
            <div>
            <Form.Field style={{ width:'300px'}}
              control={Input}
              label="Search"
              placeholder="Search datasets..."
              value={inputValue}
              onChange={handleSearchTextChange}
            />
            </div>
    <Dropdown button
    style={{width:'300px', height:'40px'}}
    className='icon'
    floating
    label={"Choose from"}
    labeled
    icon='world'
    options={optionsList}
    search
    text={inputValue}
    onChange={handleOptionClick}
  />
</div>
);
}
export default MultiselectRID;

    // <div className="form-field">
    //     <label>Search</label><it>Example: 8771348140</it>
    //   <input type="text" onChange={handleInputChange} value={inputValue} placeholder="Search for dataset..."/>
      
    //   {dropdownOpen && (<select multiple={false} onChange={handleChange}>
    //     {options.map((option) => (
    //       <option key={option.reporting_id} value={option.reporting_id} 
    //       onClick={() => handleOptionClick(option)}>
    //         {option.value}
    //       </option>
    //     ))}
    //   </select>)}
    
    // </div>
  


