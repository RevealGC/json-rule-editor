import React from 'react';

function IconLinks({ links }) {
    return (
        <div style={{ display: 'flex', height: 40,  padding: '10px' }} >
            {links.map(e => {
                return (
                    <div className="attr-link" onClick={e.onClick}
                    
                    style={{ display: e.display, height: 40,  padding: '10px' }}
                    
                    onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <span className={e.className} /><span className="text">{e.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

function handleClick(event) {
    // Add your code here to handle the click event
}

function handleMouseEnter(event) {
    // Add your code here to handle the mouse enter event
}

function handleMouseLeave(event) {
    // Add your code here to handle the mouse leave event
}

export default IconLinks;