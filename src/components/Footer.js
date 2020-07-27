import React from "react";

import "../styles/css/Components.css";
import "../styles/css/ResponsiveComponents.css";

const Footer = () => {
    return (
        <div className='custom-footer'>
            <a
                href='https://twitter.com/raidguild'
                target='_blank'
                rel='noopener noreferrer'
            >
                <i className='fab fa-twitter fa-1x'></i>
            </a>
            <a
                href='https://handbook.raidguild.org/'
                target='_blank'
                rel='noopener noreferrer'
            >
                <i className='fas fa-book fa-1x'></i>
            </a>
            <a
                href='https://github.com/raid-guild'
                target='_blank'
                rel='noopener noreferrer'
            >
                <i className='fab fa-github fa-1x'></i>
            </a>
        </div>
    );
};

export default Footer;
