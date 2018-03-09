var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "emerge call strategy naive remove grunt example sport burden ceiling tide loud";
var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/WCDTmDbf8qzgqQS9qYdT", 5);
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network i
      gas: 1000000
    },
    ropsten: {
      provider,
      network_id: "3",
      gasPrice: 0,
      gas: 6500000
    },
    myRopsten: {
      host: "localhost",
      port: 8545,
      network_id: "3",
      gas: 4700000
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
        // return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/WCDTmDbf8qzgqQS9qYdT")
