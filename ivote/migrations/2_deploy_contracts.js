var VotingToken = artifacts.require("./VotingToken.sol");

module.exports = function(deployer) {
  deployer.deploy(VotingToken, 1000000, "Voting Token", "VOTING", ["placeholder","Liberal","PC","NDP","Green"]);
}
