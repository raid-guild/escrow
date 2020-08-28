const BN = require("bignumber.js");
BN.config({ DECIMAL_PLACES: 18 });

const milestone_payments_calculation = (
    total_payment,
    milestones,
    spoils_percent
) => {
    let milestone_payment = 0;
    let milestone_spoils_payment = 1;
    let milestone_multisig_payment = 1;
    let _total_payment = new BN(total_payment);

    let multisig_percent = 1 - spoils_percent;
    let total_spoils_payment = _total_payment.times(spoils_percent);
    let total_multisig_payment = _total_payment.times(multisig_percent);

    milestone_spoils_payment = total_spoils_payment.div(milestones);
    milestone_multisig_payment = total_multisig_payment.div(milestones);
    milestone_payment = milestone_spoils_payment.plus(
        milestone_multisig_payment
    );

    let total_payment_final = milestone_payment.times(milestones);
    return [
        total_payment_final,
        milestone_payment,
        milestone_spoils_payment,
        milestone_multisig_payment,
    ];
};

export default milestone_payments_calculation;
