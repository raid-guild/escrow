import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

class Register extends Component {
    static contextType = AppContext;

    render() {
        const {
            project_name,
            client_name,
            start_date,
            end_date,
            link_to_details,
            brief_description,
        } = this.context;

        return (
            <div className='register'>
                <div className='register-sub-container'>
                    <h2>{client_name}</h2>
                    <h1>{project_name}</h1>
                    <br></br>
                    <p>Start: {start_date}</p>
                    <p>Planned End: {end_date}</p>
                    <br></br>
                    <a
                        href={link_to_details}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Link to details of agreement
                    </a>
                    <p>{brief_description}</p>
                    <button
                        className='custom-button'
                        onClick={() => this.props.history.push("/form")}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);
