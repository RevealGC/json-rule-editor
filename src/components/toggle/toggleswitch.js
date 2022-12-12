import React from "react";
import "./ToggleSwitch.css";


const ToggleSwitch = ({ label, value }) => {
  
    return (
        <div className="container">
            {label}{" "}
            {value}{ }
            <div className="toggle-switch">

                {value ? <input type="checkbox" className="checkbox"
                    name={label} id={label} checked /> :

                    <input type="checkbox" className="checkbox"
                        name={label} id={label} />
                }
                <label className="label" htmlFor={label}>
                    <span className="inner" />
                    <span className="switch" />
                </label>
            </div>
        </div>
    );
};

export default ToggleSwitch;
