var WhitelistToken = artifacts.require("./contracts/WhitelistToken.sol");

module.exports = function(deployer) {
  deployer.deploy(WhitelistToken);
};
