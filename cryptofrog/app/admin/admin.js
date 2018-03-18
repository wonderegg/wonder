// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import WonderEgg_artifacts from '../../build/contracts/WonderEgg.json'

// WonderEgg is our usable abstraction, which we'll use through the code below.
var WonderEgg = contract(WonderEgg_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

var sellrate =1;
var buyrate =1;

var wondereggContract ;
var weggs ;
            

window.App = {
  start: function() {
    var self = this;
    // Bootstrap the WonderEgg abstraction for Use.
    WonderEgg.setProvider(web3.currentProvider);

    // Get the initial account  and set defaultAccount
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

      web3.eth.defaultAccount = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("insTrans");
    status.innerHTML = message;
    console.log(message);
  },

  refreshBalance: function() {
    var self = this;
    $("#loader").show();
    var wegga;
    WonderEgg.deployed().then(function(instance) {
      wegga = instance;
      return wegga.getPrices();
    }).then(function(result){   // sellrate,buyrate
        if(result)
            {
              sellrate = result[0];
              $("#sellPriceRate").val(sellrate);
              buyrate = result[1];
              $("#buyPriceRate").val(buyrate);
              console.log('sellpricerate: ' + sellrate + ' buy price rate: ' + buyrate );
              $("#loader").hide();
            }
        else{
              $("#loader").hide();
            }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getPrices; see log.");
    });




  },


  setPrice: function() {
    var self = this;
    var wegga;
    WonderEgg.deployed().then(function(instance) {
      wegga = instance;
      return wegga.setPrices($("#sellPriceRate").val(), $("#buyPriceRate").val(), {from: account});
    }) ;
            
  },



};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/weggaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 WonderEgg, ensure you've configured that source properly. If using weggaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-weggamask")
    // Use Mist/weggaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to weggamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-weggamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});

