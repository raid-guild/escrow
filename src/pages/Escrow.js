import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { withRouter, useParams } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

import Loading from '../components/Loading';
import Success from '../components/Success';
import Instructions from '../components/Instructions';

import EscrowButtonManager from '../utils/EscrowButtonManager';
import EscrowCalc from '../utils/EscrowCalc';

import '../sass/Pages.scss';
import '../sass/ResponsivePages.scss';

import raidguild__logo from '../assets/raidguild__logo.png';

const { Locker } = require('../utils/Constants').contract_addresses;

const Escrow = (props) => {
  const context = useContext(AppContext);
  const [state, setState] = useState({});
  const [isData, setData] = useState(false);
  const [hash, setHash] = useState('');
  const [modal, setModal] = useState(false);
  const { id } = useParams();

  const onDepositHandler = async () => {
    let contract = state.tokenType === 'DAI' ? context.DAI : context.wETH;

    if (
      Number(state.DAIBalance) < Number(context.cap) &&
      state.tokenType === 'DAI'
    )
      return alert('Insufficient funds! Please add more DAI to you wallet.');

    let allowance = await contract.methods
      .allowance(context.address, Locker)
      .call();

    try {
      context.updateLoadingState();
      if (state.tokenType === 'DAI') {
        if (allowance < context.cap) {
          await contract.methods
            .approve(Locker, context.cap)
            .send({ from: context.address });
        }

        await context.locker.methods
          .confirmLocker(context.escrow_index)
          .send({
            from: context.address
          })
          .once('transactionHash', (txHash) => {
            context.updateLoadingState();
            setHash(txHash);
          });
      } else if (state.tokenType === 'wETH') {
        if (state.wETHBalance >= context.cap) {
          if (allowance < context.cap) {
            await contract.methods
              .approve(Locker, context.cap)
              .send({ from: context.address });
          }
          await context.locker.methods
            .confirmLocker(context.escrow_index)
            .send({
              from: context.address
            })
            .once('transactionHash', (txHash) => {
              context.updateLoadingState();
              setHash(txHash);
            });
        } else {
          await context.locker.methods
            .confirmLocker(context.escrow_index)
            .send({
              from: context.address,
              value: context.cap
            })
            .once('transactionHash', (txHash) => {
              context.updateLoadingState();
              setHash(txHash);
            });
        }
      }
    } catch (err) {
      context.updateLoadingState();
    }
  };

  const onReleaseHandler = async () => {
    try {
      context.updateLoadingState();
      await context.locker.methods
        .release(context.escrow_index)
        .send({ from: context.address })
        .once('transactionHash', (hash) => {
          context.updateLoadingState();
          setHash(hash);
        });
    } catch (err) {
      context.updateLoadingState();
    }
  };

  const onLockHandler = async () => {
    try {
      context.updateLoadingState();
      await context.locker.methods
        .lock(context.escrow_index, '0x0')
        .send({ from: context.address })
        .once('transactionHash', (hash) => {
          context.updateLoadingState();
          setHash(hash);
        });
    } catch (err) {
      context.updateLoadingState();
    }
  };

  const onWithdrawHandler = async () => {
    try {
      context.updateLoadingState();
      await context.locker.methods
        .withdraw(context.escrow_index)
        .send({ from: context.address })
        .once('transactionHash', (hash) => {
          context.updateLoadingState();
          setHash(hash);
        });
    } catch (err) {
      context.updateLoadingState();
    }
  };

  const calc = async () => {
    if (context.web3 && context.address && context.escrow_index) {
      let result = await EscrowCalc(context);

      setState({
        ...result
      });

      setData(true);
    }
  };

  const initData = async () => {
    if (id) {
      let result = await context.setAirtableState(id);

      if (!result.validRaidId) {
        alert('ID not found!');
        return props.history.push('/');
      }

      if (!result.escrow_index) {
        alert('Escrow not registered for this ID.');
        return props.history.push('/');
      }

      await context.connectAccount();
    } else if (context.locker === '') {
      return props.history.push('/');
    } else {
      await calc();
    }
  };

  useEffect(() => {
    if (context.chainID !== '') {
      if (context.chainID !== 1 && context.chainID !== '0x1') {
        alert('Switch to Mainnet!');
      }
    }
  }, [context.chainID, props.history]);

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  let button_component = EscrowButtonManager(
    context,
    onDepositHandler,
    onWithdrawHandler,
    onReleaseHandler,
    onLockHandler,
    setModal
  );

  let total_project_payment_frontend = Number(state.frontend_cap).toFixed(2);
  let safety_withdrawal_date_frontend = new Date(
    Number(context.termination) * 1000
  ).toDateString();
  let total_released_to_date_frontend = Number(state.frontend_released).toFixed(
    2
  );
  let total_due_to_escrow_frontend = Number(state.frontend_cap).toFixed(2);
  let total_milestone_payment_frontend = Number(
    state.next_milestone_payment
  ).toFixed(2);

  return hash !== '' ? (
    <Success hash={hash} />
  ) : !isData ? (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Loading />
    </div>
  ) : (
    <div className='escrow'>
      <a href='https://raidguild.org' target='_blank' rel='noopener noreferrer'>
        <img src={raidguild__logo} alt='raidguild' id='in-page-logo' />
      </a>
      <div className='escrow-sub-container-one'>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {context.client_name}
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {context.project_name}
        </motion.h1>
        <br></br>
        <motion.div
          className='timelines'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p>Start: {context.start_date}</p>
          <p>Planned End: {context.end_date}</p>
        </motion.div>
        <br></br>
        {context.link_to_details === 'Not Available' ? (
          <motion.p
            className='link'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Project document not available
          </motion.p>
        ) : (
          <motion.a
            className='link'
            href={context.link_to_details}
            target='_blank'
            rel='noopener noreferrer'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p>Link to details of agreement</p>
            <i className='fas fa-external-link-square-alt'></i>
          </motion.a>
        )}
        <motion.a
          className='link'
          href={`https://etherscan.io/address/${context.resolver_address}`}
          target='_blank'
          rel='noopener noreferrer'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p>Arbitration Provider - LexDAO</p>
          <i className='fas fa-external-link-square-alt'></i>
        </motion.a>
        <motion.a
          className='link'
          href={`https://etherscan.io/address/${state.client_address}`}
          target='_blank'
          rel='noopener noreferrer'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <p>Registered Client Address</p>
          <i className='fas fa-external-link-square-alt'></i>
        </motion.a>
        {/* <p>{context.brief_description}</p> */}
      </div>

      <motion.div
        className='escrow-sub-container-two'
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className='card'>
          <div>
            <p>
              Total Project Payment
              <span>
                {total_project_payment_frontend} {state.tokenType}
              </span>
            </p>
            <p>
              Safety Valve Withdrawal Date
              <span>{safety_withdrawal_date_frontend}</span>
            </p>
            <p>
              Arbitration Provider<span>{'LexDAO'}</span>
            </p>
            <p>
              Total Released to Date
              <span>
                {total_released_to_date_frontend} {state.tokenType}
              </span>
            </p>
          </div>
          <div>
            {context.confirmed !== '0' &&
            context.locked !== '1' &&
            context.termination > Math.round(new Date().getTime() / 1000) &&
            context.cap !== context.released ? (
              <p>
                Next Milestone
                <span>Milestone #{state.next_milestone}</span>
              </p>
            ) : null}

            {context.confirmed === '0' ? (
              <p style={{ color: '#ff3864' }}>
                Total Due to Escrow Today
                <span>
                  {total_due_to_escrow_frontend} {state.tokenType}
                </span>
              </p>
            ) : (
              <p style={{ color: '#ff3864' }}>
                {context.locked === '1'
                  ? 'Funds Locked'
                  : context.termination <
                    Math.round(new Date().getTime() / 1000)
                  ? 'Safety valve date due'
                  : context.cap === context.released
                  ? 'All funds released'
                  : context.isClient
                  ? 'Next Amount to Release'
                  : 'Next Amount to be Released'}
                {context.confirmed !== '0' &&
                context.locked !== '1' &&
                context.termination > Math.round(new Date().getTime() / 1000) &&
                context.cap !== context.released ? (
                  <span>
                    {total_milestone_payment_frontend} {state.tokenType}
                  </span>
                ) : null}
              </p>
            )}
          </div>
        </div>
        {button_component}
      </motion.div>

      <div className={`modal ${modal ? 'is-active' : null}`}>
        <div className='modal-background'></div>
        <Instructions
          escrow_index={context.escrow_index}
          locker_address={Locker}
        />
        <button
          className='modal-close is-large'
          aria-label='close'
          onClick={() => setModal(false)}
        ></button>
      </div>
    </div>
  );
};

export default withRouter(Escrow);
