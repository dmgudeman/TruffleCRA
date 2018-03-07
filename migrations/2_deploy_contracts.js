var FixedSupplyToken = artifacts.require("./FixedSupplyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(FixedSupplyToken, {gas: 4700000, from: "0xbf5363ca3651f374a20a39e35713f518828a5699"});
};
