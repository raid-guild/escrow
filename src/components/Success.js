import React from 'react';
import { motion } from 'framer-motion';
import { withRouter } from 'react-router-dom';

const Success = (props) => {
  return (
    <div className='success'>
      <motion.h3
        initial={{ y: -350 }}
        animate={{ y: -10 }}
        transition={{ delay: 0.5 }}
      >
        Transaction Received!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        You can check the progress of your transaction{' '}
        <a href={`https://etherscan.io/tx/${props.hash}`}>here.</a>
      </motion.p>
      <motion.button
        className='custom-button'
        onClick={() => props.history.push('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Home
      </motion.button>
    </div>
  );
};

export default withRouter(Success);
