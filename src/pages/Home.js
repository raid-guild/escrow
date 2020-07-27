import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Banner from "../assets/raid__banner-img.png";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AirtableContext } from "../context/AirtableContext";

class Home extends Component {
    state = {
        ID: "",
    };

    static contextType = AirtableContext;

    validateID = async () => {
        const { setAirtableState } = this.context;

        let result = await fetch("https://guild-keeper.herokuapp.com/raids", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ID: this.state.ID,
            }),
        }).then((res) => res.json());

        let params = {
            raid_id: this.state.ID,
            project_name: result["Name"] || "Not Available",
            client_name: result["Your Name"] || "Not Available",
            start_date: result["Date Added"] || "Not Available",
            end_date: result["Desired date of completion"] || "Not Available",
            link_to_details:
                result["Relevant Link"] || "https://raidguild.org/",
            brief_description: result["Brief Summary"] || "Not Available",
        };

        setAirtableState(params);

        return result;
    };

    onChangeHandler = (event) => {
        this.setState({ ID: event.target.value });
    };

    componentDidMount() {
        let register_button = document.querySelector("#register");
        let escrow_button = document.querySelector("#escrow");
        let error_message = document.querySelector("#error-message");

        error_message.style.visibility = "hidden";

        register_button.addEventListener("click", async () => {
            let result = await this.validateID();
            if (result === "NOT_FOUND") {
                error_message.style.visibility = "visible";
                setTimeout(() => {
                    error_message.style.visibility = "hidden";
                }, 5000);
            } else {
                this.props.history.push("/register");
            }
        });

        escrow_button.addEventListener("click", async () => {
            let result = await this.validateID();
            if (result === "NOT_FOUND") {
                error_message.style.visibility = "visible";
                setTimeout(() => {
                    error_message.style.visibility = "hidden";
                }, 5000);
            } else {
                this.props.history.push("/escrow");
            }
        });
    }

    render() {
        return (
            <div className='home'>
                <div className='home-sub-container'>
                    <h1>LLC Raid Escrows</h1>
                    <input
                        type='text'
                        placeholder='Enter Raid ID'
                        onChange={(event) => this.onChangeHandler(event)}
                    ></input>
                    <p id='error-message'>ID not found!</p>
                    <div className='home-button-container'>
                        <button className='custom-button' id='register'>
                            Register Escrow
                        </button>
                        <button className='custom-button' id='escrow'>
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
