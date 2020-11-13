const BN = require("bignumber.js");
BN.config({ DECIMAL_PLACES: 18 });

const { MainnetDAI, MainnetWETH } = require("./Constants").contract_addresses;

const EscrowCalc = async (context) => {
    let frontend_cap = context.web3.utils.fromWei(context.cap, "ether");
    let frontend_released = context.web3.utils.fromWei(
        context.released,
        "ether"
    );

    let tokenType = "";
    if (context.token.toLowerCase() === MainnetDAI.toLowerCase())
        tokenType = "DAI";
    if (context.token.toLowerCase() === MainnetWETH.toLowerCase())
        tokenType = "wETH";

    let wETHBalance = await context.wETH.methods
        .balanceOf(context.address)
        .call();
    let DAIBalance = await context.DAI.methods
        .balanceOf(context.address)
        .call();

    let total_milestone_payment = new BN(0);
    let next_milestone = "";
    if (context.confirmed === "1") {
        let event_info;

        try {
            let events = await context.ethers_locker.queryFilter(
                "RegisterLocker"
            );

            event_info = events.filter(
                (event) =>
                    parseInt(event.args.index._hex) ===
                    parseInt(context.escrow_index)
            );
        } catch (err) {
            console.log(err);
        }

        total_milestone_payment = new BN(event_info[0].args.batch[0]._hex).plus(
            new BN(event_info[0].args.batch[1]._hex)
        );

        let total_milestones = new BN(context.cap).div(total_milestone_payment);

        let milestones_left = new BN(context.cap)
            .minus(new BN(context.released))
            .div(total_milestone_payment);

        let current_milestone = total_milestones.minus(milestones_left);
        total_milestones = Math.round(total_milestones);
        milestones_left = Math.round(milestones_left);
        next_milestone = Math.round(current_milestone) + 1;

        total_milestone_payment = context.web3.utils.fromWei(
            parseInt(total_milestone_payment).toString()
        );
    }
    return {
        tokenType,
        DAIBalance,
        wETHBalance,
        frontend_cap,
        frontend_released,
        total_milestone_payment,
        next_milestone,
    };
};

export default EscrowCalc;
