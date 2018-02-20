// Import the page's CSS. Webpack will know what to do with it.
import "../web/css/main.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import CBED_artifacts from '../../build/contracts/CBED.json'

// CBED is our usable abstraction, which we'll use through the code below.
var CBED = contract(CBED_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the CBED abstraction for Use.
    CBED.setProvider(web3.currentProvider);

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

      self.refreshBalance();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var cert;
    CBED.deployed().then(function(instance) {
      cert = instance;
      return cert.getlastCED();
    }).then(function(ced ){   // id,_cid,fullname,coursename,issuedOn,validUntil
      var id_element = document.getElementById("id");
      id_element.value = ced[0].valueOf();
      var cid_element = document.getElementById("cid");
      cid_element.value = ced[1].valueOf();
      var fullname_element = document.getElementById("fullname");
      fullname_element.value = ced[2].valueOf();
      var coursename_element = document.getElementById("coursename");
      coursename_element.value = ced[3].valueOf();
      var issuedOn_element = document.getElementById("issuedOn");
      issuedOn_element.value = ced[4].valueOf();
      var validUntil_element = document.getElementById("validUntil");
      validUntil_element.value = ced[5].valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting cid; see log.");
    });
  },


  getCEDByID: function() {
    var self = this;

    var cert;
    var id = parseInt(document.getElementById("id").value);
    CBED.deployed().then(function(instance) {
      cert = instance;
      return cert.getCEDStructByID(id,{from: account});
    }).then(function(ced ){   // id,_cid,fullname,coursename,issuedOn,validUntil
      var id_element = document.getElementById("id");
      id_element.value = ced[0].valueOf();
      var cid_element = document.getElementById("cid");
      cid_element.value = ced[1].valueOf();
      var fullname_element = document.getElementById("fullname");
      fullname_element.value = ced[2].valueOf();
      var coursename_element = document.getElementById("coursename");
      coursename_element.value = ced[3].valueOf();
      var issuedOn_element = document.getElementById("issuedOn");
      issuedOn_element.value = ced[4].valueOf();
      var validUntil_element = document.getElementById("validUntil");
      validUntil_element.value = ced[5].valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting cid; see log.");
    });
  },


  getCEDByCID: function() {
    var self = this;

    var cert;
    var cid = document.getElementById("cid").value;
    CBED.deployed().then(function(instance) {
      cert = instance;
      return cert.getCEDStructsByCID(cid,{from: account});
    }).then(function(ced ){   // id,_cid,fullname,coursename,issuedOn,validUntil
      var id_element = document.getElementById("id");
      id_element.value = ced[0].valueOf();
      var cid_element = document.getElementById("cid");
      cid_element.value = ced[1].valueOf();
      var fullname_element = document.getElementById("fullname");
      fullname_element.value = ced[2].valueOf();
      var coursename_element = document.getElementById("coursename");
      coursename_element.value = ced[3].valueOf();
      var issuedOn_element = document.getElementById("issuedOn");
      issuedOn_element.value = ced[4].valueOf();
      var validUntil_element = document.getElementById("validUntil");
      validUntil_element.value = ced[5].valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting cid; see log.");
    });
  },

  setCED: function() {
    var self = this;

//    var id = parseInt(document.getElementById("id").value);
    var cid = document.getElementById("cid").value;
    var fullname = document.getElementById("fullname").value;
    var coursename = document.getElementById("coursename").value;
    var issuedOn = document.getElementById("issuedOn").value;
    var validUntil = document.getElementById("validUntil").value;

    this.setStatus("Initiating transaction... (please wait)");

    var cert;
    CBED.deployed().then(function(instance) {
      cert = instance;
      return cert.setCED(cid,fullname,coursename,issuedOn, validUntil, {from: account});
    }).then(function() {
      self.setStatus("setCED update string");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error setCED; see log.");
    });


  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/certMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 CBED, ensure you've configured that source properly. If using certMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-certmask")
    // Use Mist/certMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to certmask for development. More info here: http://truffleframework.com/tutorials/truffle-and-certmask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});



/*        $("#button3").click(function() {
             myFunction();
             renderApp();
        });



        function myFunction() {
            location.reload();
        }

        setTimeout(myFunction, 180000); // 180 seconds

*/