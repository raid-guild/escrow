import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'bulma';

import 'react-datepicker/dist/react-datepicker.css';

import Loading from '../components/Loading';
import Success from '../components/Success';

import '../sass/Pages.scss';
import '../sass/ResponsivePages.scss';

import raidguild__logo from '../assets/raidguild__logo.png';

import { AppContext } from '../context/AppContext';

import milestone_payments_calculation from '../utils/BigNumberCalc';

const { MainnetDAI, MainnetWETH } =
  require('../utils/Constants').contract_addresses;

class Form extends Component {
  state = {
    client_address: '',
    multisig_address: '',
    total_payment: 1,
    payment_token: 'DAI',
    milestone_payment: 0,
    milestones: 1,
    milestone_spoils_payment: 1,
    milestone_multisig_payment: 1,
    safety_valve_date: new Date(),
    hash: ''
  };

  static contextType = AppContext;

  componentDidMount() {
    let { spoils_percent, raid_id } = this.context;

    if (raid_id === '') {
      return this.props.history.push('/');
    }

    // if (end_date !== "Not Available") {
    //     this.setState({ safety_valve_date: new Date(end_date) });
    // }

    let client_address_input = document.getElementById('client_address');
    let multisig_address_input = document.getElementById('multisig_address');
    let total_payment_input = document.getElementById('total_payment');
    let payment_token_input = document.getElementById('token');
    let milestones_input = document.getElementById('milestones');

    let total_payment = 1;
    let milestones = 1;

    client_address_input.addEventListener('change', (event) => {
      this.setState({ client_address: event.target.value });
    });

    multisig_address_input.addEventListener('change', (event) => {
      this.setState({ multisig_address: event.target.value });
    });

    total_payment_input.addEventListener('change', (event) => {
      if (
        event.target.value === '' ||
        event.target.value === '0' ||
        Number(event.target.value) < 0
      ) {
        alert('Total payment cannot be zero, negative or empty!');
        total_payment_input.value = '1';
        this.setState({
          total_payment: 1
        });
        return;
      }
      total_payment = event.target.value;
      const payments = milestone_payments_calculation(
        total_payment,
        this.state.milestones,
        spoils_percent
      );

      this.setState({
        total_payment: payments[0],
        milestone_payment: payments[1],
        milestone_spoils_payment: payments[2],
        milestone_multisig_payment: payments[3]
      });
    });

    payment_token_input.addEventListener('change', (event) => {
      this.setState({ payment_token: event.target.value });
    });

    milestones_input.addEventListener('change', (event) => {
      if (
        event.target.value === '0' ||
        event.target.value === '' ||
        Number(event.target.value) < 0
      ) {
        alert('Milestone cannot be zero, negative or empty!');
        milestones_input.value = '1';
        this.setState({
          milestones: 1
        });
        return;
      }
      milestones = event.target.value;
      const payments = milestone_payments_calculation(
        this.state.total_payment,
        milestones,
        spoils_percent
      );
      this.setState({
        milestones: event.target.value,
        total_payment: payments[0],
        milestone_payment: payments[1],
        milestone_spoils_payment: payments[2],
        milestone_multisig_payment: payments[3]
      });
    });
  }

  dateHandler = (date) => {
    this.setState({
      safety_valve_date: date
    });
  };

