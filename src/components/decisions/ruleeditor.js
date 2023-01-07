import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Panel from "../panel/panel";
import axios from "axios";

import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "../../../node_modules/react-quill/dist/quill.snow.css"; // .  react-quill/dist/quill.snow.css';

import FormExample from "./GeneralRuleForm";

import {
  processEngine,
  updateParsedRules,
} from "../../validations/rule-validation";
import InputField from "../forms/input-field";
import SelectField from "../forms/selectmenu-field";
import Button from "../button/button";

import Tabs from "../../components/tabs/tabs";
import ReactJson from "react-json-view";

import ToggleButton from "react-toggle-button";
import { RadioGroup, Radio } from "react-radio-group";

import ApperanceContext from "../../context/apperance-context";

import { handleDebug } from "../../actions/debug";
import { handleDecision } from "../../actions/decisions";

import SweetAlert from "react-bootstrap-sweetalert";

import ImputeGrid from "./imputeGrid";

const tabs = [
  { name: "General" },
  { name: "If-Then" },
  { name: "Action" },
  { name: "Track" },
  { name: "API" },
];
const HOSTURL = "http://localhost";

const newRuleObject = {
  event: {
    ruleId: "0",
    active: true,
    name: "Rule Name(edit me)",
    actionType: "impute",
    validationType: "validation",
    rulePriority: "5",
    params: {
      rvs: "[]",
      action: [],
      message: "Enter the message you want to display...",
      actionType: "impute",
    },
    type: "0",
  },
  index: -1,
  conditions: {
    all: [
      {
        fact: "checkCondition",
        path: "$.value",
        operator: "equal",
        value: true,
        params: {
          conditionstring: "RCPT_TOT > 0",
        },
      },
    ],
  },
};

