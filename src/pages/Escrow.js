import React, { useState, useEffect, useContext } from "react";
import { withRouter, useParams } from "react-router-dom";

import Loading from "../components/Loading";
import Success from "../components/Success";
import Instructions from "../components/Instructions";

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
    const [modal, setModal] = useState(false);
    const { id } = useParams();

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

    const calc = async () => {
        if (context.web3 && context.address && context.escrow_index) {
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

            let total_milestone_payment = "";
            let next_milestone = "";
            if (context.confirmed === "1") {
                let event_info;

                try {
                    let events = await context.ethers_locker.queryFilter(
                        "RegisterLocker"
                    );
                    event_info = events.filter(
                        (event) =>
                            parseInt(event.args.index._hex) ===
                            parseInt(context.escrow_index)
                    );
                } catch (err) {
                    console.log(err);
                }

                total_milestone_payment =
                    parseInt(event_info[0].args.amount[0]._hex) +
                    parseInt(event_info[0].args.amount[1]._hex);
                let total_milestones =
                    parseInt(context.cap) / total_milestone_payment;
                let milestones_left =
                    (parseInt(context.cap) - parseInt(context.released)) /
                    total_milestone_payment;
                let current_milestone = total_milestones - milestones_left;
                total_milestones = Math.round(total_milestones);
                milestones_left = Math.round(milestones_left);
                next_milestone = Math.round(current_milestone) + 1;

                total_milestone_payment = context.web3.utils.fromWei(
                    total_milestone_payment.toString()
                );
            }

            setState({
                tokenType,
                DAIBalance,
                wETHBalance,
                frontend_cap,
                frontend_released,
                total_milestone_payment,
                next_milestone,
            });

            setData(true);
        }
    };

    const initData = async () => {
        if (id) {
            let result = await fetch(
                "https://guild-keeper.herokuapp.com/raids/validate",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ID: id,
                    }),
                }
            ).then((res) => res.json());

            if (result !== "NOT_FOUND") {
                let params = {
                    escrow_index: result["Escrow Index"] || "",
                    raid_id: id,
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
                if (!result["Escrow Index"]) {
                    alert("Escrow not registered for this ID.");
                    return props.history.push("/");
                }
                await context.setAirtableState(params);
                await context.connectAccount();
            } else {
                alert("ID not found!");
                return props.history.push("/");
            }
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
        } else if (
            context.termination < Math.round(new Date().getTime() / 1000)
        ) {
            component = (
                <button className='withdraw-button' onClick={onWithdrawHandler}>
                    Withdraw
                </button>
            );
        } else {
            component = (
                <div>
                    <button
                        className='custom-button'
                        onClick={onReleaseHandler}
                    >
                        Release
                    </button>
                    <button className='lock-button' onClick={onLockHandler}>
                        Lock
                    </button>
                </div>
            );
        }
    } else {
        component = (
            <button className='lock-button' onClick={() => setModal(true)}>
                Lock
            </button>
        );
    }

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
                                {Number(state.frontend_cap).toFixed(2)}{" "}
                                {state.tokenType}
                            </span>
                        </p>
                        <p>
                            Safety Valve Withdrawal Date
                            <span>
                                {new Date(
                                    Number(context.termination) * 1000
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
                        {context.confirmed !== "0" &&
                        context.locked !== "1" &&
                        context.termination > new Date().getTime() &&
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
                                    {Number(state.frontend_cap).toFixed(2)}{" "}
                                    {state.tokenType}
                                </span>
                            </p>
                        ) : (
                            <p style={{ color: "#ff3864" }}>
                                {context.locked === "1"
                                    ? "Funds Locked"
                                    : context.termination < new Date().getTime()
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
                                        {Number(
                                            state.total_milestone_payment
                                        ).toFixed(2)}{" "}
                                        {state.tokenType}
                                    </span>
                                ) : null}
                            </p>
                        )}
                    </div>
                </div>
                {component}
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
