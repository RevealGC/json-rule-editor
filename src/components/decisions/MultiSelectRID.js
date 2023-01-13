import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MultiselectRID(props) {
  const [ridsForProcessing, setRidsForProcessing] = useState([]);
  const [inputValue, setInputValue] = useState('');
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
        setDropdownOpen(true)
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
    setInputValue(event.target.value);
  };

  const loadRuleSetForRid = async (event) =>{
    event.preventDefault(); 
    // 
    await props.loadRuleSet(inputValue)
  }
  const handleOptionClick = (option) => {
    setInputValue(option.reporting_id);
    props.loadRuleSet(option.reporting_id);
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  return (
    <div class="form-field">
        <label>Search</label><it>Example: 8771348140</it>
      <input type="text" onChange={handleInputChange} value={inputValue} placeholder="Search for dataset..."/>
      
      {dropdownOpen && (<select multiple={false} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.reporting_id} value={option.reporting_id} 
          onClick={() => handleOptionClick(option)}>
            {option.value}
          </option>
        ))}
      </select>)}
    
    </div>
  );
}

export default MultiselectRID;
