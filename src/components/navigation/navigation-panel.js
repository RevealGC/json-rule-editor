import React, { useState, Component } from 'react';
import NavLinks from './navigation-link';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadRuleset, uploadDBRuleset } from '../../actions/ruleset';

import { createHashHistory } from 'history';
import FooterLinks from '../footer/footer';
import footerLinks from '../../data-objects/footer-links.json';
import AppearanceContext from '../../context/apperance-context';
import axios from 'axios'


// const Dotenv = require('dotenv-webpack');
const HOSTURL='http://localhost'
// const HOSTURL = 'process.env.HOSTURL

import Search from '../search/dbSearch'


import { setsearchRIDText } from '../../actions/app';

const navmenu = [{ name: 'Create Rules', navigate: './create-ruleset', iconClass: "icon fa fa-plus-square-o", linkClass: 'navmenu'},
                 { name: 'Upload Rules', navigate: './home', iconClass: "icon fa fa-cloud-upload", linkClass: 'navmenu' },
                { name: 'Appearance', navigate: './appearance', iconClass: "icon fa fa-sliders", linkClass: 'navmenu'} ];
class NavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {links: [], dbSearchText: '8771348140'};
        this.handleNavLink = this.handleNavLink.bind(this);
        this.handleNavBtn = this.handleNavBtn.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.loadRuleSet = this.loadRuleSet.bind(this);
    
    }

   
    handleNavBtn() {
        const history = createHashHistory();
        history.push('./create-ruleset');
    }

    handleNavLink(name) {
        const history = createHashHistory();
        this.props.setActiveRulesetIndex(name);
        history.push('./ruleset');
        // close the left panel.
this.props.updateState("closed")

    }
    handleSearch(e){
      
        this.setState({dbSearchText:e})
        this.props.setsearchRIDText(e)
        
    }
   async loadRuleSet(){
        // now call axios to get data from  http://localhost/rulesrepo/factsandrules/8771348140?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo
        let url = HOSTURL+'/rulesrepo/factsandrules/'+this.state.dbSearchText+'?X-API-KEY=x5nDCpvGTkvHniq8wJ9m&X-JBID=kapoo'
        try{
        let result = await axios.get(url)
        let ruleSet = result.data
        this.props.uploadRuleset(result.data)



        }
        catch(e){
            alert(e)
        }



    }
    render() {
        const { closedState, loggedIn } = this.props;
        const val = this.state.dbSearchText || '8771348140'
        
        let rulesetLink = this.props.rulenames.length > 0 ?
         [{ name: 'Ruleset', sublinks: this.props.rulenames, iconClass:"rules-icon", linkClass: 'link-heading'}] : [];

        rulesetLink = rulesetLink.concat(navmenu);

        let sideNav = loggedIn && closedState ? 'open' : 'closed';

        let appctx = this.context;

        return (
            <div className={`nav-container ${closedState ? 'closed': 'open'} ${appctx.background}`}>
                <div className="menu-bar">
                       <a href="" onClick={(e) => { e.preventDefault();  this.props.updateState(sideNav)}}> <span className="close-icon fa fa-reorder" ></span></a>
                </div>
                {!closedState && <div className="links-section">

                <div><Search 
                
                value=  {this.state.dbSearchText }
                onConfirm={this.handleSearch} 
                onChange={this.handleSearch}/>
                <div className="btn-container">
                    <button className="btn primary-btn" type="submit" onClick={this.loadRuleSet}>Load Ruleset</button>
                    </div>
                    </div>



                    <div>
                        <NavLinks links={rulesetLink} onConfirm={this.handleNavLink} activeIndex={this.props.activeIndex}/>
                    </div>
                    <div className="footer-container sidenav">
                        <FooterLinks links={footerLinks} />
                    </div>
                 </div>
                }
            </div>
        )
    }
}

NavigationPanel.contextType = AppearanceContext;

NavigationPanel.defaultProps = {
    closedState: false,
    rulenames: [],
    setActiveRulesetIndex: () => false,
    loggedIn: false,
    updateState: () => false,
    activeIndex: 0,
    setsearchRIDText: () => false,
    uploadDBRuleset: () => false,
};

NavigationPanel.propTypes = {
    closedState: PropTypes.bool,
    rulenames: PropTypes.array,
    setActiveRulesetIndex: PropTypes.func,
    loggedIn: PropTypes.bool,
    updateState: PropTypes.func,
    activeIndex: PropTypes.number,
    setsearchRIDText: PropTypes.func,
    uploadDBRuleset: PropTypes.func
  
}
const mapStateToProps = (state) => ({
   
  });


  const mapDispatchToProps = (dispatch) => ({

    
    uploadRuleset: (ruleset) =>  dispatch(uploadRuleset(ruleset)),
    uploadDBRuleset : (ruleset) => dispatch(uploadDBRuleset(ruleset))
  
  });
  

export default connect(mapStateToProps, mapDispatchToProps)(NavigationPanel);