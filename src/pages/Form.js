import React, { Component } from "react";
import "bulma";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

class Form extends Component {
    state = {};
    render() {
        return (
            <div className='form'>
                <div className='form-sub-container'>
                    <form>
                        <label>Raid ID (From Airtable)</label>
                        <input type='text' />

                        <label>
                            Client proposal or agreement (link to document)
                        </label>
                        <input type='text' />

                        <label>
                            Raid Party Multisig (eg. Gnosis safe) Address
                        </label>
                        <input type='text' />

                        <label>Spoils Destination Address (Raid Guild)</label>
                        <input type='text' />

                        <div className='input-sub-container'>
                            <div>
                                <label>Total Raid Payment</label>
                                <br />
                                <input type='text' />
                            </div>
                            <div>
                                <label>Payment Token</label>
                                <br />
                                <select>
                                    <option>Select whitelisted token</option>
                                    <option>wETH</option>
                                    <option>DAI</option>
                                </select>
                            </div>
                        </div>

                        <label>Number of Milestones</label>
                        <input type='text' />

                        <label>Payment per Milestone</label>
                        <input type='text' />

                        <label>Spoils (% of payment sent to Raid Guild)</label>
                        <input type='text' />

                        <label>Client Safety Valve Withdrawal Date</label>
                        <input type='text' />
                    </form>
                </div>
            </div>
        );
    }
}

export default Form;
