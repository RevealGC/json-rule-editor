import React, { useState } from 'react';
import './index.css'
import NameValueTable from './NameValueTable'
import ReactJson from 'react-json-view'

import ReactQuill from 'react-quill';
import  { formats } from "./EditorToolbar";

// Action Request sent
// [{"RCPT_TOT":"RCPT_TOT"},{"PAY_ANN":"RCPT_TOT*4"}]

import { Modal, Button, Icon, Checkbox, Loader, Form, Table, Input, TextArea, Label, Dropdown, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

// import {
//     processEngine,
//     updateParsedRules,
// } from "../../validations/rule-validation";

// import { processEngine, processEngineValidate, updateParsedRules, validateRuleset } from '../../validations/rule-validation';

const HOSTURL = "http://cto-tasks002-ite.ite.edl.census.gov:8002";


// {props.open} onClose={props.onClose}props.handleRule,   props.closeModal()>


const FreeTextModal = (props) => {

    const handleRule = props.handleRule

    const [freeText, setFreeText] = useState('');
    const [freeTextResultJSON, setFreeTextResultJSON] = useState({});
    const [freeTextResultDescription, setFreeTextResultJDescription] = useState('');


    const [ruleName, setRuleName] = useState('');
    const [conditionstring, setConditionstring] = useState('');

    const [conditionResult, setConditionResult] = useState({});
    const [actionTestResult, setActionTestResult] = useState({});

    const [responseVariables, setResponseVariables] = useState([]);
    const [ruleType, setRuleType] = useState('new');
    const [compute, setCompute] = useState([]);
    const [priority, setPriority] = useState(5);
    const [message, setMessage] = useState('');
    const [parseSuccess, setParseSuccess] = useState(false)


    const [ruleNameError, setRuleNameError] = useState('');

    const [aiDescribe, setAiDescribe] = useState("")
    // have 2 modal switchable windows. 
    // First one is for the record add/update, its state value = 'create'
    // second one is for results the state value = 'result'

    const [currentModal, setCurrentModal] = useState("freeText");

    const [ruleId, setRuleId] = useState(0);




    // testRuleResult
    const [testRuleResult, setTestRuleResult] = useState('');




    const cleanupString = (str) => { return str.replace(/[^\x20-\x7E]/g, "").trim(); }




    const getRule = () => {
        let action = stringToJSON(computeString)
        let ruleId = props.ruleId

        let event = {
            ruleId, active: true, name: ruleName, actionType: 'impute', validationType: ruleType,
            rulePriority: priority, params: {
                rvs: JSON.stringify[responseVariables], rvsJSON: responseVariables,
                action, message, apiSource: {}, actionType: "impute", apiChecked: false
            },
            type: ruleId
        }

        let conditions = {
            "all": [
                {
                    "fact": "checkCondition",
                    "path": "$.value",
                    "operator": "equal",
                    "value": true,
                    "params": { conditionstring }
                }
            ]
        };

        let r = { index: -1, event, conditions }
        return r

    }


    const freeTextToAddRule = () => {

        // get the rule conditions, form it, close this modal window while opening the quickmodalrule window
        // get the props from RulesGrid ie handleAddFreeTextRule

        // {
        //     "ruleName": "IF the flag for hazardous materials is reported and the NAICS is in 484",
        //     "condition": "substr(RECORD_NAICS_NUM, 1,3)== 484 and RCPT_MOTR_HAZRD_STAT == 1 and RCPT_MOTR_HAZRD_PCT == 0",
        //     "compute": [
        //       "RCPT_MOTR_HAZRD_STAT = 2",
        //       "PAY_ANN =4"
        //     ],
        //     "priority": 5,
        //     "message": "Hazardous Material rule fired"
        //   }

        let action = freeTextResultJSON.compute ? freeTextResultJSON.compute.map(c => stringToJSON(c)[0]) : []
        let condition = freeTextResultJSON.condition ? freeTextResultJSON.condition : ''
        let name =  freeTextResultJSON.name||freeTextResultJSON.ruleName ||'Rule Name'
        let rulePriority = freeTextResultJSON.rulePriority || freeTextResultJSON.priority || '5'
        let message = freeTextResultJSON.message || 'Rule was validated.'

        let nro = {name, rulePriority, condition, action, message }

        props.handleAddFreeTextRule(nro)
        // alert("Ready to start the process of adding Rule to modal window")

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
            "Express this: Rule " +
            ruleName +
            ". If " +
            conditionstring +
            " then send a message: " +
            message +
            " and track these facts: " +
            JSON.stringify(responseVariables) +
            ". Also perform the following actions, if the rule is successful:" +
            computeString +
            ". " +
            "It has a priority of " +
            priority +
            " on a scale of 1-10." +
            generateApiDescription() + " This rule was created at " + new Date();


        return description;
    },




        callAIDescribe = async (str) => {
            let url =
                HOSTURL +
                "/openai/aicomplete?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
            // get the string you want to process and update
            // let str = generateDescription();
            // now call axios post and once you get the value
            let valueFromAI = await axios.post(url, { conditionstring: str });

            // update the value of the state parameter.
            return (valueFromAI.data);
        };





    // const equations = props.compute.map(obj => {
    //     const key = Object.keys(obj)[0];
    //     return `${key} = ${obj[key]}`;
    // }).join('; ');





    // function to convert string of equations to JSON array
    const stringToJSON = (str) => {
        let arr = str.split(";");
        let json = [];
        for (let i = 0; i < arr.length; i++) {
            const equation = arr[i];
            const [key, val] = equation.split(/(?<=^[^\=]+)\=/) //split("=");

            if (key)
                json.push({ [cleanupString(key)]: cleanupString(val.replace(" eq ", "=")) });
        }
        return json;
    }

    const [computeString, setComputeString] = useState('')




    const handleSubmit = (e) => {
        e.preventDefault();
        // handle form submission here
        props.closeModal()
    };

    const validateFreeText = async (e) => {
        e.preventDefault();

       let aiActionString =  'What is the name, condition, compute as an array and message of the following rule and return it as a json: ' 
         let aiAction = aiActionString+ freeText
        let result = await callAIDescribe(aiAction)
        setFreeTextResultJSON(result)
        let strResult = JSON.stringify(result)

        aiAction = "Express this in english: " + strResult
        let descResult = await callAIDescribe(aiAction)
        setFreeTextResultJDescription(descResult.trim())
        return;

        //     let rule = {
        //         ruleId: props.ruleId || 0,
        //         name: ruleName || 'Not defined.',
        //         computeString,
        //         conditionstring,
        //         message,
        //         compute: stringToJSON(computeString)
        //     }
        //     let action = JSON.stringify(stringToJSON(computeString))
        //     // Call testcondition
        //     let urlForCondition = HOSTURL +
        //         "/rulesrepo/testcondition?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";

        //     // let result = await axios.post(urlForCondition, { facts: [facts], conditionstring })

        //     setConditionResult(result.data)
        //     setParseSuccess(result.data.parseSuccess)

        //     if (!result.data.parseSuccess) setRuleNameError(result.data.ruleResult)
        //     else setRuleNameError(result.data.value)



        //     // Call Action test and set it to actionTestResult
        //     let urlForCompute = HOSTURL +
        //         "/rulesrepo/actiontest?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";

        //     result = await axios.post(urlForCompute, { facts: [facts], action })
        //     setActionTestResult(result.data)


        //      // call describe
        //    await  callAIDescribe()

    };

    const handleComputeChange = (e) => {
        e.preventDefault();
        setCompute(e.target.value)
    }

    return (
        <Modal className="rule-modal"
            style={
                {
                    height: '700px',
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


            {(
                <>
                    <Modal.Header>{props.ruleId == 0 ? 'Free Text' : 'Edit Text:' + props.ruleId}</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={handleSubmit}>



                            <Label as='a' color='gray' >
                                Notes
                            </Label>

                            <Form.Field
                                control={TextArea}
                                // label="Rule Name"
                                placeholder="Enter note"

                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                            />


                            <Label as='a' color='gray' >
                                Description
                            </Label>


                            {/* <EditorToolbar id={"B" } /> */}
                            <ReactQuill value={freeTextResultDescription} theme="snow" formats={formats} />
                            <ReactJson displayObjectSize={false} key={'freeTextdebug'} displayDataTypes={false} collapsed={false}
                                src={freeTextResultJSON}
                            // onClick={this.handleReset} 
                            />




                            <Modal.Actions>
                                <Button onClick={() => props.closeModal()}>
                                    <Icon name='cancel' />Cancel
                                </Button>
                                <Button onClick={validateFreeText}>
                                    <Icon name='tasks' /> Process
                                </Button>

                                <Button  disabled={freeTextResultDescription.length == 0} onClick={freeTextToAddRule}>
                                    <Icon name='tasks' /> Add Rule
                                </Button>


                                {/* <Button onClick={() => props.closeModal()}>
                            <Icon name='save' /> Save
                        </Button> */}
                            </Modal.Actions>
                        </Form >
                    </Modal.Content >
                </>
            )}





        </Modal >
    );
};

export default FreeTextModal

