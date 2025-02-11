// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract SingleUserBank{
    address payable public owner;

    event Deposit(address indexed sender, uint amount, uint balance);
    event Withdrawal(address indexed sender, uint amount, uint balance);

    constructor() payable{
        owner = payable(msg.sender);
    }

    function deposit() public payable{
        require(msg.value > 0, "Deposit money must be higher than zero");
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function withdrawal(uint amount) public{
        require(amount > 0, "Your withdrawalm money should be higher than zero");
        require(amount <= address(this).balance, "Insufficient balance");
        payable(msg.sender).transfer(amount);  
        emit Withdrawal(msg.sender, amount, address(this).balance);
    }
    
    function getBankBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
