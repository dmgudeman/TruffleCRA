var FreeExchange = artifacts.require("./FreeExchange.sol");

module.exports = function(deployer) {
deployer.deploy(FreeExchange, {gas: 4700000});
};
