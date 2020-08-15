import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";

import "../styles/css/Pages.css";
import "../styles/css/ResponsivePages.css";

import { AppContext } from "../context/AppContext";

const Register = (props) => {
    const context = useContext(AppContext);

    const {
        project_name,
        client_name,
        start_date,
        end_date,
        link_to_details,
        brief_description,
        spoils_address,
        spoils_percent,
        resolver_address,
        address,
    } = context;

    useEffect(() => {
        if (address === "") return props.history.push("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='register'>
            <div className='register-sub-container'>
                <div className='contents'>
                    <h2>{client_name}</h2>
                    <h1>{project_name}</h1>
                    <br></br>
                    <p>Start: {start_date.split("T")[0]}</p>
                    <p>Planned End: {end_date}</p>
                    <br></br>
                    <p>{brief_description}</p>
                    <a
                        href={link_to_details}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Link to details of agreement
                    </a>
                    <br></br>
                    <br></br>
                    <p>Spoils Address ({spoils_address})</p>
                    <p>
                        Spoils ( {spoils_percent}% of payment sent to Raid
                        Guild)
                    </p>
                    <p>Resolver Address ({resolver_address})</p>
                    <button
                        className='custom-button'
                        onClick={() => props.history.push("/form")}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Register);
