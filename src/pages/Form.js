import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "bulma";

import "react-datepicker/dist/react-datepicker.css";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

class Form extends Component {
    state = {
        client_address: "",
        multisig_address: "",
        total_payment: 0,
        payment_token: "",
        milestones: 0,
        payment_per_milestone: 0,
        safety_valve_date: new Date(),
    };

    static contextType = AppContext;

    componentDidMount() {
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

        client_address_input.addEventListener("change", (event) => {
            this.setState({ client_address: event.target.value });
        });

        multisig_address_input.addEventListener("change", (event) => {
            this.setState({ multisig_address: event.target.value });
        });

        total_payment_input.addEventListener("change", (event) => {
            total_payment = event.target.value;
            payment_per_milestone = total_payment / milestones;

            this.setState({
                total_payment: event.target.value,
                payment_per_milestone,
            });
        });

        payment_token_input.addEventListener("change", (event) => {
            this.setState({ payment_token: event.target.value });
        });

        milestones_input.addEventListener("change", (event) => {
            milestones = event.target.value;
            payment_per_milestone = total_payment / milestones;

            this.setState({
                milestones: event.target.value,
                payment_per_milestone,
            });
        });
    }

    dateHandler = (date) => {
        console.log(date);
        var ts = date.getTime();

        this.setState({
            safety_valve_date: date,
        });
    };

    registerLocker = async () => {
        let { locker, web3 } = this.context;
        let {
            client_address,
            multisig_address,
            total_payment,
            payment_token,
            milestones,
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
    };

    render() {
        return (
            <div className='form'>
                <div className='form-sub-container'>
                    <form>
                        <label>Client Address</label>
                        <input type='text' id='client_address' />

                        {/* <label>
                            Client proposal or agreement (link to document)
                        </label>
                        <input type='text' /> */}

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

                        <div className='milestone'>
                            <div>
                                <label>Number of Milestones</label>
                                <input type='number' id='milestones' />
                            </div>

                            <div>
                                <label>Payment per Milestone</label>
                                <p>
                                    {this.state.payment_per_milestone}{" "}
                                    {this.state.payment_token}
                                </p>
                            </div>
                        </div>
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

export default Form;
