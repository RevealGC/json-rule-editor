import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { TitleIcon } from '../title/page-title';
import Tabs from '../../components/tabs/tabs';

import ApperanceContext from '../../context/apperance-context';
const tabs = [{name: 'Service'}, {name: 'Headers'}, {name: 'Params'}, {name: 'Body'}];

const APIPanel = (props) => {
 
    
    return( <div><Tabs tabs={tabs} />
      <div className="tab-page-container">
    {props.activeTab === 'Headers' && <div>Verb</div>}

</div>
    
    </div>)
}

  





APIPanel.defaultProps = {
    title: undefined,
    children: {},
  };
  
APIPanel.propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
};



export default APIPanel;