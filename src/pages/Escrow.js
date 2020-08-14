import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

const {
    KovanDAI,
    KovanWETH,
} = require("../utils/Constants").contract_addresses;

const Escrow = (props) => {
    const context = useContext(AppContext);
    const [state, setState] = useState({});

    const onDepositHandler = async () => {
        let { address, cap, tokenType } = state;
        let { web3, locker, DAI, wETH, escrow_index } = context;
        let contract = tokenType === "DAI" ? DAI : wETH;

        await locker.methods.depositLocker(escrow_index).send({
            from: address,
            data: contract.methods.transfer(
                "0xd53B46aE3781904F1f61CF38Fd9d4F47A7e9242B",
                web3.utils.toWei(cap)
            ),
        });
    };

    useEffect(() => {
        const initData = async () => {
            let {
                web3,
                address,
                locker,
                escrow_index,
                client_name,
                project_name,
                start_date,
                end_date,
                link_to_details,
                brief_description,
                isClient,
            } = context;
            if (locker === "") return props.history.push("/");

            let result = await locker.methods.lockers(escrow_index).call();
            let {
                cap,
                confirmed,
                locked,
                released,
                resolver,
                token,
                termination,
            } = result;
            cap = web3.utils.fromWei(cap, "ether");
            locked = web3.utils.fromWei(locked, "ether");
            released = web3.utils.fromWei(released, "ether");
            termination = new Date(Number(termination)).toDateString();

            let tokenType = "";
            if (token === KovanDAI) tokenType = "DAI";
            if (token === KovanWETH) tokenType = "wETH";

            setState({
                address,
                cap,
                confirmed,
                locked,
                released,
                resolver,
                token,
                tokenType,
                termination,
                client_name,
                project_name,
                start_date,
                end_date,
                link_to_details,
                brief_description,
                isClient,
            });
        };
        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='escrow'>
            <div className='escrow-sub-container-one'>
                <h2>{state.client_name}</h2>
                <h1>{state.project_name}</h1>
                <br></br>
                <p>Start: {state.start_date}</p>
                <p>Planned End: {state.end_date}</p>
                <br></br>
                <a
                    href={state.link_to_details}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Link to details of agreement
                </a>
                <p>{state.brief_description}</p>
            </div>
            <div className='escrow-sub-container-two'>
                <div className='card'>
                    <div>
                        <p>
                            Total Project Payment
                            <span>
                                {Math.round(state.cap)} {state.tokenType}
                            </span>
                        </p>
                        <p>
                            Safety Valve Withdrawal Date
                            <span>{state.termination}</span>
                        </p>
                        <p>
                            Arbitration Provider<span>{"LexDAO"}</span>
                        </p>
                        <p>
                            Total Released to Date
                            <span>
                                {state.released} {state.tokenType}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p>Next Milestone</p>
                        {state.confirmed === "0" ? (
                            <p style={{ color: "#ff3864" }}>
                                Total Due to Escrow Today
                                <span>
                                    {Math.round(state.cap)} {state.tokenType}
                                </span>
                            </p>
                        ) : (
                            <p style={{ color: "#ff3864" }}>
                                Next Amount to Release/Withdraw
                                <span>
                                    {state.locked} {state.tokenType}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
                {!state.isClient ? (
                    <button className='deposit-button'>Lock</button>
                ) : state.confirmed === "0" ? (
                    <button
                        className='deposit-button'
                        onClick={onDepositHandler}
                    >
                        Deposit
                    </button>
                ) : (
                    <div>
                        <button
                            style={{ margin: "3px" }}
                            className='deposit-button'
                        >
                            Release
                        </button>
                        <button
                            style={{ margin: "3px" }}
                            className='deposit-button'
                        >
                            Lock
                        </button>
                        <button
                            style={{ margin: "3px" }}
                            className='deposit-button'
                        >
                            Withdraw
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withRouter(Escrow);
