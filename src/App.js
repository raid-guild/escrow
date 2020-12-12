import React, { useState, useEffect } from 'react';
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
      {windowWidth < 1100 && (
        <div className='window'>
          <img src={RaidGuildLogo} alt='raidguild' />
          <h1>Raidguild Escrow Service</h1>
          <p>
            Please use your desktop or resize your window to more than 1100px to
            proceed.
          </p>
        </div>
      )}
      {windowWidth > 1100 && (
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
