import { Engine } from 'json-rules-engine';
import axios from 'axios'
import { handleDebug } from '../actions/debug'   



export const processEngine = async function(facts, rules) {

  let url = 'http://localhost/spad/testrule?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
  try{
  let result = await axios.post(url, {facts, rules})
  let resultSet = result.data
  console.log("🚀 ~ file: rule-validation.js ~ line 12 ~ processEngine ~ resultSet", resultSet)
  return resultSet;
  
  }
  catch(e){
      alert(e)
  }
  return;
};


export const updateParsedRules = async function(data){
  console.log("🚀 ~ file: rule-validation.js ~ line 13 ~ updateParsedRules ~ data", data)
  let url = 'http://localhost/rulesrepo/save/parsedrule/'+data.id+'?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
  try{
    let result = await axios.put(url, {data})
    console.log("🚀 ~ file: rule-validation.js ~ line 29 ~ updateParsedRules ~ result", result.data)
    return result.data
}
catch(e){
  console.log(e)
}}

export const validateRuleset = async (facts, conditions) => {
    console.log("🚀 ~ file: rule-validation.js ~ line 39 ~ validateRuleset ~ facts", facts)
  //  const result = await processEngine(facts, conditions);
  handleAttribute('UPDATE',facts, conditions)
  
    return result;
}