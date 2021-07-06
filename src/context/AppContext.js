import React, { Component, createContext } from 'react';

import Web3 from 'web3';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const lockerABI = require('../abi/Locker.json');
const DAI_ABI = require('../abi/DaiAbi.json');
const wETH_ABI = require('../abi/wETHAbi.json');
const { Locker, MainnetDAI, MainnetWETH, RaidGuild, LexArbitration } =
  require('../utils/Constants').contract_addresses;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID
    }
  }
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions
});

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    //web3 needs
    address: '',
    provider: '',
    web3: '',
    chainID: '',
    //contracts & address
    locker: '',
    client_address: '',
    resolver_address: LexArbitration,
    spoils_address: RaidGuild,
    //locker info
    cap: '',
    confirmed: '',
    locked: '',
    released: '',
    token: '',
    termination: '',
    client: '',
    //airtable info
    escrow_index: '',
    raid_id: '',
    project_name: '',
    client_name: '',
    start_date: '',
    end_date: '',
    link_to_details: '',
    brief_description: '',
    //math needs
    spoils_percent: 0.1,
    //checks
    isClient: false,
    isLoading: false
  };

  async componentDidMount() {
    console.log(this.state.spoils_address);
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
      )
    );
    const locker = new web3.eth.Contract(lockerABI, Locker);
    const DAI = new web3.eth.Contract(DAI_ABI, MainnetDAI);
    const wETH = new web3.eth.Contract(wETH_ABI, MainnetWETH);
    const chainID = await web3.eth.net.getId();

    this.setState({ web3, locker, DAI, wETH, chainID });
  }

  setAirtableState = async (id) => {
    let result = await fetch(
      'https://guild-keeper.herokuapp.com/escrow/validate-raid',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ID: id
        })
      }
    ).then((res) => res.json());

    if (result !== 'NOT_FOUND') {
      this.setState(
        {
          escrow_index: result['Escrow Index'] || '',
          raid_id: id,
          project_name: result['Project Name'] || 'Not Available',
          client_name: result['Name'] || 'Not Available',
          start_date: result['Raid Start Date'] || 'Not Available',
          end_date: result['Expected Deadline'] || 'Not Available',
          link_to_details: result['Specs Link'] || 'Not Available',
          brief_description: result['Project Description'] || 'Not Available'
        },
        () => this.fetchLockerInfo()
      );
      return {
        validRaidId: true,
        escrow_index: result['Escrow Index'] || ''
      };
    } else {
      return { validRaidId: false, escrow_index: '' };
    }
  };

  fetchLockerInfo = async () => {
    if (this.state.escrow_index !== '' && this.state.locker) {
      let { cap, confirmed, locked, released, token, termination, client } =
        await this.state.locker.methods.lockers(this.state.escrow_index).call();
      this.setState({
        cap,
        confirmed,
        locked,
        released,
        token,
        termination,
        client
      });
    }
  };

  connectAccount = async () => {
    try {
      this.updateLoadingState();
      // web3Modal.clearCachedProvider();

      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const locker = new web3.eth.Contract(lockerABI, Locker);
      const DAI = new web3.eth.Contract(DAI_ABI, MainnetDAI);
      const wETH = new web3.eth.Contract(wETH_ABI, MainnetWETH);
      let chainID = await web3.eth.net.getId();

      let ethers_locker = new ethers.Contract(
        Locker,
        lockerABI,
        new ethers.providers.InfuraProvider(
          'homestead',
          process.env.REACT_APP_INFURA_ID
        )
      );

      let isClient = false;

      if (accounts[0] === this.state.client) {
        isClient = true;
      }

      provider.on('chainChanged', (chainId) => {
        this.setState({ chainID: chainId });
      });

      provider.on('accountsChanged', (accounts) => {
        window.location.href = '/';
      });

      this.setState(
        {
          address: accounts[0],
          provider,
          web3,
          isClient,
          locker,
          DAI,
          wETH,
          chainID,
          ethers_locker
        },
        () => {
          this.updateLoadingState();
        }
      );
    } catch (err) {
      this.updateLoadingState();
    }
  };

  updateLoadingState = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setAirtableState: this.setAirtableState,
          connectAccount: this.connectAccount,
          updateLoadingState: this.updateLoadingState
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