class RuleEditor extends Component {
  constructor(props) {
    super(props);

    this.getRowId = this.props.getRowId;

    const displayRuleEditor = true;

    const outcome = props.editDecision
      ? props.outcome
      : { value: "New", params: [] };

    const decisionIndex = this.props.decisionIndex;

    const conditions = this.props.conditions;



    // const handleCancel = this.props.handleCancel
    const facts = this.props.facts.facts || [];

    const condition = conditions.length
      ? conditions[0]
      : newRuleObject.condition;

    const conditionstring =
      condition.conditions &&
        condition.conditions.all &&
        condition.conditions.all[0].params
        ? condition.conditions.all[0].params.conditionstring
        : "RCPT_TOT > 0"; // is an object of all/or array of conditions

    const conditionStringObject = { condition: condition } // { parseSuccess: true, ruleResult: true };

    const apiChecked =
      condition.event.params && condition.event.params.apiChecked
        ? condition.event.params.apiChecked
        : false;

    const active =
      condition.event && condition.event.active
        ? condition.event.active
        : false;



    const params =
      condition.event && condition.event.params ? condition.event.params : [];
    const action = params.action || [];

    const validationType =
      condition.event && condition.event.validationType
        ? condition.event.validationType
        : "validation";

    // Default the ruleId to 0 if its a new record and set rulePriority to 5 by default
    const ruleId =
      condition.event && condition.event.ruleId
        ? condition.event.ruleId || condition.event.type
        : 0;
    const rulePriority =
      condition.event && condition.event.rulePriority
        ? condition.event.rulePriority
        : 5;

    const name = condition.event ? condition.event.name : "";
    const message = condition.event ? condition.event.params.message : "";

    const description = this.props.description ? this.props.description : "";

    const responseVariables =
      condition.event &&
        condition.event.params &&
        condition.event.params.rvsJSON
        ? condition.event.params.rvsJSON
        : condition.event &&
          condition.event.params &&
          condition.event.params.rvs
          ? JSON.parse(condition.event.params.rvs)
          : [];

    const actionType =
      condition.event &&
        condition.event.params &&
        condition.event.params.actionType
        ? condition.event.params.actionType
        : "nofify";

    const apiSource = params.apiSource
      ? params.apiSource
      : {
        url: "http://census.gov",
        verb: "POST",
        headers: [
          { key: "X-JBID", value: "kapoo" },
          { key: "X-API-KEY", value: "12345ABC233" },
        ],
        data: [{ key: "row", value: 3 }],
        query: [{ key: "DEBUG", value: true }],
      };

    this.state = {
      showAddRuleCase: false,
      conditions: this.props.conditions,
      outcome,

      condition,
      ruleId,
      name,
      description,
      message,
      actionType,
      responseVariables,
      active,
      validationType,
      params,
      decisionIndex,
      action,
      apiSource,
      conditionstring,
      conditionStringObject,
      facts,
      rulePriority,
      displayRuleEditor,
      apiChecked,

      removeAlert: false,
      successAlert: false,
      actionParseObject: [], // gives the result of passing an array to the test action API end point. It will provide name value pairs and the imputedValue as an array.

      activeTab: "General",
      generateFlag: false,

      searchCriteria: "",
      editCaseFlag: false,
      //  message: Message.NO_DECISION_MSG,
      decisions: props.decisions || [],
      bannerflag: false,
    };

    this.handleUpdateRule = this.handleUpdateRule.bind(this);
    this.updateCondition = this.updateCondition.bind(this);
    this.removeCase = this.removeCase.bind(this);
    this.removeDecisions = this.removeDecisions.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.handleChangeRuleMessage = this.handleChangeRuleMessage.bind(this);
    this.handleChangeRuleName = this.handleChangeRuleName.bind(this);
    this.onChangeOutcomeValue = this.onChangeOutcomeValue.bind(this);
    this.onToggleActive = this.onToggleActive.bind(this);
    this.onToggleAPI = this.onToggleAPI.bind(this);

    this.handleValidationType = this.handleValidationType.bind(this);
    this.handleRulePriority = this.handleRulePriority.bind(this);

    this.addResponseVariables = this.addResponseVariables.bind(this);
    this.deleteRVActions = this.deleteRVActions.bind(this);
    this.handleShowRuleJSON = this.handleShowRuleJSON.bind(this);
    this.handleResponseVariables = this.handleResponseVariables.bind(this);
    this.handleChangeActionType = this.handleChangeActionType.bind(this);
    this.handleActions = this.handleActions.bind(this);
    this.handleCompileConditionString =
      this.handleCompileConditionString.bind(this);
    this.handleCompileImputeObject = this.handleCompileImputeObject.bind(this);

    this.handleTestRule = this.handleTestRule.bind(this);
    this.handleDeployRule = this.handleDeployRule.bind(this);
    this.handleAIDescribe = this.handleAIDescribe.bind(this);
    this.handleQuillChange = this.handleQuillChange.bind(this);

    this.reloadRulesFromDB = this.props.reloadRulesFromDB.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.addDebug = this.addDebug.bind(this);

  }

  componentDidMount() {
    this.handleCompileConditionString();
    this.addDebug(this.props.conditions);
    // this.generateDescription()
  }
  handleTab = (tabName) => {
    this.setState({ activeTab: tabName });
  };
  // enter the state parameter. get the string value for the state parameter and pass it to ai for processing.

  /**
   * Call handleAIDescribe with a state string like description.
   * Will read the str from this.state.description
   * will call axios to handle the ai parsing and get the description from ai
   * then resetting the state value of description to the new state.
   * @param {} strStateParam
   */
  handleAIDescribe = async () => {
    let url =
      HOSTURL +
      "/openai/aicomplete?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
    // get the string you want to process and update
    let str = this.generateDescription();
    // now call axios post and once you get the value
    let valueFromAI = await axios.post(url, { conditionstring: str });

    // update the value of the state parameter.
    this.setState({ description: "<h2>Rule Definition: " + this.state.name + "</h2><br>" + valueFromAI.data });
  };

  handleSearch = (value) => {
    this.setState({ searchCriteria: value });
  };

  handleUpdateRule = () => {
    // this.setState({ showAddRuleCase: true, bannerflag: true });

    this.updateCondition(this.formRule());
  };

  addDebug(debug) {
    // this.props.handleDebug('ADD', {debug});

    this.props.handleDebug("ADD", { label: "time", data: debug }, 0);
  }

