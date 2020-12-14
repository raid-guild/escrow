import React from 'react';
import { motion } from 'framer-motion';

import '../sass/Components.scss';
import '../sass/ResponsiveComponents.scss';

const Footer = () => {
  return (
    <motion.div
      className='custom-footer'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.5 }}
    >
      <a
        href='https://twitter.com/raidguild'
        target='_blank'
        rel='noopener noreferrer'
      >
        <i className='fab fa-twitter fa-1x'></i>
      </a>
      <a
        href='https://handbook.raidguild.org/'
        target='_blank'
        rel='noopener noreferrer'
      >
        <i className='fas fa-book fa-1x'></i>
      </a>
      <a
        href='https://github.com/raid-guild'
        target='_blank'
        rel='noopener noreferrer'
      >
        <i className='fab fa-github fa-1x'></i>
      </a>
    </motion.div>
  );
};

export default Footer;
