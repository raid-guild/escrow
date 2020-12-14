import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// import Header from './components/Header';
import Home from './pages/Home';
import Escrow from './pages/Escrow';
import Register from './pages/Register';
import Form from './pages/Form';

import AppContextProvider from './context/AppContext';

import './App.css';

import RaidGuildLogo from './assets/raidguild__logo.png';

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // componentDidMount() {
  //   const hamburger = document.querySelector('.hamburger');
  //   const navLinks = document.querySelector('.nav-links');
  //   const links = document.querySelectorAll('.nav-links li');

  //   hamburger.addEventListener('click', () => {
  //     navLinks.classList.toggle('open');
  //     links.forEach((link) => {
  //       link.classList.toggle('fade');
  //     });
  //   });
  // }

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div className='main'>
      {windowWidth < 1000 && (
        <div className='window'>
          <motion.img
            src={RaidGuildLogo}
            alt='raidguild'
            initial={{ y: -350 }}
            animate={{ y: -10 }}
            transition={{ delay: 0.5 }}
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Raidguild Escrow Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Please use your desktop or resize your window to more than 1000px to
            proceed.
          </motion.p>
        </div>
      )}
      {windowWidth > 1000 && (
        <AppContextProvider>
          <Router>
            {/* <Header /> */}
            <Switch>
              <Route path='/' exact>
                <Home />
              </Route>
              <Route path='/escrow' exact>
                <Escrow />
              </Route>
              <Route path='/register' exact>
                <Register />
              </Route>
              <Route path='/form' exact>
                <Form />
              </Route>
              <Route path='/escrow/:id' exact>
                <Escrow />
              </Route>
            </Switch>
          </Router>
        </AppContextProvider>
      )}
    </div>
  );
};

export default App;