  updateCondition(condition) {
    const {
      responseVariables,
      name,
      ruleId,
      message,
      actionType,
      params,
      active,
      validationType,
      action,
      conditionStringObject,
      description,
      rulePriority,
    } = this.state;

    let rowData = {
      parsed_rule: condition,
      description,
      id: ruleId,
      data: condition,
      responseVariables,
      name,
      ruleId,
      message,
      actionType,
      params,
      active,
      validationType,
      action,
      conditionStringObject,
      rulePriority,
      key: this.props.decisionIndex,
    };
    // this.addDebug({ rowData, log: 'line 261 in ruleeditor' })

    this.props.performCrudOperations(
      "update",
      this.props.decisionIndex,
      rowData
    );
  }

  removeCase(decisionIndex) {
    this.props.handleDecision("REMOVECONDITION", { decisionIndex });
  }

  removeDecisions(outcome) {
    this.props.handleDecision("REMOVEDECISIONS", { outcome });
  }

  handleReset() {
    this.props.handleDecision("RESET");
  }
  //NK FILTER
  filterOutcomes = () => {
    const { searchCriteria } = this.state;
    const { outcomes } = this.props;
    let filteredOutcomes = {};
    Object.keys(outcomes).forEach((key) => {
      if (isContains(key, searchCriteria)) {
        filteredOutcomes[key] = outcomes[key];
      }
    });
    return filteredOutcomes;
  };

  onChangeOutcomeValue(e, type) {
    const outcome = { ...this.state.outcome };
    outcome[type] = e.target.value;
    this.setState({ ruleId });
  }
  handleChangeRuleName(name) {
    this.setState({ name });
  }
  handleChangeRuleMessage(event) {
    event.preventDefault();
    let value = event.target.value;
    this.setState({ message: value });
  }

  handleChangeActionOptions(event) {
    event.preventDefault();
    this.setState({ actionType: event.target.value });
  }

  handleServiceGUPDRadioGroup(event) {
    event.preventDefault();
    const { apiGUPType } = this.state;
    this.setState({ apiGUPType: event.target.value });
  }
  handleValidationType(validationType) {
    // event.preventDefault();
    this.setState({ validationType });
  }
  handleRulePriority(rulePriority) {
    // event.preventDefault();
    this.setState({ rulePriority });
  }

  ifThenPanel() {
    // condition, ruleId, name,message, responseVariables, actionType

    const { message, conditionStringObject } = this.state;
    const success = conditionStringObject.parseSuccess;
    const hasError = !success;

    return (
      <div>
        <div> {this.conditionPanel()} </div>
        <div className="add-field-panel ">
          <Panel className="add-field-panel" title="Then Message">
            <textarea
              style={{
                width: "100%",
                height: "75px",
                padding: "20px",
                "box-sizing": "border-box",
                border: "2px solid #ccc",
                "border-radius": "4px",
                "background-color": "#f8f8f8",
                "font-size": "16px",
                resize: "vertical",
              }}
              className="ag-theme-alpine"
              onChange={(value) => this.handleChangeRuleMessage(value)}
              value={message}
              error={hasError}
              label="Rule Message"
              placeholder="Enter the message"
              readOnly={false}
            />
          </Panel>
        </div>
      </div>
    );
  }

  addResponseVariables() {
    const { responseVariables } = this.state;
    // const newParams = responseVariables.params.concat({ pkey: '', pvalue: '' });
    responseVariables.push("");

    this.setState(responseVariables);
  }
  deleteRVActions() {
    const { responseVariables } = this.state;
    let index = responseVariables.length ? responseVariables.length : 0;
    if (index) delete responseVariables[index - 1];
    this.setState(responseVariables);
  }

  handleResponseVariables(e, type, index) {
    const { responseVariables } = this.state;
    responseVariables[index] = e.target.value;
    this.setState(responseVariables);
  }

