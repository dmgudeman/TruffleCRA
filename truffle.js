module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 1000000
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: "3",
      gas: 1000000
    },
    production: {
      host: "localhost",
      port: 8545,
      network_id: "1", // LIVE
      gas: 1000000
    },
  },
  solc: { optimizer: { enabled: true, runs: 200 } }
};
