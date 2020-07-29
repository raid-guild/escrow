import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Banner from "../assets/raid__banner-img.png";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

class Home extends Component {
    state = {
        ID: "",
        validID: false,
    };

    static contextType = AppContext;

    validateID = async () => {
        const { setAirtableState } = this.context;

        if (this.state.ID) {
            let result = await fetch(
                "https://guild-keeper.herokuapp.com/raids/validate",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ID: this.state.ID,
                    }),
                }
            ).then((res) => res.json());

            if (result !== "NOT_FOUND") {
                let params = {
                    escrow_index: result["Escrow Index"] || "",
                    raid_id: this.state.ID,
                    project_name: result["Name"] || "Not Available",
                    client_name: result["Your Name"] || "Not Available",
                    start_date: result["Date Added"] || "Not Available",
                    end_date:
                        result["Desired date of completion"] || "Not Available",
                    link_to_details:
                        result["Relevant Link"] || "https://raidguild.org/",
                    brief_description:
                        result["Brief Summary"] || "Not Available",
                };

                setAirtableState(params);

                this.setState({ validID: true });
            } else {
                let { error_message } = this.state;
                error_message.style.visibility = "visible";
                setTimeout(() => {
                    error_message.style.visibility = "hidden";
                }, 5000);
            }
        }
    };

    onChangeHandler = (event) => {
        this.setState({ ID: event.target.value });
    };

    registerClickHandler = async () => {
        await this.validateID();
        if (this.state.validID) this.props.history.push("/register");
    };

    escrowClickHandler = async () => {
        await this.validateID();
        if (this.state.validID) this.props.history.push("/escrow");
    };

    componentDidMount() {
        let error_message = document.querySelector("#error-message");
        error_message.style.visibility = "hidden";
        this.setState({ error_message });
    }

    render() {
        let { address, isClient, connectAccount } = this.context;
        return (
            <div className='home'>
                <div className='home-sub-container'>
                    <h1>LLC Raid Escrows</h1>

                    {this.state.validID ? null : (
                        <input
                            type='text'
                            placeholder='Enter Raid ID'
                            onChange={(event) => this.onChangeHandler(event)}
                        ></input>
                    )}

                    <p id='error-message'>ID not found!</p>

                    {this.state.validID ? (
                        address ? (
                            isClient ? (
                                <button
                                    className='custom-button'
                                    id='escrow'
                                    onClick={this.escrowClickHandler}
                                >
                                    View Escrow
                                </button>
                            ) : (
                                <div>
                                    <button
                                        className='custom-button'
                                        id='register'
                                        onClick={this.registerClickHandler}
                                    >
                                        Register Escrow
                                    </button>
                                    <button
                                        className='custom-button'
                                        id='escrow'
                                        onClick={this.escrowClickHandler}
                                    >
                                        View Escrow
                                    </button>
                                </div>
                            )
                        ) : (
                            <button
                                className='custom-button'
                                id='connect'
                                style={{ margin: 0 }}
                                onClick={connectAccount}
                            >
                                Connect Wallet
                            </button>
                        )
                    ) : (
                        <button
                            className='custom-button'
                            style={{ margin: 0 }}
                            onClick={this.validateID}
                        >
                            Validate ID
                        </button>
                    )}
                </div>

                <img src={Banner} alt='Banner' />
            </div>
        );
    }
}

export default withRouter(Home);
