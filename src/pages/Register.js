import React from "react";
import { withRouter } from "react-router-dom";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

const Register = (props) => {
    return (
        <div className='register'>
            <div className='register-sub-container'>
                <h2>Client Name</h2>
                <h1>Project Name</h1>
                <br></br>
                <p>Start: {"August 1, 2020"}</p>
                <p>Planned End: {"October 31, 2020"}</p>
                <br></br>
                <a
                    href='https://raidguild.org/'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Link to details of agreement
                </a>
                <p>Brief description of the project</p>
                <button
                    className='custom-button'
                    onClick={() => props.history.push("/form")}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default withRouter(Register);
