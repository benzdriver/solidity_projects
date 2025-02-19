// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract MultiUserBank{
    address payable public owner;
    mapping(address => uint) balance;

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
        require(amount > 0, "Your withdrawal money should be higher than zero");
        uint current_balance = balance[msg.sender];
        require(amount <= current_balance, "Insufficient balance");
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Transfer failed");
        balance[msg.sender] = current_balance - amount; 
        emit Withdrawal(msg.sender, amount, balance[msg.sender]);
    }
    
    function getUserBankBalance(address user) public view returns (uint256) {
        return balance[user];
    }
}
