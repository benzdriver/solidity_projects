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

  it("should allow deposits", async function () {
    await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
    expect(await ethers.provider.getBalance(bank.target)).to.equal(ethers.parseEther("1"));
  });

  it("should allow withdrawals and reflect gas costs in ETH balance", async function () {
    await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });

    const beforeBankBalance = await bank.getUserBankBalance(addr1.address);
    const beforeEthBalance = await ethers.provider.getBalance(addr1.address);

    const tx = await bank.connect(addr1).withdrawal(ethers.parseEther("0.5"));
    const receipt = await tx.wait();

    const gasUsed = BigInt(receipt.gasUsed) * BigInt(receipt.gasPrice);

    const expectedBankBalance = beforeBankBalance - ethers.parseEther("0.5");
    const afterBankBalance = await bank.getUserBankBalance(addr1.address);
    expect(afterBankBalance).to.equal(expectedBankBalance);

    const afterEthBalance = await ethers.provider.getBalance(addr1.address);
    const expectedEthBalance = beforeEthBalance + ethers.parseEther("0.5") - gasUsed;
    expect(afterEthBalance).to.equal(expectedEthBalance);
  });

  it("should not allow withdrawals if insufficient balance", async function () {
    await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
    await expect(bank.connect(addr1).withdrawal(ethers.parseEther("2"))).to.be.revertedWith(
      "Insufficient balance"
    );
  });
});
        