import { Engine } from 'json-rules-engine';
import axios from 'axios'
import { handleDebug } from '../actions/debug'   


export const processEngine = async function(facts, rules) {
  console.log("🚀 ~ file: rule-validation.js ~ line 5 ~ processEngine ~ conditions", rules)
  console.log("🚀 ~ file: rule-validation.js ~ line 5 ~ processEngine ~ fact", facts)
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
    // const engine = new Engine(conditions);
  
    // return engine.run(fact)
    //     .then(results => {
    //       return results.events
    //     })
    //     .catch((e) => {
    //       console.error('Problem occured when processing the rules', e);
    //       return Promise.reject({ error: e.message });
    //     });
};
  
export const validateRuleset = async (facts, conditions) => {
    console.log("🚀 ~ file: rule-validation.js ~ line 39 ~ validateRuleset ~ facts", facts)
  //  const result = await processEngine(facts, conditions);
  handleAttribute('UPDATE',facts, conditions)
  
    return result;
}