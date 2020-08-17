import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import "bulma";

import Loading from "../components/Loading";

import Banner from "../assets/raid__banner-img.png";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

const Home = (props) => {
    const context = useContext(AppContext);
    const [ID, setID] = useState("");
    const [validID, updateValidID] = useState(false);

    const validateID = async () => {
        if (ID === "") return alert("ID cannot be empty!");

        context.updateLoadingState();

        let result = await fetch(
            "https://guild-keeper.herokuapp.com/raids/validate",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ID: ID,
                }),
            }
        ).then((res) => res.json());

        context.updateLoadingState();

        if (result !== "NOT_FOUND") {
            let params = {
                escrow_index: result["Escrow Index"] || "",
                raid_id: ID,
                project_name: result["Name"] || "Not Available",
                client_name: result["Your Name"] || "Not Available",
                start_date: result["Date Added"] || "Not Available",
                end_date:
                    result["Desired date of completion"] || "Not Available",
                link_to_details:
                    result["Relevant Link"] || "https://raidguild.org/",
                brief_description: result["Brief Summary"] || "Not Available",
            };

            context.setAirtableState(params);

            updateValidID(true);
        } else {
            alert("ID not found!");
        }
    };

    const registerClickHandler = async () => {
        await validateID();
        if (validID) props.history.push("/register");
    };

    const escrowClickHandler = async () => {
        await validateID();
        if (validID) props.history.push("/escrow");
    };

    let component;
    if (context.isLoading) {
        component = <Loading />;
    } else if (validID) {
        if (context.chainID.toString() !== "42") {
            component = <p>Switch to Kovan</p>;
        } else if (context.address) {
            if (context.escrow_index !== "") {
                component = (
                    <button
                        className='custom-button'
                        id='escrow'
                        onClick={escrowClickHandler}
                    >
                        View Escrow
                    </button>
                );
            } else {
                component = (
                    <button
                        className='custom-button'
                        id='register'
                        onClick={registerClickHandler}
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
                    onClick={context.connectAccount}
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
                onClick={validateID}
            >
                Validate ID
            </button>
        );
    }

    return (
        <div className='home'>
            <div className='home-sub-container'>
                <h1>LLC Raid Escrows</h1>
                {validID ? null : (
                    <input
                        type='text'
                        placeholder='Enter Raid ID'
                        onChange={(event) => setID(event.target.value)}
                    ></input>
                )}
                {component}
            </div>
            <img src={Banner} alt='Banner' />
        </div>
    );
};

export default withRouter(Home);
