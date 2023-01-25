import { Engine } from 'json-rules-engine';
import axios from 'axios'
import { handleDebug } from '../actions/debug'   


// const Dotenv = require('dotenv-webpack');
const HOSTURL='http://localhost'
// const HOSTURL = 'process.env.HOSTURL



export const processEngine = async function(facts, rules, showNetwork=true, attended=false, addOnFacts={}) {

  let url = HOSTURL+'/spad/processRules?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
  try{
  let result = await axios.post(url, {facts, rules ,showNetwork, attended,addOnFacts}) 
  let resultSet = result.data
  return resultSet;
  
  }
  catch(e){
      alert(e)
  }
  return;
};
export const processEngineValidate = async function(facts, rules,attended, showNetwork, addOnFacts={}) {

  let url = HOSTURL+'/spad/processRules?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
  try{
  let result = await axios.post(url, {facts, rules,showNetwork,attended, addOnFacts})
  // ,showNetwork:network, attended:attended})   
  let resultSet = result.data
  return resultSet;
  
  }
  catch(e){
      alert(e)
  }
  return;
};

export const updateParsedRules = async function(data){
  let url = HOSTURL+'/rulesrepo/save/parsedrule/'+data.id+'?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false'
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