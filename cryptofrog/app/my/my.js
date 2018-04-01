// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import WonderEgg_artifacts from '../../build/contracts/WonderEgg.json'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

// WonderEgg is our usable abstraction, which we'll use through the code below.
var WonderEgg = contract(WonderEgg_artifacts);

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

var sellrate = 1;
var buyrate = 1;

var wondereggContract ;
var Coursetro;
var weggs ;
            

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the WonderEgg abstraction for Use.
    WonderEgg.setProvider(web3.currentProvider);

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

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
      self.refreshMetaCoin();

      var setCEDButton = document.getElementById("setCED");
      var getlastCEDButton = document.getElementById("getlastCED");
      setCEDButton.disabled = true;
      getlastCEDButton.disabled = true;
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
            }
        else{
              $("#loader").hide();
            }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getPrices; see log.");
    });



    var outtext;
    WonderEgg.deployed().then(function(instance) {
      wegga = instance;
      return wegga.getlastWonderStruct({from: account});
    }).then(function(result){   // wonder.addr,wonder.id,wonder.wprice,wonder.idName,wonder.Description
        var text = 'test';
        if(result)
          {
            $("#loader").hide();
            $("#insTrans").html('MetaMask User Account: ' + web3.eth.defaultAccount);
            $("#lDescription").val(result[4]);
            switch ($("#lDescription").val()) {
                case '1':
                    text = "I believe the world is flat. My great-great-great-great-great-great grandkitty lived with Confucius. I think you'll love me beclaws I have cattitude.";
                    break;
                case '2':
                    text = "My friends describe me as vegan and despicable. I once got in a fight with a chimpanzee, and won. We're so fur-tunate to have found each other!";
                    break;
                case '3':
                    text = " I'm often referred to as the Samwise Gamgee of the group. My secret indulgence is cereal. We're so fur-tunate to have found each other!";
                    break;
                case '4':
                    text = "I enjoy picking flowers, tripping my owner, and spinning sick beats. In my free time, I can usually be found wondrous or sleeping in fresh laundry. Purrhaps this is the beginning of a beautiful relationship.";
                    break;
                case '5':
                    text = "I'm here to enjoy eating until I loathe myself and watching Stranger Things. I'm convinced that the world is flat. One day I'll prove it. This will be an amewsing friendship.";
                    break;
                case '6':
                    text = "My friends describe me as smelly and gorgeous. I once dreamed of being a Private Dancer . Now I can be found reading Danielle Steele all day. Will you be the garlic butter to my marmalade?";
                    break;
                case '7':
                    text = " I want to live in a world where people believe the world is flat. When my owner isn't watching, I steal their clutches and use them for litter paper. I'm not sorry. Will you be the ranch dressing to my soy sauce?";
            }
            outtext = 'Youngest Wonder Egg ID: '+ result[1]+ '   I am '+ web3.toAscii(result[3])+'  :)  '+ String(text)+' (Price: '+result[2]/sellrate+' ether) '   ;
            $("#instructor").html(outtext);
            $("#idName").val(web3.toAscii(result[3]).replace(/\u0000/g, ''));
            $("#age").val(result[2]/sellrate);
            console.log("refresh get last nameid: " + result[3] + ' description id' + String(text)  + " Price: " + result[2]/sellrate);
          }
        else{
            $("#loader").show();
          }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error result getlastWonderStruct; see log.");
    });



    var count ;
    var output ;
    var imageTxt = "";    
    //var wegga;

    WonderEgg.deployed().then(function(instance) {
      wegga = instance;
    wondereggContract = web3.eth.contract(wegga.abi);
    weggs = wondereggContract.at(wegga.address);
      return wegga.countWonderStructs();
    }).then(function(result ){  
      if (result) {
        count = result.c;
        output =count + ' total Wonder Eggs.  only your create/purchsed wonder egg will show here with pictures, below is one Youngest born wonder egg example FYI <hr>';
        for (var i = 0; i < count; i++) {
           weggs.getWonderStructByAddress(i, web3.eth.defaultAccount, function(error, result){
            var text = '';
            if(result)
                {
                    var icase = result[4]%6+1;
                    switch (icase) {
                            case '1':
                                text = "I believe the world is flat. My great-great-great-great-great-great grandkitty lived with Confucius. I think you'll love me beclaws I have cattitude.";
                                break;
                            case '2':
                                text = "My friends describe me as vegan and despicable. I once got in a fight with a chimpanzee, and won. We're so fur-tunate to have found each other!";
                                break;
                            case '3':
                                text = " I'm often referred to as the Samwise Gamgee of the group. My secret indulgence is cereal. We're so fur-tunate to have found each other!";
                                break;
                            case '4':
                                text = "I enjoy picking flowers, tripping my owner, and spinning sick beats. In my free time, I can usually be found wondrous or sleeping in fresh laundry. Purrhaps this is the beginning of a beautiful relationship.";
                                break;
                            case '5':
                                text = "I'm here to enjoy eating until I loathe myself and watching Stranger Things. I'm convinced that the world is flat. One day I'll prove it. This will be an amewsing friendship.";
                                break;
                            case '6':
                                text = "My friends describe me as smelly and gorgeous. I once dreamed of being a Private Dancer . Now I can be found reading Danielle Steele all day. Will you be the garlic butter to my marmalade?";
                                break;
                            case '7':
                                text = " I want to live in a world where people believe the world is flat. When my owner isn't watching, I steal their clutches and use them for litter paper. I'm not sorry. Will you be the ranch dressing to my soy sauce?";
                    }

                    if (result[1]==0) {
                        console.log("refresh get last nameid no id found under user account: "+web3.eth.defaultAccount);

                    }
                    else{
                        imageTxt = imageTxt + '<div class="image-icon flex-container"><a href="#">'+'<img id="'+icase+'" width="100%" flex-wrap: wrap;display: flex; src="http://res.cloudinary.com/cryptofrog/image/upload/v1521082543/'+icase+'.jpg"></a><div><div style="word-wrap: break-word;">' + web3.toAscii(result[3]) + ': '+ result[1] + '</div><div style="word-wrap: break-word;">(Price: '+result[2]/sellrate+' ether)</div></div></div>';
                    console.log("refresh get last nameid: " + outtext);
                    }
                    
                $("#countIns").html(output+ outtext+ '<div style="flex-wrap: wrap;display: flex;">'+imageTxt+'</div>');
                }
            else{
                $("#loader").hide();
                console.error(error);
            }
          });
         }
      }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error countWonderStructs; see log.");
    });

  },


  setWonderEgg: function() {
    var self = this;
    var wegga;
    WonderEgg.deployed().then(function(instance) {
      wegga = instance;
      return wegga.setWonderStruct(web3.eth.defaultAccount, $("#age").val()*sellrate, $("#idName").val(), $("#lDescription").val(),{from: account});
    }).then(function(result ){   
                if(result)
                    {
                        console.log("set Wonder Egg: " + $("#idName").val() + " " + $("#lDescription").val() + " Price: " +$("#age").val()*sellrate + " for "+web3.eth.defaultAccount);
                        $("#loader").hide(); 
                    }
                else{
                        console.log("Please check error: etheruem user is not authorize to setWonderStruct");
                        console.error(error);
                        $("#loader").hide(); 
                }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error setWonderStruct; see log.");
    });
            
  },


  eventwonderInfo: function() {
    var self = this;
    var wegga;
    WonderEgg.deployed().then(function(instance) {
      wegga = instance;
      return wegga.wonderInfo({}, 'latest',{from: account});
    }).then(function(result ){   
        var text = 'test';
        if(result)
            {
                $("#loader").hide();
                $("#insTrans").html('Block hash: ' + result.args.addr);
                $("#lDescription").val(result.args.Description);
                switch ($("#lDescription").val()) {
                    case '1':
                        text = "I believe the world is flat. My great-great-great-great-great-great grandkitty lived with Confucius. I think you'll love me beclaws I have cattitude.";
                        break;
                    case '2':
                        text = "My friends describe me as vegan and despicable. I once got in a fight with a chimpanzee, and won. We're so fur-tunate to have found each other!";
                        break;
                    case '3':
                        text = " I'm often referred to as the Samwise Gamgee of the group. My secret indulgence is cereal. We're so fur-tunate to have found each other!";
                        break;
                    case '4':
                        text = "I enjoy picking flowers, tripping my owner, and spinning sick beats. In my free time, I can usually be found wondrous or sleeping in fresh laundry. Purrhaps this is the beginning of a beautiful relationship.";
                        break;
                    case '5':
                        text = "I'm here to enjoy eating until I loathe myself and watching Stranger Things. I'm convinced that the world is flat. One day I'll prove it. This will be an amewsing friendship.";
                        break;
                    case '6':
                        text = "My friends describe me as smelly and gorgeous. I once dreamed of being a Private Dancer . Now I can be found reading Danielle Steele all day. Will you be the garlic butter to my marmalade?";
                        break;
                    case '7':
                        text = " I want to live in a world where people believe the world is flat. When my owner isn't watching, I steal their clutches and use them for litter paper. I'm not sorry. Will you be the ranch dressing to my soy sauce?";
                  }
                $("#instructor").html('Wonder Egg ID: '+ result.args.id+'      *hissing noises*!  I am '+ web3.toAscii(result.args.idName)+'  :)  '+ String(text)+' (Price: '+result.args.age/sellrate+' ether)' );
                $("#idName").val(web3.toAscii(result.args.idName));
                $("#age").val(result.args.age/sellrate);
                console.log("Event watch change Instructor: " + result.args.idName + ' ' + String(text)  + " Price: " + result.args.age/sellrate);
             }
        else{
             $("#loader").hide();
            }
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting wonderInfo; see log.");
    });

  sendCoinToMe: function() {
    var self = this;
    this.setStatus("Initiating transaction... (please wait)");
    var meta;
    var amount = 101;  // This is the Fee
    var receiver = 0x2e7Ed09d5bf2bDFCc8044e50Dc43E8684d48689e; // This is receiver acccount

    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {
        from: account
      });
    }).then(function() {
      self.refreshMetaCoin();
      self.toggleSendFeeButton();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  },

  refreshMetaCoin: function() {
    var self = this;
    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {
        from: account
      });
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error refresh Meta Coin; see log.");
    });
  },

  toggleSendFeeButton: function() {

    var sendFeeButton = document.getElementById("sendFee");
    var setCEDButton = document.getElementById("setCED");
    var getlastCEDButton = document.getElementById("getlastCED");

    sendFeeButton.innerHTML = "please click the 'Create Your New Puppy Egg' button";
    sendFeeButton.disabled = true;
    setCEDButton.disabled = false;
    getlastCEDButton.disabled = false;

    this.setStatus("");
  }

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

  App.eventwonderInfo();
  App.start();
});