  responseVariablesPanel() {
    const { outcome, action, responseVariables, actionType } = this.state;
    const { background } = this.context;

    return (
      <div>
        <Panel className="add-field-panel" title="Track Variables">
          <div className={`attributes-header `} style={{ margin: "20px" }}>
            <div className="attr-link" onClick={this.addResponseVariables}>
              <span className="plus-icon" />
              <span className="text">Add Response Variables</span>
            </div>
            <div className="attr-link" onClick={this.deleteRVActions}>
              <span className="plus-icon" />
              <span className="text">Delete Response Variable</span>
            </div>
          </div>

          {responseVariables &&
            responseVariables.length > 0 &&
            responseVariables.map((param, ind) => (
              <div key={ind} className="add-field-panel">
                <InputField
                  onChange={(value) =>
                    this.handleResponseVariables(value, "pvalue", ind)
                  }
                  value={param}
                  label="Variable"
                  placeholder="Enter a response variable to track..."
                />
              </div>
            ))}
        </Panel>
      </div>
    );
  }

  onToggleAPI(apiChecked) {
    if (!apiChecked)
      this.setState({
        apiSource: {
          url: "http://census.gov",
          verb: "POST",
          headers: [
            { key: "X-JBID", value: "kapoo" },
            { key: "X-API-KEY", value: "12345ABC233" },
          ],
          data: [{ key: "row", value: 3 }],
          query: [{ key: "DEBUG", value: true }],
        },
      });
    else this.setState({ apiSource: {} });
    this.setState({ apiChecked: !apiChecked });
  }

  onToggleActive(active) {
    this.setState({ active: !active });
  }
  cancelAlert = () => {

    // DOING WORK after deployrule update the states of the rules.
    this.handleUpdateRule();
    // // will reload all rules after deployrule update
    this.reloadRulesFromDB()


    this.setState({
      removeAlert: false,
      successAlert: false,
      removeDecisionAlert: false,
    });
  };
  async handleTestRule() {
    const { condition, conditionStringObject } = this.state;
    const { facts } = this.props.facts
    console.log(
      "🚀 ~ file: ruleeditor.js:508 ~ RuleEditor ~ handleTestRule ~ facts",
      facts
    );
    if (!conditionStringObject.parseSuccess) {
      alert("Error: Please fix the If-Then condition. It has a status of invalid. ");
      return;
    }

    let rules = [this.formRule()];
    let result = await processEngine([facts], rules);
    console.log(
      "🚀 ~ file: ruleeditor.js:520 ~ RuleEditor ~ handleTestRule ~ facts",
      facts
    );

    this.props.handleDebug("ADD", { label: "time", data: { result } }, 0);
  }

  generateApiDescription() {
    const { apiChecked, apiSource } = this.state;
    if (!apiChecked) return "No api has been defined.";
    return "API end point is: " + JSON.stringify(apiSource);
  }

  generateDescription() {
    const {
      condition,
      responseVariables,
      name,
      ruleId,
      message,
      actionType,
      params,
      active,
      validationType,
      action,
      conditionStringObject,
      conditionstring,
      rulePriority,
    } = this.state;

    // If:
    let description =
      "Rule " +
      name +
      ": If " +
      conditionstring +
      " then send a message: " +
      message +
      " and track these facts: " +
      JSON.stringify(responseVariables) +
      ". Also perform the following actions:" +
      JSON.stringify(action) +
      ". This rule is of type: " +
      validationType +
      ".  It has a rule priority of " +
      rulePriority +
      " on a scale of 1-10." +
      this.generateApiDescription();

    this.setState({ description });

    return description;
  }
  /**
   *
   * @returns the rule object and is not an array. used for display and running the rule
   * added a description field as a state to
   */
  formRule() {
    const {
      condition,
      responseVariables,
      name,
      ruleId,
      message,
      actionType,
      params,
      active,
      validationType,
      action,
      conditionStringObject,
      rulePriority,
      apiChecked,
      apiSource,
    } = this.state;

    this.generateApiDescription();
    if (!apiChecked) var newApiSource = {};
    else newApiSource = apiSource;
    let paramsNew = {
      ...params,
      ...{
        rvsJSON: responseVariables,
        rvs: JSON.stringify(responseVariables),
        action,
        actionType: actionType,
        message,
        apiChecked,
        apiSource: newApiSource,
      },
    };

    conditionStringObject.condition.conditions.all[0].params.conditionstring =
      this.state.conditionstring;

    const conditionNew = {
      ...condition,
      ...{
        event: {
          ruleId,
          active,
          name,
          actionType,
          validationType,
          rulePriority,
          params: paramsNew,
          type: ruleId + "",
        },
      },
      ...{ conditions: conditionStringObject.condition.conditions },
    };
    // this.state.condition
    this.setState({ condition: conditionNew });
    return conditionNew;
  }

