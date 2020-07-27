import React, { Component, createContext } from "react";

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: process.env.REACT_APP_INFURA_ID,
        },
    },
};

const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: false,
    providerOptions,
});

export const Web3Context = createContext();

class Web3ContextProvider extends Component {
    state = {
        address: "",
        provider: "",
        web3: "",
    };

    componentDidMount() {
        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
            )
        );
        this.setState({ web3 }, () => {
            console.log(web3);
        });
    }

    connectAccount = async () => {
        web3Modal.clearCachedProvider();

        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();

        this.setState({ address: accounts[0], provider, web3 });
    };

    render() {
        return (
            <Web3Context.Provider
                value={{ ...this.state, connectAccount: this.connectAccount }}
            >
                {this.props.children}
            </Web3Context.Provider>
        );
    }
}

export default Web3ContextProvider;
