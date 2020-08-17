const nav_items = [
    {
        name: "Manifesto",
        link: "https://raidguild.org/#manifesto",
    },
    {
        name: "Portfolio",
        link: "https://raidguild.org/",
    },
    {
        name: "Services",
        link: "https://raidguild.org/#services",
    },
    {
        name: "Join",
        link: "https://raidguild.org/join",
    },
    {
        name: "Hire",
        link: "https://raidguild.org/hire",
    },
];

const contract_addresses = {
    Locker: "0xd53B46aE3781904F1f61CF38Fd9d4F47A7e9242B",
    RaidGuild: "0xbeb3e32355a933501c247e2dbde6e6ca2489bf3d",
    LexArbitration: "0x06153608b799a3da838bf7c95fe21309d2e33b53",
    KovanDAI: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    KovanWETH: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
};

const lock_instructions = [
    "Go to the Gnosis Safe for the raid",
    'Click "Send" and then "Contract Interaction"',
    'In the "Recipient" field, paste [address] -- the address of the LexGuildLocker contract',
    "The ABI from the contract should load into the 'ABI' field. If it doesn't, go copy it from Etherscan and paste it in manually",
    "Select the `lock` function from the dropdown menu",
    "In the 'index' parameter field, input [i] -- the index for this escrow",
    "If you have an explanation or other details related to the Lock, paste a bytes32 compatible form (e.g. a hash) into the 'details' parameter field. If you don't have anything, type `0x`",
    "Click 'Review', and if everything looks good, click 'Submit'",
    "Have a quorum of your Gnosis Safe owners sign the transaction, then execute it",
    "You can check that the status is now 'locked' by looking up index [i] in the [contract](etherscan-link) on Etherscan",
];

module.exports = { nav_items, contract_addresses, lock_instructions };
