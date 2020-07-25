import React, { Component } from "react";
import "./App.css";

import Logo from "./assets/raidguild__logo.png";

class App extends Component {
    componentDidMount() {
        const hamburger = document.querySelector(".hamburger");
        const navLinks = document.querySelector(".nav-links");
        const links = document.querySelectorAll(".nav-links li");

        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            links.forEach((link) => {
                link.classList.toggle("fade");
            });
        });
    }
    render() {
        return (
            <div className='main'>
                <img id='logo' src={Logo} alt='logo' />
                <nav className='hamburger'>
                    <i className='fas fa-bars fa-3x'></i>
                </nav>
                <ul className='nav-links'>
                    <li>
                        <a
                            href='https://raidguild.org/#manifesto'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Manifesto
                        </a>
                    </li>
                    <li>
                        <a
                            href='https://raidguild.org/'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Portfolio
                        </a>
                    </li>
                    <li>
                        <a
                            href='https://raidguild.org/#services'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Services
                        </a>
                    </li>
                    <li>
                        <a
                            href='https://raidguild.org/join'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Join
                        </a>
                    </li>
                    <li>
                        <a
                            href='https://raidguild.org/hire'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Hire
                        </a>
                    </li>
                </ul>

                <div className='container'>
                    <div className='project'>
                        <p id='client-name'>Client Name</p>
                        <h1>Project Name</h1>
                        <br></br>
                        <p>Start: {"August 1, 2020"}</p>
                        <p>Planned End: {"October 31, 2020"}</p>
                        <br></br>
                        <a
                            href='https://raidguild.org/'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Link to details of agreement
                        </a>
                        <p>Brief description of the project</p>
                    </div>
                    <div className='escrow'>
                        <div className='card'>
                            <div className='top'>
                                <p>
                                    Total Project Payment<span>10,000 DAI</span>
                                </p>
                                <p>
                                    Per Milestone Payment<span>5,000 DAI</span>
                                </p>
                                <p>
                                    Safety Valve Withdrawal Date
                                    <span>{"Nov 30, 2020"}</span>
                                </p>
                                <p>
                                    Arbitration Provider<span>{"LexDAO"}</span>
                                </p>
                            </div>
                            <div className='bottom'>
                                <p>
                                    Next Milestone<span>{"Milestone #1"}</span>
                                </p>
                                <p style={{ color: "#ff3864" }}>
                                    Total Due to Escrow Today
                                    <span>{"10,000 DAI"}</span>
                                </p>
                            </div>
                        </div>
                        <button className='deposit'>Deposit</button>
                    </div>
                </div>
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
            </div>
        );
    }
}

export default App;
