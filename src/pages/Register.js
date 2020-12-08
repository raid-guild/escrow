import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import '../sass/Pages.scss';
import '../sass/ResponsivePages.scss';

import { AppContext } from '../context/AppContext';

const Register = (props) => {
  const context = useContext(AppContext);

  useEffect(() => {
    if (context.address === '') return props.history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='register'>
      <div className='register-sub-container'>
        <div className='contents'>
          <h2>{context.client_name}</h2>
          <h1>{context.project_name}</h1>
          <div className='timelines'>
            <p>Start: {context.start_date.split('T')[0]}</p>
            <p>Planned End: {context.end_date}</p>
          </div>
          <p>{context.brief_description}</p>
          <div>
            <a
              href={context.link_to_details}
              target='_blank'
              rel='noopener noreferrer'
            >
              Link to details of agreement
            </a>
          </div>
          <div className='addresses'>
            <a href={`https://etherscan.io/address/${context.spoils_address}`}>
              <p>Spoils - {context.spoils_percent * 100}% of payment</p>{' '}
              <i className='fas fa-external-link-square-alt'></i>
            </a>
            <a
              href={`https://etherscan.io/address/${context.resolver_address}`}
            >
              <p>Arbitration Provider</p>
              <i className='fas fa-external-link-square-alt'></i>
            </a>
          </div>
          <button
            className='custom-button'
            onClick={() => props.history.push('/form')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Register);
