import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import 'bulma';

import HomeButtonManager from '../utils/HomeButtonManager';

import Logo from '../assets/raidguild__logo.png';

import '../sass/Pages.scss';
import '../sass/ResponsivePages.scss';

import { AppContext } from '../context/AppContext';
import Footer from '../components/Footer';

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
      <div className='home-sub-container'>
        <img src={Logo} alt='raidguild' />
        <h1>RaidGuild Escrow Service</h1>
        <input
          type='text'
          placeholder='Enter Raid ID'
          onChange={(event) => setID(event.target.value)}
        ></input>
        {button_component}
        <a href='https://docs.google.com/document/d/1SoHrtoZbvgJg9OluZueZqoUracuEmvccWLo4EPU61R4/edit?usp=sharing'>
          <i className='fas fa-asterisk'></i>
          <p>Terms and Conditions apply</p>
        </a>
        <Footer />
      </div>
    </div>
  );
};

export default withRouter(Home);
