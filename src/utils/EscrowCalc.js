const BN = require('bignumber.js');
BN.config({ DECIMAL_PLACES: 18 });

const { MainnetDAI, MainnetWETH } = require('./Constants').contract_addresses;

const EscrowCalc = async (context) => {
  let frontend_cap = context.web3.utils.fromWei(context.cap, 'ether');
  let frontend_released = context.web3.utils.fromWei(context.released, 'ether');
  let client_address = '';

  let tokenType = '';
  if (context.token.toLowerCase() === MainnetDAI.toLowerCase())
    tokenType = 'DAI';
  if (context.token.toLowerCase() === MainnetWETH.toLowerCase())
    tokenType = 'wETH';

  let wETHBalance = await context.wETH.methods
    .balanceOf(context.address)
    .call();
  let DAIBalance = await context.DAI.methods.balanceOf(context.address).call();

  let total_milestone_payment;
  let next_milestone_payment;
  let next_milestone = '';
  if (context.confirmed === '1') {
    let event_info;

    try {
      let events = await context.ethers_locker.queryFilter('RegisterLocker');

      event_info = events.filter(
        (event) =>
          parseInt(event.args.index._hex) === parseInt(context.escrow_index)
      );
    } catch (err) {
      console.log(err);
    }

    client_address = event_info[0].args.client;
    // calculating the total per milestone payment
    total_milestone_payment = new BN(event_info[0].args.batch[0]._hex).plus(
      new BN(event_info[0].args.batch[1]._hex)
    );

    // calculating total number of milestones
    let total_milestones = new BN(context.cap).div(total_milestone_payment);

    // calculating number of milestones left
    let milestones_left = new BN(context.cap)
      .minus(new BN(context.released))
      .div(total_milestone_payment);

    // calculating the next total per milestone payment
    next_milestone_payment = new BN(context.cap)
      .minus(new BN(context.released))
      .div(milestones_left);

    // converting BN to human readable format
    next_milestone_payment = Number(next_milestone_payment) / 10 ** 18;

    // calculating the current milestone
    let current_milestone = total_milestones.minus(milestones_left);

    // converting BN to human readable format
    total_milestones = Number(total_milestones);
    milestones_left = Number(milestones_left);

    // calculating next milestone
    next_milestone = Number(current_milestone) + 1;
  }

  return {
    client_address,
    tokenType,
    DAIBalance,
    wETHBalance,
    frontend_cap,
    frontend_released,
    next_milestone_payment,
    next_milestone
  };
};

export default EscrowCalc;
