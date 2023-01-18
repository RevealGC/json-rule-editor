import React, { useState } from 'react';
import './index.css'
import { Modal, Button, Icon, Form, Input, TextArea, Label, Dropdown, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
const HOSTURL = "http://localhost";

const QuickRuleModal = (props) => {
    const [ruleName, setRuleName] = useState(props.ruleName);
    const [condition, setCondition] = useState(props.condition);
    const [responseVariables, setResponseVariables] = useState(props.responseVariables);
    const [ruleType, setRuleType] = useState(props.ruleType);
    const [compute, setCompute] = useState(props.compute);
    const [priority, setPriority] = useState(props.priority);
    const [message, setMessage] = useState(props.message);
    const [ruleTypes, setRuleTypes] = useState(props.ruleTypes);
    const [facts, setFacts] = useState(props.facts||{})


    const equations = props.compute.map(obj => {
        const key = Object.keys(obj)[0];
        return `${key} = ${obj[key]}`;
      }).join('; ');
      

      // function to convert string of equations to JSON object
const stringToJSON = (str) => {
    let arr = str.split("; ");
    let json = {};
    for (let i = 0; i < arr.length; i++) {
      const equation = arr[i];
      const [key, val] = equation.split(" = ");
      json[key] = val;
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
            condition,
            message,
            compute: stringToJSON(computeString) 
        }
        let action = JSON.stringify([stringToJSON(computeString)])
        // fire calls to validate both the condition is a string and comnpute Object
        // NK Work to be done
        let urlForCondition =  HOSTURL +
        "/rulesrepo/testcondition?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
        let conditionResult = await axios.post(urlForCondition, {facts:[facts], conditionstring: condition})



        let urlForCompute =  HOSTURL +
        "/rulesrepo/actiontest?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
        let computeResult = await axios.post(urlForCompute, {facts: [facts], action  })


        // post(url, { facts: [facts], action: JSON.stringify(action) })



        props.handleDebug('ADD', { label: 'time', data: { rule,  conditionResult, computeResult, facts} }, 0)
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
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                    />
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

                        <Button onClick={() => props.closeModal()}>
                            <Icon name='save' /> Save
                        </Button>
                    </Modal.Actions>






                </Form >
            </Modal.Content >
        </Modal >
    );
};

export default QuickRuleModal