  handleShowRuleJSON() {
    const condition = this.formRule();
    this.props.handleDebug("ADD", { label: "time", data: { condition } }, 0);
  }
  handleCancel(params) {
    this.alert("LINE 677 ")
    this.props.handleCancel()
  }

  handleChangeActionType(value) {
    this.setState({ actionType: value });
  }

  // Adding key or value to the impute panel
  handleActions(e, type, index) {
    const { action } = this.state;
    // const params = [...action.params];
    const newParams = action.map((param, ind) => {
      if (index === ind) {
        if (type === "pkey") {
          return { [e.target.value]: Object.values(param) };

          // return { ...param, : e.target.value };
        } else {
          return { [Object.keys(param)]: e.target.value };
          // return { ...param, pvalue: e.target.value };
        }
      }
      return param;
    });

    this.setState({ action: newParams });
  }

  validateAction(action) {
    this.setState({ action });
    this.handleCompileImputeObject(action);
  }

  /**
   * Build the aggregate panel built form actionactionType
   * @returns
   */
  imputeAggregatePanel() {
    const {
      params,
      actionType,
      action,
      active,
      validationType,
      rulePriority,
      apiChecked,
      actionParseObject,
    } = this.state;

    const imputeGrid = React.createRef();
    const actions = [
      {
        name: "Add",
        icon: "plus-icon",
        value: () => imputeGrid.current.addRow(),
      },
      {
        name: "Delete",
        icon: "reset-icon",
        value: () => imputeGrid.current.deleteSelectedRows(),
      },
      {
        name: "Validate",
        icon: "plus-icon",
        value: () => imputeGrid.current.reCreateActionArray(),
      },
    ];

    if (actionType === "api" || actionType === "notify") {
      return (
        <Panel
          title="Imputations and Aggregations"
          className="add-condition-panel "
        >
          <div style={{ "white-space": "normal", "text-align": "left" }}>
            <RadioGroup
              name="actionType"
              selectedValue={actionType}
              onChange={this.handleChangeActionType}
            >
              <Radio value="notify" />
              Notify
              <Radio value="impute" />
              Impute
              <Radio value="aggregate" />
              Aggregate
            </RadioGroup>
          </div>
        </Panel>
      );
    } else
      return actionType == "impute" || actionType == "aggregate" ? (
        <Panel title="Imputations and Aggregations" >
          <RadioGroup
            name="actionType"
            selectedValue={actionType}
            onChange={this.handleChangeActionType}
          >
            <Radio value="notify" />
            Notify
            <Radio value="impute" />
            Impute
            <Radio value="aggregate" />
            Aggregate
          </RadioGroup>

          {/* Add an impute table grid.  It will be passed actions which are links to add delete and validate actions */}
          <div
            className="ag-theme-alpine"
            style={{
              height: "auto",
              width: "auto",
              textAlign: "left",
              margin: "20px",
            }}
          >
            <ImputeGrid
              actions={actions}
              actionArray={action}
              actionParseObject={{
                actionParseObject: this.state.actionParseObject,
              }}
              ref={imputeGrid}
              validateAction={this.validateAction.bind(this)}
            />
          </div>
        </Panel>
      ) : (
        ""
      );
  }

