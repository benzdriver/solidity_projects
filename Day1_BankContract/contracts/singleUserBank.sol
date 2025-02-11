// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract bank{
    uint public balance;
    address payable public owner;

    event Deposit(address d_address, uint amount, uint balance);
    event Withdrawal(address w_address, uint amount, uint balance);

    constructor() payable{
        owner = payable(msg.sender);
    }

    function deposit() public payable{
        balance += msg.value;
        emit Deposit(owner, msg.value, balance);
    }

    function withdrawal(uint amount) public payable{
        require(amount > 0, "Your withdrawalm money should be higher than zero");
        require(amount <= balance, "Your balance is not sufficient to pay for the amount you want to withdrawl");
        balance -= amount;
        payable(msg.sender).transfer(amount);  // Transfer Ether securely
        emit Withdrawal(msg.sender, amount, address(this).balance);
    }
    
    function getBankBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
