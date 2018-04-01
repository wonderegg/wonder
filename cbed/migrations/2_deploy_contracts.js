var cert = artifacts.require("./CBED.sol");
var cbedadmin = artifacts.require("./CBEDAdmin.sol");

module.exports = function(deployer) {
  deployer.deploy(cert);
  deployer.deploy(cbedadmin);
};
