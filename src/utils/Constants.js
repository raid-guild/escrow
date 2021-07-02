const nav_items = [
  {
    name: 'Manifesto',
    link: 'https://raidguild.org/#manifesto'
  },
  {
    name: 'Portfolio',
    link: 'https://raidguild.org/'
  },
  {
    name: 'Services',
    link: 'https://raidguild.org/#services'
  },
  {
    name: 'Join',
    link: 'https://raidguild.org/join'
  },
  {
    name: 'Hire',
    link: 'https://raidguild.org/hire'
  }
];

const contract_addresses = {
  // oldLocker: "0xd53B46aE3781904F1f61CF38Fd9d4F47A7e9242B",
  // oldLocker: "0xff906de0914F20d9577d6F436d5fCbF42429371C",
  KovanLocker: '0x63E63d37A08765124dfD83eE55F055fcE36ea957',
  KovanDAI: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa',
  KovanWETH: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  Locker: '0x3a08F5Cf2c77d003FE07B69e76fF27cbB1520B4F',
  MainnetDAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  MainnetWETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  RaidGuild: '0x3C3692681cD1c0F42FA68A2521719Cc24CEc3AF3',
  LexArbitration: '0x06153608b799a3da838bf7c95fe21309d2e33b53'
};

module.exports = { nav_items, contract_addresses };
