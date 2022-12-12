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
            //Check Investor's balance
            result = await tether.balanceOf(customer);
            assert.equal(result.toString() , tokens('100'), 'Customer Mock Tether Wallet balance before Staking');

            //Checking Staking for the Customer
            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'),{from: customer});

            //Checking Updated Balance for the Customer
            result = await tether.balanceOf(customer);
            assert.equal(result.toString() , tokens('0'), 'Customer Mock Tether Wallet balance after Staking 100 Tokens');

            //Checking the Updated Balance of the Decentral Bank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('100'), 'Decentral Bank Mock Tether Wallet balance after Staking from Customer');

            //Checking the staking Status
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'true', 'Customer is Staking.');

            //Issue tokens
            await decentralBank.issueTokens({from:owner});

            //Ensure only the owner can issue tokens
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            //Unstaking Tokens
            await decentralBank.unstakeTokens({from:customer});
            result = await tether.balanceOf(customer);
            assert.equal(result, tokens('100'), 'Balance returned to the customer after unstaking');
            
            //Checking the Updated Balance of the Decentral Bank after unstaking
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('0'), 'Decentral Bank Mock Tether Wallet balance after Staking from Customer');

            //Checking if the staking balance of the customer has been nil or not
            result = await decentralBank.stakingBalance(customer);
            assert.equal(result, tokens('0'), 'Staking balance of the customer reset');
            
            //Checking the staking Status after unStaking
            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'false', 'Customer is not Staking.');


        })

    })
})

