pragma solidity ^0.5.0;

import './Tether.sol';
import './RWD.sol';

contract DecentralBank{
    string public name = 'Decentral Bank';
    address public owner;    
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    
    constructor(RWD _rwd, Tether _tether) public {
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }


    function depositTokens(uint256 _amount) public {
        //Staking amount should be greater than zero
        require(_amount > 0, "Amount cannot be less than zero");

        //Transfer the Tether into this address for staking
        tether.transferFrom(msg.sender, address(this), _amount);
        //Update Staking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //Update Staking Status 
        isStaking[msg.sender] = true; 
        hasStaked[msg.sender] = true;
 
    }

    //Unstake Tokens
    function unstakeTokens() public{
        uint balance = stakingBalance[msg.sender];
        //Require Balance of the account to be greater than zero
        require(balance > 0, 'Staking balance cannot be less than zero to Unstake');

        //Transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        //Reset Staking Status
        stakingBalance[msg.sender] = 0;

        //Update Staking Status
        isStaking[msg.sender] = false;
        
    }

    //Issue Rewards
    function issueTokens() public {
        //Require only the owner to issue the Tokens
        require(msg.sender == owner, 'The caller must be the Owner');

        for(uint i =0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient]/9; // Divide by 9 to create percentage incentive for Stakers
            if(balance > 0){
                rwd.transfer(recipient, balance);
            }
        }
    }  
}