var web3Provider = null;
var WrestlingContract;
const nullAddress = "0x0000000000000000000000000000000000000000";

function init() {
  // We init web3 so we have access to the blockchain
  initWeb3();
}

function initWeb3() {
  if (typeof web3 !== 'undefined' && typeof web3.currentProvider !== 'undefined') {
    web3Provider = web3.currentProvider;
    web3 = new Web3(web3Provider);
  } else {    
    console.error('No web3 provider found. Please install Metamask on your browser.');
    alert('No web3 provider found. Please install Metamask on your browser.');
  }
  
  // we init The Wrestling contract infos so we can interact with it
  initWrestlingContract();
}


function initWrestlingContract () {
  $.getJSON('Wrestling.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    WrestlingContract = TruffleContract(data);

    // Set the provider for our contract
    WrestlingContract.setProvider(web3Provider);

    // listen to the events emitted by our smart contract
    getEvents ();

    // We'll retrieve the Wrestlers addresses set in our contract using Web3.js
    getFirstWrestlerAddress();
    getSecondWrestlerAddress();
  });
}

function getEvents () {
  WrestlingContract.deployed().then(function(instance) {
  var events = instance.allEvents(function(error, log){
    if (!error)
      $("#eventsList").prepend('<li>' + log.event + '</li>'); // Using JQuery, we will add new events to a list in our index.html
  });
  }).catch(function(err) {
    console.log(err.message);
  });
}

function getFirstWrestlerAddress() {
  WrestlingContract.deployed().then(function(instance) {
    return instance.wrestler1.call();
  }).then(function(result) {
    $("#wrestler1").text(result); // Using JQuery again, we will modify the html tag with id wrestler1 with the returned text from our call on the instance of the wrestling contract we deployed
  }).catch(function(err) {
    console.log(err.message);
  });
}

function getSecondWrestlerAddress() {
  WrestlingContract.deployed().then(function(instance) {
    return instance.wrestler2.call();
  }).then(function(result) {
    if(result != nullAddress) {
      $("#wrestler2").text(result);
      $("#registerToFight").remove(); // By clicking on the button with the ID registerToFight, a user can register as second wrestler, so we need to remove the button if a second wrestler is set 
    } else {
      $("#wrestler2").text("Undecided, you can register to wrestle in this event!");
    }   
  }).catch(function(err) {
    console.log(err.message);
  });
}

function registerAsSecondWrestler () {
  web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  } else {
    if(accounts.length <= 0) {
      alert("No account is unlocked, please authorize an account on Metamask.")
    } else {
      WrestlingContract.deployed().then(function(instance) {
        return instance.registerAsAnOpponent({from: accounts[0]});
      }).then(function(result) {
        console.log('Registered as an opponent')
        getSecondWrestlerAddress();
      }).catch(function(err) {
        console.log(err.message);
      });
    }
  }
  });
}

// When the page loads, this will call the init() function
$(function() {
  $(window).load(function() {
    init();
  });
});