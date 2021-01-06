import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'bulma';

import { AppContext } from '../context/AppContext';

import HomeButtonManager from '../utils/HomeButtonManager';

import Logo from '../assets/raidguild__logo.png';

import '../sass/Pages.scss';
import '../sass/ResponsivePages.scss';

const Home = (props) => {
  const context = useContext(AppContext);
  const [ID, setID] = useState('');
  const [validId, setValidId] = useState(false);

  const validateID = async () => {
    if (ID === '') return alert('ID cannot be empty!');

    context.updateLoadingState();

    let result = await context.setAirtableState(ID);

    setValidId(result.validRaidId);

    context.updateLoadingState();

    if (!result.validRaidId) alert('ID not found!');
  };

  const registerClickHandler = async () => {
    await validateID();
    if (validId) props.history.push('/register');
  };

  const escrowClickHandler = async () => {
    await validateID();
    if (validId) props.history.push('/escrow');
  };

  let button_component = HomeButtonManager(
    context,
    validId,
    escrowClickHandler,
    registerClickHandler,
    validateID
  );

  return (
    <div className='home'>
      <motion.div
        className='home-sub-container'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.a
          href='https://raidguild.org/'
          target='_blank'
          rel='noopener noreferrer'
          whileHover={{ scale: 1.1 }}
        >
          <motion.img
            src={Logo}
            alt='raidguild'
            initial={{ y: -250 }}
            animate={{ y: -10 }}
            transition={{ delay: 0.6 }}
          />
        </motion.a>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          RaidGuild Escrow Service
        </motion.h1>
        <motion.input
          type='text'
          placeholder='Enter Raid ID'
          onChange={(event) => setID(event.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        ></motion.input>
        {button_component}
        {/* <motion.a
          href='https://docs.google.com/document/d/1SoHrtoZbvgJg9OluZueZqoUracuEmvccWLo4EPU61R4/edit?usp=sharing'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <i className='fas fa-asterisk'></i>
          <p>Terms and Conditions apply</p>
        </motion.a> */}
        <motion.span
          id='version'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          v2.0.0
        </motion.span>
      </motion.div>
    </div>
  );
};

export default withRouter(Home);
