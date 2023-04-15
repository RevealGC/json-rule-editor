import React, { Component, useRef, useMemo, useState } from 'react';

import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import Title from '../../components/title/title';
import PropTypes from 'prop-types';


import PageTitle from '../../components/title/page-title'

import styled from "styled-components";
import Panel from '../../components/panel/panel';
import ReactJson from 'react-json-view'
import Tabs from '../../components/tabs/tabs';

import { AgGridReact } from 'ag-grid-react';

import { handleDebug } from '../../actions/debug';

import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import axios from 'axios'
import InputField from '../../components/forms/input-field';
const tabs = [{ name: 'Debug' }, {name: 'Rules'}, {name:'Workflow'}];
import RulesGrid from   '../../components/decisions/RulesGrid'  //'../../components/decisions/RulesGrid' 
import ExpandingIframe from './ExpandingIframe';

// const Dotenv = require('dotenv-webpack');
const HOSTURL = 'http://cto-tasks002-ite.ite.edl.census.gov:8002'
// const HOSTURL = 'process.env.HOSTURL


//   const defaultColDef = useMemo(() => {
//     return {
//       flex: 1,
//     };
//   }, []);



function myFunction(spadId) {
    alert('Merge spadID ' + spadId)
}
function showMergeLink(params) {

    if (params.data.merge_status === 1)
        return params.data.id
    // return (`<a href="/spad/merge/{params.data.id}">{params.data.id}</a>`)
    else return 'N/A'
}
function stringifier(params) {
    return JSON.stringify(params.data.result);
}
function stringifierAggregateRules(params) {
    let valids = params.data && params.data.result && params.data.result.rules.valid ? params.data.result.rules.valid: []
    let rules = []
   valids.map((valid)=>{
        rules.push(valid.id +": "+valid.message)
 
   })
    return JSON.stringify(rules)
    return JSON.stringify(params.data.aggregate);
}
function stringifierFact(params) {
    return JSON.stringify(params.data.facts);
}


// this.props.handleDebug('ADD', { label: 'time', data: { facts: e.data.facts, aggregate:e.data.aggregate, valid:e.data.result.rules.valid , invalid:e.data.result.rules.invalid, deltaFacts: e.data.result.rules.deltaFacts } }, 0)},
class DebugContainer extends Component {

    constructor(props) {

        super(props);

        this.state = {
            activeTab: 'Debug',
        
         
            debugPanelDisplay: false, theme: { background: 'light', toggleBackground: this.toggleBackground }
        };
        this.handleReset = this.handleReset.bind(this)
    }

    componentDidMount() {
        document.body.className = this.state.theme.background;

    }

    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
        }
    }

    handleTab = (tabName) => {
        this.setState({ activeTab: tabName });
    }



    handleReset() {
        // alert("Reset debugger")
        this.props.resetDebug()
    }



 


// shows aggregates
debugPanelAttribute(data) {
    
        this.props.handleDebug('ADD', { label: 'time', data: { aggregate: data.data.aggregate  } }, 0)

    }

    debugPanelResult(data) {
        this.props.handleDebug('ADD', { label: 'time', data: { aggregate: data.data.result  } }, 0)
    }

  


    debugPanel() {
        const debugData = this.props.debugData.reverse()

        return (
            debugData.map((d, index, debugData) => {
                let collapsed = (index === 0) ? false : 1
                return (<Panel title={d.label} key={index}>
                    <ReactJson displayObjectSize={false}   key={index +'debug'} displayDataTypes={false} collapsed={collapsed}
                        src={d.data} onClick={this.handleReset} /> </Panel>
                )
            }))
    }

    render() {
        
        const { background } = this.context;

        return (
            <div >
                <div className={`attributes-header ${background}`}>
                    <div >
                        <span className="attr-link" onClick={this.props.resetDebug}>
                            <span className="reset-icon" /><span className="text">Reset</span>
                        </span>

                     
                    </div>
                </div>
                <Tabs tabs={tabs} onConfirm={this.handleTab} activeTab={this.state.activeTab} />
                <div className="tab-page-container">

                    {this.state.activeTab === 'Debug' &&
                        <div className="attr-link" >

                            {this.debugPanel()}
                        </div>}



                        {this.state.activeTab === 'Rules' && <RulesGrid />}
                        {this.state.activeTab == 'Workflow' && <ExpandingIframe src="http://cto-tasks002-ite.ite.edl.census.gov:8002:1880"/>}
                
                </div></div>)
    }
}



const mapStateToProps = (state, ownProps) => ({
    debugData: state.ruleset.debugData
});

const mapDispatchToProps = (dispatch) => ({
    resetDebug: () => dispatch(handleDebug("RESET", {}, 0)),
    handleDebug: (operation, attribute, index) => dispatch(handleDebug(operation, attribute, index))

});

export default connect(mapStateToProps, mapDispatchToProps)(DebugContainer);