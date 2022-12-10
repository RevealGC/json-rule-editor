import React, {useState} from 'react';
import PropTypes from 'prop-types';

const DBSearch = ({onChange}) => {

    const [dbSearch, setDBSearch] = useState('8771348140');

    const handleSearch = (e) => {
        setDBSearch(e.target.value);
        onChange(e.target.value);
    };

    return (<div className="search-container">
        <input type="text" onChange={handleSearch} 
        className="search-field" value={dbSearch} 
        placeholder="Search by id..." />
    </div>);
};

DBSearch.defaultProps = ({
    value: '',
    onChange: () => false,
});

DBSearch.propTypes = ({
    value: PropTypes.string,
    onChange: PropTypes.func,
});

export default DBSearch;