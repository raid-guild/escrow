import React, { useState, useEffect, useContext } from "react";
import { withRouter, useParams } from "react-router-dom";

import { AppContext } from "../context/AppContext";

import Loading from "../components/Loading";
import Success from "../components/Success";
import Instructions from "../components/Instructions";

import EscrowButtonManager from "../utils/EscrowButtonManager";
import EscrowCalc from "../utils/EscrowCalc";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

const { Locker } = require("../utils/Constants").contract_addresses;

const Escrow = (props) => {
    const context = useContext(AppContext);
    const [state, setState] = useState({});
    const [isData, setData] = useState(false);
    const [hash, setHash] = useState("");
    const [modal, setModal] = useState(false);
    const { id } = useParams();

    const onDepositHandler = async () => {
        let contract = state.tokenType === "DAI" ? context.DAI : context.wETH;

        if (
            Number(state.DAIBalance) < Number(context.cap) &&
            state.tokenType === "DAI"
        )
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
                    .confirmLocker(context.escrow_index)
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
                        .confirmLocker(context.escrow_index)
                        .send({
                            from: context.address,
                        })
                        .once("transactionHash", (txHash) => {
                            context.updateLoadingState();
                            setHash(txHash);
                        });
                } else {
                    await context.locker.methods
                        .confirmLocker(context.escrow_index)
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

    const calc = async () => {
        if (context.web3 && context.address && context.escrow_index) {
            let result = await EscrowCalc(context);

            setState({
                ...result,
            });

            setData(true);
        }
    };

    const initData = async () => {
        if (id) {
            let result = await context.setAirtableState(id);

            if (!result.validRaidId) {
                alert("ID not found!");
                return props.history.push("/");
            }

            if (!result.escrow_index) {
                alert("Escrow not registered for this ID.");
                return props.history.push("/");
            }

            await context.connectAccount();
        } else if (context.locker === "") {
            return props.history.push("/");
        } else {
            await calc();
        }
    };

    useEffect(() => {
        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        calc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context]);

    let button_component = EscrowButtonManager(
        context,
        onDepositHandler,
        onWithdrawHandler,
        onReleaseHandler,
        onLockHandler,
        setModal
    );

    let total_project_payment_frontend = Number(state.frontend_cap).toFixed(2);
    let safety_withdrawal_date_frontend = new Date(
        Number(context.termination) * 1000
    ).toDateString();
    let total_released_to_date_frontend = Number(
        state.frontend_released
    ).toFixed(2);
    let total_due_to_escrow_frontend = Number(state.frontend_cap).toFixed(2);
    let total_milestone_payment_frontend = Number(
        state.total_milestone_payment
    ).toFixed(2);

    return hash !== "" ? (
        <Success hash={hash} />
    ) : !isData ? (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Loading />
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

            <div className='escrow-sub-container-two'>
                <div className='card'>
                    <div>
                        <p>
                            Total Project Payment
                            <span>
                                {total_project_payment_frontend}{" "}
                                {state.tokenType}
                            </span>
                        </p>
                        <p>
                            Safety Valve Withdrawal Date
                            <span>{safety_withdrawal_date_frontend}</span>
                        </p>
                        <p>
                            Arbitration Provider<span>{"LexDAO"}</span>
                        </p>
                        <p>
                            Total Released to Date
                            <span>
                                {total_released_to_date_frontend}{" "}
                                {state.tokenType}
                            </span>
                        </p>
                    </div>
                    <div>
                        {context.confirmed !== "0" &&
                        context.locked !== "1" &&
                        context.termination >
                            Math.round(new Date().getTime() / 1000) &&
                        context.cap !== context.released ? (
                            <p>
                                Next Milestone
                                <span>Milestone #{state.next_milestone}</span>
                            </p>
                        ) : null}

                        {context.confirmed === "0" ? (
                            <p style={{ color: "#ff3864" }}>
                                Total Due to Escrow Today
                                <span>
                                    {total_due_to_escrow_frontend}{" "}
                                    {state.tokenType}
                                </span>
                            </p>
                        ) : (
                            <p style={{ color: "#ff3864" }}>
                                {context.locked === "1"
                                    ? "Funds Locked"
                                    : context.termination <
                                      Math.round(new Date().getTime() / 1000)
                                    ? "Safety valve date due"
                                    : context.cap === context.released
                                    ? "All funds released"
                                    : context.isClient
                                    ? "Next Amount to Release"
                                    : "Next Amount to be Released"}
                                {context.confirmed !== "0" &&
                                context.locked !== "1" &&
                                context.termination >
                                    Math.round(new Date().getTime() / 1000) &&
                                context.cap !== context.released ? (
                                    <span>
                                        {total_milestone_payment_frontend}{" "}
                                        {state.tokenType}
                                    </span>
                                ) : null}
                            </p>
                        )}
                    </div>
                </div>
                {button_component}
            </div>

            <div className={`modal ${modal ? "is-active" : null}`}>
                <div className='modal-background'></div>
                <Instructions
                    escrow_index={context.escrow_index}
                    locker_address={Locker}
                />
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
