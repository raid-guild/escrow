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

const { lock_instructions } = require("../utils/Constants");

const Escrow = (props) => {
    const context = useContext(AppContext);
    const [state, setState] = useState({});
    const [isData, setData] = useState(false);
    const [hash, setHash] = useState("");
    const [modal, setModal] = useState(false);

    const onDepositHandler = async () => {
        let contract = state.tokenType === "DAI" ? context.DAI : context.wETH;

        if (state.DAIBalance < context.cap && state.tokenType === "DAI")
            return alert(
                "Insufficient funds! Please add more DAI to you wallet."
            );

        let allowance = await contract.methods
            .allowance(context.address, Locker)
            .call();

        try {
            context.updateLoadingState();
            if (state.tokenType === "DAI") {
                if (allowance < context.cap) {
                    await contract.methods
                        .approve(Locker, context.cap)
                        .send({ from: context.address });
                }
                await context.locker.methods
                    .depositLocker(context.escrow_index)
                    .send({
                        from: context.address,
                    })
                    .once("transactionHash", (txHash) => {
                        context.updateLoadingState();
                        setHash(txHash);
                    });
            } else if (state.tokenType === "wETH") {
                if (state.wETHBalance >= context.cap) {
                    if (allowance < context.cap) {
                        await contract.methods
                            .approve(Locker, context.cap)
                            .send({ from: context.address });
                    }
                    await context.locker.methods
                        .depositLocker(context.escrow_index)
                        .send({
                            from: context.address,
                        })
                        .once("transactionHash", (txHash) => {
                            context.updateLoadingState();
                            setHash(txHash);
                        });
                } else {
                    await context.locker.methods
                        .depositLocker(context.escrow_index)
                        .send({
                            from: context.address,
                            value: context.cap,
                        })
                        .once("transactionHash", (txHash) => {
                            context.updateLoadingState();
                            setHash(txHash);
                        });
                }
            }
        } catch (err) {
            context.updateLoadingState();
        }
    };

    const onReleaseHandler = async () => {
        try {
            context.updateLoadingState();
            await context.locker.methods
                .release(context.escrow_index)
                .send({ from: context.address })
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
            await context.locker.methods
                .lock(context.escrow_index, "0x0")
                .send({ from: context.address })
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
            await context.locker.methods
                .withdraw(context.escrow_index)
                .send({ from: context.address })
                .once("transactionHash", (hash) => {
                    context.updateLoadingState();
                    setHash(hash);
                });
        } catch (err) {
            context.updateLoadingState();
        }
    };

    const initData = async () => {
        if (context.locker === "") return props.history.push("/");

        let frontend_cap = context.web3.utils.fromWei(context.cap, "ether");
        let frontend_released = context.web3.utils.fromWei(
            context.released,
            "ether"
        );

        let tokenType = "";
        if (context.token.toLowerCase() === KovanDAI.toLowerCase())
            tokenType = "DAI";
        if (context.token.toLowerCase() === KovanWETH.toLowerCase())
            tokenType = "wETH";

        let wETHBalance = await context.wETH.methods
            .balanceOf(context.address)
            .call();
        let DAIBalance = await context.DAI.methods
            .balanceOf(context.address)
            .call();

        setState({
            tokenType,
            DAIBalance,
            wETHBalance,
            frontend_cap,
            frontend_released,
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
    } else if (context.cap === context.released || context.locked === "1") {
        component = null;
    } else if (context.isClient) {
        if (context.confirmed === "0") {
            component = (
                <button className='custom-button' onClick={onDepositHandler}>
                    Deposit
                </button>
            );
        } else if (context.termination < new Date().getTime()) {
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
    } else {
        component = (
            <button
                style={{ margin: "3px" }}
                className='custom-button'
                onClick={() => setModal(true)}
            >
                Lock
            </button>
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
                <h2>{context.client_name}</h2>
                <h1>{context.project_name}</h1>
                <br></br>
                <p>Start: {context.start_date}</p>
                <p>Planned End: {context.end_date}</p>
                <br></br>
                <a
                    href={context.link_to_details}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Link to details of agreement
                </a>
                <p>{context.brief_description}</p>
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
                                    {Number(state.frontend_cap).toFixed(2)}{" "}
                                    {state.tokenType}
                                </span>
                            </p>
                            <p>
                                Safety Valve Withdrawal Date
                                <span>
                                    {new Date(
                                        Number(context.termination)
                                    ).toDateString()}
                                </span>
                            </p>
                            <p>
                                Arbitration Provider<span>{"LexDAO"}</span>
                            </p>
                            <p>
                                Total Released to Date
                                <span>
                                    {Number(state.frontend_released).toFixed(2)}{" "}
                                    {state.tokenType}
                                </span>
                            </p>
                        </div>
                        <div>
                            {/* <p>Next Milestone</p> */}
                            {context.confirmed === "0" ? (
                                <p style={{ color: "#ff3864" }}>
                                    Total Due to Escrow Today
                                    <span>
                                        {Number(state.frontend_cap).toFixed(2)}{" "}
                                        {state.tokenType}
                                    </span>
                                </p>
                            ) : (
                                <p style={{ color: "#ff3864" }}>
                                    {context.locked === "1"
                                        ? "Funds Locked"
                                        : context.termination <
                                          new Date().getTime()
                                        ? "Safety valve date due"
                                        : context.cap === context.released
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
            <div className={`modal ${modal ? "is-active" : null}`}>
                <div className='modal-background'></div>
                <div className='modal-content'>
                    <p>
                        Initiate a transaction{" "}
                        <a
                            href={`https://kovan.etherscan.io/address/${Locker}`}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            here
                        </a>{" "}
                        to lock funds.
                    </p>
                    <div className='points'>
                        {lock_instructions.map((instruction, index) => {
                            return <li key={index}>{instruction}</li>;
                        })}
                    </div>
                </div>
                <button
                    className='modal-close is-large'
                    aria-label='close'
                    onClick={() => setModal(false)}
                ></button>
            </div>
        </div>
    );
};

export default withRouter(Escrow);
