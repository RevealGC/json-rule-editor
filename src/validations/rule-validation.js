import { Engine } from 'json-rules-engine';


export const processEngine = (fact, conditions) => {
  console.log("🚀 ~ file: rule-validation.js ~ line 5 ~ processEngine ~ conditions", conditions)
  console.log("🚀 ~ file: rule-validation.js ~ line 5 ~ processEngine ~ fact", fact)
  console.log("file: rule-validation.js ~ line 5 ~ processEngine ~CALL QBES via axios ")
  return;
    const engine = new Engine(conditions);
  
    return engine.run(fact)
        .then(results => {
          return results.events
        })
        .catch((e) => {
          console.error('Problem occured when processing the rules', e);
          return Promise.reject({ error: e.message });
        });
};
  
export const validateRuleset = async (facts, conditions) => {
    const result = await processEngine(facts, conditions);
    return result;
}