var web3Provider = null;

var WrestlingContract;

function init() {
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
  
  initWrestlingContract();
}


function initWrestlingContract () {
    $.getJSON('Wrestling.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    WrestlingContract = TruffleContract(data);

    // Set the provider for our contract
    WrestlingContract.setProvider(web3Provider);
  });
}

