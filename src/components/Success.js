import React from "react";
import { withRouter } from "react-router-dom";

const Success = (props) => {
    return (
        <div className='success'>
            <h3>Transaction Received!</h3>
            <p>
                You can check the progress of your transaction{" "}
                <a href={`https://etherscan.io/tx/${props.hash}`}>here.</a>
            </p>
            <button
                className='custom-button'
                onClick={() => props.history.push("/")}
            >
                Home
            </button>
        </div>
    );
};

export default withRouter(Success);
