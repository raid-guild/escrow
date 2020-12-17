import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { withRouter } from 'react-router-dom';

import '../sass/Pages.scss';
import '../sass/ResponsivePages.scss';

import raidguild__logo from '../assets/raidguild__logo.png';

import { AppContext } from '../context/AppContext';

const Register = (props) => {
  const context = useContext(AppContext);

  useEffect(() => {
    if (context.address === '') return props.history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='register'>
      <a href='https://raidguild.org' target='_blank' rel='noopener noreferrer'>
        <img src={raidguild__logo} alt='raidguild' id='in-page-logo' />
      </a>
      <div className='register-sub-container'>
        <div className='contents'>
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
          <motion.div
            className='timelines'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p>Start: {context.start_date.split('T')[0]}</p>
            <p>Planned End: {context.end_date}</p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {context.brief_description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <a
              href={context.link_to_details}
              target='_blank'
              rel='noopener noreferrer'
            >
              Link to details of agreement
            </a>
          </motion.div>
          <motion.div
            className='addresses'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <a
              href={`https://etherscan.io/address/${context.spoils_address}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <p>Spoils - {context.spoils_percent * 100}% of payment</p>{' '}
              <i className='fas fa-external-link-square-alt'></i>
            </a>
            <a
              href={`https://etherscan.io/address/${context.resolver_address}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <p>Arbitration Provider - LexDAO</p>
              <i className='fas fa-external-link-square-alt'></i>
            </a>
          </motion.div>
          <motion.button
            className='custom-button'
            onClick={() => props.history.push('/form')}
            initial={{ x: '100vw' }}
            animate={{ x: 0 }}
            transition={{ delay: 1.3 }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Register);
