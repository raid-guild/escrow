import React from "react";

import "../styles/css/Components.css";

const Loading = () => {
    return (
        <div className='spinner'>
            <div className='bounce1'></div>
            <div className='bounce2'></div>
            <div className='bounce3'></div>
        </div>
    );
};

export default Loading;
