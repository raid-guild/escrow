import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import "bulma";

import "react-datepicker/dist/react-datepicker.css";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

const { contract_addresses } = require("../utils/Constants");

class Form extends Component {
    state = {
        client_address: "",
        multisig_address: "",
        total_payment: 0,
        payment_token: "",
        milestones: 0,
        payment_per_milestone: 0,
        safety_valve_date: new Date(),
        spoils_payment: 0,
        multisig_payment: 0,
    };

    static contextType = AppContext;

    componentDidMount() {
        let { spoils_percent } = this.context;

        let client_address_input = document.getElementById("client_address");
        let multisig_address_input = document.getElementById(
            "multisig_address"
        );
        let total_payment_input = document.getElementById("total_payment");
        let payment_token_input = document.getElementById("token");
        let milestones_input = document.getElementById("milestones");

        let total_payment = 1;
        let milestones = 1;
        let payment_per_milestone = 0;
        let spoils_payment = 1;
        let multisig_payment = 1;

        client_address_input.addEventListener("change", (event) => {
            this.setState({ client_address: event.target.value });
        });

        multisig_address_input.addEventListener("change", (event) => {
            this.setState({ multisig_address: event.target.value });
        });

        total_payment_input.addEventListener("change", (event) => {
            total_payment = event.target.value;
            payment_per_milestone = (total_payment / milestones).toFixed(0);
            spoils_payment = (payment_per_milestone / spoils_percent).toFixed(
                0
            );
            multisig_payment = (payment_per_milestone - spoils_payment).toFixed(
                0
            );
            this.setState({
                total_payment: event.target.value,
                payment_per_milestone,
                spoils_payment,
                multisig_payment,
            });
        });

        payment_token_input.addEventListener("change", (event) => {
            this.setState({ payment_token: event.target.value });
        });

        milestones_input.addEventListener("change", (event) => {
            milestones = event.target.value;
            payment_per_milestone = (total_payment / milestones).toFixed(0);
            spoils_payment = (payment_per_milestone / spoils_percent).toFixed(
                0
            );
            multisig_payment = (payment_per_milestone - spoils_payment).toFixed(
                0
            );
            this.setState({
                milestones: event.target.value,
                payment_per_milestone,
                spoils_payment,
                multisig_payment,
            });
        });
    }

    dateHandler = (date) => {
        this.setState({
            safety_valve_date: date,
        });
    };

    registerLocker = async () => {
        let {
            address,
            locker,
            web3,
            spoils_address,
            resolver_address,
            raid_id,
        } = this.context;
        let {
            client_address,
            multisig_address,
            total_payment,
            payment_token,
            milestones,
            multisig_payment,
            spoils_payment,
            safety_valve_date,
        } = this.state;

        if (!web3.utils.isAddress(client_address))
            return alert("Client address is not valid!");
        if (!web3.utils.isAddress(multisig_address))
            return alert("Multisig address is not valid!");
        if (total_payment === 0)
            return alert("Total Payment must be greater than 0.");
        if (payment_token === "")
            return alert("Please select a payment token.");
        if (milestones === 0)
            return alert("Number of Milestones must be greater than 0.");
        if (safety_valve_date.getDate() === new Date().getDate())
            return alert("Safety valve date cannot be today.");

        let index = await locker.methods.lockerCount().call();
        let payment_token_address = "";
        if (payment_token === "DAI") {
            payment_token_address = contract_addresses.KovanDAI;
        } else if (payment_token === "wETH") {
            payment_token_address = contract_addresses.KovanWETH;
        }

        await locker.methods
            .registerLocker(
                client_address,
                [multisig_address, spoils_address],
                resolver_address,
                payment_token_address,
                [multisig_payment, spoils_payment],
                total_payment,
                milestones,
                safety_valve_date.getTime(),
                "0x0"
            )
            .send({
                from: address,
            })
            .once("transactionHash", async (hash) => {
                let result = await fetch(
                    "https://guild-keeper.herokuapp.com/raids/update",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ID: raid_id,
                            Hash: hash,
                            Index: parseInt(index) + 1,
                        }),
                    }
                ).then((res) => res.json());

                if (result === "SUCCESS") {
                    alert(
                        `The transaction hash is ${hash} & a locker will be created with an Index ${
                            parseInt(index) + 1
                        } when it confirms.`
                    );
                    this.setState(
                        {
                            client_address: "",
                            multisig_address: "",
                            total_payment: 0,
                            payment_token: "",
                            milestones: 0,
                            payment_per_milestone: 0,
                            safety_valve_date: new Date(),
                            spoils_payment: 0,
                            multisig_payment: 0,
                        },
                        () => this.props.history.push("/")
                    );
                }
            })
            .on("error", (err) => console.log(err));
    };

    render() {
        let { spoils_percent } = this.context;
        return (
            <div className='form'>
                <div className='form-sub-container-one'>
                    <div>
                        <p>
                            Payment per milestone -{" "}
                            <span>
                                {this.state.payment_per_milestone}{" "}
                                {this.state.payment_token}
                            </span>
                        </p>
                        <p>
                            Guild spoils ({spoils_percent}%) per milestone -{" "}
                            <span>
                                {this.state.spoils_payment}{" "}
                                {this.state.payment_token}
                            </span>
                        </p>
                        <p>
                            Multisig Payment per milestone -{" "}
                            <span>
                                {this.state.multisig_payment}
                                {this.state.payment_token}
                            </span>
                        </p>
                    </div>
                </div>
                <div className='form-sub-container-two'>
                    <form>
                        <label>Client Address</label>
                        <input type='text' id='client_address' />

                        <label>
                            Raid Party Multisig (eg. Gnosis safe) Address
                        </label>
                        <input type='text' id='multisig_address' />

                        <div className='input-sub-container'>
                            <div>
                                <label>Total Raid Payment</label>
                                <br />
                                <input type='number' id='total_payment' />
                            </div>
                            <div>
                                <label>Payment Token</label>
                                <br />
                                <select id='token'>
                                    <option>Select whitelisted token</option>
                                    <option>wETH</option>
                                    <option>DAI</option>
                                </select>
                            </div>
                        </div>

                        <label>Number of Milestones</label>
                        <input type='number' id='milestones' />

                        <div id='date-picker'>
                            <label>Client Safety Valve Withdrawal Date</label>
                            <DatePicker
                                minDate={this.state.safety_valve_date}
                                dateFormat='yyyy/MM/dd'
                                selected={this.state.safety_valve_date}
                                onChange={this.dateHandler}
                            />
                        </div>
                    </form>

                    <button
                        className='custom-button'
                        onClick={this.registerLocker}
                    >
                        Register
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(Form);
