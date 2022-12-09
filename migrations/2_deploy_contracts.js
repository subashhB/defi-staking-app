const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');


module.exports = async function (deployer, networks, accounts) {
    //Deploying the Mock Tether contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();
    
    //Deploying the Reward contract
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    //Deploying the Decentral bank contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    const decentralBank = await DecentralBank.deployed();

    //Transfer the reward Tokens to the Decentral Bank
    await rwd.transfer(decentralBank.address, '1000000000000000000000000');

    //Transfer 100 Tether to the Accounts
    await tether.transfer(accounts[1], '100000000000000000000');
}