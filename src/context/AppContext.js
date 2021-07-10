import React, { Component, createContext } from 'react';

import Web3 from 'web3';
import { ethers } from 'ethers';
import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
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

  setWeb3Provider = async (prov, initialCall = false) => {
    if (prov) {
      const web3Provider = new Web3(prov);
      const web3 = new Web3(web3Provider);
      const gotProvider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider
      );
      const gotChainId = Number(prov.chainId);
      const locker = new web3.eth.Contract(lockerABI, Locker);
      const DAI = new web3.eth.Contract(DAI_ABI, MainnetDAI);
      const wETH = new web3.eth.Contract(wETH_ABI, MainnetWETH);

      let ethers_locker = new ethers.Contract(
        Locker,
        lockerABI,
        new ethers.providers.InfuraProvider(
          'homestead',
          process.env.REACT_APP_INFURA_ID
        )
      );

      if (initialCall) {
        const signer = gotProvider.getSigner();
        const gotAccount = await signer.getAddress();
        let isClient = false;

      if (gotAccount === this.state.client) {
        isClient = true;
      }
        this.setState({
          address: gotAccount,
          chainID: gotChainId,
          provider: gotProvider,
          web3: web3Provider,
          ethers_locker: ethers_locker,
          locker:locker,
          DAI:DAI,
          wETH:wETH,
          isClient:isClient
        });
      } else {
        this.setState({
          chainID: gotChainId,
          provider: gotProvider,
          web3: web3Provider
        });
      }
    }
  };

  connectAccount = async () => {
    try {
      this.updateLoadingState();

      const modalProvider = await web3Modal.requestProvider();

      await this.setWeb3Provider(modalProvider, true);

      const isGnosisSafe = !!modalProvider.safe;

      if (!isGnosisSafe) {
        modalProvider.on('accountsChanged', (accounts) => {
          this.setState({ account: accounts[0] });
        });
        modalProvider.on('chainChanged', (chainID) => {
          this.setState({ chainID });
          console.log(chainID);
        });
      }
    } catch (web3ModalError) {
      console.log(web3ModalError);
      this.updateLoadingState();
    } finally {
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
