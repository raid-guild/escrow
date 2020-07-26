import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Banner from "../assets/raid__banner-img.png";

import "../styles/CSS/Pages.css";

class Home extends Component {
    state = {};
    render() {
        return (
            <div className='home'>
                <div className='home-sub-container'>
                    <h1>LLC Raid Escrows</h1>
                    <input type='number' placeholder='Enter Raid ID'></input>
                    <div className='home-button-container'>
                        <button
                            className='custom-button'
                            onClick={() => this.props.history.push("/register")}
                        >
                            Register Escrow
                        </button>
                        <button
                            className='custom-button'
                            onClick={() => this.props.history.push("/escrow")}
                        >
                            View Escrow
                        </button>
                    </div>
                </div>
                <img src={Banner} alt='Banner' />
            </div>
        );
    }
}

export default withRouter(Home);
