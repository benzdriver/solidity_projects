# **Day 2: Optimizing Solidity Smart Contracts & Understanding Reentrancy Protection**  

## **🚀 Introduction: From Single-User to Multi-User Banking & Securing ETH Transfers**
On **Day 2 of my journey from SDET to Smart Contract Engineer**, I **transformed my smart contract from a single-user bank to a multi-user bank**, optimized **gas costs, secured ETH transfers, and gained a deep understanding of reentrancy protection**.  

### **Today's Highlights:**
✅ **Implemented user-specific balances with `mapping(address => uint)`**  
✅ **Optimized storage access to reduce `SLOAD` gas costs**  
✅ **Replaced `.transfer()` with `.call{value: amount}("")` for secure ETH transfers**  
✅ **Enhanced Hardhat test coverage with balance tracking**  
✅ **Deployed contracts dynamically with `deploy.js`**  
✅ **Understood and mitigated Reentrancy Attacks!**  

---

## **1️⃣ Upgrading to Multi-User Bank**
### **🔴 Problem: Single-User Balance Tracking**
Initially, my contract tracked **one balance for the entire contract**, meaning all users **shared the same balance**.  

```solidity
uint public balance; // Tracks one balance for all users
```

🔴 **Issue:** All users shared a single balance, making it unrealistic for a real banking system.  

### **💡 Solution: Use a `mapping` to Track Balances Per User**
```solidity
mapping(address => uint) balance;
```
✅ **Each user now has their own balance**  
✅ **Deposits and withdrawals are specific to each address**  

**Updated deposit function:**
```solidity
function deposit() public payable {
    require(msg.value > 0, "Deposit money must be higher than zero");
    balance[msg.sender] += msg.value;
    emit Deposit(msg.sender, msg.value, balance[msg.sender]);
}
```
✅ **Each user’s balance is updated independently!**  

---

## **2️⃣ Gas Optimization: Reduce Storage Reads (`SLOAD`)**
Storage reads (`SLOAD`) in Solidity are **expensive**, so minimizing them reduces gas costs.  

🔴 **Original code with redundant `SLOAD`:**  
```solidity
uint current_balance = balance[msg.sender];  
require(amount <= current_balance, "Insufficient balance");  
balance[msg.sender] = current_balance - amount;  
```
🔴 **Problem:** Reads storage **twice** (extra gas usage).  

**💡 Solution: Read from storage once, then modify in memory**
```solidity
uint userBalance = balance[msg.sender];  
require(amount <= userBalance, "Insufficient balance");  
balance[msg.sender] = userBalance - amount;  
```
✅ **Storage access reduced from two to one (saving gas)!**  

---

## **3️⃣ Safer ETH Transfers: Using `.call{value: amount}("")` Instead of `.transfer()`**
Initially, I used:  
```solidity
payable(msg.sender).transfer(amount);
```
🔴 **Problem:**  
- `.transfer()` has a **gas limit of 2300**, which **may fail if the receiving address is a contract**.  
- It **does not return a success/failure flag**, making debugging harder.  

**💡 Solution: Use `.call{value: amount}("")`**
```solidity
(bool sent, ) = payable(msg.sender).call{value: amount}("");
require(sent, "Transfer failed");
```
✅ **Handles ETH transfers more safely!**  
✅ **Prevents unexpected failures due to gas limits!**  

---

## **4️⃣ Reentrancy Protection: Why This Version is Safe**
I **deepened my understanding of reentrancy vulnerabilities** today!  

### **🔴 What is a Reentrancy Attack?**
A **malicious contract** can **repeatedly call the `withdrawal` function before the balance updates**, **draining** the contract’s funds.  

### **🚨 Vulnerable Code Pattern:**
```solidity
(bool sent, ) = msg.sender.call{value: amount}("");
require(sent, "Transfer failed");
balance[msg.sender] -= amount;
```
🔴 **Problem:** The contract **sends ETH before updating the balance**, allowing reentrancy!  

### **💡 Solution: Update the Balance **Before** Sending ETH**
```solidity
uint userBalance = balance[msg.sender];
require(amount <= userBalance, "Insufficient balance");

// ✅ Update balance FIRST before sending ETH
balance[msg.sender] = userBalance - amount;

(bool sent, ) = payable(msg.sender).call{value: amount}("");
require(sent, "Transfer failed");

emit Withdrawal(msg.sender, amount, balance[msg.sender]);
```
✅ **Reentrancy attack is impossible because the balance updates before ETH is sent!**  

---

## **5️⃣ Writing and Running Hardhat Tests**
After improving the contract, I wrote **comprehensive Hardhat tests**.

### **Key Test Cases:**
✅ **Deposits update the correct user’s balance**  
✅ **Withdrawals succeed and update the user’s balance correctly**  
✅ **Withdrawals fail when balance is insufficient**  
✅ **Gas fees are deducted correctly**  

**Hardhat Test File (multiUserBank.test.js):**
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiUserBank", function () {
  let bank, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory("MultiUserBank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();
  });

  it("should allow user-specific deposits", async function () {
    await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
    expect(await bank.getUserBankBalance(addr1.address)).to.equal(ethers.parseEther("1"));
  });

  it("should allow withdrawals and update balances correctly", async function () {
    await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });

    const beforeBankBalance = await bank.getUserBankBalance(addr1.address);
    const beforeEthBalance = await ethers.provider.getBalance(addr1.address);

    const tx = await bank.connect(addr1).withdrawal(ethers.parseEther("0.5"));
    const receipt = await tx.wait();
    const gasUsed = BigInt(receipt.gasUsed) * BigInt(receipt.gasPrice);

    const afterBankBalance = await bank.getUserBankBalance(addr1.address);
    expect(afterBankBalance).to.equal(beforeBankBalance - ethers.parseEther("0.5"));

    const afterEthBalance = await ethers.provider.getBalance(addr1.address);
    expect(afterEthBalance).to.equal(beforeEthBalance + ethers.parseEther("0.5") - gasUsed);
  });

  it("should prevent overdrafts", async function () {
    await expect(bank.connect(addr1).withdrawal(ethers.parseEther("2"))).to.be.revertedWith(
      "Insufficient balance"
    );
  });
});
```
✅ **Thorough tests ensure contract safety!**  
✅ **Validates ETH balance changes post-withdrawal!**  

---

## **📌 Final Thoughts:**
Today’s Solidity deep dive helped me:  
✅ **Upgrade to a Multi-User Banking System using `mapping`**  
✅ **Prevent Reentrancy Attacks by updating balances before sending ETH**  
✅ **Reduce gas costs by optimizing storage access**  
✅ **Deploy contracts dynamically instead of hardcoding deployments**  

**Follow my Solidity progress on GitHub, Dev.to, and Medium!** 🚀  

🌍 Join Me on This Journey!
If you're also learning Solidity, Smart Contracts, or blockchain development, let's connect!
📌GitHub: https://github.com/benzdriver
📌LinkedIn: https://www.linkedin.com/in/ziyan-zhou/
💡 Let’s build the future of blockchain together! 🚀  