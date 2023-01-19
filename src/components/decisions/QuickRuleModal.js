import React, { useState } from 'react';
import './index.css'

// Action Request sent
// [{"RCPT_TOT":"RCPT_TOT"},{"PAY_ANN":"RCPT_TOT*4"}]

import { Modal, Button, Icon, Checkbox, Loader, Form, Table, Input, TextArea, Label, Dropdown, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import { green } from '@mui/material/colors';
import { MarkAsUnread } from '@mui/icons-material';
import {
    processEngine,
    updateParsedRules,
  } from "../../validations/rule-validation";
const HOSTURL = "http://localhost";

const QuickRuleModal = (props) => {
    const [ruleName, setRuleName] = useState(props.ruleName);
    const [conditionstring, setConditionstring] = useState(props.conditionstring);
    const [loading, setLoading] = useState(true);
    const [conditionResult, setConditionResult] = useState({});
    const [actionTestResult, setActionTestResult] = useState({});

    const [responseVariables, setResponseVariables] = useState(props.responseVariables);
    const [ruleType, setRuleType] = useState(props.ruleType);
    const [compute, setCompute] = useState(props.compute);
    const [priority, setPriority] = useState(props.priority);
    const [message, setMessage] = useState(props.message);
    const [ruleTypes, setRuleTypes] = useState(props.ruleTypes);
    const [facts, setFacts] = useState(props.facts || {})
    const [parseSuccess, setParseSuccess] = useState(false)


    const [ruleNameError, setRuleNameError] = useState('');

    const [aiDescribe, setAiDescribe] = useState("")
    // have 2 modal switchable windows. 
    // First one is for the record add/update, its state value = 'create'
    // second one is for results the state value = 'result'

    const [currentModal, setCurrentModal] = useState("create");

    const [ruleId, setRuleId] = useState(0);

    const saveRuleToDbAndRedux = async function(e){
        e.preventDefault()
        let action = stringToJSON(computeString)
        let event = {
            ruleId,active:true,name:ruleName,actionType:'impute',validationType:ruleType,
            rulePriority:priority, params:{rvs: JSON.stringify[responseVariables], rvsJSON:responseVariables,
            action,message,apiSource:{}, actionType:"impute", apiChecked:false},
            type:ruleId}

           let conditions = {
            "all": [
              {
                "fact": "checkCondition",
                "path": "$.value",
                "operator": "equal",
                "value": true,
                "params": {conditionstring }
              }
            ]
          };

          let r = { index: -1, event,conditions }
          let data = {
            parsed_rule: r,
            active: true,
            type: ruleType,
            data: r,
            description: aiDescribe,
            name: ruleName,
            id: ruleId,
          };
          
          let result = await updateParsedRules(data);
          let resultId = result.length > 0 ? result[0].id + '' : ''
          alert( "Rule " + resultId + " was successfully deployed");


        }
   






    const generateApiDescription = () => {
        // const { apiChecked, apiSource } = this.state;
        //   (!apiChecked)
        return "No api has been defined.";
        // return "API end point is: " + JSON.stringify(apiSource);
    }
    const generateDescription = () => {


        // If:
        let description =
            "Rule " +
            ruleName +
            ". If " +
            conditionstring +
            " then send a message: " +
            message +
            " and track these facts: " +
            JSON.stringify(responseVariables) +
            ". Also perform the following actions, if the rule is successful:" +
            computeString +
            ". "+
            "It has a priority of " +
            priority +
            " on a scale of 1-10." +
            generateApiDescription()+ " This rule was created at "+new Date();


        return description;
    },



        callAIDescribe = async () => {
            let url =
                HOSTURL +
                "/openai/aicomplete?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
            // get the string you want to process and update
            let str = generateDescription();
            // now call axios post and once you get the value
            let valueFromAI = await axios.post(url, { conditionstring: str });

            // update the value of the state parameter.
            setAiDescribe(valueFromAI.data);
        };



    // The result modal window will show the following items:
    // I would like to create a modal content window using symantic react with the following 4 fields. Suggest the react code for the modal window.
    // 1) Rule Name: ruleName(state variable)
    // 2) Status: parseSuccess (is a state variable and is to be shown in green. if true then show a green check mark else display a red cross )
    // 3) Action: actionTestResult (is a state variable and an array. The array object has key, value and expression as properties of the objects.  I would like to display that in a table with the 3 column table populated with actionTestResult.)
    // 4) Describe: aiDescribe (is a state variable and a string.  It should be displayed in a symantic textarea)


    //     actionTestResult is a state variable which manages the 
    //actionTestResult is an array  [
    //     {
    //       "key": "RCPT_TOT",
    //       "value": "",
    //       "expression": "RCPT_TOT"
    //     }
    //   ]
    //  

    /**
     * and conditionResult: {
      "parseSuccess": true,
      "message": "RCPT_TOT > 0",
      "value": false,
      "condition": {
        "conditions": {
          "all": [
            {
              "fact": "checkCondition",
              "path": "$.value",
              "operator": "equal",
              "value": true,
              "params": {
                "conditionstring": "RCPT_TOT > 0"
              }
            }
          ]
        }
      },
      "ruleResult": "",
      "facts": [
        {}
      ]
    }
    
    
    
    
    
    
     */


    const equations = props.compute.map(obj => {
        const key = Object.keys(obj)[0];
        return `${key} = ${obj[key]}`;
    }).join('; ');


    // function to convert string of equations to JSON object
    const stringToJSON = (str) => {
        let arr = str.split(";");
        let json = [];
        for (let i = 0; i < arr.length; i++) {
            const equation = arr[i];
            const [key, val] = equation.split("=");
            json.push({ [key]: val.replace(" eq ", "=") });
        }
        return json;
    }

    const [computeString, setComputeString] = useState(equations)

    const [ruleTypeOptions, setRuleTypeOptions] = useState(props.ruleTypes.map((type) => ({ key: type.type, value: type.type, text: type.type })))



    const handleSubmit = (e) => {
        e.preventDefault();
        // handle form submission here
        props.closeModal()
    };

    const validateQuickAdd = async (e) => {
        e.preventDefault();

        setLoading(true);

        let rule = {
            ruleId: props.ruleId,
            name: ruleName,
            computeString,
            conditionstring,
            message,
            compute: stringToJSON(computeString)
        }
        let action = JSON.stringify(stringToJSON(computeString))
        // Call testcondition
        let urlForCondition = HOSTURL +
            "/rulesrepo/testcondition?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";

        let result = await axios.post(urlForCondition, { facts: [facts], conditionstring })

        setConditionResult(result.data)
        setParseSuccess(result.data.parseSuccess)

        if (!result.data.parseSuccess) setRuleNameError(result.data.ruleResult)
        else setRuleNameError(result.data.value)



        // Call Action test and set it to actionTestResult
        let urlForCompute = HOSTURL +
            "/rulesrepo/actiontest?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";

        result = await axios.post(urlForCompute, { facts: [facts], action })
        setActionTestResult(result.data)

    

        // Show the result modal window
        if (parseSuccess) setCurrentModal("result")
    // call describe
    await callAIDescribe()

        props.handleDebug('ADD', { label: 'time', data: { rule, conditionResult, actionTestResult, facts } }, 0)
        setLoading(false);
    };

    const handleComputeChange = (e) => {
        e.preventDefault();
        setCompute(e.target.value)
    }

    return (
        <Modal className="rule-modal"
            style={
                {
                    height:'700px',
                    // modal: {
                        marginTop: '0px !important',
                        marginLeft: '40px',
                        marginRight: 'auto'
                    // }
                }
            }


            open={props.open} onClose={props.onClose}>


            {/* <>
            <Loader active style={{ visibility: loading ? 'visible' : 'hidden' }} />
            </> */}


            {currentModal === "create" && (
                <>
                    <Modal.Header>Add Rule</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', padding: '20px' }}>
                                <div style={{ width: "50%" }}>

                                    <Dropdown button
                                        className='icon'
                                        floating
                                        labeled
                                        icon='folder open'
                                        options={ruleTypeOptions}
                                        label='Save...'
                                        search
                                        text={ruleType}
                                        onChange={(e, { value }) => setRuleType(value)}
                                    />
                                    <Label as='a' tag>
                                        Save As...
                                    </Label>
                                </div >
                                <div >

                                    <Dropdown button
                                        className='icon'
                                        label='Priority'
                                        floating
                                        labeled
                                        icon='tasks'
                                        options={[...Array(10).keys()].map((num) => ({ key: num + 1 + '', value: num + 1 + '', text: num + 1 + '' }))}
                                        search
                                        text={priority}
                                        onChange={(e, { value }) => setPriority(value)}
                                    />
                                    <Label as='a' color='gray' tag>
                                        Priority
                                    </Label>
                                </div>

                            </div>


                            <Label as='a' color='gray' ribbon>
                                        1. Name the rule
                                    </Label>

                            <Form.Field
                                control={TextArea}
                                // label="Rule Name"
                                placeholder="Enter a rule name"
                                maxLength={80}
                                value={ruleName}
                                onChange={(e) => setRuleName(e.target.value)}
                            />
 

 <Label as='a' color='gray' ribbon>
                                        2. Condition
                                    </Label>
                            <Form.Field
                                control={TextArea}
                                // label="Condition"
                                placeholder="Enter a condition"
                                value={conditionstring}
                                onChange={(e) => setConditionstring(e.target.value)}
                            />
                            {ruleNameError && <span className='error-message'>{ruleNameError}</span>}
<div></div>
                            <Label as='a' color='gray' ribbon>
                                        3. Track 
                                    </Label>

                            <Form.Field
                                control={Input}
                                // label="Response Variables"
                                placeholder="Enter response variables, separated by commas"
                                value={responseVariables.join(';')}
                                onChange={(e) => setResponseVariables(e.target.value.split(';'))}
                            />
  <Label as='a' color='gray' ribbon>
                                        4. Actions
                                    </Label>
                            <Form.Field
                                control={TextArea}
                                // label="Compute"
                                placeholder="Enter compute expressions, one per line"
                                value={computeString}
                                // onChange={handleComputeChange}
                                onChange={(e) => setComputeString(e.target.value)}
                            />
  <Label as='a' color='gray' ribbon>
                                        5. Message
                                    </Label>
                            <Form.Field
                                control={Input}
                                // label="Message"
                                placeholder="Enter a message"
                                maxLength={400}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Modal.Actions>
                                <Button onClick={() => props.closeModal()}>
                                    <Icon name='cancel' />Cancel
                                </Button>

                                <Button onClick={validateQuickAdd}>
                                    <Icon name='tasks' /> Validate
                                </Button>

                                {/* <Button onClick={() => props.closeModal()}>
                            <Icon name='save' /> Save
                        </Button> */}
                            </Modal.Actions>






                        </Form >
                    </Modal.Content >
                </>
            )}
            {currentModal === "result" && (

                <>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Rule Name</label>
                                <Input
                                    value={ruleName}
                                    onChange={(e) => setRuleName(e.target.value)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Status</label>
                                <Checkbox
                                    checked={parseSuccess}
                                    //   onChange={(e) => setParseSuccess(e.target.checked)}
                                    label={parseSuccess ? 'Success' : 'Failed'}
                                    color={parseSuccess ? 'green' : 'red'}
                                />
                            </Form.Field>
                            {parseSuccess && <span className='message'>{conditionResult.message}<br></br>
                                {conditionResult.ruleResult}
                            </span>}
                            {!parseSuccess && <span className='error-message'>{conditionResult.message}<br></br>{ruleNameError}</span>}

                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Key</Table.HeaderCell>
                                        <Table.HeaderCell>Value</Table.HeaderCell>
                                        <Table.HeaderCell>Expression</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {actionTestResult.map((result) => (
                                        <Table.Row key={result.key}>
                                            <Table.Cell>{result.key}</Table.Cell>
                                            <Table.Cell>{result.value}</Table.Cell>
                                            <Table.Cell>{result.expression}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                            <Form.Field>
                                <label>Describe</label>
                                <TextArea
                                    value={aiDescribe}
                                    onChange={(e) => setAiDescribe(e.target.value)}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setCurrentModal("create")}>Back</Button>
                        <Button primary disabled={!parseSuccess} onClick={saveRuleToDbAndRedux}>
                            Submit
                        </Button>
                    </Modal.Actions>

                </>


            )}
        </Modal >
    );
};

export default QuickRuleModal

/*

import React, { useState } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

const ModalWorkflow = () => {
  const [currentModal, setCurrentModal] = useState(1);

  const handleNextModal = () => {
    // Validate current modal form here
    if (valid) {
      setCurrentModal(currentModal + 1);
    }
  };

  const handlePreviousModal = () => {
    setCurrentModal(currentModal - 1);
  };

  return (
    <Modal open={true}>
      {currentModal === 1 && (
        <>
          <Modal.Header>Modal 1</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label="Name" placeholder="Enter your name" />
              <Form.Input label="Email" placeholder="Enter your email" />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleNextModal}>Next</Button>
          </Modal.Actions>
        </>
      )}
      {currentModal === 2 && (
        <>
          <Modal.Header>Modal 2</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label="Address" placeholder="Enter your address" />
              <Form.Input label="Phone" placeholder="Enter your phone number" />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handlePreviousModal}>Back</Button>
            <Button onClick={handleNextModal}>Next</Button>
          </Modal.Actions>
        </>
      )}
      {currentModal === 3 && (
        <>
          <Modal.Header>Modal 3</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label="City" placeholder="Enter your city" />
              <Form.Input label="Country" placeholder="Enter your country" />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handlePreviousModal}>Back</Button>
            <Button>Submit</Button>
          </Modal.Actions>
        </>
      )}
    </Modal>
  );
};

export default ModalWorkflow;
*/