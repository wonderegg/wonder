var cert = artifacts.require("./CBED.sol");
var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var greet = artifacts.require("./greeter.sol");

module.exports = function(deployer) {
  deployer.deploy(cert);
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(greet);
};
