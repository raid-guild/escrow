import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "bulma";

import Loading from "../components/Loading";

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
        const { setAirtableState, updateLoadingState } = this.context;

        if (this.state.ID === "") return alert("ID cannot be empty!");

        updateLoadingState();

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

        updateLoadingState();

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
                brief_description: result["Brief Summary"] || "Not Available",
            };

            setAirtableState(params);

            this.setState({ validID: true });
        } else {
            alert("ID not found!");
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

    render() {
        let {
            address,
            chainID,
            escrow_index,
            isLoading,
            connectAccount,
        } = this.context;
        let component;

        if (isLoading) {
            component = <Loading />;
        } else if (this.state.validID) {
            if (chainID.toString() !== "42") {
                component = <p>Switch to Kovan</p>;
            } else if (address) {
                if (escrow_index !== "") {
                    component = (
                        <button
                            className='custom-button'
                            id='escrow'
                            onClick={this.escrowClickHandler}
                        >
                            View Escrow
                        </button>
                    );
                } else {
                    component = (
                        <button
                            className='custom-button'
                            id='register'
                            onClick={this.registerClickHandler}
                        >
                            Register Escrow
                        </button>
                    );
                }
            } else {
                component = (
                    <button
                        className='custom-button'
                        id='connect'
                        style={{ margin: 0 }}
                        onClick={connectAccount}
                    >
                        Connect Wallet
                    </button>
                );
            }
        } else {
            component = (
                <button
                    className='custom-button'
                    style={{ margin: 0 }}
                    onClick={this.validateID}
                >
                    Validate ID
                </button>
            );
        }

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
                    {component}
                </div>
                <img src={Banner} alt='Banner' />
            </div>
        );
    }
}

export default withRouter(Home);
