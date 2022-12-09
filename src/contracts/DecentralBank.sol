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
    mapping(address =>bool) public hasStaked;
    mapping(address => bool) public isStaking;
    
    constructor(Tether _tether, RWD _rwd) public {
        tether = _tether;
        rwd = _rwd;
    }

    function depositeTokens(uint256 _amount) public{
        //Staking amount should be greater than zero
        require(_amount > 0, 'Amount cannot be Zero');

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
}