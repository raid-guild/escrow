import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import "bulma";

import HomeButtonManager from "../utils/HomeButtonManager";

import Banner from "../assets/raid__banner-img.png";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

const Home = (props) => {
    const context = useContext(AppContext);
    const [ID, setID] = useState("");
    const [validId, setValidId] = useState(false);

    const validateID = async () => {
        if (ID === "") return alert("ID cannot be empty!");

        context.updateLoadingState();

        let result = await context.setAirtableState(ID);

        setValidId(result.validRaidId);

        context.updateLoadingState();

        if (!result.validRaidId) alert("ID not found!");
    };

    const registerClickHandler = async () => {
        await validateID();
        if (validId) props.history.push("/register");
    };

    const escrowClickHandler = async () => {
        await validateID();
        if (validId) props.history.push("/escrow");
    };

    let button_component = HomeButtonManager(
        context,
        validId,
        escrowClickHandler,
        registerClickHandler,
        validateID
    );

    return (
        <div className='home'>
            <div className='home-sub-container'>
                <h1>RaidGuild Payment Escrow</h1>
                {validId ? null : (
                    <input
                        type='text'
                        placeholder='Enter Raid ID'
                        onChange={(event) => setID(event.target.value)}
                    ></input>
                )}
                {button_component}
            </div>
            <img src={Banner} alt='Banner' />
        </div>
    );
};

export default withRouter(Home);
