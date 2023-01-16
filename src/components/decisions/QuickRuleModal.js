import React, { useState } from 'react';
import './index.css'
import { Modal,Button,Icon, Form, Input, TextArea, Select } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


const QuickRuleModal = (props) => {
    const [ruleName, setRuleName] = useState(props.ruleName);
    const [condition, setCondition] = useState(props.condition);
    const [responseVariables, setResponseVariables] = useState(props.responseVariables);
    const [ruleType, setRuleType] = useState(props.ruleType);
    const [compute, setCompute] = useState(props.compute);
    const [priority, setPriority] = useState(props.priority);
    const [message, setMessage] = useState(props.message);


    const handleSubmit = (e) => {
        e.preventDefault();
        // handle form submission here
        props.closeModal()
    };
 
    return (
        <Modal className="rule-modal" 
        style={
        {modal : {
            marginTop: '0px !important',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}
          }
        
        
        open={props.open} onClose={props.onClose}>
          
            <Modal.Header>Create a new rule</Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
        
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
                        value={responseVariables.join(',')}
                        onChange={(e) => setResponseVariables(e.target.value.split(','))}
                    />
                    <Form.Field
                        control={Select}
                        label="Rule Type"
                        options={props.ruleTypes.map((type) => ({ key: type, value: type, text: type }))}
                        value={ruleType}
                        onChange={(e, { value }) => setRuleType(value)}
                    />
                    <Form.Field
                        control={Input}
                        label="Compute"
                        placeholder="Enter compute expressions, one per line"
                        value={compute.map((c) => JSON.stringify(c)).join('\n')}
                        onChange={(e) => setCompute(e.target.value.split('\n').map((c) => JSON.parse(c)))}
                    />
                    <Form.Field
                        control={Select}
                        label="Priority"
                        options={[...Array(10).keys()].map((num) => ({ key: num + 1, value: num + 1, text: num + 1 }))}
                        value={priority}
                        onChange={(e, { value }) => setPriority(value)}
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
                <Button basic color='red' inverted onClick={() =>  props.closeModal()}>
                    <Icon name='remove' /> No
                </Button>

                <Button color='blue' inverted onClick={() =>  props.closeModal()}>
                    <Icon name='view' /> Validate
                </Button>

                <Button color='green' inverted onClick={() =>  props.closeModal()}>
                    <Icon name='checkmark' /> Yes
                </Button>
            </Modal.Actions>



           

         
        </Form >
      </Modal.Content >
    </Modal >
  );
};

export default QuickRuleModal