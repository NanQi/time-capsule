import contract from "truffle-contract";
import TimeCapsuleJson from "../build/contracts/TimeCapsule.json";
import { Notification } from 'element-ui';
import router from './router'

var httpProvider = '';

if (typeof web3 !== "undefined") {
    httpProvider = web3.currentProvider;
}  else {
    window.web3 = {};
    var handler = () => {
        router.push({name: 'about'})
    }
    Notification({ 
        title: '提示',
        dangerouslyUseHTMLString: true,
        message: '请安装MetaMask插件',
        type: 'error',
        showClose: true,
        center: true,
        duration: 2500,
        onClose: handler,
        onClick: handler
      });
}

web3 = new Web3(httpProvider);

function getNetwork() {
    return new Promise((resolve, reject) => {
        web3.version.getNetwork((err, netId) => {
            if (err) {
                reject(err);
            }
            var that = {};
            that.isNetworkReady = true;

            switch (netId) {
                case "1":
                    that.networkName = "mainnet";
                    break;
                case "2":
                    that.networkName = "deprecated Morden test network";
                    break;
                case "3":
                    that.networkName = "Ropsten test network";
                    break;
                case "4":
                    that.networkName = "Rinkeby test network";
                    break;
                case "42":
                    that.networkName = "Kovan test network";
                    break;
                case "5777":
                    that.networkName = "Ganache test network";
                    break;
                default:
                    that.isNetworkReady = false;
                    break;
            }

            web3.network = that;

            resolve(web3);
        });
    })
}

function getAccount() {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((error, accounts) => {
            if (error) {
                reject(error)
            } else {
                resolve(accounts[0])
            }
        });
    })
}


function getContract() {
    return getNetwork().then(({network: {networkName}}) => {
        var TimeCapsule = contract(TimeCapsuleJson);
        if (networkName == "Rinkeby test network") {
            var abi = [ { "constant": true, "inputs": [], "name": "dug", "outputs": [ { "name": "code", "type": "uint8" }, { "name": "content", "type": "string" }, { "name": "time", "type": "uint32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getAllCapsules", "outputs": [ { "name": "", "type": "uint256[]", "value": [] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_modulus", "type": "uint256" } ], "name": "randMod", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_content", "type": "string" }, { "name": "_tips", "type": "string" }, { "name": "_time", "type": "uint32" }, { "name": "_encrypt", "type": "bool" } ], "name": "buried", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getCapsuleById", "outputs": [ { "name": "content", "type": "string", "value": "" }, { "name": "tips", "type": "string", "value": "" }, { "name": "createAt", "type": "uint32", "value": "0" }, { "name": "expireAt", "type": "uint32", "value": "0" }, { "name": "encrypt", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "capsuleId", "type": "uint256" }, { "indexed": false, "name": "time", "type": "uint32" }, { "indexed": false, "name": "encrypt", "type": "bool" } ], "name": "NewCapsule", "type": "event" } ];
            var address = "0xAE603d7f895310FB936F67C6607d1ed150d81EE4";
            TimeCapsule = contract({abi});
            TimeCapsule.setProvider(web3.currentProvider);
            return TimeCapsule.at(address);
        } else if (networkName == "Ganache test network") {
            TimeCapsule.setProvider(web3.currentProvider);
            return TimeCapsule.deployed()
        }
    })
    
}

export default Promise.all([
    getNetwork()
    , getContract()
    , getAccount()])