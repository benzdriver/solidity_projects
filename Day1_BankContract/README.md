# Solidity Project: SingleUserBank  

This repository documents my **Solidity learning journey** as I transition from **SDET to Smart Contract Engineer**.  

---

## **Key Takeaways from Day 1**  

### **Solidity Basics & ETH Transactions**
- **`payable` functions** automatically receive ETH, so **`deposit()` does not need an explicit amount parameter**.
- **`msg.value` contains the ETH amount sent with the function call**.
- **Withdrawals require an explicit `amount` parameter** since the contract doesn’t know how much the user wants to withdraw.
- The **contract’s balance is automatically updated when `.transfer()` is called**, so **manual balance tracking is unnecessary**.

### **Event Logging & Indexed Parameters**
- Using **`indexed` in event parameters** allows **efficient log filtering** on the blockchain.
- **`msg.sender` cannot be used inside event declarations**, but it can be passed dynamically when emitting an event.
- **Events store indexed parameters in topics** (fast search) and non-indexed ones in log data (requires manual retrieval).

### **Smart Contract Optimization & Fixes**
- **Removed unnecessary `balance` state variable** since Solidity already tracks `address(this).balance`.
- **Ensured deposit events correctly log `msg.sender` instead of `owner`**.
- **Fixed withdrawal event to log `msg.sender` instead of `address(this)`**.
- **Removed the `payable` modifier from `withdrawal()`**, as it does not receive ETH.
- **Used `require()` for input validation** to prevent invalid deposits and withdrawals.

---

## **Project Setup with Hardhat**  

### **1️⃣ Clone the Repo**
```bash
git clone https://github.com/benzdriver/solidity_projects.git
cd solidity_projects
```
### **2️⃣ Install Hardhat & Dependencies**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-ethers ethers chai
```
### **3️⃣ Initialize Hardhat Project**
```bash
npx hardhat init
```
### **4️⃣ Compile the Smart Contract**
```bash
npx hardhat compile
```

### **5️⃣ Deploy to Local Hardhat Network**
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```
### **6️⃣ Run Tests**
```bash
npx hardhat test
```
## **Next Steps**  

- **Implement multi-user banking using mapping(address => uint) balances.**

- **Add owner-only withdrawal function for full contract balance withdrawal.**

- **Explore smart contract security best practices and potential vulnerabilities.**