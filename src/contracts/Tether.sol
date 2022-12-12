pragma solidity ^0.5.0;

contract Tether{
    string public name = "Mock Tether";
    string public symbol = "mUSDT";
    uint256 public totalSupply = 1000000000000000000000000; //1 million Tokens
    uint8 public decimal = 18;

    event Transfer (
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approved(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping (address => uint256) public balanceOf;
    mapping(address => mapping (address => uint256)) public allowance;

    constructor() public{
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer (address _to, uint256 _value) public returns (bool success){
        //It is required that the account of the sender has value greater than or equal to the _value.
        require(balanceOf[msg.sender] >= _value);
        //Transfering the amount from the sender and subtracting the amount
        balanceOf[msg.sender] -= _value;
        //Adding the balance to the transfered account
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approved(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        //Add the value to the transferred account
        balanceOf[_to] += _value;
        //Reduce the value which is transferred
        balanceOf[_from] -= _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}