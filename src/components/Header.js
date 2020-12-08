import React from 'react';
import { withRouter } from 'react-router-dom';

import '../sass/Components.scss';
import '../sass/ResponsiveComponents.scss';

const { nav_items } = require('../utils/Constants');

const Header = (props) => {
  return (
    <div className='custom-header'>
      <nav className='hamburger'>
        <i className='fas fa-bars fa-3x'></i>
      </nav>
      <ul className='nav-links'>
        {nav_items.map((item, index) => {
          return (
            <li key={index}>
              <a href={item.link} target='_blank' rel='noopener noreferrer'>
                {item.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default withRouter(Header);