  registerLocker = async () => {
    let {
      address,
      locker,
      web3,
      spoils_address,
      resolver_address,
      raid_id,
      connectAccount,
      updateLoadingState
    } = this.context;
    let {
      client_address,
      multisig_address,
      total_payment,
      payment_token,
      milestones,
      milestone_multisig_payment,
      milestone_spoils_payment,
      safety_valve_date
    } = this.state;
    let payment_token_address = '';

    if (address === '') return connectAccount();

    if (!web3.utils.isAddress(client_address))
      return alert('Client address is not valid!');
    if (!web3.utils.isAddress(multisig_address))
      return alert('Multisig address is not valid!');
    if (total_payment === 0)
      return alert('Total Payment must be greater than 0.');
    if (payment_token === '' || payment_token === 'Select whitelisted token')
      return alert('Please select a payment token.');
    if (milestones === 0)
      return alert('Number of Milestones must be greater than 0.');
    if (safety_valve_date.getDate() === new Date().getDate())
      return alert('Safety valve date cannot be today.');

    if (payment_token === 'DAI') {
      payment_token_address = MainnetDAI;
    } else if (payment_token === 'wETH') {
      payment_token_address = MainnetWETH;
    }

    let index = await locker.methods.lockerCount().call();
    try {
      updateLoadingState();
      await locker.methods
        .registerLocker(
          client_address,
          [multisig_address, spoils_address],
          resolver_address,
          payment_token_address,
          [
            web3.utils.toWei(milestone_multisig_payment.toString()),
            web3.utils.toWei(milestone_spoils_payment.toString())
          ],
          web3.utils.toWei(total_payment.toString()),
          milestones,
          Math.round(safety_valve_date.getTime() / 1000),
          '0x0'
        )
        .send({
          from: address
        })
        .once('transactionHash', async (hash) => {
          let result = await fetch(
            'https://guild-keeper.herokuapp.com/escrow/update-raid',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                ID: raid_id,
                Hash: hash,
                Index: parseInt(index) + 1
              })
            }
          ).then((res) => res.json());

          if (result === 'SUCCESS') {
            updateLoadingState();
            this.setState({
              client_address: '',
              multisig_address: '',
              total_payment: 0,
              payment_token: '',
              milestones: 0,
              milestone_payment: 0,
              safety_valve_date: new Date(),
              milestone_spoils_payment: 0,
              milestone_multisig_payment: 0,
              hash: hash
            });
          }
        })
        .on('error', (err) => console.log(err));
    } catch (err) {
      updateLoadingState();
    }
  };

  render() {
    let { spoils_percent, isLoading } = this.context;

    return this.state.hash !== '' ? (
      <Success hash={this.state.hash} />
    ) : (
      <div className='form'>
        <a
          href='https://raidguild.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          <img src={raidguild__logo} alt='raidguild' id='in-page-logo' />
        </a>
        <div className='form-sub-container-one'>
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Payment per milestone ~{' '}
              <span>
                {this.state.milestone_payment.toFixed(2)}{' '}
                {this.state.payment_token}
              </span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Guild spoils ({spoils_percent * 100}%) per milestone ~{' '}
              <span>
                {this.state.milestone_spoils_payment.toFixed(2)}{' '}
                {this.state.payment_token}
              </span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Multisig Payment per milestone ~{' '}
              <span>
                {this.state.milestone_multisig_payment.toFixed(2)}{' '}
                {this.state.payment_token}
              </span>
            </motion.p>
          </div>
        </div>
        <motion.div
          className='form-sub-container-two'
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <form>
            <label>Client Address</label>
            <input type='text' id='client_address' />

            <label>Raid Party Multisig (eg. Gnosis safe) Address</label>
            <input type='text' id='multisig_address' />

            <div className='input-sub-container'>
              <div>
                <label>Total Raid Payment</label>
                <br />
                <input type='number' id='total_payment' min='1' />
              </div>
              <div>
                <label>Payment Token</label>
                <br />
                <select id='token'>
                  <option>DAI</option>
                  <option>wETH</option>
                </select>
              </div>
            </div>

            <label>Number of Milestones</label>
            <input type='number' id='milestones' min='1' />

            <div id='date-picker'>
              <label>Client Safety Valve Withdrawal Date</label>
              <DatePicker
                minDate={new Date()}
                dateFormat='yyyy/MM/dd'
                selected={this.state.safety_valve_date}
                onChange={this.dateHandler}
              />
            </div>
          </form>
          {isLoading ? (
            <Loading />
          ) : (
            <button className='custom-button' onClick={this.registerLocker}>
              Register
            </button>
          )}
        </motion.div>
      </div>
    );
  }
}

export default withRouter(Form);
