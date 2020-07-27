import React, { Component, createContext } from "react";

export const AirtableContext = createContext();

class AirtableContextProvider extends Component {
    state = {
        raid_id: "",
        project_name: "",
        client_name: "",
        start_date: "",
        end_date: "",
        link_to_details: "",
        brief_description: "",
    };

    setAirtableState = (params) => {
        this.setState({
            raid_id: params.raid_id,
            project_name: params.project_name,
            client_name: params.client_name,
            start_date: params.start_date,
            end_date: params.end_date,
            link_to_details: params.link_to_details,
            brief_description: params.brief_description,
        });
    };

    render() {
        return (
            <AirtableContext.Provider
                value={{
                    ...this.state,
                    setAirtableState: this.setAirtableState,
                }}
            >
                {this.props.children}
            </AirtableContext.Provider>
        );
    }
}

export default AirtableContextProvider;