  apiPanel() {
    let { actionType, apiChecked, activeAPITab, apiSource } = this.state;
    let onEdit = apiChecked,
      onAdd = apiChecked,
      onDelete = apiChecked;
    return true ? (
      <Panel title="API">
        <div id="treeWrapper">
          <ReactJson
            src={apiSource}
            displayObjectSize={false}
            displayDataTypes={false}
            onEdit={
              onEdit
                ? (e) => {
                  console.log(e);
                  this.setState({ apiSource: e.updated_src });
                }
                : false
            }
            onDelete={
              onDelete
                ? (e) => {
                  console.log(e);
                  this.setState({ apiSource: e.updated_src });
                }
                : false
            }
            onAdd={
              onAdd
                ? (e) => {
                  console.log(e);
                  let name = e.name; // header, query, body anything with key value pairs
                  let length = e.updated_src[name].length;
                  e.updated_src[name].pop();

                  e.updated_src[name].push({ key: "", value: "" });

                  this.setState({ apiSource: e.updated_src });
                }
                : false
            }
          />
        </div>
      </Panel>
    ) : (
      ""
    );
  }
  /**
     * api returns actionParseObject as
    [
      {
        "RCPT_TOT": "RCPT_TOT",
        "imputedValue": {
          "error": false,
          "message": "",
          "conditionObject": {
            "conditions": {
              "all": [
                {
                  "fact": "checkCondition",
                  "path": "$.value",
                  "operator": "equal",
                  "value": true,
                  "params": {
                    "conditionstring": "RCPT_TOT"
                  }
                }
              ]
            }
          },
          "expression": "RCPT_TOT",
          "value": true,
          "rvName": "RCPT_TOT",
          "rvValue": 3500002,
          "ruleResult": 3500002
        },
        "imputedVariable": "RCPT_TOT"
      }
    ]
    
    Pass the above to the imputeGrid and update its rvValue state with actionParseObject(apo) in the imputeGrid (method: updateActionValues for:
    
    Pass the imputeGrid of object: {[]}
    let actionValues = {}
    apo.map(a=>{actionValues = {...actionValues, ...{[a.]}}
    
    
    })
    
        this.setState({value:value})
        
        ).  
     * @param {} action 
     * @returns 
     */
  handleCompileImputeObject(action) {
    const { facts } = this.props.facts

    if (!action.length) return;

    var self = this;
    let url =
      HOSTURL +
      "/rulesrepo/actiontest?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
    try {
      let result = axios
        .post(url, { facts: [facts], action: JSON.stringify(action) })
        .then((response) => {
          let actionParseObject = response.data;
          console.log(
            "🚀 ~ file: ruleeditor.js:726 ~ RuleEditor ~ .then ~ actionParseObject",
            actionParseObject
          );
          self.setState({ actionParseObject }); // key/value/expression array of objects to display in the
        })
        .catch(function (error) {
          self.setState({ actionParseObject: error.response.data.error });
          console.log(error);
        });
    } catch (e) {
      alert(e);
    }
    return;
  }

  handleCompileConditionString() {
    const { conditionstring, conditionStringObject } = this.state;
    const { facts } = this.props.facts
    var self = this;
    // if (!facts) return;
    let url =
      HOSTURL +
      "/rulesrepo/testcondition?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo&DEBUG=false";
    try {
      let result = axios
        .post(url, { facts: [facts], conditionstring })
        .then((response) => {
          let conditionStringObject = response.data;
          self.setState({ conditionStringObject });
        })
        .catch(function (error) {
          self.setState({ conditionStringObject: error.response.data.error });
          console.log(error);
        });
    } catch (e) {
      alert(e);
    }
    return;
  }

  onChangeConditionString(event) {
    event.preventDefault();
    const conditionstring = event.target.value;
    const conditionStringObject = this.state.conditionStringObject;

    // NK Check if string is valid or not by making an axios call. Pass the string and it should return the error if any

    // conditionStringObject.condition.conditions.all[0].params.conditionstring = this.state.conditionstring
    this.setState({ conditionstring }); //, conditionStringObject })
  }

  conditionPanel() {
    const { conditionstring, outcome, conditionStringObject, facts } =
      this.state;
    const success = conditionStringObject.parseSuccess;
    const hasError = !success;

    const { background } = this.context;

    return (
      <Panel title="Specify IF Condition">
        <div
          className="add-condition-panel "
          style={{ "white-space": "normal", "text-align": "left" }}
        >
          <div>
            <textarea
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                "box-sizing": "border-box",
                border: "2px solid #ccc",
                "border-radius": "4px",
                "background-color": "#f8f8f8",
                "font-size": "16px",
                resize: "vertical",
              }}
              className="ag-theme-alpine"
              onChange={(value) => this.onChangeConditionString(value)}
              value={conditionstring}
              label="Rule Condition Error"
              placeholder="Enter the conditions"
              readOnly={false}
            />
            <div> Syntax: {success ? "Correct" : "Incorrect"}</div>
            {/* If has error then show the error in the parent.hint */}

