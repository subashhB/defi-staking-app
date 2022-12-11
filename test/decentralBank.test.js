const { assert } = require('chai');
const { debug } = require('console');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
    //Codes for testing

    let tether, rwd, decentralBank;

    tokens = (number) => web3.utils.toWei(number,'ether');

    before(async () => {
        //Load contracts
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        //Transfer the Reward Tokens to the Decentral Bank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        //Transfer the 100 Tether to the first account
        await tether.transfer(customer, tokens('100', {from: owner}))
    }) 

    describe('Tether Token Deployment', async () => {
        it('Matches the name successfully', async () =>{
            const name = await tether.name();
            assert.equal(name, 'Mock Tether');
        })
    })

    describe('Reward Token Deployment', async () => {
        it('Matches the name successfully', async () =>{
            const name = await rwd.name();
            assert.equal(name, 'Reward Token');
        })
    })

    describe('Decentral Bank', async () => {
        it('Matches the name successfully', async () => {
            const name = await decentralBank.name();
            assert.equal(name,'Decentral Bank');
        })

        it('Contract has Tokens', async ()=>{
            balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, tokens('1000000'))
        })
    })

    describe('Yeild Farming', async()=>{
        it('Rewards Tokens for Staking', async()=>{
            let result
            //Check investors balance
            result = await tether.balanceOf(customer);
            assert.equal(result.toString() , tokens('100'), 'Customer Mock Tether Wallet balance before Staking');
        })

        it('Transfer Tokens', async() =>{
            //Checking Staking for the Customer
            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'),{from: customer});
        })

    })
})

