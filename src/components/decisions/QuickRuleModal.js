import React, { useState } from 'react';
import './index.css'

// Action Request sent
// [{"RCPT_TOT":"RCPT_TOT"},{"PAY_ANN":"RCPT_TOT*4"}]

import { Modal, Button, Icon,Checkbox, Form,Table,  Input, TextArea, Label, Dropdown, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import { green } from '@mui/material/colors';
import { MarkAsUnread } from '@mui/icons-material';
const HOSTURL = "http://localhost";

const QuickRuleModal = (props) => {
    const [ruleName, setRuleName] = useState(props.ruleName);
    const [conditionstring, setConditionstring] = useState(props.conditionstring);

    const [conditionResult, setConditionResult] = useState({});
    const [actionTestResult, setActionTestResult] = useState({});

    const [responseVariables, setResponseVariables] = useState(props.responseVariables);
    const [ruleType, setRuleType] = useState(props.ruleType);
    const [compute, setCompute] = useState(props.compute);
    const [priority, setPriority] = useState(props.priority);
    const [message, setMessage] = useState(props.message);
    const [ruleTypes, setRuleTypes] = useState(props.ruleTypes);
    const [facts, setFacts] = useState(props.facts||{})
    const [parseSuccess, setParseSuccess] = useState(false)


    const [ruleNameError, setRuleNameError] = useState('');

    const [aiDescribe, setAiDescribe] = useState("")
    // have 2 modal switchable windows. 
    // First one is for the record add/update, its state value = 'create'
    // second one is for results the state value = 'result'

    const [currentModal, setCurrentModal] = useState("create");
    

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
      json.push({[key]:val.replace(" eq ","=")});
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

    const validateQuickAdd = async (e)=> {
        e.preventDefault();
        let rule = {
            ruleId: props.ruleId,
            name: ruleName,
            computeString,
            conditionstring,
            message,
            compute: stringToJSON(computeString) 
        }
        let action = JSON.stringify(stringToJSON(computeString))
        // fire calls to validate both the condition is a string and comnpute Object
        // NK Work to be done
        let urlForCondition =  HOSTURL +
        "/rulesrepo/testcondition?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
        
        let result = await axios.post(urlForCondition, {facts:[facts], conditionstring})

        setConditionResult(result.data)
        setParseSuccess(result.data.parseSuccess)

        if(!result.data.parseSuccess) setRuleNameError(result.data.ruleResult) 
        else setRuleNameError(result.data.value)

        let urlForCompute =  HOSTURL +
        "/rulesrepo/actiontest?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
        
        result = await axios.post(urlForCompute, {facts: [facts], action  })
        setActionTestResult(result.data)

        // Show the result modal window
        if(parseSuccess) setCurrentModal("result")


        props.handleDebug('ADD', { label: 'time', data: { rule,  conditionResult, actionTestResult, facts} }, 0)
        // formRule()

        // handle form submission here
        // props.closeModal()
    };

    const handleComputeChange = (e) => {
        e.preventDefault();
        setCompute(e.target.value)
    }

    return (
        <Modal className="rule-modal"
            style={
                {
                    modal: {
                        marginTop: '0px !important',
                        marginLeft: '40px',
                        marginRight: 'auto'
                    }
                }
            }


            open={props.open} onClose={props.onClose}>

            {currentModal ==="create" && (
                <>
            <Modal.Header>Add Rule</Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', padding: '20px'}}>
                        <div style={{width:"50%"}}>

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
                            <Label as='a'  tag>
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
                             <Label as='a' color='red' tag>
                               Priority
                            </Label>
                        </div>

                    </div>




                    <Form.Field
                        control={Input}
                        label="Rule Name"
                        placeholder="Enter a rule name"
                        maxLength={80}
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                    />



                    <Form.Field
                        control={Input}
                        label="Condition"
                        placeholder="Enter a condition"
                        maxLength={400}
                        value={conditionstring}
                        onChange={(e) => setConditionstring(e.target.value)}
                    />
                       {ruleNameError && <span className='error-message'>{ruleNameError}</span>}
                    <Form.Field
                        control={Input}
                        label="Response Variables"
                        placeholder="Enter response variables, separated by commas"
                        value={responseVariables.join(';')}
                        onChange={(e) => setResponseVariables(e.target.value.split(';'))}
                    />

                    <Form.Field
                        control={TextArea}
                        label="Compute"
                        placeholder="Enter compute expressions, one per line"
                        value={computeString}
                        // onChange={handleComputeChange}
                        onChange={(e) => setComputeString(e.target.value)}
                    />

                    <Form.Field
                        control={Input}
                        label="Message"
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
        <Button primary disabled={!parseSuccess} onClick={() => setCurrentModal("create")}>
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