            <div>
              Result:{" "}
              {JSON.stringify(conditionStringObject.ruleResult)}
            </div>
            {/* Show the status can be true or false based on the value       */}
            Status:{" "}
            {conditionStringObject.value
              ? JSON.stringify(conditionStringObject.value)
              : "false"}
          </div>
        </div>
        <div className="btn-group">
          {/* Calling validation */}
          <div
            className={`attributes-header ${background}`}
            style={{ margin: "20px;" }}
          >
            <div
              className="attr-link"
              onClick={this.handleCompileConditionString}
            >
              <span className="plus-icon" />
              <span className="text">Validate</span>
            </div>
          </div>
        </div>
      </Panel>
    );
  }

  showAlert(title, message, style) {
    this.setState({
      alert: (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Sí"
          cancelBtnText="No"
          confirmBtnBsStyle={style ? style : "warning"}
          cancelBtnBsStyle="default"
          customIcon="thumbs-up.jpg"
          title={title}
          onConfirm={this.hideAlert()}
          onCancel={this.hideAlert}
        >
          {message}
        </SweetAlert>
      ),
    });
  }

  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };

  alert = () => {
    return (
      <div>
        {/* {this.state.removeAlert && this.removeCaseAlert()} */}
        {this.state.removeDecisionAlert && this.removeDecisionAlert()}
        {this.state.successAlert && this.successAlert()}
      </div>
    );
  };

  cancelAlert() {
    this.setState({ successAlert: false });
  }

  successAlert = () => {
    return (
      <div style={{ width: "fit-content" }}>
        <SweetAlert
          success
          title={"Rule has been deployed successfully!! "}
          onConfirm={this.cancelAlert.bind(this)}
          onCancel={this.cancelAlert.bind(this)}
        >
          {this.state.updatedAlert}
        </SweetAlert>
      </div>
    );
  };
  /**
   * Deploy the rule
   * 1) formRule(collect all the parts of a rule)
   * 2) update the db with the data
   * 3) show the successAlert
   */
  async handleDeployRule() {
    const r = this.formRule();
    let data = {
      parsed_rule: r,
      active: this.state.active,
      type: this.state.validationType,
      data: r,
      description: this.state.description,
      name: this.state.name,
      id: Number(r.event.ruleId),
    };
    let result = await updateParsedRules(data);



    // DOING WORK after deployrule update the states of the rules.
    // this.handleUpdateRule();
    // // will reload all rules after deployrule update
    // this.props.reloadRulesFromDB()
    this.setState({
      successAlert: true,
      updatedAlert: "Rule # " + result[0].id + " was successfully deployed",
    });

    // alert("Rule # " + result[0].id + " was successfully deployed", '')
  }

  handleDescriptionChange(event) {
    event.preventDefault();
    let description = event.target.value;
    this.setState({ description: description });
  }

  handleQuillChange(description) {
    this.setState({ description: description });
  }

  modules = (id)=>{
    return {
      toolbar: {
        container: "#" + id,
        // handlers: {
        //   "insertStar": insertStar,
        // }
      }
    }
  }
  render() {
    const {
      searchCriteria,
      bannerflag,
      name,
      active,
      validationType,
      ruleId,
      actionType,
      rulePriority,
      displayRuleEditor,
      successAlert,
      apiChecked,
      outcome,
      facts,
    } = this.state;

    let disabled = !facts || facts.length === 0;

    const buttonProps = {
      primaryLabel: ruleId ? "Submit" : "Add",
      secondaryLabel: "Cancel",
    };
    const editButtonProps = {
      primaryLabel: "Update Rulecase",
      secondaryLabel: "Cancel",
    };
    const filteredOutcomes = searchCriteria
      ? this.filterOutcomes()
      : this.props.outcomes;
    const { conditions } = this.state;
    return !displayRuleEditor ? (
      <div>
        <span />
      </div>
    ) : 

      <div style={{
      
        "minWidth": "400px",
        padding: "20px",
        margin: "10px",
      }}>
        
    
      <div
        
      >
        {this.alert()}
        <div title={name}>
          {(
            <div className="btn-group">

              <Button
                label={buttonProps.primaryLabel}
                onConfirm={this.handleDeployRule}
                classname="primary-btn"
              // disabled={disabled}
              />

              <Button
                label="View"
                onConfirm={this.handleShowRuleJSON}
                // disabled={disabled}
                classname="primary-btn"
              />

              <Button
                label="Test"
                onConfirm={this.handleTestRule}
                classname="primary-btn"
              // disabled={disabled}
              />

            </div>
          )}

          <Tabs
            tabs={tabs}
            onConfirm={this.handleTab}
            activeTab={this.state.activeTab}
          />
          <div
            style={{
              height: "800px",
              "minWidth": "800px",
              padding: "20px",
              margin: "10px",
            }}
          >
            <div className="tab-page-container">
              {this.state.activeTab === "General" && (
                <div>
                  <Panel title="Enter rule name">
                    <FormExample  // Points to General Rule Form

                      name={this.state.name}
                      active={this.state.active}
                      priority={this.state.rulePriority}
                      validationType={this.state.validationType}
                      handleChangeRuleName={this.handleChangeRuleName}
                      handleRulePriority={this.handleRulePriority}
                      handleValidationType={this.handleValidationType}
                      handleToggleActive={this.onToggleActive}
                    />
                  </Panel> 
                  <Panel title="Description">
                    <EditorToolbar id={"A"+this.state.ruleId} />
                    <ReactQuill value={this.state.description} onChange={this.handleQuillChange} theme="snow"
                      // modules={modules}
                      modules={this.modules("A"+this.state.ruleId)}
                      formats={formats}
                    />

                    <div className="btn-group">
                      {" "}
                      <Button
                        label="Describe"
                        onConfirm={this.handleAIDescribe}
                        classname="primary-btn"
                      />
                    </div>
                  </Panel>
                </div>
              )}

              {this.state.activeTab === "Track" && (
                <div>{this.responseVariablesPanel()}</div>
              )}

              {this.state.activeTab === "If-Then" && (
                <div> {this.ifThenPanel()} </div>
              )}
              {this.state.activeTab === "Condition" && (
                <div> {this.conditionPanel()} </div>
              )}

              {this.state.activeTab === "API" && (
                <div>
                  {" "}
                  API Active Status{" "}
                  <ToggleButton
                    onToggle={this.onToggleAPI}
                    value={apiChecked}
                  />
                  {this.apiPanel()}
                </div>
              )}

              {this.state.activeTab === "Action" && (
                <div> {this.imputeAggregatePanel()}</div>
              )}
              {this.state.activeTab === "Settings" && <div></div>}
            </div>
          </div>
        </div>
      </div>
     
    </div>;
  }
}
RuleEditor.contextType = ApperanceContext;
RuleEditor.defaultProps = {
  submit: () => false,
  reset: () => false,
  decisions: [],
  attributes: [],
  outcomes: {},
  handleDebug: () => false,
  handleDecision: () => false,
};

RuleEditor.propTypes = {
  submit: PropTypes.func,
  reset: PropTypes.func,
  decisions: PropTypes.array,
  attributes: PropTypes.array,
  outcomes: PropTypes.object,
  handleDebug: PropTypes.func,
  handleDecision: PropTypes.func,
  hello: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  // debugData: state.ruleset.debugData
  facts: state.ruleset.rulesets[state.ruleset.activeRuleset]
});
const mapDispatchToProps = (dispatch) => ({
  handleDebug: (operation, attribute, index) =>
    dispatch(handleDebug(operation, attribute, index)),
  handleDecision: (operation, decision) =>
    dispatch(handleDecision(operation, decision)),

});

export default connect(mapStateToProps, mapDispatchToProps)(RuleEditor);
