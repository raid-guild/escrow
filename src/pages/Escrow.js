import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";

import Loading from "../components/Loading";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

const {
    Locker,
    KovanDAI,
    KovanWETH,
} = require("../utils/Constants").contract_addresses;

const Escrow = (props) => {
    const context = useContext(AppContext);
    const [state, setState] = useState({});
    const [isData, setData] = useState(false);
    const [hash, setHash] = useState("");

    const onDepositHandler = async () => {
        let { address, cap, tokenType, wETHBalance } = state;
        let {
            web3,
            locker,
            DAI,
            wETH,
            escrow_index,
            updateLoadingState,
        } = context;
        let contract = tokenType === "DAI" ? DAI : wETH;
        cap = web3.utils.toWei(cap);

        try {
            updateLoadingState();
            if (tokenType === "DAI") {
                await contract.methods
                    .approve(Locker, cap)
                    .send({ from: address });
                await locker.methods
                    .depositLocker(escrow_index)
                    .send({
                        from: address,
                    })
                    .once("transactionHash", (txHash) => {
                        updateLoadingState();
                        setHash(txHash);
                    });
            } else if (tokenType === "wETH") {
                if (wETHBalance >= cap) {
                    await contract.methods
                        .approve(Locker, cap)
                        .send({ from: address });

                    await locker.methods
                        .depositLocker(escrow_index)
                        .send({
                            from: address,
                        })
                        .once("transactionHash", (txHash) => {
                            updateLoadingState();
                            setHash(txHash);
                        });
                } else {
                    await locker.methods
                        .depositLocker(escrow_index)
                        .send({
                            from: address,
                            value: cap,
                        })
                        .once("transactionHash", (txHash) => {
                            updateLoadingState();
                            setHash(txHash);
                        });
                }
            }
        } catch (err) {
            updateLoadingState();
        }
    };

    const onReleaseHandler = async () => {
        try {
            context.updateLoadingState();
            let { address } = state;
            let { locker, escrow_index } = context;
            await locker.methods
                .release(escrow_index)
                .send({ from: address })
                .once("transactionHash", (hash) => {
                    context.updateLoadingState();
                    setHash(hash);
                });
        } catch (err) {
            context.updateLoadingState();
        }
    };

    const onLockHandler = async () => {
        try {
            context.updateLoadingState();
            let { address } = state;
            let { locker, escrow_index } = context;
            await locker.methods
                .lock(escrow_index, "0x0")
                .send({ from: address })
                .once("transactionHash", (hash) => {
                    context.updateLoadingState();
                    setHash(hash);
                });
        } catch (err) {
            context.updateLoadingState();
        }
    };

    const onWithdrawHandler = async () => {
        try {
            context.updateLoadingState();
            let { address } = state;
            let { locker, escrow_index } = context;
            await locker.methods
                .withdraw(escrow_index)
                .send({ from: address })
                .once("transactionHash", (hash) => {
                    context.updateLoadingState();
                    setHash(hash);
                });
        } catch (err) {
            context.updateLoadingState();
        }
    };

    const initData = async () => {
        let {
            web3,
            wETH,
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
        released = web3.utils.fromWei(released, "ether");

        let tokenType = "";
        if (token === KovanDAI) tokenType = "DAI";
        if (token === KovanWETH) tokenType = "wETH";

        let wETHBalance = await wETH.methods.balanceOf(address).call();

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
            wETHBalance,
        });

        setData(true);
    };

    useEffect(() => {
        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let component;
    if (context.isLoading) {
        component = <Loading />;
    } else if (state.cap === state.released || state.locked === "1") {
        component = null;
    } else if (state.confirmed === "0") {
        component = (
            <button className='custom-button' onClick={onDepositHandler}>
                Deposit
            </button>
        );
    } else if (state.termination < new Date().getTime()) {
        component = (
            <button
                style={{ margin: "3px" }}
                className='custom-button'
                onClick={onWithdrawHandler}
            >
                Withdraw
            </button>
        );
    } else {
        component = (
            <div>
                <button
                    style={{ margin: "3px" }}
                    className='custom-button'
                    onClick={onReleaseHandler}
                >
                    Release
                </button>
                <button
                    style={{ margin: "3px" }}
                    className='custom-button'
                    onClick={onLockHandler}
                >
                    Lock
                </button>
            </div>
        );
    }

    return hash !== "" ? (
        <div className='success'>
            <h3>Transaction Received!</h3>
            <p>
                You can check the progress of your transaction{" "}
                <a href={`https://kovan.etherscan.io/tx/${hash}`}>here.</a>
            </p>
            <button
                className='custom-button'
                onClick={() => props.history.push("/")}
            >
                Home
            </button>
        </div>
    ) : (
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
            {!isData ? (
                Loading
            ) : (
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
                                <span>
                                    {new Date(
                                        Number(state.termination)
                                    ).toDateString()}
                                </span>
                            </p>
                            <p>
                                Arbitration Provider<span>{"LexDAO"}</span>
                            </p>
                            <p>
                                Total Released to Date
                                <span>
                                    {Number(state.released).toFixed(2)}{" "}
                                    {state.tokenType}
                                </span>
                            </p>
                        </div>
                        <div>
                            {/* <p>Next Milestone</p> */}
                            {state.confirmed === "0" ? (
                                <p style={{ color: "#ff3864" }}>
                                    Total Due to Escrow Today
                                    <span>
                                        {Math.round(state.cap)}{" "}
                                        {state.tokenType}
                                    </span>
                                </p>
                            ) : (
                                <p style={{ color: "#ff3864" }}>
                                    {state.locked === "1"
                                        ? "Funds Locked"
                                        : state.termination <
                                          new Date().getTime()
                                        ? "Safety valve date due"
                                        : state.cap === state.released
                                        ? "All funds released"
                                        : "Release Milestone funds"}

                                    {/* <span>
                                    {state.locked} {state.tokenType}
                                </span> */}
                                </p>
                            )}
                        </div>
                    </div>
                    {component}
                </div>
            )}
        </div>
    );
};

export default withRouter(Escrow);
