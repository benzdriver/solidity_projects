// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract MultiUserBank{
    address payable public owner;
    mapping(address addr => uint amount) balance;

    event Deposit(address indexed sender, uint amount, uint balance);
    event Withdrawal(address indexed sender, uint amount, uint balance);

    constructor() payable{
        owner = payable(msg.sender);
        balance[msg.sender] = 0;
    }

    function deposit() public payable{
        require(msg.value > 0, "Deposit money must be higher than zero");
        balance[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, balance[msg.sender]);
    }

    function withdrawal(uint amount) public{
        require(amount > 0, "Your withdrawalm money should be higher than zero");
        uint current_balance = balance[msg.sender];
        require(amount <= current_balance, "Insufficient balance");
        balance[msg.sender] = current_balance - amount; 
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount, current_balance);
    }
    
    function getUserBankBalance() public view returns (uint256) {
        return balance[msg.sender];
    }
}
