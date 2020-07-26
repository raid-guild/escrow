import React from "react";

import Logo from "../assets/raidguild__logo.png";

const nav = [
    {
        name: "Manifesto",
        link: "https://raidguild.org/#manifesto",
    },
    {
        name: "Portfolio",
        link: "https://raidguild.org/",
    },
    {
        name: "Services",
        link: "https://raidguild.org/#services",
    },
    {
        name: "Join",
        link: "https://raidguild.org/join",
    },
    {
        name: "Hire",
        link: "https://raidguild.org/hire",
    },
];

const Header = () => {
    return (
        <>
            <img id='logo' src={Logo} alt='logo' />
            <nav className='hamburger'>
                <i className='fas fa-bars fa-3x'></i>
            </nav>
            <ul className='nav-links'>
                {nav.map((item) => {
                    return (
                        <li>
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
        </>
    );
};

export default Header;
