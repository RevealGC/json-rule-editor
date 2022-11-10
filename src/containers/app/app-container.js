import React, { Component } from 'react';

import { connect } from 'react-redux';
import Title from '../../components/title/title';
import NavigationPanel from '../../components/navigation/navigation-panel';
import AppRoutes from '../../routes/app-routes';
import PropTypes from 'prop-types';
import { updateRulesetIndex } from '../../actions/ruleset';
import { setsearchRIDText, updateState } from '../../actions/app';
import { createHashHistory } from 'history';
import ApperanceContext from '../../context/apperance-context';
import Button from "../../components/button/button"



import { SplitPane } from "react-collapse-pane";


import styled from "styled-components";
import Panel from '../../components/panel/panel';
import ReactJson from 'react-json-view'

const Wrapper = styled.div`
  .Resizer {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Pane {
  
    overflow:auto;
  }
 
`;





class ApplicationContainer extends Component {

    constructor(props) {
        super(props);
        const history = createHashHistory();
        this.setsearchRIDText = this.setsearchRIDText.bind(this)
        if (!this.props.loggedIn) {
            history.push('./home');
        }
        this.toggleBackground = (value) => {
            const theme = { ...this.state.theme, background: value };
            document.body.className = value;
            this.setState({ theme });
        }
        this.state = { debugPanelDisplay: false, theme: { background: 'light', toggleBackground: this.toggleBackground } };
    }

    componentDidMount() {
        document.body.className = this.state.theme.background;
    }

    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
        }
    }


    setsearchRIDText(e) {

    }

    render() {
        const closednav = this.props.navState !== 'open';
        const {debugPanelDisplay} = this.state
        const debugData = this.props.debugData
        return (




            <React.Fragment>
                <ApperanceContext.Provider value={this.state.theme}>
                   

                   
            <Wrapper>
               
                            <SplitPane split="vertical" collapsedSizes={['85%', '15%']}  minSize={250}   >
                       <div style={{overflow:'auto'}} > 
                       <Title title={'QBES: Rule Editor'} />
                        <NavigationPanel closedState={closednav}
                                updateState={this.props.updateState}
                                setsearchRIDText={this.props.setsearchRIDText}
                                activeIndex={this.props.activeIndex}
                                rulenames={this.props.rulenames} setActiveRulesetIndex={this.props.setActiveRulesetIndex} loggedIn={this.props.loggedIn} />
                        
                        
                       
                            <AppRoutes closedState={closednav} loggedIn={this.props.loggedIn} appctx={this.state.theme} />
                            </div>  

                    
                          
                            <div>
                            <Title title={'Debugger'} />
                            <div className="attr-link" onClick={this.handleReset}>
                 <span className="reset-icon" /><span className="text">Reset</span> 
            </div>
                   
                        {
                      
                        debugData.map(d=> {return( <Panel title={d.label}>  <ReactJson collapsed={false} src={d.data}  /> </Panel>
                        
                       )})
              
                        }
                        </div>
                    
                     
                      
                    </SplitPane>
            
                    </Wrapper>    

                </ApperanceContext.Provider>
            </React.Fragment>
        )
    }
}

ApplicationContainer.defaultProps = {
    rulenames: [],
    debugData: [],
    setActiveRulesetIndex: () => false,
    navState: undefined,
    activeIndex: 0,
    loggedIn: false,
    updateState: () => false,
    setsearchRIDText: () => false,
};

ApplicationContainer.propTypes = {
    rulenames: PropTypes.array,
    setActiveRulesetIndex: PropTypes.func,
    navState: PropTypes.string,
    loggedIn: PropTypes.bool,
    updateState: PropTypes.func,
    activeIndex: PropTypes.number,
    setsearchRIDText: PropTypes.func,
    debugData: PropTypes.array
}


const mapStateToProps = (state, ownProps) => ({
    navState: state.app.navState,
    rulenames: state.ruleset.rulesets.map(r => r.name),
    loggedIn: state.app.loggedIn,
    activeIndex: state.ruleset.activeRuleset,
    ownProps,
    debugData: state.ruleset.debugData
});

const mapDispatchToProps = (dispatch) => ({
    handleClick: () => {
        return false;
    },
    setActiveRulesetIndex: (name) => dispatch(updateRulesetIndex(name)),
    updateState: (val) => dispatch(updateState(val)),
    setsearchRIDText: (val) => dispatch(setsearchRIDText(val))

});

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);