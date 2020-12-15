import React from 'react';
import Loading from '../components/Loading';

const EscrowButtonManager = (
  context,
  onDepositHandler,
  onWithdrawHandler,
  onReleaseHandler,
  onLockHandler,
  setModal
) => {
  let component;
  if (context.isLoading) {
    component = <Loading />;
  } else if (context.cap === context.released || context.locked === '1') {
    component = null;
  } else if (context.address.toLowerCase() === context.client.toLowerCase()) {
    if (context.confirmed === '0') {
      component = (
        <button className='custom-button' onClick={onDepositHandler}>
          Deposit
        </button>
      );
    } else if (context.termination < Math.round(new Date().getTime() / 1000)) {
      component = (
        <button className='withdraw-button' onClick={onWithdrawHandler}>
          Withdraw
        </button>
      );
    } else {
      component = (
        <div>
          <button className='custom-button' onClick={onReleaseHandler}>
            Release
          </button>
          <button className='lock-button' onClick={onLockHandler}>
            Lock
          </button>
        </div>
      );
    }
  } else if (context.confirmed !== '0') {
    component = (
      <button className='lock-button' onClick={() => setModal(true)}>
        Lock
      </button>
    );
  } else {
    component = (
      <p style={{ marginTop: '20px' }}>Client has not yet made a deposit</p>
    );
  }

  return component;
};

export default EscrowButtonManager;
