import React from "react";

const Footer = () => {
    return (
        <footer>
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
                <i class='fas fa-book fa-1x'></i>
            </a>
            <a
                href='https://github.com/raid-guild'
                target='_blank'
                rel='noopener noreferrer'
            >
                <i className='fab fa-github fa-1x'></i>
            </a>
        </footer>
    );
};

export default Footer;
