// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
//import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import votingtoken_artifacts from '../../build/contracts/VotingToken.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
//var MetaCoin = contract(metacoin_artifacts);
var Voting = contract(votingtoken_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    //MetaCoin.setProvider(web3.currentProvider);
    Voting.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
    });
  },

//get the candidates from the contract and populate the web
  populateCandidates: function() {
    var self = this;
    Voting.deployed().then(function(contractInstance) {
      contractInstance.getAllCandidates().then(function(candidateArray) {
         $("#candidate-rows").html("");
        //skip the first one who is the placeholder
        for(let i=1; i < candidateArray.length; i++) {
          contractInstance.candToVotesRcvdMapping(i).then(function(voteCount) {
            //candidate names are stored as bytes32
            $("#candidate-rows").append("<tr style='text-align: left;'><td style='text-align: left;'><input type='radio' name='voteForCandIndx' value='"+i+"'></td><td><b>" + i + "</b>-" + web3.toUtf8(candidateArray[i])+ "</td><td id='candidate-" + i + "'>" + voteCount + "</td></tr>");
      });
        }
      }).catch(function(e) {
        console.log(e);
        })
    });
  },

//get the registered voters from the contract and populate the web
  populateVoters: function() {
    var self = this;
    Voting.deployed().then(function(contractInstance) {
      contractInstance.getAllRegVoters().then(function(voterArray) {
        $("#voter-rows").html("");
        for(let i=0; i < voterArray.length; i++) {
          contractInstance.voterAddrToNameMapping(voterArray[i]).then(function(voterName) {
            //voter names are stored as bytes32
            //use -1 as the initial candidate-ID
            $("#voter-rows").append("<tr><td>" + web3.toUtf8(voterName) + "</td><td id='voter-" + i + "'>-1</td></tr>");
            //alert("name " + voterName );
          });        
          }
      }).catch(function(e) {
        console.log(e);
        })
    });
  },

//get the registered votes from the contract and populate the web
  populateVotes: function() {
    var self = this;
    Voting.deployed().then(function(contractInstance) {
      contractInstance.getAllRegVoters().then(function(voterArray) {
        for(let i=0; i < voterArray.length; i++) {
          contractInstance.voterAddrToVotedCandIdxMapping(voterArray[i]).then(function(votedCandIdx) {
            $("#voter-"+i).text(votedCandIdx); 
          });
        }
      }).catch(function(e) {
        console.log(e);
        })
    });
  },

  voterRegister: function() {
    var self = this;
    let voterName = $("#voterName").val();
    let voterAddr= $("#voterAddr").val();
    if(!voterName || !voterAddr) {
        alert("Please provide both the Voter Name AND the Voter Ropsten address. Input values: Voter addr, " + voterAddr + ", voter name, " + voterName);
        return;
    }
    $("#msg").html("<p style='color:Red;'><b>........................In process</b>. Please wait....</p>")
    $("#voterName").val("");
    $("#voterAddr").val("");
  
    Voting.deployed().then(function(contractInstance) {
      //must add the gas from account
      return contractInstance.voterRegister(voterAddr, voterName, {from: account});
    }).then(function() {
      $("#msg").html("<p style='color:Green;'><b>........................Completed</b>");
      //refresh the registration.
      self.populateVoters();
      setTimeout(self.populateVotes, 1000);
      //self.populateVotes();
    }).catch(function(e) {
      $("#msg").html("<p style='color:Red;'><b>........................Failed</b>. Please see console log.");
      console.log(e);
      //self.setStatus("Error sending coin; see log.");
    });
  },

  //Vote for the selected candidate
  voteForCandidate: function() {
    var self = this;
    let voterAddr= $("#voterAddrForVoting").val();
    let radioValue = $("input[name='voteForCandIndx']:checked").val();
    if(!voterAddr || !radioValue ) {
        alert("Please select the candidate AND fill in registered Voter Ropsten address. Input values: Voter addr, " + voterAddr + ", selection, " + radioValue);
        return;
    }
    $("#votingmsg").html("<p style='color:Red;'><b>........................In process</b>. Please wait....</p>")
    $("#voterAddrForVoting").val("");
    $("#voteForCandIndx").val("");
  
    Voting.deployed().then(function(contractInstance) {
      //must add the gas from account
      return contractInstance.votersVote(voterAddr, radioValue, {from: account});
    }).then(function() {
      $("#votingmsg").html("<p style='color:Green;'><b>........................Completed</b>");
      //refresh the candidate and voter list.
      self.populateCandidates();
      self.populateVoters();
      setTimeout(self.populateVotes, 1000);
    }).catch(function(e) {
      $("#votingmsg").html("<p style='color:Red;'><b>........................Failed</b>. Please see console log.");
      console.log(e);
      //self.setStatus("Error sending coin; see log.");
    });
  }

}; //end of Window.App definition

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
  App.populateCandidates();
  App.populateVoters();
  setTimeout(App.populateVotes, 1000);
});
