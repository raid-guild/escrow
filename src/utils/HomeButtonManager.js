import React from 'react';
import { motion } from 'framer-motion';
import Loading from '../components/Loading';

const HomeButtonManager = (
  context,
  validId,
  escrowClickHandler,
  validateID
) => {
  let component;
  if (context.isLoading) {
    component = <Loading />;
  } else if (validId) {
    if (context.chainID.toString() !== '100' && context.chainID !== '0x64') {
      component = <p id='network-error-message'>Switch to xDai</p>;
    } else if (context.address) {
      if (context.escrow_index !== '') {
        component = (
          <button
            className='custom-button'
            id='escrow'
            onClick={escrowClickHandler}
          >
            View Escrow
          </button>
        );
      } else {
        component = (
          <>
            <p>Escrow not found. To create new, please use</p>
            <a
              style={{ marginTop: '0px' }}
              href='https://smartescrow.raidguild.org/'
            >
              {' '}
              smart escrow
            </a>
          </>
        );
      }
    } else {
      component = (
        <button
          className='custom-button'
          id='connect'
          style={{ margin: 0 }}
          onClick={context.connectAccount}
        >
          Connect Wallet
        </button>
      );
    }
  } else {
    component = (
      <motion.button
        className='custom-button'
        style={{ margin: 0 }}
        onClick={validateID}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        Validate ID
      </motion.button>
    );
  }

  return component;
};

export default HomeButtonManager;
