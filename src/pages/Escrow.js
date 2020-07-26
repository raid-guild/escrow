import React, { Component } from "react";

import "../styles/CSS/Pages.css";

class Escrow extends Component {
    state = {};
    render() {
        return (
            <div className='escrow'>
                <div className='escrow-sub-container-one'>
                    <h2>Client Name</h2>
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
                <div className='escrow-sub-container-two'>
                    <div className='card'>
                        <div>
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
                        <div>
                            <p>
                                Next Milestone<span>{"Milestone #1"}</span>
                            </p>
                            <p style={{ color: "#ff3864" }}>
                                Total Due to Escrow Today
                                <span>{"10,000 DAI"}</span>
                            </p>
                        </div>
                    </div>
                    <button className='deposit-button'>Deposit</button>
                </div>
            </div>
        );
    }
}

export default Escrow;
