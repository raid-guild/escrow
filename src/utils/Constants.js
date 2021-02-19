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
  Locker: '0x7f8F6E42C169B294A384F5667c303fd8Eedb3CF3',
  w_XDAI: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  w_ETH: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
  RaidGuild: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f',
  LexArbitration: '0x034CfED494EdCff96f0D7160dC2B55Cae5Ee69E1'
};

module.exports = { nav_items, contract_addresses };
