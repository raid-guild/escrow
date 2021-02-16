import React from 'react';

const Instructions = ({ escrow_index, locker_address }) => {
  return (
    <div className='modal-content'>
      <p>
        To Lock funds from the Raid Party’s Gnosis Safe, follow these steps:
      </p>
      <ol>
        <li>Go to the Gnosis Safe for the raid.</li>
        <li>Click "Send" and then "Contract Interaction".</li>
        <li>
          In the "Recipient" field, paste <span>{locker_address}</span> -- the
          address of the LexGuildLocker contract.
          <br></br>
          <strong>
            <span role='img' aria-label='warning'>
              ⚠️
            </span>{' '}
            Never send funds (tokens or ETH) directly to the escrow smart
            contract. Those funds will not be recovarable.
          </strong>
        </li>
        <li>
          The ABI from the contract should load into the 'ABI' field. If it
          doesn't, go copy it from blockscout and paste it in manually.
        </li>
        <li>Select the `lock` function from the dropdown menu.</li>
        <li>
          In the "index" parameter field, input <span>{escrow_index}</span> --
          the index for this escrow.
        </li>
        <li>
          If you have an explanation or other details related to the Lock, paste
          a bytes32 compatible form (e.g. a hash) into the "details" parameter
          field. If you don't have anything, type `0x`.
        </li>
        <li>Click "Review", and if everything looks good, click "Submit".</li>
        <li>
          Have a quorum of your Gnosis Safe owners sign the transaction, then
          execute it.
        </li>
        <li>
          You can check that the status is now "locked" by looking up index{' '}
          <span>{escrow_index}</span> in the{' '}
          <a
            href={`https://blockscout.com/poa/xdai/address/${locker_address}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            LexGuildLocker Contract
          </a>{' '}
          on blockscout.
        </li>
      </ol>
    </div>
  );
};

export default Instructions;
