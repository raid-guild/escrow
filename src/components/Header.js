import React from "react";
import { withRouter } from "react-router-dom";

import Logo from "../assets/raidguild__logo.png";

import "../styles/css/Components.css";
import "../styles/css/ResponsiveComponents.css";

const { nav_items } = require("../utils/Constants");

const Header = (props) => {
    return (
        <div className='custom-header'>
            <img
                id='logo'
                src={Logo}
                alt='logo'
                onClick={() => props.history.push("/")}
            />
            <nav className='hamburger'>
                <i className='fas fa-bars fa-3x'></i>
            </nav>
            <ul className='nav-links'>
                {nav_items.map((item, index) => {
                    return (
                        <li key={index}>
                            <a
                                href={item.link}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {item.name}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default withRouter(Header);
