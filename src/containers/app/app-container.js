import React, { Component } from 'react';
import { SplitPane } from "react-collapse-pane";
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

import Panel from '../../components/panel/panel';
import ReactJson from 'react-json-view'

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
                    <Title title={'QBES: Rule Editor'} />
                    <SplitPane split="vertical" collapseOptions={{ beforeToggleButton: <Button>⬅</Button>, afterToggleButton: <Button>➡</Button>, overlayCss: { backgroundColor: "green" }, buttonTransition: "zoom", buttonPositionOffset: -20, collapsedSize: 10, collapseTransitionTimeout: 350, }} resizerOptions={{ css: { width: '1px', background: 'rgba(0, 0, 0, 0.1)', }, hoverCss: { width: '3px', background: '1px solid rgba(102, 194, 255, 0.5)', }, grabberSize: '1rem', }}>
                        <div>

                            <NavigationPanel closedState={closednav}
                                updateState={this.props.updateState}
                                setsearchRIDText={this.props.setsearchRIDText}
                                activeIndex={this.props.activeIndex}
                                rulenames={this.props.rulenames} setActiveRulesetIndex={this.props.setActiveRulesetIndex} loggedIn={this.props.loggedIn} />
                            <AppRoutes closedState={closednav} loggedIn={this.props.loggedIn} appctx={this.state.theme} />


                        </div>
                     <div>{
                        debugData.map(d=> {return(<div> <Panel title={d.label}>  <ReactJson collapsed={false} src={d.data}  /> </Panel>
                        
                        </div>)}) }
                        </div> 
                    </SplitPane>


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